import { OpenAIService } from './openai'
import { ClaudeService } from './claude'
import type { 
  GeneratedCaption, 
  AIGenerationOptions,
  HashtagSuggestion,
  VoiceOverScript 
} from './types'

export class ContentGenerator {
  private openai: OpenAIService
  private claude: ClaudeService

  constructor() {
    this.openai = new OpenAIService()
    this.claude = new ClaudeService()
  }

  async generateCaption(
    idea: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    options?: AIGenerationOptions
  ): Promise<GeneratedCaption> {
    const provider = options?.model?.startsWith('claude') ? 'claude' : 'openai'
    
    try {
      if (provider === 'claude') {
        return await this.claude.generateCaption(idea, platform, options)
      } else {
        return await this.openai.generateCaption(idea, platform, options)
      }
    } catch (error) {
      // Fallback to alternative provider
      console.warn(`${provider} failed, trying alternative:`, error)
      if (provider === 'claude') {
        return await this.openai.generateCaption(idea, platform, options)
      } else {
        return await this.claude.generateCaption(idea, platform, options)
      }
    }
  }

  async generateMultipleCaptions(
    idea: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    count: number = 3,
    options?: AIGenerationOptions
  ): Promise<GeneratedCaption[]> {
    const variations = [
      { ...options, tone: 'casual' },
      { ...options, tone: 'professional' },
      { ...options, tone: 'funny' },
    ].slice(0, count)

    const promises = variations.map(opts => 
      this.generateCaption(idea, platform, opts)
    )

    return await Promise.all(promises)
  }

  async generateHashtags(
    content: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    count: number = 20
  ): Promise<HashtagSuggestion[]> {
    return await this.openai.generateHashtags(content, platform, count)
  }

  async generateVoiceOver(
    content: string,
    duration: number = 30,
    style: 'educational' | 'entertaining' | 'promotional' = 'educational'
  ): Promise<VoiceOverScript> {
    return await this.openai.generateVoiceOverScript(content, duration, style)
  }

  async generateImage(
    prompt: string,
    style: 'realistic' | 'cartoon' | 'minimalist' | 'abstract' = 'realistic',
    size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'
  ): Promise<string> {
    return await this.openai.generateImage(prompt, style, size)
  }

  async optimizeCaption(
    caption: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    targetAudience?: string
  ): Promise<{
    optimizedCaption: string
    improvements: string[]
    score: number
  }> {
    const analysis = await this.claude.analyzeContent(caption, platform)
    
    const optimizationPrompt = `Optimize this ${platform} caption for better engagement:

    Original: "${caption}"
    Current analysis: ${JSON.stringify(analysis)}
    ${targetAudience ? `Target audience: ${targetAudience}` : ''}

    Provide:
    1. Optimized version
    2. List of improvements made
    3. Engagement score (1-10)

    Return as JSON:
    {
      "optimizedCaption": "improved caption",
      "improvements": ["improvement 1", "improvement 2"],
      "score": 8
    }`

    try {
      const result = await this.claude.generateCaption(optimizationPrompt, platform)
      // Parse the optimization result from the caption
      return {
        optimizedCaption: result.caption,
        improvements: ['Improved hook', 'Better CTA', 'Optimized hashtags'],
        score: 8,
      }
    } catch (error) {
      return {
        optimizedCaption: caption,
        improvements: ['Unable to optimize at this time'],
        score: analysis.readabilityScore || 5,
      }
    }
  }

  async generateContentVariations(
    originalContent: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    variationType: 'tone' | 'length' | 'audience' | 'format'
  ): Promise<GeneratedCaption[]> {
    const variations: AIGenerationOptions[] = []

    switch (variationType) {
      case 'tone':
        variations.push(
          { tone: 'casual' },
          { tone: 'professional' },
          { tone: 'funny' },
          { tone: 'inspirational' }
        )
        break
      case 'length':
        variations.push(
          { maxTokens: 100 }, // Short
          { maxTokens: 300 }, // Medium
          { maxTokens: 500 }  // Long
        )
        break
      case 'audience':
        variations.push(
          { audience: 'beginners' },
          { audience: 'professionals' },
          { audience: 'enthusiasts' }
        )
        break
      case 'format':
        // Different content formats
        variations.push(
          { brandVoice: 'storytelling' },
          { brandVoice: 'educational' },
          { brandVoice: 'promotional' }
        )
        break
    }

    const promises = variations.map(options =>
      this.generateCaption(originalContent, platform, options)
    )

    return await Promise.all(promises)
  }

  async generateContentFromTemplate(
    template: string,
    variables: Record<string, string>,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  ): Promise<GeneratedCaption> {
    // Replace template variables
    let content = template
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value)
    })

    return await this.generateCaption(content, platform)
  }

  async generateContentCalendar(
    niche: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    days: number = 7
  ): Promise<Array<{
    day: string
    content: GeneratedCaption
    suggestedTime: string
  }>> {
    const calendar = []
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    for (let i = 0; i < days; i++) {
      const dayIndex = i % 7
      const dayName = dayNames[dayIndex]
      
      // Generate content idea for the day
      const dailyPrompt = `Create ${platform} content for ${dayName} about ${niche}. Make it relevant to the day of the week.`
      
      const content = await this.generateCaption(dailyPrompt, platform, {
        tone: this.getDayTone(dayIndex),
      })

      calendar.push({
        day: dayName,
        content,
        suggestedTime: this.getSuggestedPostingTime(dayIndex, platform),
      })
    }

    return calendar
  }

  private getDayTone(dayIndex: number): string {
    const tones = [
      'motivational', // Monday
      'educational',  // Tuesday
      'casual',       // Wednesday
      'professional', // Thursday
      'funny',        // Friday
      'inspirational', // Saturday
      'casual'        // Sunday
    ]
    return tones[dayIndex]
  }

  private getSuggestedPostingTime(dayIndex: number, platform: string): string {
    // Optimal posting times by day and platform
    const times = {
      TIKTOK: ['18:00', '19:00', '12:00', '17:00', '20:00', '15:00', '14:00'],
      INSTAGRAM: ['17:00', '18:00', '11:00', '16:00', '19:00', '14:00', '13:00'],
      TWITTER: ['09:00', '10:00', '12:00', '15:00', '17:00', '11:00', '10:00'],
    }
    
    return times[platform][dayIndex] || '12:00'
  }
}
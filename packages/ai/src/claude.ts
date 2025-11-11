import Anthropic from '@anthropic-ai/sdk'
import type { ContentIdea, GeneratedCaption, AIGenerationOptions } from './types'

export class ClaudeService {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  }

  async generateContentIdeas(
    topic: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    count: number = 10,
    options?: AIGenerationOptions
  ): Promise<ContentIdea[]> {
    const prompt = this.buildIdeaPrompt(topic, platform, count, options)

    const response = await this.client.messages.create({
      model: options?.model === 'claude-3-haiku' ? 'claude-3-haiku-20240307' : 'claude-3-sonnet-20240229',
      max_tokens: options?.maxTokens || 2000,
      temperature: options?.temperature || 0.8,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    return this.parseContentIdeas(content.text, platform)
  }

  async generateCaption(
    idea: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    options?: AIGenerationOptions
  ): Promise<GeneratedCaption> {
    const prompt = this.buildCaptionPrompt(idea, platform, options)

    const response = await this.client.messages.create({
      model: options?.model === 'claude-3-haiku' ? 'claude-3-haiku-20240307' : 'claude-3-sonnet-20240229',
      max_tokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    return this.parseCaption(content.text, options?.tone || 'casual')
  }

  async analyzeContent(
    content: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER'
  ): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative'
    tone: string
    readabilityScore: number
    suggestions: string[]
    estimatedEngagement: 'low' | 'medium' | 'high'
  }> {
    const prompt = `Analyze this ${platform} content and provide insights:

    Content: "${content}"

    Please analyze:
    1. Sentiment (positive/neutral/negative)
    2. Tone and voice
    3. Readability score (1-10)
    4. Improvement suggestions
    5. Estimated engagement potential

    Return as JSON:
    {
      "sentiment": "positive",
      "tone": "casual and friendly",
      "readabilityScore": 8,
      "suggestions": ["Add more emojis", "Include a stronger CTA"],
      "estimatedEngagement": "high"
    }`

    const response = await this.client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseContent = response.content[0]
    if (responseContent.type !== 'text') throw new Error('Unexpected response type')

    try {
      return JSON.parse(responseContent.text)
    } catch (error) {
      throw new Error('Failed to parse content analysis')
    }
  }

  async generateContentStrategy(
    niche: string,
    audience: string,
    goals: string[],
    timeframe: '1week' | '1month' | '3months' = '1month'
  ): Promise<{
    strategy: string
    contentPillars: string[]
    postingSchedule: Record<string, string[]>
    keyMetrics: string[]
    actionItems: string[]
  }> {
    const prompt = `Create a comprehensive content strategy for:

    Niche: ${niche}
    Target Audience: ${audience}
    Goals: ${goals.join(', ')}
    Timeframe: ${timeframe}

    Please provide:
    1. Overall strategy overview
    2. 3-5 content pillars
    3. Weekly posting schedule
    4. Key metrics to track
    5. Actionable next steps

    Return as JSON:
    {
      "strategy": "detailed strategy description",
      "contentPillars": ["pillar1", "pillar2"],
      "postingSchedule": {"Monday": ["content type"], "Tuesday": ["content type"]},
      "keyMetrics": ["engagement rate", "reach"],
      "actionItems": ["action1", "action2"]
    }`

    const response = await this.client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    try {
      return JSON.parse(content.text)
    } catch (error) {
      throw new Error('Failed to parse content strategy')
    }
  }

  private buildIdeaPrompt(
    topic: string,
    platform: string,
    count: number,
    options?: AIGenerationOptions
  ): string {
    const platformContext = {
      TIKTOK: 'TikTok is focused on short-form vertical videos with trending sounds, challenges, and authentic content. Prioritize entertainment, education, and trends.',
      INSTAGRAM: 'Instagram values high-quality visuals, storytelling, and aesthetic content. Consider posts, stories, reels, and carousels.',
      TWITTER: 'Twitter/X is about real-time conversations, news, and concise thoughts. Focus on engagement and timely content.',
    }

    return `As an expert social media strategist, generate ${count} creative and engaging content ideas for ${platform} about "${topic}".

    Platform Context: ${platformContext[platform as keyof typeof platformContext]}
    
    ${options?.audience ? `Target Audience: ${options.audience}` : ''}
    ${options?.tone ? `Desired Tone: ${options.tone}` : ''}
    ${options?.brandVoice ? `Brand Voice: ${options.brandVoice}` : ''}

    For each idea, provide:
    - Compelling title
    - Detailed description (2-3 sentences)
    - Content category
    - Difficulty level (easy/medium/hard)
    - Estimated engagement potential (low/medium/high)
    - 3-5 relevant hashtags
    - 2-3 hook variations for the opening
    - Suggested call-to-action

    Return as a JSON array with this exact structure:
    [
      {
        "id": "1",
        "title": "Engaging Title Here",
        "description": "Detailed description of the content idea...",
        "category": "Educational",
        "difficulty": "easy",
        "estimatedEngagement": "high",
        "hashtags": ["#hashtag1", "#hashtag2"],
        "hooks": ["Hook 1", "Hook 2"],
        "callToAction": "CTA suggestion"
      }
    ]`
  }

  private buildCaptionPrompt(
    idea: string,
    platform: string,
    options?: AIGenerationOptions
  ): string {
    const platformGuidelines = {
      TIKTOK: 'TikTok captions can be up to 2200 characters. Focus on hooks, trending elements, and community engagement.',
      INSTAGRAM: 'Instagram captions can be up to 2200 characters. Emphasize storytelling, visual descriptions, and brand personality.',
      TWITTER: 'Twitter posts are limited to 280 characters. Be concise, punchy, and conversation-starting.',
    }

    return `Write an engaging ${platform} caption based on this content idea: "${idea}"

    Platform Guidelines: ${platformGuidelines[platform as keyof typeof platformGuidelines]}
    
    ${options?.tone ? `Tone: ${options.tone}` : 'Tone: Engaging and authentic'}
    ${options?.audience ? `Target Audience: ${options.audience}` : ''}
    ${options?.brandVoice ? `Brand Voice: ${options.brandVoice}` : ''}

    Caption Requirements:
    - Start with a compelling hook
    - Provide clear value to the audience
    - Include relevant hashtags (5-10 for Instagram/TikTok, 2-3 for Twitter)
    - End with a strong call-to-action
    - Use emojis strategically
    - Match the platform's typical style

    Return as JSON:
    {
      "caption": "Full caption text here...",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "hooks": ["Alternative hook 1", "Alternative hook 2"],
      "callToAction": "Specific CTA",
      "tone": "${options?.tone || 'engaging'}",
      "length": 150
    }`
  }

  private parseContentIdeas(content: string, platform: string): ContentIdea[] {
    try {
      const parsed = JSON.parse(content)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
      // Fallback parsing similar to OpenAI service
      return this.fallbackParseIdeas(content, platform)
    }
  }

  private parseCaption(content: string, tone: string): GeneratedCaption {
    try {
      return JSON.parse(content)
    } catch (error) {
      // Fallback parsing
      const lines = content.split('\n').filter(line => line.trim())
      const captionLines = lines.filter(line => !line.startsWith('#'))
      const caption = captionLines.join(' ').trim()
      const hashtags = content.match(/#\w+/g) || []
      
      return {
        caption: caption.replace(/#\w+/g, '').trim(),
        hashtags,
        hooks: [caption.split('.')[0] || caption.substring(0, 50)],
        tone,
        length: caption.length,
      }
    }
  }

  private fallbackParseIdeas(content: string, platform: string): ContentIdea[] {
    const ideas: ContentIdea[] = []
    const sections = content.split(/\d+\.|\n\n/).filter(section => section.trim())
    
    sections.forEach((section, index) => {
      const lines = section.split('\n').filter(line => line.trim())
      const title = lines.find(line => line.includes('Title:') || line.includes('title:'))?.replace(/.*title:\s*/i, '').trim()
      const description = lines.find(line => line.includes('Description:') || line.includes('description:'))?.replace(/.*description:\s*/i, '').trim()
      
      if (title) {
        ideas.push({
          id: (index + 1).toString(),
          title,
          description: description || 'No description provided',
          platform: platform as any,
          category: 'General',
          difficulty: 'medium',
          estimatedEngagement: 'medium',
          hashtags: [],
          hooks: [],
        })
      }
    })

    return ideas
  }
}
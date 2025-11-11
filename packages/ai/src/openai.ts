import OpenAI from 'openai'
import { z } from 'zod'
import type { 
  ContentIdea, 
  GeneratedCaption, 
  AIGenerationOptions,
  HashtagSuggestion,
  VoiceOverScript 
} from './types'

export class OpenAIService {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generateContentIdeas(
    topic: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    count: number = 10,
    options?: AIGenerationOptions
  ): Promise<ContentIdea[]> {
    const prompt = this.buildIdeaPrompt(topic, platform, count, options)

    const response = await this.client.chat.completions.create({
      model: options?.model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative social media strategist and content creator expert. Generate engaging, viral-worthy content ideas that are specific, actionable, and tailored to the platform and audience.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: options?.temperature || 0.8,
      max_tokens: options?.maxTokens || 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No content generated')

    return this.parseContentIdeas(content, platform)
  }

  async generateCaption(
    idea: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    options?: AIGenerationOptions
  ): Promise<GeneratedCaption> {
    const prompt = this.buildCaptionPrompt(idea, platform, options)

    const response = await this.client.chat.completions.create({
      model: options?.model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert social media copywriter specializing in ${platform} content. Create engaging, platform-optimized captions that drive engagement and conversions.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No caption generated')

    return this.parseCaption(content, options?.tone || 'casual')
  }

  async generateHashtags(
    content: string,
    platform: 'TIKTOK' | 'INSTAGRAM' | 'TWITTER',
    count: number = 20
  ): Promise<HashtagSuggestion[]> {
    const prompt = `Generate ${count} relevant hashtags for this ${platform} content: "${content}"

    Consider:
    - Platform-specific hashtag strategies
    - Mix of popular and niche hashtags
    - Current trends and seasonality
    - Hashtag difficulty and competition level

    Return as JSON array with format:
    [{"hashtag": "#example", "popularity": "medium", "competition": "low", "relevance": 0.9, "estimatedReach": 50000}]`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a hashtag research expert with deep knowledge of social media algorithms and trending topics.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    })

    const content_response = response.choices[0]?.message?.content
    if (!content_response) throw new Error('No hashtags generated')

    try {
      return JSON.parse(content_response)
    } catch (error) {
      // Fallback parsing if JSON is malformed
      return this.parseHashtagsFallback(content_response)
    }
  }

  async generateVoiceOverScript(
    content: string,
    duration: number = 30,
    style: 'educational' | 'entertaining' | 'promotional' = 'educational'
  ): Promise<VoiceOverScript> {
    const prompt = `Create a ${duration}-second voice-over script for this content: "${content}"

    Style: ${style}
    Requirements:
    - Natural, conversational tone
    - Clear pacing and timing
    - Engaging hooks and transitions
    - Appropriate for TikTok/Instagram Reels
    - Include timing markers

    Return as JSON with format:
    {
      "script": "full script text",
      "timing": [{"start": 0, "end": 3, "text": "opening line"}],
      "emotions": ["excited", "confident"],
      "pace": "medium",
      "totalDuration": 30
    }`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional voice-over script writer specializing in short-form video content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content_response = response.choices[0]?.message?.content
    if (!content_response) throw new Error('No script generated')

    try {
      return JSON.parse(content_response)
    } catch (error) {
      throw new Error('Failed to parse voice-over script')
    }
  }

  async generateImage(
    prompt: string,
    style: 'realistic' | 'cartoon' | 'minimalist' | 'abstract' = 'realistic',
    size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'
  ): Promise<string> {
    const enhancedPrompt = `${prompt}, ${style} style, high quality, professional, social media optimized`

    const response = await this.client.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size: size,
      quality: 'standard',
      n: 1,
    })

    const imageUrl = response.data[0]?.url
    if (!imageUrl) throw new Error('No image generated')

    return imageUrl
  }

  private buildIdeaPrompt(
    topic: string,
    platform: string,
    count: number,
    options?: AIGenerationOptions
  ): string {
    const platformSpecs = {
      TIKTOK: 'short-form videos (15-60 seconds), trending sounds, challenges, educational content',
      INSTAGRAM: 'visual storytelling, carousels, reels, stories, aesthetic content',
      TWITTER: 'concise text (280 chars), threads, real-time engagement, news commentary',
    }

    return `Generate ${count} creative content ideas for ${platform} about "${topic}".

    Platform context: ${platformSpecs[platform as keyof typeof platformSpecs]}
    ${options?.audience ? `Target audience: ${options.audience}` : ''}
    ${options?.tone ? `Tone: ${options.tone}` : ''}
    ${options?.brandVoice ? `Brand voice: ${options.brandVoice}` : ''}

    For each idea, provide:
    1. Catchy title
    2. Brief description (2-3 sentences)
    3. Content category
    4. Difficulty level (easy/medium/hard)
    5. Estimated engagement potential
    6. 3-5 relevant hashtags
    7. 2-3 hook variations
    8. Call-to-action suggestion

    Format as JSON array with this structure:
    [{"id": "1", "title": "...", "description": "...", "category": "...", "difficulty": "easy", "estimatedEngagement": "high", "hashtags": ["#tag1"], "hooks": ["hook1"], "callToAction": "..."}]`
  }

  private buildCaptionPrompt(
    idea: string,
    platform: string,
    options?: AIGenerationOptions
  ): string {
    const platformLimits = {
      TIKTOK: '2200 characters, focus on hooks and trending elements',
      INSTAGRAM: '2200 characters, storytelling and visual descriptions',
      TWITTER: '280 characters, concise and punchy',
    }

    return `Write an engaging caption for ${platform} based on this idea: "${idea}"

    Platform guidelines: ${platformLimits[platform as keyof typeof platformLimits]}
    ${options?.tone ? `Tone: ${options.tone}` : 'Tone: casual and engaging'}
    ${options?.audience ? `Audience: ${options.audience}` : ''}
    ${options?.brandVoice ? `Brand voice: ${options.brandVoice}` : ''}

    Include:
    - Compelling hook (first line)
    - Value-driven content
    - Relevant hashtags (5-10)
    - Clear call-to-action
    - Emojis where appropriate

    Return as JSON:
    {"caption": "...", "hashtags": ["#tag1"], "hooks": ["hook1"], "callToAction": "...", "tone": "${options?.tone || 'casual'}", "length": 150}`
  }

  private parseContentIdeas(content: string, platform: string): ContentIdea[] {
    try {
      const parsed = JSON.parse(content)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
      // Fallback parsing for malformed JSON
      const ideas: ContentIdea[] = []
      const lines = content.split('\n')
      
      let currentIdea: Partial<ContentIdea> = {}
      let idCounter = 1

      for (const line of lines) {
        if (line.includes('Title:') || line.includes('title:')) {
          if (currentIdea.title) {
            ideas.push(this.completeIdea(currentIdea, platform, idCounter++))
            currentIdea = {}
          }
          currentIdea.title = line.replace(/.*title:\s*/i, '').trim()
        } else if (line.includes('Description:') || line.includes('description:')) {
          currentIdea.description = line.replace(/.*description:\s*/i, '').trim()
        }
        // Add more parsing logic as needed
      }

      if (currentIdea.title) {
        ideas.push(this.completeIdea(currentIdea, platform, idCounter))
      }

      return ideas
    }
  }

  private parseCaption(content: string, tone: string): GeneratedCaption {
    try {
      return JSON.parse(content)
    } catch (error) {
      // Fallback parsing
      const lines = content.split('\n')
      const caption = lines.find(line => !line.startsWith('#'))?.trim() || content
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

  private parseHashtagsFallback(content: string): HashtagSuggestion[] {
    const hashtags = content.match(/#\w+/g) || []
    return hashtags.map((hashtag, index) => ({
      hashtag,
      popularity: index < 5 ? 'high' : index < 15 ? 'medium' : 'low',
      competition: index < 10 ? 'high' : 'medium',
      relevance: Math.max(0.5, 1 - (index * 0.05)),
      estimatedReach: Math.max(1000, 100000 - (index * 5000)),
    }))
  }

  private completeIdea(idea: Partial<ContentIdea>, platform: string, id: number): ContentIdea {
    return {
      id: id.toString(),
      title: idea.title || 'Untitled Idea',
      description: idea.description || 'No description provided',
      platform: platform as any,
      category: idea.category || 'General',
      difficulty: idea.difficulty || 'medium',
      estimatedEngagement: idea.estimatedEngagement || 'medium',
      hashtags: idea.hashtags || [],
      hooks: idea.hooks || [],
      callToAction: idea.callToAction,
    }
  }
}
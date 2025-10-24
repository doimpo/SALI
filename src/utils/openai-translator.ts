import OpenAI from 'openai';
import { translationConfig } from '../i18n/config';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

export interface BatchTranslationRequest {
  items: TranslationRequest[];
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}

export class OpenAITranslator {
  private client: OpenAI;
  private rateLimitDelay: number = 1000; // 1 second between requests
  private lastRequestTime: number = 0;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
    });
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  private getMedicalSystemPrompt(sourceLanguage: string, targetLanguage: string): string {
    return `You are a medical translator specializing in hepatology and liver care. Your task is to translate medical content from ${sourceLanguage} to ${targetLanguage} while maintaining:

1. MEDICAL ACCURACY: Preserve all medical terminology, drug names, procedure names, and anatomical terms exactly as they are in the source language when they are internationally recognized (e.g., "liver transplantation", "hepatitis", "cirrhosis", "FibroScan", "TACE", "TIPS").

2. CONTEXT AWARENESS: This content is for a liver care institute (South Asian Liver Institute - SALi) providing liver transplantation, cirrhosis treatment, and hepatology services.

3. CULTURAL SENSITIVITY: Adapt content appropriately for the target language audience while maintaining medical accuracy.

4. FORMATTING: Preserve HTML tags, structure, and formatting exactly as provided.

5. BRAND CONSISTENCY: Maintain "South Asian Liver Institute" and "SALi" as proper nouns.

IMPORTANT RULES:
- Do NOT translate medical terms that are internationally standardized
- Do NOT translate proper nouns (doctor names, institute names, location names)
- Do NOT translate HTML attributes, class names, or technical elements
- Preserve all numbers, dates, phone numbers, and URLs exactly
- Maintain the same tone and formality level as the source

Translate only the text content while preserving all HTML structure and medical terminology.`;
  }

  async translateSingle(request: TranslationRequest): Promise<TranslationResponse> {
    await this.enforceRateLimit();

    try {
      const systemPrompt = this.getMedicalSystemPrompt(request.sourceLanguage, request.targetLanguage);
      
      const completion = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Translate the following text from ${request.sourceLanguage} to ${targetLanguage}:\n\n${request.text}`
          }
        ],
        temperature: 0.1, // Low temperature for consistent medical translations
        max_tokens: 4000,
      });

      const translatedText = completion.choices[0]?.message?.content?.trim() || request.text;

      return {
        translatedText,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        confidence: 0.95 // High confidence for GPT-4 medical translations
      };

    } catch (error) {
      console.error(`Translation error for ${request.sourceLanguage} -> ${request.targetLanguage}:`, error);
      
      // Return original text if translation fails
      return {
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        confidence: 0
      };
    }
  }

  async translateBatch(request: BatchTranslationRequest): Promise<TranslationResponse[]> {
    const results: TranslationResponse[] = [];
    const batchSize = translationConfig.batchSize;

    for (let i = 0; i < request.items.length; i += batchSize) {
      const batch = request.items.slice(i, i + batchSize);
      
      try {
        const batchResults = await Promise.all(
          batch.map(item => this.translateSingle(item))
        );
        
        results.push(...batchResults);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < request.items.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`Batch translation error:`, error);
        
        // Add fallback translations for failed batch
        batch.forEach(item => {
          results.push({
            translatedText: item.text,
            sourceLanguage: item.sourceLanguage,
            targetLanguage: item.targetLanguage,
            confidence: 0
          });
        });
      }
    }

    return results;
  }

  async translateWithRetry(request: TranslationRequest, maxRetries: number = translationConfig.retryAttempts): Promise<TranslationResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.translateSingle(request);
      } catch (error) {
        lastError = error as Error;
        console.warn(`Translation attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          const delay = translationConfig.retryDelay * attempt;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // If all retries failed, return original text
    console.error(`Translation failed after ${maxRetries} attempts:`, lastError);
    return {
      translatedText: request.text,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      confidence: 0
    };
  }

  async validateTranslation(original: string, translated: string, sourceLanguage: string, targetLanguage: string): Promise<boolean> {
    // Basic validation checks
    if (!translated || translated.trim().length === 0) {
      return false;
    }

    // Check if translation is too different in length (might indicate failure)
    const lengthRatio = translated.length / original.length;
    if (lengthRatio < 0.3 || lengthRatio > 3) {
      console.warn(`Translation length ratio suspicious: ${lengthRatio}`);
      return false;
    }

    // Check for common translation failure patterns
    const failurePatterns = [
      'translation failed',
      'unable to translate',
      'error occurred',
      'translation error'
    ];

    const hasFailurePattern = failurePatterns.some(pattern => 
      translated.toLowerCase().includes(pattern)
    );

    if (hasFailurePattern) {
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const openaiTranslator = new OpenAITranslator(translationConfig.openaiApiKey);

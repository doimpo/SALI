const OpenAI = require('openai');

/**
 * OpenAI Translator for medical content
 * JavaScript version for use in Node.js build scripts
 */
class OpenAITranslator {
  constructor(apiKey) {
    this.client = new OpenAI({
      apiKey: apiKey,
    });
    this.rateLimitDelay = 1000; // 1 second between requests
    this.lastRequestTime = 0;
  }

  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  getMedicalSystemPrompt(sourceLanguage, targetLanguage) {
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

  async translateSingle(request) {
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
            content: `Translate the following text from ${request.sourceLanguage} to ${request.targetLanguage}:\n\n${request.text}`
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
      console.error(`Translation error for ${request.sourceLanguage} -> ${request.targetLanguage}:`, error.message);
      
      // Return original text if translation fails
      return {
        translatedText: request.text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        confidence: 0
      };
    }
  }

  async translateBatch(request) {
    const results = [];
    const batchSize = request.batchSize || 10;

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
        console.error(`Batch translation error:`, error.message);
        
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

  async translateWithRetry(request, maxRetries = 3) {
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.translateSingle(request);
      } catch (error) {
        lastError = error;
        console.warn(`Translation attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = 1000 * attempt;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // If all retries failed, return original text
    console.error(`Translation failed after ${maxRetries} attempts:`, lastError?.message);
    return {
      translatedText: request.text,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      confidence: 0
    };
  }

  validateTranslation(original, translated, sourceLanguage, targetLanguage) {
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

module.exports = OpenAITranslator;

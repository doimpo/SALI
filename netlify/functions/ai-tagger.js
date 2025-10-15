/**
 * AI Tagging and Categorization Service
 * Uses OpenAI to analyze form submissions and extract insights
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Keywords for urgency detection
const URGENT_KEYWORDS = ['emergency', 'urgent', 'critical', 'immediate', 'severe', 'pain', 'bleeding', 'unconscious'];
const SERVICE_KEYWORDS = {
  transplant: ['transplant', 'liver transplant', 'donor', 'recipient'],
  cirrhosis: ['cirrhosis', 'fibrosis', 'scarring'],
  cancer: ['cancer', 'tumor', 'malignant', 'oncology'],
  'fatty-liver': ['fatty liver', 'NAFLD', 'NASH', 'steatosis'],
  endoscopy: ['endoscopy', 'ERCP', 'EGD', 'colonoscopy'],
  ICU: ['ICU', 'intensive care', 'critical care'],
};

/**
 * Perform rule-based classification as fallback
 */
function ruleBasedClassification(formData) {
  const text = JSON.stringify(formData).toLowerCase();
  
  // Detect urgency
  const isUrgent = URGENT_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
  
  // Detect service area
  let serviceArea = 'general';
  let maxMatches = 0;
  
  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    const matches = keywords.filter(keyword => text.includes(keyword.toLowerCase())).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      serviceArea = service;
    }
  }
  
  // Calculate priority score
  let priorityScore = 3; // default
  if (isUrgent) priorityScore = 5;
  else if (maxMatches > 0) priorityScore = 4;
  
  return {
    urgency: isUrgent ? 'urgent' : 'routine',
    priorityScore,
    serviceArea,
    tags: [],
    summary: 'Rule-based classification',
  };
}

/**
 * Use AI to analyze form submission
 */
async function aiAnalysis(formData) {
  try {
    const prompt = `Analyze this medical appointment/inquiry form submission and provide structured insights:

Form Data:
${JSON.stringify(formData, null, 2)}

Please provide a JSON response with:
1. urgency: "urgent" or "routine" (urgent if medical emergency, severe symptoms, or immediate attention needed)
2. priorityScore: 1-5 (5=immediate, 4=high, 3=medium, 2=low, 1=informational)
3. serviceArea: one of [transplant, cirrhosis, cancer, fatty-liver, endoscopy, ICU, laparoscopic, interventional, general]
4. tags: array of relevant tags (e.g., ["insurance-query", "second-opinion", "follow-up"])
5. summary: brief 1-2 sentence summary of the inquiry
6. contactPreference: "phone", "email", or "either" (based on form data)

Response must be valid JSON only, no other text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a medical intake specialist analyzing patient form submissions. Provide structured JSON analysis only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error('AI analysis failed, falling back to rule-based:', error);
    return ruleBasedClassification(formData);
  }
}

/**
 * Main tagger function
 */
export async function tagSubmission(formData) {
  const submissionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();
  
  // Try AI analysis first, fallback to rule-based
  let analysis;
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
    analysis = await aiAnalysis(formData);
  } else {
    console.log('OpenAI API key not configured, using rule-based classification');
    analysis = ruleBasedClassification(formData);
  }
  
  // Extract location from form data
  const location = formData.location || formData['form-location'] || 'not-specified';
  
  return {
    submissionId,
    timestamp,
    formType: formData['form-type'] || 'contact',
    urgency: analysis.urgency,
    priorityScore: analysis.priorityScore,
    location,
    serviceArea: analysis.serviceArea,
    tags: analysis.tags || [],
    summary: analysis.summary || 'Form submission received',
    contactPreference: analysis.contactPreference || 'either',
    rawData: formData,
    spamScore: 0, // Will be set by reCAPTCHA verification
  };
}

export default tagSubmission;


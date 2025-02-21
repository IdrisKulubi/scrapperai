import OpenAI from 'openai';
import { ScrapedResult } from '../scrapers/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AIClassification = {
  relevant: boolean;
  sector: 'energy' | 'agriculture' | 'water' | 'other';
  deadline: string;
  relevance_score: number;
};

export const classifyContent = async (content: string): Promise<AIClassification> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [{
      role: 'system',
      content: `Analyze African sustainability opportunities. Respond with JSON: { 
        relevant: boolean, 
        sector: "energy"|"agriculture"|"water"|"other",
        deadline: "YYYY-MM-DD"|null,
        relevance_score: 0-100
      }`
    }, {
      role: 'user',
      content
    }]
  });

  return JSON.parse(response.choices[0].message.content || '{}');
};

export const batchClassify = async (items: ScrapedResult[]) => {
  return Promise.all(items.map(async (item) => ({
    ...item,
    classification: await classifyContent(item.content)
  })));
}; 
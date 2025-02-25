export type ScrapedResult = {
  url: string;
  content: string;
  classification: {
    relevant: boolean;
    sector: string;
    relevance_score: number;
    deadline?: string;

  };
  metadata?: Record<string, unknown>;
  timestamp: Date;
  source: string;
  
  
}; 
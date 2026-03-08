export interface ResumeAnalysisRequest {
  jobUrl: string;
  resumeFile: File;
}

export interface ResumeAnalysisResult {
  originalScore: number;
  adjustedScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  adjustedContent: string;
  jobTitle: string;
  company: string;
}

export interface Suggestion {
  section: string;
  original: string;
  improved: string;
  impact: 'high' | 'medium' | 'low';
}

export type AnalysisStep = 'upload' | 'analyzing' | 'result';

export interface AnalysisProgress {
  step: number;
  message: string;
  percentage: number;
}

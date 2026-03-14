export interface ResumeAnalysisRequest {
  jobUrl: string;
  resumeFile: File;
}

export interface ResumeAnalysisResult {
  analysisId?: string;
  status?: string;
  originalScore: number;
  adjustedScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  adjustedContent: string;
  jobTitle: string;
  company: string;
  adjustedFileName?: string;
  adjustedFileContentType?: string;
  adjustedFileBase64?: string;
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

export interface ResumeApiResponse {
  analysisId?: string;
  status?: string;
  improvedResumePdf?: string;
  improvedResumeContent?: string;
  originalScore?: number;
  adjustedScore?: number;
  currentScore?: number;
  optimizedScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  suggestions?: Suggestion[];
  adjustedContent?: string;
  optimizedContent?: string;
  generatedResume?: string;
  jobTitle?: string;
  company?: string;
  fileName?: string;
  contentType?: string;
  fileBase64?: string;
}

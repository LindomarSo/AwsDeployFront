import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ResumeAnalysisRequest,
  ResumeAnalysisResult,
  AnalysisProgress,
  ResumeApiResponse,
} from '../models/resume.model';
import { finalize } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  readonly isLoading = signal(false);
  readonly progress = signal<AnalysisProgress>({ step: 0, message: '', percentage: 0 });
  readonly result = signal<ResumeAnalysisResult | null>(null);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);
  private progressTimer: ReturnType<typeof setInterval> | null = null;

  private readonly analysisSteps: AnalysisProgress[] = [
    { step: 1, message: 'Fazendo leitura do currículo...', percentage: 15 },
    { step: 2, message: 'Acessando a vaga de emprego...', percentage: 30 },
    { step: 3, message: 'Extraindo requisitos da vaga...', percentage: 50 },
    { step: 4, message: 'Comparando com seu currículo...', percentage: 65 },
    { step: 5, message: 'Identificando palavras-chave...', percentage: 80 },
    { step: 6, message: 'Gerando sugestões personalizadas...', percentage: 92 },
    { step: 7, message: 'Finalizando ajustes...', percentage: 100 },
  ];

  analyzeResume(request: ResumeAnalysisRequest): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.result.set(null);

    const formData = new FormData();
    formData.append('file', request.resumeFile, request.resumeFile.name);
    formData.append('jobVacancyUrl', request.jobUrl);

    this.startProgress();

    this.http
      .post<ResumeApiResponse>(`${API_BASE_URL}/resume/analyze`, formData)
      .pipe(
        finalize(() => {
          this.stopProgress();
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.progress.set(this.analysisSteps[this.analysisSteps.length - 1]);
          this.result.set(this.mapResult(response, request));
        },
        error: (error: { error?: { message?: string }; status?: number }) => {
          const message =
            error.error?.message ??
            (error.status === 401
              ? 'Sua sessão expirou. Faça login novamente para analisar o currículo.'
              : 'Não foi possível analisar o currículo na API local.');

          this.error.set(message);
        },
      });
  }

  private startProgress(): void {
    let currentIndex = 0;
    this.progress.set(this.analysisSteps[currentIndex]);

    this.progressTimer = setInterval(() => {
      currentIndex = Math.min(currentIndex + 1, this.analysisSteps.length - 2);
      this.progress.set(this.analysisSteps[currentIndex]);
    }, 900);
  }

  private stopProgress(): void {
    if (!this.progressTimer) {
      return;
    }

    clearInterval(this.progressTimer);
    this.progressTimer = null;
  }

  private mapResult(
    response: ResumeApiResponse | null | undefined,
    request: ResumeAnalysisRequest
  ): ResumeAnalysisResult {
    const adjustedContent =
      response?.improvedResumeContent ??
      response?.adjustedContent ??
      response?.optimizedContent ??
      response?.generatedResume ??
      '';
    const adjustedFileBase64 = response?.improvedResumePdf ?? response?.fileBase64;

    return {
      analysisId: response?.analysisId,
      status: response?.status,
      originalScore: response?.originalScore ?? response?.currentScore ?? 0,
      adjustedScore: response?.adjustedScore ?? response?.optimizedScore ?? 0,
      matchedKeywords: response?.matchedKeywords ?? [],
      missingKeywords: response?.missingKeywords ?? [],
      suggestions: response?.suggestions ?? [],
      adjustedContent,
      jobTitle: response?.jobTitle ?? 'Vaga analisada',
      company: response?.company ?? this.extractCompanyFromUrl(request.jobUrl),
      adjustedFileName:
        response?.fileName ?? (adjustedFileBase64 ? 'curriculo-otimizado.pdf' : undefined),
      adjustedFileContentType:
        response?.contentType ?? (adjustedFileBase64 ? 'application/pdf' : undefined),
      adjustedFileBase64,
    };
  }

  private extractCompanyFromUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      if (hostname.includes('linkedin')) return 'LinkedIn';
      if (hostname.includes('gupy')) return 'Gupy';
      if (hostname.includes('indeed')) return 'Indeed';
      if (hostname.includes('glassdoor')) return 'Glassdoor';
      return hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'Empresa';
    }
  }

  reset(): void {
    this.stopProgress();
    this.result.set(null);
    this.error.set(null);
    this.isLoading.set(false);
    this.progress.set({ step: 0, message: '', percentage: 0 });
  }
}

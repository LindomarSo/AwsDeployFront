import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ResumeAnalysisRequest,
  ResumeAnalysisResult,
  AnalysisProgress,
} from '../models/resume.model';
import { Observable, of, delay, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  readonly isLoading = signal(false);
  readonly progress = signal<AnalysisProgress>({ step: 0, message: '', percentage: 0 });
  readonly result = signal<ResumeAnalysisResult | null>(null);
  readonly error = signal<string | null>(null);

  private readonly analysisSteps: AnalysisProgress[] = [
    { step: 1, message: 'Fazendo leitura do currículo...', percentage: 15 },
    { step: 2, message: 'Acessando a vaga de emprego...', percentage: 30 },
    { step: 3, message: 'Extraindo requisitos da vaga...', percentage: 50 },
    { step: 4, message: 'Comparando com seu currículo...', percentage: 65 },
    { step: 5, message: 'Identificando palavras-chave...', percentage: 80 },
    { step: 6, message: 'Gerando sugestões personalizadas...', percentage: 92 },
    { step: 7, message: 'Finalizando ajustes...', percentage: 100 },
  ];

  constructor(private http: HttpClient) {}

  analyzeResume(request: ResumeAnalysisRequest): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.result.set(null);

    // Simulate step-by-step progress (replace with real API call)
    this.simulateProgress().then(() => {
      const mockResult: ResumeAnalysisResult = {
        originalScore: 42,
        adjustedScore: 87,
        matchedKeywords: ['Angular', 'TypeScript', 'RxJS', 'REST API', 'Git'],
        missingKeywords: ['AWS', 'Docker', 'CI/CD', 'Scrum', 'Jest'],
        jobTitle: 'Desenvolvedor Frontend Sênior',
        company: this.extractCompanyFromUrl(request.jobUrl),
        suggestions: [
          {
            section: 'Resumo Profissional',
            original: 'Desenvolvedor frontend com experiência em Angular.',
            improved:
              'Desenvolvedor Frontend Sênior com +5 anos de experiência em Angular, TypeScript e AWS, entregando soluções escaláveis com foco em performance e CI/CD.',
            impact: 'high',
          },
          {
            section: 'Habilidades Técnicas',
            original: 'Angular, TypeScript, HTML, CSS',
            improved:
              'Angular 17+, TypeScript, RxJS, AWS (S3/EC2), Docker, CI/CD (GitHub Actions), Jest, SCSS, REST/GraphQL APIs',
            impact: 'high',
          },
          {
            section: 'Experiência – Empresa XYZ',
            original: 'Desenvolvi features para aplicação web.',
            improved:
              'Desenvolvi e implantei 12+ features críticas em aplicação Angular com 50k usuários, reduzindo o tempo de carregamento em 35% através de lazy loading e otimização de bundle.',
            impact: 'medium',
          },
        ],
        adjustedContent: 'Currículo ajustado e pronto para download...',
      };

      this.result.set(mockResult);
      this.isLoading.set(false);
    });
  }

  private async simulateProgress(): Promise<void> {
    for (const step of this.analysisSteps) {
      this.progress.set(step);
      await this.sleep(600 + Math.random() * 400);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    this.result.set(null);
    this.error.set(null);
    this.isLoading.set(false);
    this.progress.set({ step: 0, message: '', percentage: 0 });
  }
}

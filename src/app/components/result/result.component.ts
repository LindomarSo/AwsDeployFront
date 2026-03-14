import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeAnalysisResult } from '../../models/resume.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="result-wrapper">
      <!-- Score Section -->
      @if (hasScoreData()) {
      <div class="score-section">
        <div class="score-card score-before">
          <p class="score-label">Pontuação Anterior</p>
          <div class="score-circle score-circle--low">
            <svg viewBox="0 0 36 36" class="score-svg">
              <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="score-fill score-fill--low" [attr.stroke-dasharray]="data().originalScore + ', 100'"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            </svg>
            <span class="score-value">{{ data().originalScore }}%</span>
          </div>
        </div>

        <div class="score-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
          <span class="score-improvement">+{{ data().adjustedScore - data().originalScore }}%</span>
        </div>

        <div class="score-card score-after">
          <p class="score-label">Pontuação Ajustada</p>
          <div class="score-circle score-circle--high">
            <svg viewBox="0 0 36 36" class="score-svg">
              <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="score-fill score-fill--high" [attr.stroke-dasharray]="data().adjustedScore + ', 100'"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            </svg>
            <span class="score-value score-value--high">{{ data().adjustedScore }}%</span>
          </div>
        </div>
      </div>
      }

      @if (data().analysisId || data().status) {
        <div class="analysis-meta">
          @if (data().status) {
            <span class="analysis-badge">Status: {{ data().status }}</span>
          }
          @if (data().analysisId) {
            <span class="analysis-id">Análise: {{ data().analysisId }}</span>
          }
        </div>
      }

      <!-- Job Info -->
      <div class="job-info-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <span>{{ data().jobTitle }} · {{ data().company }}</span>
      </div>

      <!-- Keywords -->
      @if (hasKeywordData()) {
      <div class="keywords-section">
        <div class="keyword-group">
          <h4 class="keyword-title keyword-title--match">
            <span class="keyword-dot keyword-dot--match"></span>
            Palavras-chave encontradas ({{ data().matchedKeywords.length }})
          </h4>
          <div class="keyword-list">
            @for (kw of data().matchedKeywords; track kw) {
              <span class="keyword-tag keyword-tag--match">{{ kw }}</span>
            }
          </div>
        </div>
        <div class="keyword-group">
          <h4 class="keyword-title keyword-title--missing">
            <span class="keyword-dot keyword-dot--missing"></span>
            Palavras-chave ausentes ({{ data().missingKeywords.length }})
          </h4>
          <div class="keyword-list">
            @for (kw of data().missingKeywords; track kw) {
              <span class="keyword-tag keyword-tag--missing">{{ kw }}</span>
            }
          </div>
        </div>
      </div>
      }

      <!-- Suggestions -->
      @if (hasSuggestions()) {
      <div class="suggestions-section">
        <h3 class="suggestions-title">Sugestões de Melhoria</h3>
        <div class="suggestions-list">
          @for (suggestion of data().suggestions; track suggestion.section) {
            <div [class]="'suggestion-card suggestion-card--' + suggestion.impact">
              <div class="suggestion-header">
                <span class="suggestion-section">{{ suggestion.section }}</span>
                <span [class]="'suggestion-impact impact--' + suggestion.impact">
                  {{ impactLabel(suggestion.impact) }}
                </span>
              </div>
              <div class="suggestion-body">
                <div class="suggestion-diff suggestion-diff--before">
                  <span class="diff-label">Antes</span>
                  <p>{{ suggestion.original }}</p>
                </div>
                <div class="suggestion-diff suggestion-diff--after">
                  <span class="diff-label">Após</span>
                  <p>{{ suggestion.improved }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      }

      @if (data().adjustedContent) {
        <div class="content-section">
          <h3 class="suggestions-title">Conteúdo Otimizado</h3>
          <div class="content-card">
            <p>{{ data().adjustedContent }}</p>
          </div>
        </div>
      }

      <!-- Download Button -->
      <button class="download-btn" (click)="downloadResume()" [disabled]="!canDownload()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        {{ canDownload() ? 'Baixar Currículo Ajustado' : 'Sem arquivo para download' }}
        <div class="btn-shine"></div>
      </button>
    </div>
  `,
  styles: [`
    .result-wrapper { display: flex; flex-direction: column; gap: 1.5rem; animation: fadeSlideUp 0.6s ease both; }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .score-section { display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
    .score-card { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); min-width: 140px; }
    .score-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin: 0; }
    .score-circle { position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; }
    .score-svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
    .score-bg { fill: none; stroke: rgba(255,255,255,0.06); stroke-width: 2.5; }
    .score-fill { fill: none; stroke-width: 2.5; stroke-linecap: round; transition: stroke-dasharray 1.5s ease; }
    .score-fill--low { stroke: #f59e0b; }
    .score-fill--high { stroke: url(#grad); stroke: #10b981; }
    .score-value { font-size: 1.6rem; font-weight: 700; color: #e2e8f0; z-index: 1; }
    .score-value--high { color: #10b981; }
    .score-arrow { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; color: #8b5cf6; }
    .score-arrow svg { width: 28px; height: 28px; }
    .score-improvement { font-size: 0.9rem; font-weight: 700; color: #10b981; }
    .analysis-meta { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .analysis-badge, .analysis-id {
      border-radius: 999px;
      padding: 0.45rem 0.8rem;
      font-size: 0.76rem;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: #cbd5e1;
    }
    .job-info-badge { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 999px; color: #a78bfa; font-size: 0.875rem; font-weight: 500; align-self: flex-start; }
    .job-info-badge svg { width: 16px; height: 16px; flex-shrink: 0; }
    .keywords-section { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 600px) { .keywords-section { grid-template-columns: 1fr; } }
    .keyword-group { background: rgba(255,255,255,0.02); border-radius: 12px; padding: 1rem; border: 1px solid rgba(255,255,255,0.05); }
    .keyword-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.75rem; }
    .keyword-title--match { color: #10b981; }
    .keyword-title--missing { color: #f59e0b; }
    .keyword-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .keyword-dot--match { background: #10b981; box-shadow: 0 0 6px #10b981; }
    .keyword-dot--missing { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }
    .keyword-list { display: flex; flex-wrap: wrap; gap: 0.375rem; }
    .keyword-tag { font-size: 0.75rem; padding: 0.25rem 0.625rem; border-radius: 6px; }
    .keyword-tag--match { background: rgba(16, 185, 129, 0.12); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.2); }
    .keyword-tag--missing { background: rgba(245, 158, 11, 0.12); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.2); }
    .suggestions-section { display: flex; flex-direction: column; gap: 0.75rem; }
    .suggestions-title { font-size: 1rem; font-weight: 700; color: #e2e8f0; margin: 0 0 0.25rem; }
    .suggestion-card { border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); overflow: hidden; transition: transform 0.2s; }
    .suggestion-card:hover { transform: translateY(-2px); }
    .suggestion-card--high { border-color: rgba(139, 92, 246, 0.2); }
    .suggestion-card--medium { border-color: rgba(59, 130, 246, 0.2); }
    .suggestion-card--low { border-color: rgba(100, 116, 139, 0.2); }
    .suggestion-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); }
    .suggestion-section { font-size: 0.85rem; font-weight: 600; color: #cbd5e1; }
    .suggestion-impact { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700; }
    .impact--high { background: rgba(139, 92, 246, 0.15); color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.25); }
    .impact--medium { background: rgba(59, 130, 246, 0.15); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.25); }
    .impact--low { background: rgba(100, 116, 139, 0.15); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.25); }
    .suggestion-body { display: grid; grid-template-columns: 1fr 1fr; }
    @media (max-width: 600px) { .suggestion-body { grid-template-columns: 1fr; } }
    .suggestion-diff { padding: 0.875rem 1rem; }
    .suggestion-diff--before { background: rgba(239, 68, 68, 0.04); border-right: 1px solid rgba(255,255,255,0.05); }
    .suggestion-diff--after { background: rgba(16, 185, 129, 0.04); }
    .diff-label { display: inline-block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
    .suggestion-diff--before .diff-label { color: #f87171; }
    .suggestion-diff--after .diff-label { color: #6ee7b7; }
    .suggestion-diff p { font-size: 0.8rem; color: #94a3b8; margin: 0; line-height: 1.6; }
    .suggestion-diff--after p { color: #cbd5e1; }
    .content-section { display: flex; flex-direction: column; gap: 0.75rem; }
    .content-card {
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      background: rgba(255,255,255,0.03);
      padding: 1rem;
    }
    .content-card p {
      margin: 0;
      white-space: pre-wrap;
      line-height: 1.7;
      color: #cbd5e1;
      font-size: 0.9rem;
    }
    .download-btn {
      position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center; gap: 0.625rem;
      padding: 1rem 2rem; border-radius: 14px; border: none; cursor: pointer;
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      color: white; font-size: 1rem; font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4);
      letter-spacing: 0.01em;
    }
    .download-btn svg { width: 20px; height: 20px; }
    .download-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(124, 58, 237, 0.5); }
    .download-btn:active { transform: translateY(0); }
    .download-btn:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      box-shadow: none;
    }
    .download-btn:disabled:hover { transform: none; }
    .btn-shine {
      position: absolute; top: -50%; left: -60%; width: 40%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transform: skewX(-20deg);
      animation: shine 4s ease-in-out infinite;
    }
    @keyframes shine {
      0% { left: -60%; }
      30%, 100% { left: 140%; }
    }
  `],
})
export class ResultComponent {
  readonly data = input.required<ResumeAnalysisResult>();

  hasScoreData(): boolean {
    const data = this.data();
    return data.originalScore > 0 || data.adjustedScore > 0;
  }

  hasKeywordData(): boolean {
    const data = this.data();
    return data.matchedKeywords.length > 0 || data.missingKeywords.length > 0;
  }

  hasSuggestions(): boolean {
    return this.data().suggestions.length > 0;
  }

  canDownload(): boolean {
    const data = this.data();
    return Boolean(data.adjustedFileBase64 || data.adjustedContent);
  }

  impactLabel(impact: 'high' | 'medium' | 'low'): string {
    const map = { high: 'Alto Impacto', medium: 'Médio Impacto', low: 'Baixo Impacto' };
    return map[impact];
  }

  downloadResume(): void {
    const data = this.data();

    if (!this.canDownload()) {
      return;
    }

    const blob = data.adjustedFileBase64
      ? this.base64ToBlob(
          data.adjustedFileBase64,
          data.adjustedFileContentType ?? 'application/octet-stream'
        )
      : new Blob([data.adjustedContent || 'Currículo Ajustado - conteúdo gerado pela IA'], {
          type: data.adjustedFileContentType ?? 'text/plain;charset=utf-8',
        });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.adjustedFileName ?? 'curriculo-ajustado.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
    const sanitized = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteCharacters = atob(sanitized);
    const byteNumbers = new Array(byteCharacters.length);

    for (let index = 0; index < byteCharacters.length; index += 1) {
      byteNumbers[index] = byteCharacters.charCodeAt(index);
    }

    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }
}

import {
  Component,
  output,
  signal,
  computed,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="upload-zone"
      [class.drag-over]="isDragOver()"
      [class.has-file]="selectedFile()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
    >
      <input
        #fileInput
        type="file"
        accept=".pdf,.doc,.docx"
        class="hidden"
        (change)="onFileSelected($event)"
      />

      @if (!selectedFile()) {
        <div class="upload-idle">
          <div class="upload-icon-wrapper">
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/>
            </svg>
          </div>
          <p class="upload-title">Arraste seu currículo aqui</p>
          <p class="upload-subtitle">ou <span class="upload-link">clique para selecionar</span></p>
          <p class="upload-formats">PDF, DOC ou DOCX • Máx. 10MB</p>
        </div>
      } @else {
        <div class="file-selected">
          <div class="file-icon-wrapper">
            <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </div>
          <div class="file-info">
            <p class="file-name">{{ selectedFile()!.name }}</p>
            <p class="file-size">{{ formatSize(selectedFile()!.size) }}</p>
          </div>
          <button class="file-remove" (click)="removeFile($event)" aria-label="Remover arquivo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .upload-zone {
      border: 2px dashed rgba(139, 92, 246, 0.4);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(139, 92, 246, 0.04);
      position: relative;
      overflow: hidden;
    }
    .upload-zone::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08), transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .upload-zone:hover, .upload-zone.drag-over {
      border-color: rgba(139, 92, 246, 0.8);
      background: rgba(139, 92, 246, 0.08);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(139, 92, 246, 0.2);
    }
    .upload-zone:hover::before, .upload-zone.drag-over::before { opacity: 1; }
    .upload-zone.has-file {
      border-color: rgba(16, 185, 129, 0.5);
      background: rgba(16, 185, 129, 0.04);
      cursor: default;
    }
    .upload-zone.drag-over { transform: scale(1.01) translateY(-2px); }
    .upload-idle { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .upload-icon-wrapper {
      width: 72px; height: 72px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 0.5rem;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .upload-icon { width: 36px; height: 36px; color: #8b5cf6; }
    .upload-title { font-size: 1.1rem; font-weight: 600; color: #e2e8f0; margin: 0; }
    .upload-subtitle { font-size: 0.875rem; color: #94a3b8; margin: 0; }
    .upload-link { color: #8b5cf6; text-decoration: underline; }
    .upload-formats { font-size: 0.75rem; color: #64748b; margin: 0.25rem 0 0; }
    .file-selected { display: flex; align-items: center; gap: 1rem; }
    .file-icon-wrapper {
      width: 52px; height: 52px; flex-shrink: 0;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2));
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .file-icon { width: 28px; height: 28px; color: #10b981; }
    .file-info { flex: 1; min-width: 0; }
    .file-name { font-size: 0.95rem; font-weight: 600; color: #e2e8f0; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .file-size { font-size: 0.8rem; color: #64748b; margin: 0.2rem 0 0; }
    .file-remove {
      width: 32px; height: 32px; flex-shrink: 0;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; color: #ef4444;
    }
    .file-remove:hover { background: rgba(239, 68, 68, 0.2); }
    .file-remove svg { width: 16px; height: 16px; }
    .hidden { display: none; }
  `],
})
export class FileUploadComponent {
  readonly fileSelected = output<File | null>();

  readonly selectedFile = signal<File | null>(null);
  readonly isDragOver = signal(false);

  readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.setFile(file);
  }

  removeFile(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.fileSelected.emit(null);
    this.fileInputRef().nativeElement.value = '';
  }

  private setFile(file: File): void {
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
}

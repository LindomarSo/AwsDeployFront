import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { ResultComponent } from '../../components/result/result.component';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, ResultComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly resumeService = inject(ResumeService);

  readonly jobUrl = signal('');
  readonly resumeFile = signal<File | null>(null);

  readonly canAnalyze = computed(
    () => this.jobUrl().trim().length > 0 && this.resumeFile() !== null
  );

  onFileSelected(file: File | null): void {
    this.resumeFile.set(file);
  }

  onAnalyze(): void {
    const file = this.resumeFile();
    if (!this.canAnalyze() || !file) return;

    this.resumeService.analyzeResume({
      jobUrl: this.jobUrl(),
      resumeFile: file,
    });
  }

  onReset(): void {
    this.jobUrl.set('');
    this.resumeFile.set(null);
    this.resumeService.reset();
  }
}

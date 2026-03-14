import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, of, switchMap } from 'rxjs';

import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { ResultComponent } from '../../components/result/result.component';
import { LoginRequest, RegisterRequest } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { ResumeService } from '../../services/resume.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, ResultComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly authService = inject(AuthService);
  readonly resumeService = inject(ResumeService);

  readonly authMode = signal<'login' | 'register'>('login');
  readonly authName = signal('');
  readonly authEmail = signal('');
  readonly authPassword = signal('');
  readonly authFeedback = signal<string | null>(null);
  readonly authError = signal<string | null>(null);
  readonly isSubmittingAuth = signal(false);

  readonly jobUrl = signal('');
  readonly resumeFile = signal<File | null>(null);

  readonly canAnalyze = computed(
    () =>
      this.authService.isAuthenticated() &&
      this.jobUrl().trim().length > 0 &&
      this.resumeFile() !== null
  );
  readonly canSubmitAuth = computed(() => {
    const hasCredentials =
      this.authEmail().trim().length > 0 && this.authPassword().trim().length > 0;

    if (this.authMode() === 'login') {
      return hasCredentials;
    }

    return hasCredentials && this.authName().trim().length > 0;
  });

  setAuthMode(mode: 'login' | 'register'): void {
    this.authMode.set(mode);
    this.authError.set(null);
    this.authFeedback.set(null);
  }

  onAuthSubmit(): void {
    if (!this.canSubmitAuth()) {
      return;
    }

    this.isSubmittingAuth.set(true);
    this.authError.set(null);
    this.authFeedback.set(null);

    const email = this.authEmail().trim();
    const password = this.authPassword().trim();
    const loginPayload: LoginRequest = { email, password };
    const request$ =
      this.authMode() === 'register'
        ? this.authService.register({
            name: this.authName().trim(),
            email,
            password,
          } satisfies RegisterRequest).pipe(
            switchMap((session) => (session.token ? of(session) : this.authService.login(loginPayload)))
          )
        : this.authService.login(loginPayload);

    request$
      .pipe(finalize(() => this.isSubmittingAuth.set(false)))
      .subscribe({
        next: () => {
          this.authPassword.set('');
          this.authFeedback.set(
            this.authMode() === 'register'
              ? 'Conta criada e autenticada com sucesso.'
              : 'Login realizado com sucesso.'
          );
        },
        error: (error: { error?: { message?: string }; status?: number }) => {
          const message =
            error.error?.message ??
            (error.status === 401
              ? 'E-mail ou senha inválidos.'
              : error.status === 409
                ? 'Esse e-mail já está cadastrado.'
                : 'Não foi possível concluir a autenticação na API local.');

          this.authError.set(message);
        },
      });
  }

  onLogout(): void {
    this.authService.logout();
    this.authPassword.set('');
    this.authFeedback.set('Sessão encerrada.');
    this.authError.set(null);
    this.resumeService.reset();
  }

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
    this.resumeService.error.set(null);
    this.resumeService.reset();
  }
}

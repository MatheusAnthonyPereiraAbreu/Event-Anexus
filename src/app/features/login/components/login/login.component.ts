import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginDto } from '../../../../core/dto/login.dto';
import { UserType } from '../../../../core/dto/user.dto';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { extractFieldErrors, formatErrorForModal } from '../../../../shared/utils/error-handler';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  navigateToCadastro() {
    this.router.navigate(['/cadastro']);
  }

  navigateToEsquecerSenha() {
    this.router.navigate(['/esquecer-senha']);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: LoginDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login realizado com sucesso:', response.message);

        // Redireciona baseado no tipo de usuário
        const user = this.authService.getCurrentUser();
        if (user?.type === UserType.ORGANIZER) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/participant-dashboard']);
        }
      },
      error: (error) => {
        console.error('Erro ao fazer login:', error);

        // Extrai erros específicos de campos
        const fieldErrors = extractFieldErrors(error);

        // Aplica erros aos campos correspondentes
        Object.keys(fieldErrors).forEach(field => {
          const control = this.loginForm.get(field);
          if (control) {
            control.setErrors({ backend: fieldErrors[field] });
            control.markAsTouched();
          }
        });

        // Formata e exibe modal de erro
        const { title, message } = formatErrorForModal(error);
        this.modalService.error(title, message).subscribe();

        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}

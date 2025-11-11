import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../../core/services/users.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { UserDto, UserType } from '../../../../core/dto/user.dto';
import { UpdateUserDto, UpdatePasswordDto } from '../../../../core/dto/update-user.dto';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
    selector: 'app-edit-user',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
    templateUrl: './edit-user.component.html',
    styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
    userForm: FormGroup;
    passwordForm: FormGroup;
    userId: string = '';
    isLoadingUser = false;
    isSubmittingUser = false;
    isSubmittingPassword = false;
    showPasswordSection = false;
    currentUser: UserDto | null = null;

    userTypes = [
        { value: 'ORGANIZER', label: 'Organizador' },
        { value: 'REGULAR', label: 'Regular' }
    ];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private usersService: UsersService,
        private authService: AuthService,
        private modalService: ModalService
    ) {
        // Form de dados do usuário
        this.userForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            telephone_number: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{5}-\d{4}$/)]],
            type: ['REGULAR', Validators.required],
            department: ['']
        });

        // Form de alteração de senha
        this.passwordForm = this.fb.group({
            current_password: ['', [Validators.required, Validators.minLength(6)]],
            new_password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_new_password: ['', [Validators.required]]
        }, { validators: this.passwordsMatchValidator });
    }

    ngOnInit() {
        this.userId = this.route.snapshot.paramMap.get('id') || '';
        if (this.userId) {
            this.loadUser();
        } else {
            this.modalService.error('Erro', 'ID do usuário não fornecido').subscribe();
            this.navigateToDashboard();
        }
    }

    /**
     * Obtém a rota base do dashboard baseado no tipo de usuário atual
     */
    private getDashboardBasePath(): string {
        const currentUser = this.authService.getCurrentUser();
        return currentUser?.type === UserType.ORGANIZER
            ? '/dashboard-admin'
            : '/dashboard-participant';
    }

    /**
     * Navega para o dashboard apropriado
     */
    private navigateToDashboard(): void {
        this.router.navigate([this.getDashboardBasePath()]);
    }

    /**
     * Validador customizado para confirmar se as senhas são iguais
     */
    passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('new_password')?.value;
        const confirmPassword = control.get('confirm_new_password')?.value;

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            return { passwordsMismatch: true };
        }

        return null;
    }

    get uf() {
        return this.userForm.controls;
    }

    get pf() {
        return this.passwordForm.controls;
    }

    loadUser() {
        this.isLoadingUser = true;
        this.usersService.getUserById(this.userId).subscribe({
            next: (user) => {
                this.currentUser = user;
                this.userForm.patchValue({
                    name: user.name,
                    email: user.email,
                    telephone_number: user.telephone_number,
                    type: user.type,
                    department: user.department || ''
                });
                this.isLoadingUser = false;
            },
            error: (error) => {
                console.error('Erro ao carregar usuário:', error);
                this.modalService.error(
                    'Erro ao carregar usuário',
                    error.error?.message || 'Não foi possível carregar os dados do usuário'
                ).subscribe(() => {
                    this.navigateToDashboard();
                });
                this.isLoadingUser = false;
            }
        });
    }

    togglePasswordSection() {
        this.showPasswordSection = !this.showPasswordSection;
        if (!this.showPasswordSection) {
            this.passwordForm.reset();
        }
    }

    onSubmitUser() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const userData: UpdateUserDto = {
            name: this.userForm.value.name,
            telephone_number: this.userForm.value.telephone_number,
            type: this.userForm.value.type,
            department: this.userForm.value.department || undefined
        };

        this.isSubmittingUser = true;

        this.usersService.updateUser(userData).subscribe({
            next: () => {
                this.modalService.success(
                    'Dados atualizados',
                    'Seus dados foram atualizados com sucesso!'
                ).subscribe();
                this.isSubmittingUser = false;
                this.loadUser(); // Recarrega os dados
            },
            error: (error) => {
                console.error('Erro ao atualizar usuário:', error);
                this.modalService.error(
                    'Erro ao atualizar',
                    error.error?.message || 'Não foi possível atualizar seus dados'
                ).subscribe();
                this.isSubmittingUser = false;
            }
        });
    }

    onSubmitPassword() {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        const passwordData: UpdatePasswordDto = {
            current_password: this.passwordForm.value.current_password,
            new_password: this.passwordForm.value.new_password
        };

        this.isSubmittingPassword = true;

        this.usersService.updatePassword(passwordData).subscribe({
            next: () => {
                this.modalService.success(
                    'Senha alterada',
                    'Sua senha foi alterada com sucesso!'
                ).subscribe();
                this.passwordForm.reset();
                this.showPasswordSection = false;
                this.isSubmittingPassword = false;
            },
            error: (error) => {
                console.error('Erro ao alterar senha:', error);
                this.modalService.error(
                    'Erro ao alterar senha',
                    error.error?.message || 'Não foi possível alterar sua senha. Verifique se a senha atual está correta.'
                ).subscribe();
                this.isSubmittingPassword = false;
            }
        });
    }

    onDeleteUser() {
        this.modalService.confirm(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'
        ).subscribe((confirmed) => {
            if (confirmed) {
                this.usersService.deleteUser().subscribe({
                    next: () => {
                        this.modalService.success(
                            'Conta excluída',
                            'Sua conta foi excluída com sucesso'
                        ).subscribe(() => {
                            // Limpa a sessão e redireciona para login
                            sessionStorage.clear();
                            this.router.navigate(['/login']);
                        });
                    },
                    error: (error) => {
                        console.error('Erro ao excluir usuário:', error);
                        this.modalService.error(
                            'Erro ao excluir conta',
                            error.error?.message || 'Não foi possível excluir sua conta'
                        ).subscribe();
                    }
                });
            }
        });
    }
}

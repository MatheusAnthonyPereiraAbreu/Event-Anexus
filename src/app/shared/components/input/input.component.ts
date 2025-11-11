import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() control!: AbstractControl;
    @Input() errorMessages: { [key: string]: string } = {};
    @Input() id: string = '';
    @Input() name: string = '';
    @Input() mask: 'phone' | 'none' = 'none';
    @Input() icon?: string;
    @Input() parentForm?: any; // Para validações cross-field
    @Input() maxlength?: number;

    @Output() input = new EventEmitter<Event>();

    private onChange: (value: any) => void = () => { };
    private onTouched: () => void = () => { };

    value: string = '';
    disabled: boolean = false;

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
        this.onChange(this.value);
    }

    onBlur(): void {
        this.onTouched();
    }

    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        let newValue = input.value;

        // Aplica máscara de telefone se configurado
        if (this.mask === 'phone') {
            newValue = this.applyPhoneMask(newValue);
            input.value = newValue;
        }

        this.control?.setValue(newValue);
        this.control?.markAsDirty();

        // Emite o evento para o componente pai (para máscaras customizadas)
        this.input.emit(event);
    }

    onBlurEvent(): void {
        this.control?.markAsTouched();
    }

    private applyPhoneMask(value: string): string {
        // Remove todos os caracteres não numéricos
        let numbers = value.replace(/\D/g, '');

        // Limita a 11 dígitos (padrão brasileiro)
        if (numbers.length > 11) {
            numbers = numbers.slice(0, 11);
        }

        // Formata conforme o tamanho
        if (numbers.length <= 2) {
            return numbers.length > 0 ? `(${numbers}` : '';
        } else if (numbers.length <= 6) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        } else if (numbers.length <= 10) {
            // Fixo: (00) 0000-0000
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        } else {
            // Celular: (00) 00000-0000
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }
    }

    getErrorMessage(): string {
        if (!this.control || !this.control.touched) {
            return '';
        }

        // Check for control-level errors
        const errors = this.control.errors;
        if (errors) {
            if (errors['required']) {
                return this.errorMessages['required'] || 'Campo obrigatório';
            }
            if (errors['email']) {
                return this.errorMessages['email'] || 'E-mail inválido';
            }
            if (errors['minlength']) {
                const minLength = errors['minlength'].requiredLength;
                return this.errorMessages['minlength'] || `Mínimo de ${minLength} caracteres`;
            }
            if (errors['maxlength']) {
                const maxLength = errors['maxlength'].requiredLength;
                return this.errorMessages['maxlength'] || `Máximo de ${maxLength} caracteres`;
            }
            if (errors['pattern']) {
                return this.errorMessages['pattern'] || 'Formato inválido';
            }
            if (errors['passwordMismatch']) {
                return this.errorMessages['passwordMismatch'] || 'As senhas não coincidem';
            }
            if (errors['backend']) {
                return errors['backend'];
            }
        }

        // Check for form-level errors (like passwordsMismatch)
        const parent = this.parentForm || this.control.parent;
        if (parent && parent.errors) {
            const parentErrors = parent.errors;
            if (parentErrors['passwordsMismatch'] && this.control.dirty) {
                return this.errorMessages['passwordsMismatch'] || 'As senhas não coincidem';
            }
        }

        return '';
    }
}

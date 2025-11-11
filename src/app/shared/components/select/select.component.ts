import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
    value: string | number;
    label: string;
}

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class SelectComponent {
    @Input() label: string = '';
    @Input() placeholder: string = 'Selecione uma opção';
    @Input() control!: AbstractControl;
    @Input() options: SelectOption[] = [];
    @Input() errorMessages: { [key: string]: string } = {};
    @Input() icon?: string;

    onBlurEvent(): void {
        this.control?.markAsTouched();
    }

    hasError(errorType: string): boolean {
        return this.control?.hasError(errorType) && this.control?.touched || false;
    }

    getErrorMessage(errorType: string): string {
        return this.errorMessages[errorType] || '';
    }

    get showError(): boolean {
        return this.control?.invalid && this.control?.touched || false;
    }
}

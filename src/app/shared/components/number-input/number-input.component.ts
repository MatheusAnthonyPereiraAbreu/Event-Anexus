import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-number-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './number-input.component.html',
    styleUrl: './number-input.component.scss'
})
export class NumberInputComponent {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() control!: AbstractControl;
    @Input() errorMessages: { [key: string]: string } = {};
    @Input() min?: number;
    @Input() max?: number;
    @Input() icon?: string;
    @Input() helpText?: string;

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

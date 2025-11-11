import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './textarea.component.html',
    styleUrl: './textarea.component.scss'
})
export class TextareaComponent {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() control!: AbstractControl;
    @Input() errorMessages: { [key: string]: string } = {};
    @Input() rows: number = 4;
    @Input() maxlength?: number;
    @Input() showCounter: boolean = true;

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

    get currentLength(): number {
        return this.control?.value?.length || 0;
    }
}

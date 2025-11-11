import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'danger';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
    @Input() text: string = '';
    @Input() label: string = ''; // Alias para text
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() buttonType: ButtonType = 'primary';
    @Input() variant: ButtonType = 'primary'; // Alias para buttonType
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;
    @Input() loadingText: string = 'Carregando...';
    @Input() icon: string = '';
    @Input() iconLeft: string = ''; // Alias para icon com position left
    @Input() iconRight: string = ''; // Alias para icon com position right
    @Input() iconPosition: 'left' | 'right' = 'left';
    @Input() fullWidth: boolean = true;

    @Output() btnClick = new EventEmitter<Event>();
    @Output() onClick = new EventEmitter<Event>(); // Alias para btnClick

    handleClick(event: Event): void {
        if (!this.disabled && !this.loading) {
            this.btnClick.emit(event);
            this.onClick.emit(event);
        }
    }

    get displayText(): string {
        if (this.loading) {
            return this.loadingText;
        }
        return this.label || this.text;
    }

    get displayIcon(): string {
        return this.iconLeft || this.iconRight || this.icon;
    }

    get displayIconPosition(): 'left' | 'right' {
        if (this.iconLeft) return 'left';
        if (this.iconRight) return 'right';
        return this.iconPosition;
    }

    get effectiveButtonType(): ButtonType {
        return this.variant || this.buttonType;
    }

    get isDisabled(): boolean {
        return this.disabled || this.loading;
    }

    getButtonClasses(): string {
        const baseClasses = 'inline-flex items-center justify-center gap-3 py-2 px-6 md:py-3 md:px-8 rounded-full transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed';

        const widthClass = this.fullWidth ? 'w-full' : '';

        let typeClasses = '';

        switch (this.effectiveButtonType) {
            case 'primary':
                typeClasses = 'bg-secondary text-white hover:bg-secondary/90';
                break;
            case 'secondary':
                typeClasses = 'bg-primary text-white hover:bg-primary/90';
                break;
            case 'outline':
                typeClasses = 'border border-secondary text-secondary hover:bg-secondary hover:text-white';
                break;
            case 'danger':
                typeClasses = 'bg-red-500 text-white hover:bg-red-600';
                break;
        }

        return `${baseClasses} ${widthClass} ${typeClasses}`.trim();
    }
}


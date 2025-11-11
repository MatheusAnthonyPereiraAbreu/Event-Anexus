import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectComponent, SelectOption } from '../../../../shared/components/select/select.component';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { NumberInputComponent } from '../../../../shared/components/number-input/number-input.component';
import { extractFieldErrors, formatErrorForModal } from '../../../../shared/utils/error-handler';
import { CreateEventDto } from '../../../../core/dto/event.dto';
import { convertEventTypeToBackend } from '../../../../shared/utils/event-type-mapper';

@Component({
    selector: 'app-create-event',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputComponent,
        ButtonComponent,
        SelectComponent,
        TextareaComponent,
        NumberInputComponent
    ],
    templateUrl: './create-event.component.html',
    styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {
    eventForm: FormGroup;
    isSubmitting = false;
    unlimitedCapacity = false;

    eventTypeOptions: SelectOption[] = [
        { value: 'Workshop', label: 'Workshop' },
        { value: 'Palestra', label: 'Palestra' },
        { value: 'Conferência', label: 'Conferência' },
        { value: 'Seminário', label: 'Seminário' },
        { value: 'Hackathon', label: 'Hackathon' },
        { value: 'Meetup', label: 'Meetup' },
        { value: 'Treinamento', label: 'Treinamento' },
        { value: 'Webinar', label: 'Webinar' },
        { value: 'Outro', label: 'Outro' }
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private eventsService: EventsService,
        private modalService: ModalService
    ) {
        this.eventForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(500)],
            date: ['', [Validators.required, this.futureDateValidator]],
            time: ['', [Validators.required, this.timeFormatValidator]],
            location: ['', Validators.required],
            capacity: [null],
            type: ['', Validators.required],
            speaker: [''],
            responsible: ['', Validators.required]
        });
    }

    toggleUnlimitedCapacity(): void {
        this.unlimitedCapacity = !this.unlimitedCapacity;

        if (this.unlimitedCapacity) {
            this.eventForm.get('capacity')?.setValue(null);
            this.eventForm.get('capacity')?.disable();
        } else {
            this.eventForm.get('capacity')?.enable();
        }
    }

    // Validador customizado para data futura
    futureDateValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }

        const inputDate = control.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Converte DD/MM/YYYY para Date
        const parts = inputDate.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Mês começa em 0
            const year = parseInt(parts[2], 10);
            const selectedDate = new Date(year, month, day);

            if (selectedDate < today) {
                return { pastDate: true };
            }
        }

        return null;
    }

    // Validador para formato HH:MM
    timeFormatValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }

        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timePattern.test(control.value)) {
            return { invalidTime: true };
        }

        return null;
    }

    onSubmit() {
        if (this.eventForm.invalid) {
            this.eventForm.markAllAsTouched();

            // Coleta erros para exibir
            const invalidFields: string[] = [];
            const fieldLabels: { [key: string]: string } = {
                title: 'Título',
                description: 'Descrição',
                date: 'Data',
                time: 'Horário',
                location: 'Local',
                capacity: 'Capacidade',
                type: 'Tipo',
                speaker: 'Palestrante',
                responsible: 'Responsável'
            };

            Object.keys(this.eventForm.controls).forEach(key => {
                const control = this.eventForm.get(key);
                if (control?.invalid && control.errors) {
                    const fieldLabel = fieldLabels[key] || key;

                    if (control.errors['required']) {
                        invalidFields.push(`${fieldLabel}: campo obrigatório`);
                    } else if (control.errors['maxlength']) {
                        const maxLength = control.errors['maxlength'].requiredLength;
                        invalidFields.push(`${fieldLabel}: máximo de ${maxLength} caracteres`);
                    } else if (control.errors['pastDate']) {
                        invalidFields.push(`${fieldLabel}: deve ser uma data futura`);
                    } else if (control.errors['invalidTime']) {
                        invalidFields.push(`${fieldLabel}: formato inválido (HH:MM)`);
                    }
                }
            });

            const errorMessage = invalidFields.join('\n');
            this.modalService.error('Formulário incompleto', errorMessage).subscribe();
            return;
        }

        this.isSubmitting = true;

        const formValue = this.eventForm.getRawValue();

        // Converte data DD/MM/YYYY para ISO format YYYY-MM-DDTHH:mm:ss
        const dateISO = this.convertDateToISO(formValue.date);

        // Converte o tipo de português para inglês usando o utilitário
        const typeInEnglish = convertEventTypeToBackend(formValue.type);

        const eventData: CreateEventDto = {
            title: formValue.title,
            description: formValue.description || '',
            date: dateISO,
            time: formValue.time,
            location: formValue.location,
            capacity: this.unlimitedCapacity ? null : (formValue.capacity || 0),
            type: typeInEnglish as any,
            speaker: formValue.speaker || '',
            institution_organizer: formValue.responsible
        };

        this.eventsService.createEvent(eventData).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.modalService.success(
                    'Evento criado!',
                    response.message || 'O evento foi cadastrado com sucesso e está visível para inscrições.'
                ).subscribe(() => {
                    this.router.navigate(['/dashboard-admin/eventos']);
                });
            },
            error: (error) => {
                this.isSubmitting = false;

                // Extrai erros específicos de campos
                const fieldErrors = extractFieldErrors(error);

                // Aplica erros aos campos correspondentes
                Object.keys(fieldErrors).forEach(field => {
                    const control = this.eventForm.get(field);
                    if (control) {
                        control.setErrors({ backend: fieldErrors[field] });
                        control.markAsTouched();
                    }
                });

                // Formata e exibe modal de erro
                const { title, message } = formatErrorForModal(error);
                this.modalService.error(title, message).subscribe();
            }
        });
    }

    cancel() {
        this.router.navigate(['/dashboard-admin/eventos']);
    }

    // Máscara para data (DD/MM/YYYY)
    applyDateMask(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length >= 5) {
            value = value.slice(0, 5) + '/' + value.slice(5, 9);
        }

        input.value = value;
        this.eventForm.get('date')?.setValue(value);
    }

    // Máscara para horário (HH:MM)
    applyTimeMask(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = value.slice(0, 2) + ':' + value.slice(2, 4);
        }

        input.value = value;
        this.eventForm.get('time')?.setValue(value);
    }

    // Converte data DD/MM/YYYY para ISO format YYYY-MM-DDTHH:mm:ss
    private convertDateToISO(dateStr: string): string {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}T00:00:00`;
        }
        return dateStr;
    }
}

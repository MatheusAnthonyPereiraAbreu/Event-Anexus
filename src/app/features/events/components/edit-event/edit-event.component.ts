import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectComponent, SelectOption } from '../../../../shared/components/select/select.component';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { NumberInputComponent } from '../../../../shared/components/number-input/number-input.component';
import { extractFieldErrors, formatErrorForModal } from '../../../../shared/utils/error-handler';
import { UpdateEventDto, EventDto } from '../../../../core/dto/event.dto';
import { convertEventTypeToBackend, convertEventTypeFromBackend } from '../../../../shared/utils/event-type-mapper';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-edit-event',
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
    templateUrl: './edit-event.component.html',
    styleUrl: './edit-event.component.scss'
})
export class EditEventComponent extends BrowserOnlyComponent implements OnInit {
    eventForm: FormGroup;
    isSubmitting = false;
    isLoading = true;
    unlimitedCapacity = false;
    eventId!: number;

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
        private route: ActivatedRoute,
        private eventsService: EventsService,
        private modalService: ModalService
    ) {
        super(); // Chama construtor da classe base
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

    protected override onBrowserInit(): void {
        // Executado apenas no navegador - substitui ngOnInit
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.eventId = parseInt(id, 10);
            this.loadEvent();
        } else {
            this.isLoading = false;
            this.modalService.error('Erro', 'ID do evento não encontrado').subscribe();
            this.router.navigate(['/dashboard-admin/eventos']);
        }
    }

    loadEvent(): void {
        this.isLoading = true;
        this.eventsService.getEventById(this.eventId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (event) => {
                    this.populateForm(event);
                    this.isLoading = false;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.error(
                        'Erro ao carregar evento',
                        'Não foi possível carregar os dados do evento. Tente novamente.'
                    ).subscribe(() => {
                        this.router.navigate(['/dashboard-admin/eventos']);
                    });
                }
            });
    }

    populateForm(event: EventDto): void {
        // Converte data ISO para DD/MM/YYYY
        const dateFormatted = this.convertISOToDate(event.date);

        // Converte tipo de inglês (backend) para português (UI)
        const typeFormatted = convertEventTypeFromBackend(event.type);

        // Verifica se é capacidade ilimitada
        this.unlimitedCapacity = event.capacity === null || event.capacity === 0;

        this.eventForm.patchValue({
            title: event.title,
            description: event.description,
            date: dateFormatted,
            time: event.time,
            location: event.location,
            capacity: event.capacity,
            type: typeFormatted,
            speaker: event.speaker,
            responsible: event.institution_organizer
        });

        // Desabilita o campo de capacidade se for ilimitado
        if (this.unlimitedCapacity) {
            this.eventForm.get('capacity')?.disable();
        }
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

    futureDateValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }

        const inputDate = control.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const parts = inputDate.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const selectedDate = new Date(year, month, day);

            if (selectedDate < today) {
                return { pastDate: true };
            }
        }

        return null;
    }

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

    onSubmit(): void {
        if (this.eventForm.invalid) {
            this.eventForm.markAllAsTouched();

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
        const dateISO = this.convertDateToISO(formValue.date);

        // Converte o tipo de português para inglês usando o utilitário
        const typeInEnglish = convertEventTypeToBackend(formValue.type);

        const eventData: UpdateEventDto = {
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

        this.eventsService.updateEvent(this.eventId, eventData).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.modalService.success(
                    'Evento atualizado!',
                    response.message || 'O evento foi atualizado com sucesso.'
                ).subscribe(() => {
                    this.router.navigate(['/dashboard-admin/eventos']);
                });
            },
            error: (error) => {
                this.isSubmitting = false;

                const fieldErrors = extractFieldErrors(error);
                Object.keys(fieldErrors).forEach(field => {
                    const control = this.eventForm.get(field);
                    if (control) {
                        control.setErrors({ backend: fieldErrors[field] });
                        control.markAsTouched();
                    }
                });

                const { title, message } = formatErrorForModal(error);
                this.modalService.error(title, message).subscribe();
            }
        });
    }

    cancel(): void {
        this.router.navigate(['/dashboard-admin/eventos']);
    }

    applyDateMask(event: Event): void {
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

    applyTimeMask(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');

        if (value.length >= 2) {
            value = value.slice(0, 2) + ':' + value.slice(2, 4);
        }

        input.value = value;
        this.eventForm.get('time')?.setValue(value);
    }

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

    private convertISOToDate(isoDate: string): string {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

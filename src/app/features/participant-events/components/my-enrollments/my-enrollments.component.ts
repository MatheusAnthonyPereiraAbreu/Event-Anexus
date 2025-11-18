import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { MyEnrollmentDto } from '../../../../core/dto/event.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-my-enrollments',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './my-enrollments.component.html',
    styleUrl: './my-enrollments.component.scss'
})
export class MyEnrollmentsComponent extends BrowserOnlyComponent implements OnInit {
    events: MyEnrollmentDto[] = [];
    isLoading = true;

    constructor(
        private eventsService: EventsService,
        private modalService: ModalService,
        private router: Router
    ) {
        super();
    }

    protected override onBrowserInit(): void {
        this.loadMyEnrollments();
    }

    loadMyEnrollments(): void {
        this.isLoading = true;
        this.eventsService.getMyEnrollments()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (events) => {
                    this.events = events;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.error(
                        'Erro ao carregar inscrições',
                        'Não foi possível carregar suas inscrições. Tente novamente.'
                    ).subscribe();
                }
            });
    }

    formatDate(isoDate: string): string {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    getEventTypeLabel(type: string): string {
        const typeMap: { [key: string]: string } = {
            'WORKSHOP': 'Workshop',
            'LECTURE': 'Palestra',
            'CONFERENCE': 'Conferência',
            'SEMINAR': 'Seminário',
            'HACKATHON': 'Hackathon',
            'MEETUP': 'Meetup',
            'TRAINING': 'Treinamento',
            'WEBINAR': 'Webinar',
            'OTHER': 'Outro'
        };
        return typeMap[type] || type;
    }

    isPastEvent(event: MyEnrollmentDto): boolean {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate < today;
    }

    cancelEnrollment(event: MyEnrollmentDto): void {
        if (this.isPastEvent(event)) {
            this.modalService.error(
                'Cancelamento não permitido',
                'Não é possível cancelar inscrição em eventos que já ocorreram.'
            ).subscribe();
            return;
        }

        this.modalService.confirm(
            'Cancelar Inscrição',
            `Tem certeza que deseja cancelar sua inscrição no evento "${event.title}"?`
        ).subscribe((confirmed) => {
            if (confirmed) {
                this.performCancelEnrollment(event.id);
            }
        });
    }

    performCancelEnrollment(eventId: number): void {
        this.eventsService.cancelEnrollment(eventId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.success(
                        'Inscrição cancelada!',
                        'Sua inscrição foi cancelada com sucesso.'
                    ).subscribe();
                    this.loadMyEnrollments(); // Recarrega a lista
                },
                error: (error) => {
                    const errorMessage = error.error?.message || 'Não foi possível cancelar a inscrição. Tente novamente.';
                    this.modalService.error(
                        'Erro ao cancelar inscrição',
                        errorMessage
                    ).subscribe();
                }
            });
    }

    viewEventDetails(eventId: number): void {
        this.router.navigate(['/dashboard-participant/evento-detalhes', eventId]);
    }

    viewCertificate(certificateId: number): void {
        this.router.navigate(['/dashboard-participant/certificado', certificateId]);
    }

    hasCertificate(event: MyEnrollmentDto): boolean {
        return event.certificate_id !== null && event.certificate_id !== undefined && this.isPastEvent(event);
    }
}

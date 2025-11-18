import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AvailableEventDto, MyEnrollmentDto } from '../../../../core/dto/event.dto';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-participant-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './participant-home.component.html',
    styleUrl: './participant-home.component.scss'
})
export class ParticipantHomeComponent extends BrowserOnlyComponent implements OnInit {
    userName: string = '';
    availableEvents: AvailableEventDto[] = [];
    myEvents: MyEnrollmentDto[] = [];
    isLoadingAvailable = true;
    isLoadingMy = true;

    constructor(
        private authService: AuthService,
        private eventsService: EventsService,
        private modalService: ModalService,
        private router: Router
    ) {
        super();
    }

    protected override onBrowserInit(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.userName = user.name;
        }

        this.loadAvailableEvents();
        this.loadMyEvents();
    }

    loadAvailableEvents() {
        this.isLoadingAvailable = true;
        this.eventsService.getAvailableEvents()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (events) => {
                    const eventsAvaliable = events.filter(event => !event.is_participant);
                    this.availableEvents = eventsAvaliable.slice(0, 6);
                    this.isLoadingAvailable = false;
                },
                error: (error) => {
                    this.isLoadingAvailable = false;
                    this.modalService.error(
                        'Erro ao carregar eventos',
                        'Não foi possível carregar os eventos disponíveis.'
                    ).subscribe();
                }
            });
    }

    loadMyEvents() {
        this.isLoadingMy = true;
        this.eventsService.getMyEnrollments()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (events) => {
                    this.myEvents = events.slice(0, 3);
                    this.isLoadingMy = false;
                },
                error: (error) => {
                    this.isLoadingMy = false;
                    this.modalService.error(
                        'Erro ao carregar inscrições',
                        'Não foi possível carregar suas inscrições.'
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

    getCapacityPercentage(event: AvailableEventDto): number {
        if (!event.capacity || event.capacity === 0) {
            return 100;
        }
        const enrolled = event.capacity - event.remaining_slots;
        return (enrolled / event.capacity) * 100;
    }

    isPastEvent(event: MyEnrollmentDto): boolean {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate < today;
    }

    viewEventDetails(eventId: number) {
        this.router.navigate(['/dashboard-participant/evento-detalhes', eventId]);
    }

    viewAllAvailable() {
        this.router.navigate(['/dashboard-participant/eventos-disponiveis']);
    }

    viewAllEnrollments() {
        this.router.navigate(['/dashboard-participant/minhas-inscricoes']);
    }

    cancelEnrollment(event: MyEnrollmentDto) {
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

    performCancelEnrollment(eventId: number) {
        this.eventsService.cancelEnrollment(eventId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.success(
                        'Inscrição cancelada!',
                        'Sua inscrição foi cancelada com sucesso.'
                    ).subscribe();
                    this.loadMyEvents();
                    this.loadAvailableEvents();
                },
                error: (error) => {
                    const errorMessage = error.error?.message || 'Não foi possível cancelar a inscrição.';
                    this.modalService.error(
                        'Erro ao cancelar inscrição',
                        errorMessage
                    ).subscribe();
                }
            });
    }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { PublicEventDetailDto } from '../../../../core/dto/event.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-event-details',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './event-details.component.html',
    styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent extends BrowserOnlyComponent implements OnInit {
    event: PublicEventDetailDto | null = null;
    isLoading = true;
    isEnrolling = false;
    eventId!: number;

    constructor(
        private eventsService: EventsService,
        private modalService: ModalService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super();
    }

    protected override onBrowserInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.eventId = parseInt(id, 10);
            this.loadEventDetails();
        } else {
            this.modalService.error('Erro', 'ID do evento não encontrado').subscribe();
            this.router.navigate(['/dashboard-participant/eventos-disponiveis']);
        }
    }

    loadEventDetails(): void {
        this.isLoading = true;
        this.eventsService.getPublicEventDetail(this.eventId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (event) => {
                    this.event = event;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.error(
                        'Erro ao carregar evento',
                        'Não foi possível carregar os detalhes do evento. Tente novamente.'
                    ).subscribe(() => {
                        this.router.navigate(['/dashboard-participant/eventos-disponiveis']);
                    });
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

    formatFullDate(isoDate: string): string {
        const date = new Date(isoDate);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('pt-BR', options);
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

    getCapacityText(): string {
        if (!this.event) return '';

        if (this.event.capacity === null || this.event.capacity === 0) {
            return 'Vagas ilimitadas';
        }
        return `${this.event.remaining_slots} de ${this.event.capacity} vagas disponíveis`;
    }

    canEnroll(): boolean {
        if (!this.event) return false;
        return !this.event.is_past && !this.event.is_full;
    }

    enrollInEvent(): void {
        if (!this.event || !this.canEnroll()) return;

        this.modalService.confirm(
            'Confirmar Inscrição',
            `Deseja se inscrever no evento "${this.event.title}"?`
        ).subscribe((confirmed) => {
            if (confirmed) {
                this.performEnrollment();
            }
        });
    }

    performEnrollment(): void {
        this.isEnrolling = true;
        this.eventsService.enrollInEvent(this.eventId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.isEnrolling = false;
                    this.modalService.success(
                        'Inscrição realizada!',
                        response.message || 'Sua inscrição foi realizada com sucesso.'
                    ).subscribe(() => {
                        this.router.navigate(['/dashboard-participant/minhas-inscricoes']);
                    });
                },
                error: (error) => {
                    this.isEnrolling = false;
                    const errorMessage = error.error?.message || 'Não foi possível realizar a inscrição. Tente novamente.';
                    this.modalService.error(
                        'Erro ao realizar inscrição',
                        errorMessage
                    ).subscribe();
                }
            });
    }

    goBack(): void {
        this.router.navigate(['/dashboard-participant/eventos-disponiveis']);
    }
}

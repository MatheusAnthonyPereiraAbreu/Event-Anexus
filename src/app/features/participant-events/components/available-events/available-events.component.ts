import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AvailableEventDto } from '../../../../core/dto/event.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-available-events',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './available-events.component.html',
    styleUrl: './available-events.component.scss'
})
export class AvailableEventsComponent extends BrowserOnlyComponent implements OnInit {
    events: AvailableEventDto[] = [];
    isLoading = true;

    constructor(
        private eventsService: EventsService,
        private modalService: ModalService,
        private router: Router
    ) {
        super();
    }

    protected override onBrowserInit(): void {
        this.loadAvailableEvents();
    }

    loadAvailableEvents(): void {
        this.isLoading = true;
        this.eventsService.getAvailableEvents()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (events) => {
                    this.events = events;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.error(
                        'Erro ao carregar eventos',
                        'Não foi possível carregar os eventos disponíveis. Tente novamente.'
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

    getCapacityText(event: AvailableEventDto): string {
        if (event.capacity === null || event.capacity === 0) {
            return 'Vagas ilimitadas';
        }
        return `${event.remaining_slots} vagas disponíveis`;
    }

    viewEventDetails(eventId: number): void {
        this.router.navigate(['/dashboard-participant/evento-detalhes', eventId]);
    }
}

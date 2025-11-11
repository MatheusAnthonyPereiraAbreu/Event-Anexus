import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { EventDto } from '../../../../core/dto/event.dto';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';
import { convertEventTypeFromBackend } from '../../../../shared/utils/event-type-mapper';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-home.component.html',
    styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent extends BrowserOnlyComponent implements OnInit {
    recentEvents: EventDto[] = [];
    isLoadingEvents = false;

    constructor(
        private router: Router,
        private eventsService: EventsService
    ) {
        super();
    }

    stats = [
        {
            title: 'Total de Eventos',
            value: '0',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: 'bg-primary'
        },
        {
            title: 'Participantes',
            value: '0',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            color: 'bg-secondary'
        },
        {
            title: 'Eventos Ativos',
            value: '0',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-green-500'
        },
        {
            title: 'Próximos Eventos',
            value: '0',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-blue-500'
        }
    ];

    protected override onBrowserInit(): void {
        this.loadRecentEvents();
    }

    loadRecentEvents(): void {
        this.isLoadingEvents = true;
        this.eventsService.getAllEvents()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (events) => {
                    // Pega os 5 primeiros eventos (mais recentes)
                    this.recentEvents = events.slice(0, 5);
                    this.isLoadingEvents = false;

                    // Atualiza os stats
                    this.updateStats(events);
                },
                error: (error) => {
                    this.isLoadingEvents = false;
                    console.error('Erro ao carregar eventos recentes:', error);
                }
            });
    }

    updateStats(events: EventDto[]): void {
        const now = new Date();
        const activeEvents = events.filter(event => new Date(event.date) >= now);

        this.stats[0].value = events.length.toString();
        this.stats[2].value = activeEvents.length.toString();
        this.stats[3].value = activeEvents.length.toString();
    }

    formatDate(isoDate: string): string {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    translateEventType(type: string): string {
        return convertEventTypeFromBackend(type);
    }

    navigateToCreateEvent() {
        this.router.navigate(['/dashboard/eventos/novo']);
    }

    navigateToEvent(eventId: number) {
        this.router.navigate(['/dashboard/eventos/editar', eventId]);
    }

    navigateToAllEvents() {
        this.router.navigate(['/dashboard/eventos']);
    }
}

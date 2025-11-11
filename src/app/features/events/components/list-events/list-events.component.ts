import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { EventDto } from '../../../../core/dto/event.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { convertEventTypeFromBackend } from '../../../../shared/utils/event-type-mapper';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-list-events',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './list-events.component.html',
    styleUrl: './list-events.component.scss'
})
export class ListEventsComponent extends BrowserOnlyComponent implements OnInit {
    events: EventDto[] = [];
    isLoading = false;

    constructor(
        private eventsService: EventsService,
        private router: Router,
        private modalService: ModalService
    ) {
        super();
    }

    protected override onBrowserInit(): void {
        this.loadEvents();
    }

    loadEvents(): void {
        this.isLoading = true;
        this.eventsService.getAllEvents()
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
                        'Não foi possível carregar a lista de eventos. Tente novamente.'
                    ).subscribe();
                }
            });
    }

    createNewEvent(): void {
        this.router.navigate(['/dashboard-admin/eventos/novo']);
    }

    editEvent(eventId: number): void {
        this.router.navigate(['/dashboard-admin/eventos/editar', eventId]);
    }

    deleteEvent(event: EventDto): void {
        this.modalService.confirm(
            'Confirmar exclusão',
            `Tem certeza que deseja excluir o evento "${event.title}"?`
        ).subscribe(confirmed => {
            if (confirmed) {
                this.eventsService.deleteEvent(event.id).subscribe({
                    next: () => {
                        this.modalService.success(
                            'Evento excluído!',
                            'O evento foi removido com sucesso.'
                        ).subscribe();
                        this.loadEvents(); // Recarrega a lista
                    },
                    error: (error) => {
                        this.modalService.error(
                            'Erro ao excluir',
                            'Não foi possível excluir o evento. Tente novamente.'
                        ).subscribe();
                    }
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

    getCapacityText(capacity: number | null): string {
        return capacity === null || capacity === 0 ? 'Ilimitado' : `${capacity} vagas`;
    }

    translateEventType(type: string): string {
        return convertEventTypeFromBackend(type);
    }
}

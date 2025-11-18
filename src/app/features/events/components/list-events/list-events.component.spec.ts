import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ListEventsComponent } from './list-events.component';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { EventDto } from '../../../../core/dto/event.dto';

describe('ListEventsComponent', () => {
    let component: ListEventsComponent;
    let fixture: ComponentFixture<ListEventsComponent>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;

    const mockEvents: EventDto[] = [
        {
            id: 1,
            title: 'Workshop Angular',
            description: 'Aprenda Angular',
            date: '2025-12-01',
            time: '14:00',
            location: 'Sala 101',
            capacity: 30,
            type: 'WORKSHOP',
            speaker: 'João Silva',
            institution_organizer: 'Tech Academy',
            created_by: 1
        },
        {
            id: 2,
            title: 'Palestra React',
            description: 'Aprenda React',
            date: '2025-12-05',
            time: '10:00',
            location: 'Auditório',
            capacity: null,
            type: 'LECTURE',
            speaker: 'Maria Santos',
            institution_organizer: 'Code Academy',
            created_by: 1
        }
    ];

    beforeEach(async () => {
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getAllEvents', 'deleteEvent']);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error', 'success', 'confirm']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ListEventsComponent],
            providers: [
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture = TestBed.createComponent(ListEventsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load events on init', () => {
        eventsService.getAllEvents.and.returnValue(of(mockEvents));

        fixture.detectChanges();

        expect(eventsService.getAllEvents).toHaveBeenCalled();
        expect(component.events).toEqual(mockEvents);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading events fails', () => {
        const error = { error: { message: 'Erro ao carregar' } };
        eventsService.getAllEvents.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao carregar eventos',
            'Não foi possível carregar a lista de eventos. Tente novamente.'
        );
        expect(component.isLoading).toBeFalse();
    });

    it('should navigate to create event', () => {
        component.createNewEvent();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-admin/eventos/novo']);
    });

    it('should navigate to edit event', () => {
        component.editEvent(1);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-admin/eventos/editar', 1]);
    });

    it('should delete event after confirmation', () => {
        const event = mockEvents[0];
        modalService.confirm.and.returnValue(of(true));
        eventsService.deleteEvent.and.returnValue(of(void 0));
        eventsService.getAllEvents.and.returnValue(of([mockEvents[1]]));
        modalService.success.and.returnValue(of(undefined));

        component.deleteEvent(event);

        expect(modalService.confirm).toHaveBeenCalledWith(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir o evento "Workshop Angular"?'
        );
        expect(eventsService.deleteEvent).toHaveBeenCalledWith(1);
        expect(modalService.success).toHaveBeenCalledWith(
            'Evento excluído!',
            'O evento foi removido com sucesso.'
        );
    });

    it('should not delete event if user cancels confirmation', () => {
        const event = mockEvents[0];
        modalService.confirm.and.returnValue(of(false));

        component.deleteEvent(event);

        expect(eventsService.deleteEvent).not.toHaveBeenCalled();
    });

    it('should handle error when deleting event fails', () => {
        const event = mockEvents[0];
        const error = { error: { message: 'Erro ao excluir' } };
        modalService.confirm.and.returnValue(of(true));
        eventsService.deleteEvent.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        component.deleteEvent(event);

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao excluir',
            'Não foi possível excluir o evento. Tente novamente.'
        );
    });
});

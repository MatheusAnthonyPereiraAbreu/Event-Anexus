import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AvailableEventsComponent } from './available-events.component';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AvailableEventDto } from '../../../../core/dto/event.dto';

describe('AvailableEventsComponent', () => {
    let component: AvailableEventsComponent;
    let fixture: ComponentFixture<AvailableEventsComponent>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;

    const mockEvents: AvailableEventDto[] = [
        {
            id: 1,
            title: 'Workshop Angular',
            description: 'Aprenda Angular',
            date: '2025-12-01T14:00:00Z',
            time: '14:00',
            location: 'Sala 101',
            capacity: 30,
            type: 'WORKSHOP',
            speaker: 'João Silva',
            institution_organizer: 'Tech Academy',
            created_by: 1,
            remaining_slots: 10,
            is_participant: false
        },
        {
            id: 2,
            title: 'Palestra React',
            description: 'Aprenda React',
            date: '2025-12-05T10:00:00Z',
            time: '10:00',
            location: 'Auditório',
            capacity: null,
            type: 'LECTURE',
            speaker: 'Maria Santos',
            institution_organizer: 'Code Academy',
            created_by: 2,
            remaining_slots: 0,
            is_participant: false
        }
    ];

    beforeEach(async () => {
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getAvailableEvents']);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [AvailableEventsComponent],
            providers: [
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture = TestBed.createComponent(AvailableEventsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load available events on init', () => {
        eventsService.getAvailableEvents.and.returnValue(of(mockEvents));

        fixture.detectChanges();

        expect(eventsService.getAvailableEvents).toHaveBeenCalled();
        expect(component.events).toEqual(mockEvents);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading events fails', () => {
        const error = { error: { message: 'Erro ao carregar' } };
        eventsService.getAvailableEvents.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao carregar eventos',
            'Não foi possível carregar os eventos disponíveis. Tente novamente.'
        );
        expect(component.isLoading).toBeFalse();
    });

    it('should format date correctly', () => {
        const formatted = component.formatDate('2025-12-01T14:00:00Z');
        expect(formatted).toBe('01/12/2025');
    });

    it('should get event type label correctly', () => {
        expect(component.getEventTypeLabel('WORKSHOP')).toBe('Workshop');
        expect(component.getEventTypeLabel('LECTURE')).toBe('Palestra');
        expect(component.getEventTypeLabel('UNKNOWN')).toBe('UNKNOWN');
    });

    it('should return correct capacity text for limited capacity', () => {
        const text = component.getCapacityText(mockEvents[0]);
        expect(text).toBe('10 vagas disponíveis');
    });

    it('should return unlimited capacity text', () => {
        const text = component.getCapacityText(mockEvents[1]);
        expect(text).toBe('Vagas ilimitadas');
    });

    it('should navigate to event details', () => {
        component.viewEventDetails(1);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/evento-detalhes', 1]);
    });
});

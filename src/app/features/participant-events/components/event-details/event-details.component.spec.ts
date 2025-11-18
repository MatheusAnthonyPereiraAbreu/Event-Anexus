import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EventDetailsComponent } from './event-details.component';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { PublicEventDetailDto } from '../../../../core/dto/event.dto';

describe('EventDetailsComponent', () => {
    let component: EventDetailsComponent;
    let fixture: ComponentFixture<EventDetailsComponent>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;
    let activatedRoute: any;

    const mockEvent: PublicEventDetailDto = {
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
        enrolled_count: 20,
        is_full: false,
        is_past: false,
        is_participant: false
    };

    beforeEach(async () => {
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getPublicEventDetail', 'enrollInEvent']);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error', 'success', 'confirm']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        activatedRoute = {
            snapshot: {
                paramMap: {
                    get: jasmine.createSpy('get').and.returnValue('1')
                }
            }
        };

        await TestBed.configureTestingModule({
            imports: [EventDetailsComponent],
            providers: [
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        }).compileComponents();

        eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture = TestBed.createComponent(EventDetailsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load event details on init', () => {
        eventsService.getPublicEventDetail.and.returnValue(of(mockEvent));

        fixture.detectChanges();

        expect(component.eventId).toBe(1);
        expect(eventsService.getPublicEventDetail).toHaveBeenCalledWith(1);
        expect(component.event).toEqual(mockEvent);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when event ID is missing', () => {
        activatedRoute.snapshot.paramMap.get.and.returnValue(null);
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith('Erro', 'ID do evento não encontrado');
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/eventos-disponiveis']);
    });

    it('should handle error when loading event fails', () => {
        const error = { error: { message: 'Evento não encontrado' } };
        eventsService.getPublicEventDetail.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao carregar evento',
            'Não foi possível carregar os detalhes do evento. Tente novamente.'
        );
        expect(component.isLoading).toBeFalse();
    });

    it('should check if can enroll correctly', () => {
        component.event = mockEvent;
        expect(component.canEnroll()).toBeTrue();

        component.event = { ...mockEvent, is_full: true };
        expect(component.canEnroll()).toBeFalse();

        component.event = { ...mockEvent, is_past: true };
        expect(component.canEnroll()).toBeFalse();
    });

    it('should get capacity text for limited capacity', () => {
        component.event = mockEvent;
        expect(component.getCapacityText()).toBe('10 de 30 vagas disponíveis');
    });

    it('should get capacity text for unlimited capacity', () => {
        component.event = { ...mockEvent, capacity: null };
        expect(component.getCapacityText()).toBe('Vagas ilimitadas');
    });

    it('should confirm and enroll in event', () => {
        component.event = mockEvent;
        component.eventId = 1;
        const response = { message: 'Inscrição realizada com sucesso' };

        modalService.confirm.and.returnValue(of(true));
        eventsService.enrollInEvent.and.returnValue(of(response));
        modalService.success.and.returnValue(of(undefined));

        component.enrollInEvent();

        expect(modalService.confirm).toHaveBeenCalledWith(
            'Confirmar Inscrição',
            'Deseja se inscrever no evento "Workshop Angular"?'
        );
        expect(eventsService.enrollInEvent).toHaveBeenCalledWith(1);
        expect(modalService.success).toHaveBeenCalledWith(
            'Inscrição realizada!',
            'Inscrição realizada com sucesso'
        );
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/minhas-inscricoes']);
    });

    it('should not enroll if user declines confirmation', () => {
        component.event = mockEvent;
        modalService.confirm.and.returnValue(of(false));

        component.enrollInEvent();

        expect(eventsService.enrollInEvent).not.toHaveBeenCalled();
    });

    it('should handle error when enrollment fails', () => {
        component.event = mockEvent;
        component.eventId = 1;
        const error = { error: { message: 'Evento lotado' } };

        modalService.confirm.and.returnValue(of(true));
        eventsService.enrollInEvent.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        component.enrollInEvent();

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao realizar inscrição',
            'Evento lotado'
        );
        expect(component.isEnrolling).toBeFalse();
    });

    it('should navigate back', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/eventos-disponiveis']);
    });
});

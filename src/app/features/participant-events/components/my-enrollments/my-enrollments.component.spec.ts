import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MyEnrollmentsComponent } from './my-enrollments.component';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { MyEnrollmentDto } from '../../../../core/dto/event.dto';

describe('MyEnrollmentsComponent', () => {
    let component: MyEnrollmentsComponent;
    let fixture: ComponentFixture<MyEnrollmentsComponent>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;

    const mockEnrollments: MyEnrollmentDto[] = [
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
            certificate_id: null
        },
        {
            id: 2,
            title: 'Palestra React',
            description: 'Aprenda React',
            date: '2025-10-01T10:00:00Z',
            time: '10:00',
            location: 'Auditório',
            capacity: 50,
            type: 'LECTURE',
            speaker: 'Maria Santos',
            institution_organizer: 'Code Academy',
            created_by: 2,
            remaining_slots: 0,
            certificate_id: 123
        }
    ];

    beforeEach(async () => {
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getMyEnrollments', 'cancelEnrollment']);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error', 'success', 'confirm']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [MyEnrollmentsComponent],
            providers: [
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture = TestBed.createComponent(MyEnrollmentsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load enrollments on init', () => {
        eventsService.getMyEnrollments.and.returnValue(of(mockEnrollments));

        fixture.detectChanges();

        expect(eventsService.getMyEnrollments).toHaveBeenCalled();
        expect(component.events).toEqual(mockEnrollments);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading enrollments fails', () => {
        const error = { error: { message: 'Erro ao carregar' } };
        eventsService.getMyEnrollments.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao carregar inscrições',
            'Não foi possível carregar suas inscrições. Tente novamente.'
        );
        expect(component.isLoading).toBeFalse();
    });

    it('should detect past event correctly', () => {
        const pastEvent = mockEnrollments[1];
        const futureEvent = mockEnrollments[0];

        expect(component.isPastEvent(pastEvent)).toBeTrue();
        expect(component.isPastEvent(futureEvent)).toBeFalse();
    });

    it('should show error when trying to cancel past event', () => {
        const pastEvent = mockEnrollments[1];
        modalService.error.and.returnValue(of(undefined));

        component.cancelEnrollment(pastEvent);

        expect(modalService.error).toHaveBeenCalledWith(
            'Cancelamento não permitido',
            'Não é possível cancelar inscrição em eventos que já ocorreram.'
        );
    });

    it('should confirm and cancel enrollment for future event', () => {
        const futureEvent = mockEnrollments[0];
        modalService.confirm.and.returnValue(of(true));
        eventsService.cancelEnrollment.and.returnValue(of(void 0));
        eventsService.getMyEnrollments.and.returnValue(of(mockEnrollments));
        modalService.success.and.returnValue(of(undefined));

        component.cancelEnrollment(futureEvent);

        expect(modalService.confirm).toHaveBeenCalledWith(
            'Cancelar Inscrição',
            'Tem certeza que deseja cancelar sua inscrição no evento "Workshop Angular"?'
        );
        expect(eventsService.cancelEnrollment).toHaveBeenCalledWith(1);
        expect(modalService.success).toHaveBeenCalled();
    });

    it('should not cancel enrollment if user declines confirmation', () => {
        const futureEvent = mockEnrollments[0];
        modalService.confirm.and.returnValue(of(false));

        component.cancelEnrollment(futureEvent);

        expect(eventsService.cancelEnrollment).not.toHaveBeenCalled();
    });

    it('should handle error when canceling enrollment fails', () => {
        const futureEvent = mockEnrollments[0];
        const error = { error: { message: 'Erro ao cancelar' } };
        modalService.confirm.and.returnValue(of(true));
        eventsService.cancelEnrollment.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        component.cancelEnrollment(futureEvent);

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao cancelar inscrição',
            'Erro ao cancelar'
        );
    });

    it('should navigate to event details', () => {
        component.viewEventDetails(1);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/evento-detalhes', 1]);
    });

    it('should navigate to certificate', () => {
        component.viewCertificate(123);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/certificado', 123]);
    });

    it('should check if event has certificate', () => {
        const eventWithCert = mockEnrollments[1];
        const eventWithoutCert = mockEnrollments[0];

        expect(component.hasCertificate(eventWithCert)).toBeTrue();
        expect(component.hasCertificate(eventWithoutCert)).toBeFalse();
    });
});

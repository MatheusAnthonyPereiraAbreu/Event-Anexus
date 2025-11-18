import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ParticipantHomeComponent } from './participant-home.component';
import { AuthService } from '../../../../core/services/auth.service';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { UserDto, UserType } from '../../../../core/dto/user.dto';

describe('ParticipantHomeComponent', () => {
    let component: ParticipantHomeComponent;
    let fixture: ComponentFixture<ParticipantHomeComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;

    const mockUser: UserDto = {
        id: '1',
        name: 'João Silva',
        email: 'joao@test.com',
        telephone_number: '(11) 98765-4321',
        type: UserType.REGULAR,
        department: undefined
    };

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', [
            'getAvailableEvents',
            'getMyEnrollments',
            'cancelEnrollment'
        ]);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error', 'success', 'confirm']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [ParticipantHomeComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        authService.getCurrentUser.and.returnValue(mockUser);

        fixture = TestBed.createComponent(ParticipantHomeComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load user name and events on init', () => {
        eventsService.getAvailableEvents.and.returnValue(of([]));
        eventsService.getMyEnrollments.and.returnValue(of([]));

        fixture.detectChanges();

        expect(component.userName).toBe('João Silva');
        expect(eventsService.getAvailableEvents).toHaveBeenCalled();
        expect(eventsService.getMyEnrollments).toHaveBeenCalled();
    });

    it('should navigate to all available events', () => {
        component.viewAllAvailable();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/eventos-disponiveis']);
    });

    it('should navigate to all enrollments', () => {
        component.viewAllEnrollments();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/minhas-inscricoes']);
    });

    it('should navigate to event details', () => {
        component.viewEventDetails(1);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/evento-detalhes', 1]);
    });
});

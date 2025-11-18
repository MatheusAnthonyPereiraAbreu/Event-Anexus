import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CreateEventComponent } from './create-event.component';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';

describe('CreateEventComponent', () => {
    let component: CreateEventComponent;
    let fixture: ComponentFixture<CreateEventComponent>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['createEvent']);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error', 'success']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        // Configurar retorno padrão para os spies
        modalServiceSpy.error.and.returnValue(of(undefined));
        modalServiceSpy.success.and.returnValue(of(undefined));

        await TestBed.configureTestingModule({
            imports: [CreateEventComponent],
            providers: [
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture = TestBed.createComponent(CreateEventComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
        expect(component.eventForm.get('title')?.value).toBe('');
        expect(component.eventForm.get('description')?.value).toBe('');
        expect(component.eventForm.get('date')?.value).toBe('');
        expect(component.eventForm.get('time')?.value).toBe('');
        expect(component.eventForm.get('location')?.value).toBe('');
        expect(component.eventForm.get('type')?.value).toBe('');
    });

    it('should not submit if form is invalid', () => {
        component.eventForm.get('title')?.setValue('');
        component.eventForm.get('description')?.setValue('');

        component.onSubmit();

        expect(eventsService.createEvent).not.toHaveBeenCalled();
    });

    it('should create event successfully', () => {
        component.eventForm.patchValue({
            title: 'Workshop Angular',
            description: 'Aprenda Angular',
            date: '01/12/2025',
            time: '14:00',
            location: 'Sala 101',
            type: 'Workshop',
            speaker: 'João Silva',
            responsible: 'Tech Academy',
            capacity: null
        });

        const response = { id: 1, url: '/events/1', message: 'Evento criado' };
        eventsService.createEvent.and.returnValue(of(response));
        modalService.success.and.returnValue(of(undefined));

        component.onSubmit();

        expect(eventsService.createEvent).toHaveBeenCalled();
        expect(modalService.success).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-admin/eventos']);
    });

    it('should handle create event error', () => {
        component.eventForm.patchValue({
            title: 'Workshop Angular',
            description: 'Aprenda Angular',
            date: '01/12/2025',
            time: '14:00',
            location: 'Sala 101',
            type: 'Workshop',
            responsible: 'Tech Academy'
        });

        const error = { error: { message: 'Erro ao criar evento' } };
        eventsService.createEvent.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        component.onSubmit();

        expect(modalService.error).toHaveBeenCalled();
        expect(component.isSubmitting).toBeFalse();
    });

    it('should cancel and navigate back', () => {
        component.cancel();
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-admin/eventos']);
    });

    it('should toggle unlimited capacity', () => {
        expect(component.unlimitedCapacity).toBeFalse();

        component.toggleUnlimitedCapacity();

        expect(component.unlimitedCapacity).toBeTrue();
        expect(component.eventForm.get('capacity')?.disabled).toBeTrue();
    });
});

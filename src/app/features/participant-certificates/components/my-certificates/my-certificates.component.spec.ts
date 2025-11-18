import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MyCertificatesComponent } from './my-certificates.component';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { CertificateDto } from '../../../../core/dto/certificate.dto';

describe('MyCertificatesComponent', () => {
    let component: MyCertificatesComponent;
    let fixture: ComponentFixture<MyCertificatesComponent>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;

    const mockCertificates: CertificateDto[] = [
        {
            id: 1,
            event_id: 10,
            user_id: 5,
            certificate_path: '/certificates/cert-123.pdf',
            generated_at: '2025-11-17T10:00:00Z',
            sent_by_email: true,
            event: {
                title: 'Workshop de Angular',
                date: '2025-11-15T14:00:00Z',
                location: 'Sala 101',
                speaker: 'João Silva',
                institution_organizer: 'Tech Academy'
            }
        },
        {
            id: 2,
            event_id: 11,
            user_id: 5,
            certificate_path: '/certificates/cert-456.pdf',
            generated_at: '2025-11-18T09:00:00Z',
            sent_by_email: false,
            event: {
                title: 'Palestra de React',
                date: '2025-11-16T10:00:00Z',
                location: 'Auditório',
                speaker: 'Maria Santos',
                institution_organizer: 'Code Academy'
            }
        }
    ];

    beforeEach(async () => {
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getMyCertificates', 'downloadCertificateFile']);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error', 'success']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [MyCertificatesComponent],
            providers: [
                { provide: EventsService, useValue: eventsServiceSpy },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        eventsService = TestBed.inject(EventsService) as jasmine.SpyObj<EventsService>;
        modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture = TestBed.createComponent(MyCertificatesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load certificates on init', () => {
        eventsService.getMyCertificates.and.returnValue(of(mockCertificates));

        fixture.detectChanges();

        expect(eventsService.getMyCertificates).toHaveBeenCalled();
        expect(component.certificates).toEqual(mockCertificates);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when loading certificates fails', () => {
        const error = { error: { message: 'Erro ao carregar' } };
        eventsService.getMyCertificates.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao carregar certificados',
            'Não foi possível carregar seus certificados. Tente novamente.'
        );
        expect(component.isLoading).toBeFalse();
    });

    it('should format date correctly', () => {
        const formatted = component.formatDate('2025-11-17T10:00:00Z');
        expect(formatted).toBe('17/11/2025');
    });

    it('should format datetime correctly', () => {
        const formatted = component.formatDateTime('2025-11-17T10:30:00Z');
        expect(formatted).toMatch(/17\/11\/2025 às \d{2}:\d{2}/);
    });

    it('should navigate to certificate details', () => {
        component.viewCertificate(1);
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/certificado', 1]);
    });

    it('should download certificate file', () => {
        const certificate = mockCertificates[0];
        const blob = new Blob(['test'], { type: 'application/pdf' });
        eventsService.downloadCertificateFile.and.returnValue(of(blob));
        modalService.success.and.returnValue(of(undefined));

        spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
        spyOn(window.URL, 'revokeObjectURL');
        spyOn(document.body, 'appendChild');
        spyOn(document.body, 'removeChild');

        component.downloadCertificate(certificate);

        expect(modalService.success).toHaveBeenCalledWith(
            'Download Concluído!',
            'Seu certificado foi baixado com sucesso.'
        );
    });
});

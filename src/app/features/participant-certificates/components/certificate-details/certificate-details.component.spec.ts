import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CertificateDetailsComponent } from './certificate-details.component';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { CertificateDto } from '../../../../core/dto/certificate.dto';

describe('CertificateDetailsComponent', () => {
    let component: CertificateDetailsComponent;
    let fixture: ComponentFixture<CertificateDetailsComponent>;
    let eventsService: jasmine.SpyObj<EventsService>;
    let modalService: jasmine.SpyObj<ModalService>;
    let router: jasmine.SpyObj<Router>;
    let activatedRoute: any;

    const mockCertificate: CertificateDto = {
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
    };

    beforeEach(async () => {
        const eventsServiceSpy = jasmine.createSpyObj('EventsService', ['getCertificateById', 'downloadCertificateFile']);
        const modalServiceSpy = jasmine.createSpyObj('ModalService', ['error', 'success']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        activatedRoute = {
            snapshot: {
                paramMap: {
                    get: jasmine.createSpy('get').and.returnValue('1')
                }
            }
        };

        await TestBed.configureTestingModule({
            imports: [CertificateDetailsComponent],
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

        fixture = TestBed.createComponent(CertificateDetailsComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load certificate on init', () => {
        eventsService.getCertificateById.and.returnValue(of(mockCertificate));

        fixture.detectChanges();

        expect(component.certificateId).toBe(1);
        expect(eventsService.getCertificateById).toHaveBeenCalledWith(1);
        expect(component.certificate).toEqual(mockCertificate);
        expect(component.isLoading).toBeFalse();
    });

    it('should handle error when certificate ID is missing', () => {
        activatedRoute.snapshot.paramMap.get.and.returnValue(null);
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith('Erro', 'ID do certificado não encontrado');
        expect(router.navigate).toHaveBeenCalledWith(['/dashboard-participant/minhas-inscricoes']);
    });

    it('should handle error when loading certificate fails', () => {
        const error = { error: { message: 'Certificado não encontrado' } };
        eventsService.getCertificateById.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        fixture.detectChanges();

        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao carregar certificado',
            'Não foi possível carregar os detalhes do certificado. Tente novamente.'
        );
        expect(component.isLoading).toBeFalse();
    });

    it('should format date correctly', () => {
        const formatted = component.formatDate('2025-11-17T14:30:00Z');
        expect(formatted).toBe('17/11/2025');
    });

    it('should format datetime correctly', () => {
        const formatted = component.formatDateTime('2025-11-17T14:30:00Z');
        expect(formatted).toMatch(/17\/11\/2025 às \d{2}:\d{2}/);
    });

    it('should download certificate file', () => {
        component.certificate = mockCertificate;
        const blob = new Blob(['test'], { type: 'application/pdf' });
        eventsService.downloadCertificateFile.and.returnValue(of(blob));
        modalService.success.and.returnValue(of(undefined));

        spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
        spyOn(window.URL, 'revokeObjectURL');
        spyOn(document.body, 'appendChild');
        spyOn(document.body, 'removeChild');

        component.downloadCertificate();

        expect(component.isDownloading).toBeFalse();
        expect(modalService.success).toHaveBeenCalledWith(
            'Download Concluído!',
            'Seu certificado foi baixado com sucesso.'
        );
    });

    it('should handle error when downloading certificate fails', () => {
        component.certificate = mockCertificate;
        const error = { error: { message: 'Erro ao baixar' } };
        eventsService.downloadCertificateFile.and.returnValue(throwError(() => error));
        modalService.error.and.returnValue(of(undefined));

        component.downloadCertificate();

        expect(component.isDownloading).toBeFalse();
        expect(modalService.error).toHaveBeenCalledWith(
            'Erro ao baixar certificado',
            'Erro ao baixar'
        );
    });

    it('should navigate back to enrollments', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['..'], { relativeTo: activatedRoute });
    });
});

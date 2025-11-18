import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { CertificateDto } from '../../../../core/dto/certificate.dto';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-my-certificates',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './my-certificates.component.html',
    styleUrl: './my-certificates.component.scss'
})
export class MyCertificatesComponent extends BrowserOnlyComponent implements OnInit {
    certificates: CertificateDto[] = [];
    isLoading = false;

    constructor(
        private eventsService: EventsService,
        private modalService: ModalService,
        private router: Router
    ) {
        super();
    }

    protected override onBrowserInit(): void {
        this.loadCertificates();
    }

    loadCertificates(): void {
        this.isLoading = true;
        this.eventsService.getMyCertificates()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (certificates) => {
                    this.certificates = certificates;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.error(
                        'Erro ao carregar certificados',
                        'Não foi possível carregar seus certificados. Tente novamente.'
                    ).subscribe();
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

    formatDateTime(isoDate: string): string {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    }

    viewCertificate(certificateId: number): void {
        this.router.navigate(['/dashboard-participant/certificado', certificateId]);
    }

    downloadCertificate(certificate: CertificateDto): void {
        this.eventsService.downloadCertificateFile(certificate.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Certificado_${certificate.event.title.replace(/\s+/g, '_')}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    this.modalService.success(
                        'Download Concluído!',
                        'Seu certificado foi baixado com sucesso.'
                    ).subscribe();
                },
                error: (error) => {
                    const errorMessage = error.error?.message || 'Não foi possível baixar o certificado. Tente novamente.';
                    this.modalService.error(
                        'Erro ao baixar certificado',
                        errorMessage
                    ).subscribe();
                }
            });
    }
}

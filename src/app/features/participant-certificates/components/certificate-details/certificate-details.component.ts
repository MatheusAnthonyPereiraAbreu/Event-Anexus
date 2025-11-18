import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { CertificateDto } from '../../../../core/dto/certificate.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { BrowserOnlyComponent } from '../../../../core/base/browser-only.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-certificate-details',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './certificate-details.component.html',
    styleUrl: './certificate-details.component.scss'
})
export class CertificateDetailsComponent extends BrowserOnlyComponent implements OnInit {
    certificate: CertificateDto | null = null;
    isLoading = true;
    isDownloading = false;
    certificateId!: number;

    constructor(
        private eventsService: EventsService,
        private modalService: ModalService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super();
    }

    protected override onBrowserInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.certificateId = parseInt(id, 10);
            this.loadCertificate();
        } else {
            this.modalService.error('Erro', 'ID do certificado não encontrado').subscribe();
            this.router.navigate(['/dashboard-participant/minhas-inscricoes']);
        }
    }

    loadCertificate(): void {
        this.isLoading = true;
        this.eventsService.getCertificateById(this.certificateId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (certificate) => {
                    this.certificate = certificate;
                    this.isLoading = false;
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.error(
                        'Erro ao carregar certificado',
                        'Não foi possível carregar os detalhes do certificado. Tente novamente.'
                    ).subscribe(() => {
                        this.router.navigate(['/dashboard-participant/minhas-inscricoes']);
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

    formatDateTime(isoDate: string): string {
        const date = new Date(isoDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    }

    downloadCertificate(): void {
        if (!this.certificate) return;

        this.isDownloading = true;
        this.eventsService.downloadCertificateFile(this.certificateId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (blob) => {
                    // Criar um link temporário para download
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `certificado-${this.certificate?.event.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    this.isDownloading = false;
                    this.modalService.success(
                        'Download Concluído!',
                        'Seu certificado foi baixado com sucesso.'
                    ).subscribe();
                },
                error: (error) => {
                    this.isDownloading = false;
                    const errorMessage = error.error?.message || 'Não foi possível baixar o certificado. Tente novamente.';
                    this.modalService.error(
                        'Erro ao baixar certificado',
                        errorMessage
                    ).subscribe();
                }
            });
    }

    goBack(): void {
        this.router.navigate(['..'], { relativeTo: this.route });
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    EventDto,
    CreateEventDto,
    UpdateEventDto,
    EventResponseDto,
    AvailableEventDto,
    MyEnrollmentDto,
    PublicEventDetailDto,
    EnrollmentResponseDto
} from '../dto/event.dto';
import { CertificateDto } from '../dto/certificate.dto';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(private http: HttpClient) { }

    // ============================================
    // ENDPOINTS PARA ORGANIZADORES
    // ============================================

    // GET /events/ - Listar eventos do usuário autenticado
    getAllEvents(): Observable<EventDto[]> {
        return this.http.get<EventDto[]>('events/');
    }

    // POST /events/ - Criar novo evento
    createEvent(event: CreateEventDto): Observable<EventResponseDto> {
        return this.http.post<EventResponseDto>('events/', event);
    }

    // GET /events/{event_id} - Buscar evento por ID
    getEventById(eventId: number): Observable<EventDto> {
        return this.http.get<EventDto>(`events/${eventId}`);
    }

    // PUT /events/{event_id} - Atualizar evento
    updateEvent(eventId: number, event: UpdateEventDto): Observable<EventResponseDto> {
        return this.http.put<EventResponseDto>(`events/${eventId}`, event);
    }

    // DELETE /events/{event_id} - Deletar evento (retorna 204 No Content)
    deleteEvent(eventId: number): Observable<void> {
        return this.http.delete<void>(`events/${eventId}`);
    }

    // ============================================
    // ENDPOINTS PARA PARTICIPANTES
    // ============================================

    // GET /events/available - Listar eventos disponíveis para inscrição
    getAvailableEvents(): Observable<AvailableEventDto[]> {
        return this.http.get<AvailableEventDto[]>('events/available');
    }

    // GET /events/my-enrollments - Listar eventos inscritos
    getMyEnrollments(): Observable<MyEnrollmentDto[]> {
        return this.http.get<MyEnrollmentDto[]>('events/my-enrollments');
    }

    // GET /events/{event_id}/public - Detalhes públicos do evento
    getPublicEventDetail(eventId: number): Observable<PublicEventDetailDto> {
        return this.http.get<PublicEventDetailDto>(`events/${eventId}/public`);
    }

    // POST /events/{event_id}/enrollments - Inscrever-se no evento
    enrollInEvent(eventId: number): Observable<EnrollmentResponseDto> {
        return this.http.post<EnrollmentResponseDto>(`events/${eventId}/enrollments`, {});
    }

    // DELETE /events/{event_id}/enrollments - Cancelar inscrição (retorna 204 No Content)
    cancelEnrollment(eventId: number): Observable<void> {
        return this.http.delete<void>(`events/${eventId}/enrollments`);
    }

    // ============================================
    // ENDPOINTS PARA CERTIFICADOS
    // ============================================

    // GET /certificates/ - Listar todos os certificados do usuário
    getMyCertificates(): Observable<CertificateDto[]> {
        return this.http.get<CertificateDto[]>('certificates/');
    }

    // POST /certificates/event/{event_id}/generate - Gerar certificado para um evento
    generateCertificate(eventId: number): Observable<{ message: string; certificate_id: number }> {
        return this.http.post<{ message: string; certificate_id: number }>(`certificates/event/${eventId}/generate`, {});
    }

    // GET /certificates/{certificate_id} - Buscar detalhes do certificado
    getCertificateById(certificateId: number): Observable<CertificateDto> {
        return this.http.get<CertificateDto>(`certificates/${certificateId}`);
    }

    // GET /certificates/{certificate_id}/download - Baixar arquivo do certificado
    downloadCertificateFile(certificateId: number): Observable<Blob> {
        return this.http.get(`certificates/${certificateId}/download`, {
            responseType: 'blob'
        });
    }
}

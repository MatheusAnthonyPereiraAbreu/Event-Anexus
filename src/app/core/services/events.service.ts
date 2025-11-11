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
}

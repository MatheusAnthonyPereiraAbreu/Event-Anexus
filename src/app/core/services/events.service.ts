import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto, CreateEventDto, UpdateEventDto, EventResponseDto } from '../dto/event.dto';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(private http: HttpClient) { }

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
}

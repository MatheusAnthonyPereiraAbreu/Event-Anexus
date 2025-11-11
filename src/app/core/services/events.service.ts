import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto, CreateEventDto } from '../dto/event.dto';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(private http: HttpClient) { }

    // Criar novo evento (apenas ORGANIZER)
    createEvent(event: CreateEventDto): Observable<{ message: string; event: EventDto }> {
        return this.http.post<{ message: string; event: EventDto }>('events/', event);
    }

    // Listar todos os eventos
    getAllEvents(): Observable<EventDto[]> {
        return this.http.get<EventDto[]>('events/');
    }

    // Buscar evento por ID
    getEventById(id: string): Observable<EventDto> {
        return this.http.get<EventDto>(`events/${id}`);
    }

    // Atualizar evento
    updateEvent(id: string, event: Partial<EventDto>): Observable<{ message: string; event: EventDto }> {
        return this.http.put<{ message: string; event: EventDto }>(`events/${id}`, event);
    }

    // Deletar evento
    deleteEvent(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`events/${id}`);
    }

    // Inscrever-se em evento (REGULAR)
    joinEvent(eventId: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`events/${eventId}/join`, {});
    }

    // Cancelar inscrição em evento
    leaveEvent(eventId: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`events/${eventId}/leave`);
    }

    // Listar eventos do usuário (como participante)
    getMyEvents(): Observable<EventDto[]> {
        return this.http.get<EventDto[]>('events/my-events');
    }

    // Listar eventos criados pelo organizador
    getMyCreatedEvents(): Observable<EventDto[]> {
        return this.http.get<EventDto[]>('events/my-created-events');
    }
}

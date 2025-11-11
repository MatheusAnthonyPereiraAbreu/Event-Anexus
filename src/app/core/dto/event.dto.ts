/**
 * Event DTOs - Backend API Communication
 * 
 * IMPORTANTE: Mapeamento de Tipos de Eventos
 * ==========================================
 * UI (Português) <-> Backend (Inglês)
 * 
 * Workshop        <-> WORKSHOP
 * Palestra        <-> LECTURE
 * Conferência     <-> CONFERENCE
 * Seminário       <-> SEMINAR
 * Hackathon       <-> HACKATHON
 * Meetup          <-> MEETUP
 * Treinamento     <-> TRAINING
 * Webinar         <-> WEBINAR
 * Outro           <-> OTHER
 * 
 * Use os utilitários em shared/utils/event-type-mapper.ts
 * para conversão entre os formatos.
 */

// DTO de resposta do backend (GET /events/ e GET /events/{id})
export interface EventDto {
    id: number;
    title: string;
    description: string;
    date: string; // ISO format: "2025-12-25T00:00:00"
    time: string; // HH:MM format: "14:30"
    location: string;
    capacity: number | null; // null ou 0 = sem limite
    type: 'WORKSHOP' | 'LECTURE' | 'CONFERENCE' | 'SEMINAR' | 'HACKATHON' | 'MEETUP' | 'TRAINING' | 'WEBINAR' | 'OTHER';
    speaker: string;
    institution_organizer: string; // Responsável/Instituição organizadora
    created_by: number; // ID do usuário criador
}

// DTO para criação de evento (POST /events/)
export interface CreateEventDto {
    title: string;
    description: string;
    date: string; // ISO format: "2025-12-25T00:00:00"
    time: string; // HH:MM format: "14:30"
    location: string;
    capacity: number | null; // null = sem limite
    type: 'WORKSHOP' | 'LECTURE' | 'CONFERENCE' | 'SEMINAR' | 'HACKATHON' | 'MEETUP' | 'TRAINING' | 'WEBINAR' | 'OTHER';
    speaker: string;
    institution_organizer: string;
}

// DTO para atualização de evento (PUT /events/{id})
export interface UpdateEventDto {
    title: string;
    description: string;
    date: string; // ISO format: "2025-12-25T00:00:00"
    time: string; // HH:MM format: "14:30"
    location: string;
    capacity: number | null;
    type: 'WORKSHOP' | 'LECTURE' | 'CONFERENCE' | 'SEMINAR' | 'HACKATHON' | 'MEETUP' | 'TRAINING' | 'WEBINAR' | 'OTHER';
    speaker: string;
    institution_organizer: string;
}

// DTO de resposta para criação/atualização
export interface EventResponseDto {
    id: number;
    message: string;
    url: string;
}

export interface EventDto {
    id?: string;
    title: string;
    description?: string;
    date: string; // DD/MM/YYYY
    time: string; // HH:MM
    location: string;
    capacity?: number | null; // null = sem limite
    type: string;
    speaker?: string;
    responsible: string; // Responsável pelo evento (para certificado)
    created_by?: string; // ID do organizador
    participants?: number; // Quantidade atual de participantes
    status?: 'OPEN' | 'CLOSED' | 'CANCELLED';
    created_at?: string;
    updated_at?: string;
}

export interface CreateEventDto {
    title: string;
    description?: string;
    date: string;
    time: string;
    location: string;
    capacity?: number | null; // null = sem limite
    type: string;
    speaker?: string;
    responsible: string;
}

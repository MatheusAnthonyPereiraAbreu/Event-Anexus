/**
 * Utilitário para mapeamento de tipos de eventos
 * UI: Português (amigável ao usuário)
 * Backend: Inglês UPPERCASE (conforme API)
 */

// Mapeamento: Português (UI) -> Inglês (Backend)
export const EVENT_TYPE_TO_BACKEND: { [key: string]: string } = {
    'Workshop': 'WORKSHOP',
    'Palestra': 'LECTURE',
    'Conferência': 'CONFERENCE',
    'Seminário': 'SEMINAR',
    'Hackathon': 'HACKATHON',
    'Meetup': 'MEETUP',
    'Treinamento': 'TRAINING',
    'Webinar': 'WEBINAR',
    'Outro': 'OTHER'
};

// Mapeamento: Inglês (Backend) -> Português (UI)
export const EVENT_TYPE_FROM_BACKEND: { [key: string]: string } = {
    'WORKSHOP': 'Workshop',
    'LECTURE': 'Palestra',
    'CONFERENCE': 'Conferência',
    'SEMINAR': 'Seminário',
    'HACKATHON': 'Hackathon',
    'MEETUP': 'Meetup',
    'TRAINING': 'Treinamento',
    'WEBINAR': 'Webinar',
    'OTHER': 'Outro'
};

/**
 * Converte tipo do formato UI (português) para formato Backend (inglês)
 * @param uiType - Tipo em português (ex: "Workshop")
 * @returns Tipo em inglês uppercase (ex: "WORKSHOP")
 */
export function convertEventTypeToBackend(uiType: string): string {
    return EVENT_TYPE_TO_BACKEND[uiType] || uiType;
}

/**
 * Converte tipo do formato Backend (inglês) para formato UI (português)
 * @param backendType - Tipo em inglês uppercase (ex: "WORKSHOP")
 * @returns Tipo em português (ex: "Workshop")
 */
export function convertEventTypeFromBackend(backendType: string): string {
    return EVENT_TYPE_FROM_BACKEND[backendType] || backendType;
}

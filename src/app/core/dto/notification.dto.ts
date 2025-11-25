/**
 * Notification DTOs - Backend API Communication
 */

// DTO de notificação individual
export interface NotificationDto {
    id: number;
    user_id: number;
    title: string;
    message: string;
    link: string;
    is_read: boolean;
    created_at: string; // ISO 8601 format
}

// DTO de resposta para lista de notificações (GET /notifications/)
export interface NotificationListDto {
    data: NotificationDto[];
}

// DTO de resposta para contador de não lidas (GET /notifications/count-unread)
export interface UnreadCountDto {
    unread_count: number;
}

// Parâmetros de query para GET /notifications/
export interface NotificationQueryParams {
    unread?: boolean; // Se 'true', retorna apenas notificações não lidas
    since_date?: string; // Data inicial para filtrar notificações (formato ISO 8601)
}

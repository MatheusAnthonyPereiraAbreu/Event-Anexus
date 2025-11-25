import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { NotificationDto } from '../dto/notification.dto';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    private baseUrl = '/notifications';

    constructor(private http: HttpClient) { }

    getNotifications(unread?: boolean, since_date?: string): Observable<NotificationDto[]> {
        let params = new HttpParams();
        if (unread !== undefined) params = params.set('unread', String(unread));
        if (since_date) params = params.set('since_date', since_date);
        return this.http.get<NotificationDto[]>(`${this.baseUrl}/`, { params });
    }

    getUnreadCount(): Observable<number> {
        return this.http.get<{ unread_count: number }>(`${this.baseUrl}/count-unread`).pipe(
            map(res => res.unread_count)
        );
    }

    markAllAsRead(): Observable<NotificationDto[]> {
        return this.http.patch<{ data: NotificationDto[] }>(`${this.baseUrl}/mark-all-as-read`, {}).pipe(
            map(res => res.data)
        );
    }

    markAsRead(notificationId: number): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${notificationId}/mark-as-read`, {});
    }
}

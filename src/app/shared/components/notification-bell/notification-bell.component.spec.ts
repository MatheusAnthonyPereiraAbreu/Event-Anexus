import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationBellComponent } from './notification-bell.component';
import { NotificationsService } from '../../../core/services/notifications.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

class MockNotificationsService {
    getNotifications = jasmine.createSpy('getNotifications').and.returnValue(of([
        {
            id: 1,
            title: 'Test Notification',
            message: 'This is a test notification.',
            link: '/dashboard-participant/certificado/2',
            is_read: false,
            created_at: '2025-11-24T22:09:50.625597',
            user_id: 3,
        },
    ]));

    getUnreadCount = jasmine.createSpy('getUnreadCount').and.returnValue(of(1));
    markAllAsRead = jasmine.createSpy('markAllAsRead').and.returnValue(of([]));
    markAsRead = jasmine.createSpy('markAsRead').and.returnValue(of(null));
}

describe('NotificationBellComponent', () => {
    let component: NotificationBellComponent;
    let fixture: ComponentFixture<NotificationBellComponent>;
    let notificationsService: MockNotificationsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificationBellComponent, RouterTestingModule, CommonModule],
            providers: [
                { provide: NotificationsService, useClass: MockNotificationsService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationBellComponent);
        component = fixture.componentInstance;
        notificationsService = TestBed.inject(NotificationsService) as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch notifications on init', () => {
        expect(notificationsService.getNotifications).toHaveBeenCalled();
        expect(component.notifications.length).toBe(1);
    });

    it('should toggle dropdown', () => {
        expect(component.showDropdown).toBeFalse();
        component.toggleDropdown();
        expect(component.showDropdown).toBeTrue();
        component.toggleDropdown();
        expect(component.showDropdown).toBeFalse();
    });

    it('should fetch notifications when dropdown is opened', () => {
        component.toggleDropdown();
        expect(notificationsService.getNotifications).toHaveBeenCalledTimes(2);
    });

    it('should mark all notifications as read', () => {
        component.markAllAsRead();
        expect(notificationsService.markAllAsRead).toHaveBeenCalled();
        expect(component.notifications.length).toBe(0);
        expect(component.unreadCount).toBe(0);
    });

    it('should mark a notification as read', () => {
        const notification = component.notifications[0];
        expect(notification.is_read).toBeFalse();
        component.markAsRead(notification);
        expect(notificationsService.markAsRead).toHaveBeenCalledWith(notification.id);
        expect(notification.is_read).toBeTrue();
        expect(component.unreadCount).toBe(0);
    });
});
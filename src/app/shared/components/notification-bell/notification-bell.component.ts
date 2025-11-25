import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService } from '../../../core/services/notifications.service';
import { NotificationDto } from '../../../core/dto/notification.dto';
import { Subscription, interval } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-notification-bell',
    templateUrl: './notification-bell.component.html',
    imports: [CommonModule, RouterModule],
    styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
    notifications: NotificationDto[] = [];
    unreadCount = 0;
    showDropdown = false;
    pollingSub?: Subscription;

    constructor(private notificationsService: NotificationsService, private router: Router) { }

    ngOnInit() {
        this.fetchNotifications();
        this.pollingSub = interval(10000).subscribe(() => this.fetchNotifications());
    }

    ngOnDestroy() {
        this.pollingSub?.unsubscribe();
    }

    fetchNotifications() {
        this.notificationsService.getNotifications().subscribe(notifs => {
            this.notifications = notifs;
        });
        this.notificationsService.getUnreadCount().subscribe(count => {
            this.unreadCount = count;
        });
    }

    markAllAsRead() {
        this.notificationsService.markAllAsRead().subscribe(notifs => {
            this.notifications = notifs;
            this.unreadCount = 0;
        });
    }

    markAsRead(notification: NotificationDto) {
        if (!notification.is_read) {
            this.notificationsService.markAsRead(notification.id).subscribe(() => {
                notification.is_read = true;
                this.unreadCount = Math.max(0, this.unreadCount - 1);
            });
        }
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
        if (this.showDropdown) {
            this.fetchNotifications();
        }
    }

    navigateToNotification(link: string) {
        this.router.navigate([link]);
    }
}

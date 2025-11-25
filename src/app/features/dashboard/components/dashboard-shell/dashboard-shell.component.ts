import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { NotificationBellComponent } from '../../../../shared/components/notification-bell/notification-bell.component';

@Component({
    selector: 'app-dashboard-shell',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent, NotificationBellComponent],
    templateUrl: './dashboard-shell.component.html',
    styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent { }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { NotificationBellComponent } from '../../../../shared/components/notification-bell/notification-bell.component';

@Component({
    selector: 'app-participant-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent, NotificationBellComponent],
    templateUrl: './participant-dashboard.component.html',
    styleUrl: './participant-dashboard.component.scss'
})
export class ParticipantDashboardComponent {
}

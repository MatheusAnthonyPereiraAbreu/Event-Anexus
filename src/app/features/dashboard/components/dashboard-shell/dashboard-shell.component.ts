import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-dashboard-shell',
    standalone: true,
    imports: [CommonModule, RouterModule, SidebarComponent],
    templateUrl: './dashboard-shell.component.html',
    styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent { }

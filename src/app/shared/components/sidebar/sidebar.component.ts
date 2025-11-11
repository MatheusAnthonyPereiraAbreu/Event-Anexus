import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
    @Input() isSecondaryColor = false; // Para mudar a cor da sidebar
    isSidebarOpen = true;
    userId = '';
    userEmail = '';
    menuItems = [
        {
            icon: 'ph-house',
            label: 'Dashboard',
            route: '/dashboard'
        },
        {
            icon: 'ph-calendar-blank',
            label: 'Eventos',
            route: '/dashboard/eventos'
        },
        {
            icon: 'ph-users-three',
            label: 'Participantes',
            route: '/dashboard/participantes'
        }
    ];

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        this.userId = this.authService.getCurrentUser()!.id || '';
        this.userEmail = this.authService.getCurrentUser()!.email || '';
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    navigateToProfile() {
        if (this.userId) {
            this.router.navigate(['/dashboard/perfil', this.userId]);
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}

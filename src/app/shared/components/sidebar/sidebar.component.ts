import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { UserType } from '../../../core/dto/user.dto';

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
    userType: UserType = UserType.REGULAR;
    menuItems: any[] = [];

    // Menu para organizadores
    organizerMenuItems = [
        {
            icon: 'ph-house',
            label: 'Dashboard',
            route: '/dashboard-admin'
        },
        {
            icon: 'ph-calendar-blank',
            label: 'Eventos',
            route: '/dashboard-admin/eventos'
        },
        {
            icon: 'ph-users-three',
            label: 'Participantes',
            route: '/dashboard-admin/participantes'
        }
    ];

    // Menu para participantes
    participantMenuItems = [
        {
            icon: 'ph-house',
            label: 'Dashboard',
            route: '/dashboard-participant'
        },
        {
            icon: 'ph-calendar-blank',
            label: 'Eventos Disponíveis',
            route: '/dashboard-participant/eventos-disponiveis'
        },
        {
            icon: 'ph-check-circle',
            label: 'Minhas Inscrições',
            route: '/dashboard-participant/minhas-inscricoes'
        },
        {
            icon: 'ph-certificate',
            label: 'Meus Certificados',
            route: '/dashboard-participant/meus-certificados'
        }
    ];

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadCurrentUser();
        this.setMenuItems();
    }

    loadCurrentUser() {
        const user = this.authService.getCurrentUser();
        this.userId = user?.id || '';
        this.userEmail = user?.email || '';
        this.userType = user?.type || UserType.REGULAR;
    }

    setMenuItems() {
        // Define os itens do menu baseado no tipo de usuário
        if (this.userType === UserType.ORGANIZER) {
            this.menuItems = this.organizerMenuItems;
        } else {
            this.menuItems = this.participantMenuItems;
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    navigateToProfile() {
        if (this.userId) {
            const basePath = this.userType === UserType.ORGANIZER
                ? '/dashboard-admin'
                : '/dashboard-participant';
            this.router.navigate([`${basePath}/perfil`, this.userId]);
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}

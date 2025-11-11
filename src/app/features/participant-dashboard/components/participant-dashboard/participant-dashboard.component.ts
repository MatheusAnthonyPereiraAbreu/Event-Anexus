import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-participant-dashboard',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    templateUrl: './participant-dashboard.component.html',
    styleUrl: './participant-dashboard.component.scss'
})
export class ParticipantDashboardComponent implements OnInit {
    userName: string = '';
    availableEvents: any[] = [];
    myEvents: any[] = [];

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.userName = user.name;
        }

        // TODO: Carregar eventos disponíveis da API
        this.loadAvailableEvents();
        this.loadMyEvents();
    }

    loadAvailableEvents() {
        // Mock de eventos disponíveis
        this.availableEvents = [
            {
                id: 1,
                title: 'Workshop de Angular',
                description: 'Aprenda Angular do zero ao avançado',
                date: '2025-11-15',
                location: 'Online',
                category: 'Tecnologia',
                participants: 45,
                maxParticipants: 100
            },
            {
                id: 2,
                title: 'Conferência de UX/UI',
                description: 'Tendências em design de interfaces',
                date: '2025-11-20',
                location: 'São Paulo - SP',
                category: 'Design',
                participants: 80,
                maxParticipants: 150
            },
            {
                id: 3,
                title: 'Hackathon 2025',
                description: 'Maratona de programação',
                date: '2025-11-25',
                location: 'Rio de Janeiro - RJ',
                category: 'Tecnologia',
                participants: 120,
                maxParticipants: 200
            }
        ];
    }

    loadMyEvents() {
        // Mock de eventos que o usuário está participando
        this.myEvents = [
            {
                id: 4,
                title: 'Workshop de TypeScript',
                description: 'Domine TypeScript avançado',
                date: '2025-11-12',
                location: 'Online',
                category: 'Tecnologia'
            }
        ];
    }

    joinEvent(event: any) {
        console.log('Participar do evento:', event);
        // TODO: Implementar lógica de inscrição no evento
        this.myEvents.push(event);
        this.availableEvents = this.availableEvents.filter(e => e.id !== event.id);
    }

    leaveEvent(event: any) {
        console.log('Sair do evento:', event);
        // TODO: Implementar lógica de cancelamento de inscrição
        this.availableEvents.push(event);
        this.myEvents = this.myEvents.filter(e => e.id !== event.id);
    }

    viewEventDetails(event: any) {
        console.log('Ver detalhes do evento:', event);
        // TODO: Navegar para página de detalhes do evento
    }
}

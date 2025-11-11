import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-home.component.html',
    styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {
    constructor(private router: Router) { }

    stats = [
        {
            title: 'Total de Eventos',
            value: '0',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
            color: 'bg-primary'
        },
        {
            title: 'Participantes',
            value: '0',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
            color: 'bg-secondary'
        },
        {
            title: 'Eventos Ativos',
            value: '0',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-green-500'
        },
        {
            title: 'Próximos Eventos',
            value: '0',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'bg-blue-500'
        }
    ];

    navigateToCreateEvent() {
        this.router.navigate(['/dashboard/eventos/novo']);
    }
}

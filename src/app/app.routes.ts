import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserType } from './core/dto/user.dto';
import { CadastroComponent } from './features/cadastro/components/cadastro/cadastro.component';
import { EsquecerSenhaComponent } from './features/esqueci-senha/components/esquecer-senha/esquecer-senha.component';
import { AuthShellComponent } from './features/auth-shell/components/auth-shell/auth-shell.component';
import { DashboardShellComponent } from './features/dashboard/components/dashboard-shell/dashboard-shell.component';
import { DashboardHomeComponent } from './features/dashboard/components/dashboard-home/dashboard-home.component';
import { ParticipantDashboardComponent } from './features/participant-dashboard/components/participant-dashboard/participant-dashboard.component';
import { ParticipantHomeComponent } from './features/participant-dashboard/components/participant-home/participant-home.component';
import { EditUserComponent } from './features/usuarios/components/edit-user/edit-user.component';
import { CreateEventComponent } from './features/events/components/create-event/create-event.component';
import { ListEventsComponent } from './features/events/components/list-events/list-events.component';
import { EditEventComponent } from './features/events/components/edit-event/edit-event.component';
import { AvailableEventsComponent } from './features/participant-events/components/available-events/available-events.component';
import { MyEnrollmentsComponent } from './features/participant-events/components/my-enrollments/my-enrollments.component';
import { EventDetailsComponent } from './features/participant-events/components/event-details/event-details.component';

export const routes: Routes = [
    // Dashboard Organizador
    {
        path: 'dashboard-admin',
        component: DashboardShellComponent,
        canActivate: [AuthGuard, roleGuard],
        data: { role: UserType.ORGANIZER },
        children: [
            { path: '', component: DashboardHomeComponent },
            { path: 'perfil/:id', component: EditUserComponent },
            { path: 'eventos', component: ListEventsComponent },
            { path: 'eventos/novo', component: CreateEventComponent },
            { path: 'eventos/editar/:id', component: EditEventComponent },
            { path: 'participantes', component: DashboardHomeComponent }
        ]
    },
    // Dashboard Participante
    {
        path: 'dashboard-participant',
        component: ParticipantDashboardComponent,
        canActivate: [AuthGuard, roleGuard],
        data: { role: UserType.REGULAR },
        children: [
            { path: '', component: ParticipantHomeComponent },
            { path: 'perfil/:id', component: EditUserComponent },
            { path: 'eventos-disponiveis', component: AvailableEventsComponent },
            { path: 'minhas-inscricoes', component: MyEnrollmentsComponent },
            { path: 'evento-detalhes/:id', component: EventDetailsComponent }
        ]
    },
    // Rotas de autenticação
    {
        path: '',
        component: AuthShellComponent,
        children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
            { path: 'cadastro', component: CadastroComponent, data: { animation: 'CadastroPage' } },
            { path: 'esquecer-senha', component: EsquecerSenhaComponent, data: { animation: 'EsquecerPage' } },
        ]
    },
    // Redirect para login se rota não encontrada
    { path: '**', redirectTo: '/login' }
];




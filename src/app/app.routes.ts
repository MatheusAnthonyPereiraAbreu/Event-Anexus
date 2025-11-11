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
import { EditUserComponent } from './features/usuarios/components/edit-user/edit-user.component';
import { CreateEventComponent } from './features/events/components/create-event/create-event.component';

export const routes: Routes = [
    // Rotas protegidas - Dashboard Administrador (ORGANIZER)
    {
        path: 'dashboard',
        component: DashboardShellComponent,
        canActivate: [AuthGuard, roleGuard],
        data: { role: UserType.ORGANIZER },
        children: [
            { path: '', component: DashboardHomeComponent },
            { path: 'perfil/:id', component: EditUserComponent },
            { path: 'eventos/novo', component: CreateEventComponent },
            { path: 'eventos', component: DashboardHomeComponent }, // Placeholder - lista de eventos
            { path: 'participantes', component: DashboardHomeComponent } // Placeholder
        ]
    },
    // Rotas protegidas - Dashboard Participante (REGULAR)
    {
        path: 'participant-dashboard',
        canActivate: [AuthGuard, roleGuard],
        data: { role: UserType.REGULAR },
        children: [
            { path: '', component: ParticipantDashboardComponent },
            { path: 'perfil/:id', component: EditUserComponent }
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
    // Redirect para dashboard se rota não encontrada
    { path: '**', redirectTo: '/dashboard' }
];



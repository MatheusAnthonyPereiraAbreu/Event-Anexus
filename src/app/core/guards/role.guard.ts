import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserType } from '../dto/user.dto';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
        router.navigate(['/login']);
        return false;
    }

    const requiredRole = route.data['role'] as UserType;

    // Se não há role requerida, permite acesso
    if (!requiredRole) {
        return true;
    }

    // Se a role corresponde, permite acesso
    if (currentUser.type === requiredRole) {
        return true;
    }

    // Se chegou aqui, a role não corresponde
    return false;
};

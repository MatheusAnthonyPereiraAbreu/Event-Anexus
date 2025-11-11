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

    if (requiredRole && currentUser.type !== requiredRole) {
        // Redireciona para a dashboard apropriada
        if (currentUser.type === UserType.ORGANIZER) {
            router.navigate(['/dashboard']);
        } else {
            router.navigate(['/participant-dashboard']);
        }
        return false;
    }

    return true;
};

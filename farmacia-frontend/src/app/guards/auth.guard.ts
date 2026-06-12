import { inject } from '@angular/core';
import { Router, type ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');
  
  if (!token || !auth.isAuthenticated()) {
    return router.parseUrl('/login');
  }
  
  // Verificar roles requeridos (si la ruta tiene data.roles)
  const requiredRoles = route.data?.['roles'] as Array<string>;
  if (requiredRoles && !requiredRoles.includes(rol || '')) {
    return router.parseUrl('/'); // o a una página de "no autorizado"
  }
  
  return true;
};
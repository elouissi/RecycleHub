import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const collecteurGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (  authService.getRole()=="collecteur" ) {
    return true;
  }else {
    return router.parseUrl('/home');
  }


};

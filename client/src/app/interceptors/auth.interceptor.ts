import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return from(auth.getToken()).pipe(
    switchMap((token: string | null) => {
      const cloned = token
        ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
        : req;
      return next(cloned).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) auth.logout();
          return throwError(() => err);
        })
      );
    })
  );
};
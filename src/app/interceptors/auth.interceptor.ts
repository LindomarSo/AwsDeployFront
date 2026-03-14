import { HttpInterceptorFn } from '@angular/common/http';

import { API_BASE_URL, AUTH_STORAGE_KEY } from '../config/api.config';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const isApiRequest = request.url.startsWith(API_BASE_URL);
  const isAuthRequest = request.url.includes('/auth/');
  const token = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!isApiRequest || isAuthRequest || !token) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};

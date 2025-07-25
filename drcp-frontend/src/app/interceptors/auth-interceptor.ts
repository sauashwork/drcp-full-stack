import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  let authReq = req;
  if (token) {
    let parsedToken = "";
    try {
      parsedToken = JSON.parse(token).token || token;
    } catch {
      parsedToken = token;
    }
    console.log("Sending token:", parsedToken);
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${parsedToken}`
      }
    });
  }

  return next(authReq);
};

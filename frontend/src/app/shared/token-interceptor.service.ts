import { Injectable , Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector : Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let authService = this.injector.get(AuthServiceService);
      let tokenizedReq = req.clone({
        setHeaders:{
          Authorization:`Baerer ${authService.getToken()}`
        }
      })
      return next.handle(tokenizedReq);
  }

}

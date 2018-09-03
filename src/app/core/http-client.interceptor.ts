import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
        req = req.clone({
            url: environment.apiUrl + req.url,
            withCredentials: true
        });
        return next.handle(req);
    }
}

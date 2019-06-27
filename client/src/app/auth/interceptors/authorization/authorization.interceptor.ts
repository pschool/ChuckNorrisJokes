import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';

/**
 * Interceptor used to add an Authorization header to requests if logged in or currently logging in.
 */
@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
    /**
     * Default constructor triggered when the class is initialized.
     * @param authService - AuthService instance used to get the user credentials.
     */
    constructor(private authService: AuthService) { }

    /**
     * Method used by the Angular to intercept http calls.
     * @param request - Angular class containing the request.
     * @param next - Angular class that will handle the modified request.
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header if credentials are available
        if (this.authService.getToken()) {
            request = request.clone({
                setHeaders: {
                    Authorization: this.authService.getToken()
                }
            });
        }
        return next.handle(request);
    }
}

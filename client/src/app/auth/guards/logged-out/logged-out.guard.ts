import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

/**
 * Guard class to only allow access to a route when logged out.
 */
@Injectable({
    providedIn: 'root'
})
export class LoggedOutGuard implements CanActivate {
    /**
     * Default constructor triggered when the class is initialized.
     * @param authService - AuthService instance used to check if the user is logged in.
     * @param router - Angular Router class.
     */
    constructor(private authService: AuthService, private router: Router) { }

    /**
     * Method used by the Angular router to know if the route can be activated.
     * @param next - Angular ActivatedRouteSnapshot class.
     * @param state - Angular RouterStateSnapshot class.
     */
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isLoggedIn()) {
            // If this is the first application load, to a path that can't be accessed, redirect to the root url.
            if (this.router.routerState.snapshot.url === '') {
                this.router.navigate(['/']);
            }
            return false;
        }
        return true;
    }
}

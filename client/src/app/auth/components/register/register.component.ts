import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

/**
 * Component used to display a register page.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public loginForm: FormGroup;
  public submitted = false;
  public loading = false;
  public noPassMatch = false;
  public userCreated = false;

  /**
   * Default constructor triggered when the class is initialized.
   * @param authService - AuthService instance used for logging in.
   * @param formBuilder - Angular FormBuilder class.
   * @param route -  Angular ActivatedRoute class.
   * @param router - Angular Router class.
   */
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  /**
   * Default Angular OnInit function triggered after the constructor and before the view is initialized.
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required]
    });
  }

  /**
   * Triggers when the login form is submitted.
   */
  public onSubmit(): void {
    this.noPassMatch = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAsPristine();
      return;
    }

    this.submitted = true;

    if (this.loginForm.controls.password.value === this.loginForm.controls.passwordRepeat.value) {
      this.loading = true;
      this.authService.register(
        this.loginForm.controls.username.value,
        this.loginForm.controls.password.value,
        () => {
          this.userCreated = true;
        },
        error => {
          error.ShowUser = false;
        },
        () => {
          this.loading = false;
        }
      );
    } else {
      this.noPassMatch = true;
    }
  }
}

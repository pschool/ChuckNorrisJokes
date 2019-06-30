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
  public passRequirementsFailed = false;
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
    this.passRequirementsFailed = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAsPristine();
      return;
    }

    this.submitted = true;

    if (this.loginForm.controls.password.value === this.loginForm.controls.passwordRepeat.value) {

      if (!this.checkPasswordRequirements(this.loginForm.controls.password.value)) {
        this.passRequirementsFailed = true;
        return;
      }

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

  private checkPasswordRequirements(password: string): boolean {
    // Validate max length.
    if (password.length > 32) {
      console.error('32 limit');
      return false;
    }

    // Validate use of illegal items.
    const illegalItems = ['i', 'O', 'l'];
    for (const illegalItem of illegalItems) {
      if (password.includes(illegalItem)) {
        console.error('illegal item');
        return false;
      }
    }

    // Validate two non overlapping characters.
    const passwordLowerCaseCharArray = password.toLowerCase().split('');
    let nonOverlapPassed = false;
    for (let i = 0; i < passwordLowerCaseCharArray.length; i++) {
      if (passwordLowerCaseCharArray[i] === passwordLowerCaseCharArray[i + 1]) {
        nonOverlapPassed = true;
        break;
      }
    }
    if (!nonOverlapPassed) {
      console.error('No overlap');
      return false;
    }

    const alphaArray = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];
    let increasingStraightPassed = false;
    // Don't check last 2 characters, not possible to get 3 straight.
    for (let i = 0; i < passwordLowerCaseCharArray.length - 2; i++) {
      const indexOfFirst = alphaArray.indexOf(passwordLowerCaseCharArray[i]);
      const indexOfSecond = alphaArray.indexOf(passwordLowerCaseCharArray[i + 1]);
      const indexOfThird = alphaArray.indexOf(passwordLowerCaseCharArray[i + 2]);
      if (indexOfFirst >= 0 && indexOfSecond >= 0 && indexOfThird >= 0) {
        if (
          indexOfThird - indexOfSecond === 1 &&
          indexOfSecond - indexOfFirst === 1) {
          increasingStraightPassed = true;
          break;
        }
      }
    }
    if (!increasingStraightPassed) {
      console.error('No increasing straight');
      return false;
    }

    return true;
  }
}

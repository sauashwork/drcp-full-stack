import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { App } from '../../../app';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true
})
export class Login {

  loginForm: FormGroup;
  
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

  constructor(private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private app: App,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.minLength(5), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(this.passwordPattern)]],
    })
  }

  onClickSignup(): void {
    this.router.navigate(['signup']);
  }

  onClickForgetPassword(): void {
    this.router.navigate(['forget-password']);
  }

  onLoginSubmit() {
    const formData = this.loginForm.value;
    console.log("login form deatils: " + JSON.stringify(formData));
    this.authService.login(formData.username, formData.password);
  };

  onClickClose() {
    console.log("close clicked...");
    this.router.navigate(['/']);
  }
}

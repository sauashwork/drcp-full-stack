import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  standalone: true
})
export class Signup {

  signupForm: FormGroup;
  roles : string[]=["NONE","ADMIN", "USER", "VOLUNTEER"];
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

  constructor(private router : Router, 
    private authService : AuthService,
    private fb : FormBuilder
  ){
    this.signupForm=this.fb.group({
      username: ['', [Validators.required, Validators.pattern("^[a-zA-Z]+$"), Validators.minLength(5), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(this.passwordPattern)]],
      role: ['', Validators.required]
    })
  }

  onClickLogin() : void{
    this.router.navigate(['login']);
  }

  OnSubmitSignUpForm() : void {
    const formData=this.signupForm.value;
    console.log("signup form deatils: "+JSON.stringify(formData));
    this.authService.register(formData.username, formData.email, formData.password, formData.role);
  }

  onClickClose(){
    console.log("close clicked...");
    this.router.navigate(['/']);
  }
}

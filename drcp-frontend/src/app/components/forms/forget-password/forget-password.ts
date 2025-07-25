import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, MatIconModule, CommonModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
  standalone: true
})
export class ForgetPassword {

  forgetPasswordForm: FormGroup;
  codeverificationForm: FormGroup;
  resetPasswordForm: FormGroup;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;

  constructor(private router : Router,
    private fb : FormBuilder
  ){
    this.forgetPasswordForm=this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.codeverificationForm=this.fb.group({
      code: [''],
    });

    this.resetPasswordForm=this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(this.passwordPattern)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(this.passwordPattern)]],
    });
  }

  openForgetPasswordForm: boolean=true;
  openCodeverificationForm : boolean = false;
  isCodeCorrect: boolean=false;
  openResetPasswordForm: boolean=false;
  
  onClickLogin(){
    this.router.navigate(['login']);
  }

  onSubmitForgetPasswordForm(){
    this.openForgetPasswordForm=false;
    this.openCodeverificationForm = true;
    this.isCodeCorrect=false;
    this.openResetPasswordForm=false;
  }

  onSubmitCodeVerificationForm(){
    this.openForgetPasswordForm=false;
    this.openCodeverificationForm = false;
    this.isCodeCorrect=true; //todo: implemennt logic to verify code...if it is true open reset form else dont...
    if(this.isCodeCorrect){
      this.openResetPasswordForm=true;
    } else {
      alert("wrong code submitted...");
      this.openCodeverificationForm=true;
    }
  }

  onSubmitResendCode(){
    this.openForgetPasswordForm=false;
    this.openCodeverificationForm = true;
    this.isCodeCorrect=false; 
    this.openResetPasswordForm=false;
  }

  onClickClose(){
    console.log("close clicked...");
    this.router.navigate(['login']);
  }
}

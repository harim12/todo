import { Component, OnInit } from '@angular/core';
import {FormGroup , FormBuilder, FormControl,Validators} from '@angular/forms';
import { AuthServiceService } from '../shared/auth-service.service';
import * as alertifyjs from 'alertifyjs';
import { Router } from '@angular/router';
interface Alert {
  type: string;
  message: string;
}
const ALERTS: Alert[] = [
	{
		type: 'success',
		message: 'user registered succefuly',
	},
	
	{
		type: 'danger',
		message: 'email already exists',
	},
	{
		type: 'danger',
		message: 'fill all fields',
	},
	{
		type: 'danger',
		message: 'Somthing went wrong',
	}
	
];
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;
  alerts: Alert[];
  alertRegisteredSuccess;
  alertRegisteredSuccessBool=false;
  alertFillFields;
  alertFillFieldsBool =false;
  alertEmailAlreadyExists ;
  alertEmailAlreadyExistsBool = false;
  alertSomthingWentWrong;
  alertSomthingWentWrongBool = false;
  constructor(private fb:FormBuilder,private authServive:AuthServiceService,private router:Router) {
    this.reset();
   }
   
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    })
    this.alertRegisteredSuccess = this.alerts[0];
    this.alertFillFields = this.alerts[2];   
    this.alertEmailAlreadyExists =  this.alerts[1];
    this.alertSomthingWentWrong = this.alerts[3];
  }
  submitForm(){
    this.authServive.registerUser(this.registerForm.value).subscribe(
      (res)=>{
       
           this.alertRegisteredSuccessBool = true;
           this.router.navigate(['/login']);
         
    },err =>{
      let status = err.status;
      if(status ==400){
        this.alertFillFieldsBool = true;
      }
      else if(status == 401){
        this.alertEmailAlreadyExistsBool = true;
      }
      else if(status == 500){
        // this.alertSomthingWentWrongBool = true;
      }
    }
    )
}
close(alert: Alert) {
  this.alerts.splice(this.alerts.indexOf(alert), 1);
}

reset() {
  this.alerts = Array.from(ALERTS);
}
}
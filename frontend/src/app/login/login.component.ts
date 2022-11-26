import { Component, OnInit } from '@angular/core';
import {FormGroup , FormBuilder, FormControl,Validators} from '@angular/forms';
import { AuthServiceService } from '../shared/auth-service.service';
import { Routes, RouterModule, Router ,Event, NavigationStart } from '@angular/router';
import * as alertifyjs from 'alertifyjs';

interface Alert {
  type: string;
  message: string;
}
const ALERTS: Alert[] = [
	{
		type: 'success',
		message: 'logged in succefuly',
	},
	
	{
		type: 'danger',
		message: 'fill all fields',
	},
	{
		type: 'danger',
		message: 'wrong credantials',
	},
	{
		type: 'danger',
		message: 'Somthing went wrong',
	}
	
];

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 
  loginForm:FormGroup;
  errorMessage:string = null;
  isAlert = false;
  userLoggedInSuccef  = 'User logged in succefuly';
  alerts: Alert[];
  alertDangerWrongCred;
  alertDangeWrongCredBool=false;
  alertFillFields;
  alertFillFieldsBool =false;
  alertLoggedSuccess ;
  alertLoggedSuccessBool = false;
  alertSomthingWentWrong;
  alertSomthingWentWrongBool = false;
  constructor(private fb:FormBuilder,private authServive:AuthServiceService,private router:Router ) { 
    this.reset();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:['',[Validators.required,Validators.email ]],
      password:['',[Validators.required ]]
    })
    this.router.events.subscribe((routerEvent:Event)=>{
      if(routerEvent instanceof NavigationStart){

      }
    })
   this.alertDangerWrongCred = this.alerts[2];
   this.alertFillFields = this.alerts[1];   
   this.alertLoggedSuccess =  this.alerts[0];
   this.alertSomthingWentWrong = this.alerts[3];
  }
  close(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

	reset() {
		this.alerts = Array.from(ALERTS);
	}
  submitForm(){
  this.authServive.loginUser(this.loginForm.value).subscribe((res)=>{
    if(res.message == "Auth Successful"){
   ;
    localStorage.setItem('token',res.token);
    localStorage.setItem('userId',res.user.id);
    localStorage.setItem('username',res.user.username);
    this.alertLoggedSuccessBool = true;

    this.router.navigate(['/home']);
   }
   
  },(err)=>{
    let status = err.status;
   
    if(status ==401){
      this.alertDangeWrongCredBool = true;

    }
    else if(status == 402){
      this.alertFillFieldsBool = true;
    }
    else if(status == 500){
      // this.alertSomthingWentWrongBool = true;
    }
    

  })

  
  }

  isAuth(){
    this.authServive.validateUser().subscribe(res=>{
      console.log(res);
    })
  }
  
}

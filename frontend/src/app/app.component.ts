import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  constructor(private http:HttpClient,
              private swPush:SwPush){}
  ngOnInit(){
   
  }
  isLoggedin :boolean = true;
 

}

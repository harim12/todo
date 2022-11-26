import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthServiceService } from '../shared/auth-service.service';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { DataService } from '../shared/data.service';
import { navbarData } from './nav-data'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchForm:FormGroup;
  firstLetterUserName;
  navData = navbarData;
  @Output() newItemEvent = new EventEmitter<string>(); 
  
  constructor(private authService:AuthServiceService , private fb :FormBuilder,private dataService:DataService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.firstLetterUserName = localStorage.getItem('username').charAt(0).toUpperCase();
  }
  greenStudent(){

    this.dataService.sendMessage('Good morning');
  }
  appreciateStudent(){
    this.dataService.sendMessage('well done')
  }
  loggoutUser(){
    this.authService.logout();
  }

  initializeForm(): void {
    this.searchForm = this.fb.group({
      task:''
    });
  }
  submit(){
    //we send the searched value to the service
    this.dataService.sendMessage(this.searchForm.value.task);
  }
 
}

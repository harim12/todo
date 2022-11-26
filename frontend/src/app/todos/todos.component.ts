import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
import { MatDialog } from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import {interval} from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  todos: Todo[];
  todoForm: FormGroup;
  checkBoxForm: FormGroup;
  endDate: Date;
  today: Date = new Date();
  text = '';
  searchedTodos:Todo[];
  currentDay:string;

  readonly publicKey = "BFOHDhriav-4tmaiv7YCeITOi9X1MBmnMnDWusW4g9mGl4JKEC23-NXiWMwAAgZNpGXGfnSIPSzIvRQmzfwE3hk";
  subPayl;
  subscription;
  payload;

  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private swPush: SwPush
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllData();
    this.searchData();
    this.formatedDate();
    this.subscribeNotification();
    const obs$ = interval(60000);
    obs$.subscribe((d)=>{
      this.todos.forEach(todo=>{
        const currentDate = new Date();
        const rappelDate  = new Date(todo.rappel);
        if(currentDate.toDateString() === rappelDate.toDateString()
         && currentDate.getHours() == rappelDate.getHours() && 
         currentDate.getMinutes() == rappelDate.getMinutes()){

        this.sendNotification(todo);
          console.log("it s the same");
        }
       
      })
    })
    
  }

 
   subscribeNotification(){

    this.swPush
      .requestSubscription({
        serverPublicKey: this.publicKey,
      })
      .then((sub) => {
        this.dataService.postSubscription(sub).subscribe(res=>{
          console.log(res);
        });
        
        
      })
      .catch((err) => console.log(err));
  }



  sendNotification(todo:Todo){
    this.dataService.sendNotificationServ(todo).subscribe(res=>{
      console.log(res);
    });
  }
  getAllData() {
    this.dataService.getAllTodos().subscribe((res) => {
      this.todos = res.data;
    });
  }
searchData(){
  this.dataService.headerTodosSource$.subscribe(message=>{
    if(message){
      this.dataService.searchTodos().subscribe((res) => {
        this.todos = res.data;
      });
    }
  })
}
  
  openDialog(todo: Todo) {
    let dialogueRef = this.dialog.open(TodoDialogComponent, {
      data: todo,
    });

    dialogueRef.afterClosed().subscribe((result) => {
      // console.log(`dialogue result: ${result.task}`);
      this.getAllData();
    });
  }
  initializeForm(): void {
    this.todoForm = this.fb.group({
      task: ['', Validators.compose([Validators.required])],
      rappel: null,
      date: null,
      important: 0,
      completed: 0,
    });
  }

  isCompleted(todo: Todo) {
    let id = todo.id;
    todo.completed = 1;
    console.log(todo);
    this.dataService.addCompletedTodo(todo).subscribe((res) => {
      console.log(res);
      Swal.fire({
        text: 'todo completed succefuly',
        icon: 'success',
         confirmButtonColor: "#973ba3",    
      })
      this.getAllData();
    });

    this.dataService.deleteCompletedTodo(todo).subscribe((res) => {
      this.getAllData();
    });
  }
  isImportant(todo: Todo) {
    if (todo.important == 0) {
      todo.important = 1;
    } else {
      todo.important = 0;
    }
    this.dataService.important(todo).subscribe((res) => {
      console.log(res, 'res updated');
    });
  }
  onSubmit(): void {
    // this.dataService.addTodo(this.todoForm.value);
    if (this.todoForm.valid) {
      console.log(this.todoForm.value);
      if (this.todoForm.value.date == null) {
        this.todoForm.value.date = new Date();
      }

      this.dataService.addTodo(this.todoForm.value).subscribe((res) => {
        console.log(res);
        console.log("adding the todo");
        this.todoForm.reset();
        this.getAllData();
      });
    }
  }
  onDeleteButton(index: number) {
    // this.dataService.deleteTodo(index);
    console.log(index, 'deleted id');
    this.dataService.deleteData(index).subscribe((res) => {
      console.log(index);
      console.log(res, 'deleteres==>');
      this.getAllData();
    });
  }
  isToday(todo: Todo): boolean {
    let today = new Date();
    let todoDate = new Date(todo.date);
    today.setUTCHours(0, 0, 0, 0);
    todoDate.setUTCHours(0, 0, 0, 0);

    if (today.getTime() == todoDate.getTime()) {
      return true;
    } else {
      return false;
    }
  }
  formatedDate(){
    let d = moment().day();
    let day;
    let date;
    let month;
    switch (d){
      case 0:
        day = "Sun";
        break;
      case 1:
        day = "Mon";
        break;
      case 2:
        day = "Tue";
        break;
      case 3:
        day = "Wen";
        break;
      case 4:
        day = "Thu";
        break;
      case 5:
        day = "Fri";
        break;
      case 6:
        day = "Sat";
        break;
    }
    date = moment().format('D');
    month = moment().format('M');
    this.currentDay = day+" " + date +"-"+month;
  }
  notNull(value){
    if(value!=="null"){
      return true;
    }
    else{
      return false;
    }
  }
  notNullAdd(value){
    if(value!==null){
      return true;
    }
    else{
      return false;
    }
  }
  formatDate(date){
    return this.dataService.formatDateService(date);
  }
  formatRappel(rappel){
    return this.dataService.formatRappelService(rappel);
  }
}

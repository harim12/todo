import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
import {MatDialog} from '@angular/material/dialog';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
@Component({
  selector: 'app-important-todos',
  templateUrl: './important-todos.component.html',
  styleUrls: ['./important-todos.component.scss']
})
export class ImportantTodosComponent implements OnInit {


  todos:Todo[]; 
  completedTodosOnTime:Todo[];
  constructor(public dialog :MatDialog,private dataService :DataService) { 
    
  }

  ngOnInit(): void {
    
    this.getAllData();
    this.searchData();
   
  }
  getAllData(){
    this.dataService.getAllTodos().subscribe((res)=>{
      console.log("today todos");
      this.todos = res.data;
      console.log(res.data);
      console.log("it has been called");
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
  openDialog(todo:Todo){
    let dialogueRef = this.dialog.open(TodoDialogComponent,
     {
       data:todo
       
     });
     
   dialogueRef.afterClosed().subscribe(result =>{
    
     this.getAllData();
   })
 }
 isCompleted(todo:Todo){
  let id = todo.id;
  todo.completed = 1;
  console.log(todo);
  this.dataService.addCompletedTodo(todo).subscribe((res)=>{
    console.log(res);
    
    this.getAllData();
  })

  this.dataService.deleteCompletedTodo(todo).subscribe(res=>{
    this.getAllData();
  })
}
  isImportant(todo:Todo){
    if(todo.important ==0){
      todo.important = 1;
    }
    else{
      todo.important = 0;
    }
    this.dataService.important(todo).subscribe((res)=>{
      console.log(res,'res updated');
      
     })
  }
  onDeleteButton(index:number){
   
    console.log(index,"deleted id");
    this.dataService.deleteData(index).subscribe((res)=>{
      console.log(index);
      console.log(res,'deleteres==>');
      this.getAllData();
    })
  }
  notNull(value){
    if(value!=="null"){
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

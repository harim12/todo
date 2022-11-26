import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';

@Component({
  selector: 'app-next-todos',
  templateUrl: './next-todos.component.html',
  styleUrls: ['./next-todos.component.scss']
})
export class NextTodosComponent implements OnInit {

  todos:Todo[];
  completedTodosOnTime:Todo[];
  constructor(public dialog :MatDialog,private dataService :DataService) { 
    
  }

  ngOnInit(): void {
    
    this.getAllData();
    this.searchData();
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
  getAllData(){
    this.dataService.getAllTodos().subscribe((res)=>{
      this.todos = res.data;
    });
  }

  openDialog(todo:Todo){
    let dialogueRef = this.dialog.open(TodoDialogComponent,
     {
       data:todo
       
     });
     
   dialogueRef.afterClosed().subscribe(result =>{
   })
 }
 isCompleted(todo:Todo){
  let id = todo.id;
  todo.completed = 1;

  this.dataService.addCompletedTodo(todo).subscribe((res)=>{

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
    // this.dataService.deleteTodo(index);

    this.dataService.deleteData(index).subscribe((res)=>{
      this.getAllData();
    })
  }
  isToday(todo:Todo):boolean{
    let today = new Date();
    let todoDate = new Date(todo.date);
    today.setUTCHours(0,0,0,0);
    todoDate.setUTCHours(0,0,0,0);
   
    if(today.getTime() == todoDate.getTime()){
     
      return true;
    }
    else{
      
      return false;
    }
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

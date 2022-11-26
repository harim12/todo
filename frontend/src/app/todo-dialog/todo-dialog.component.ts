import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
import { NgForm } from '@angular/forms';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormControlName,
} from '@angular/forms';
@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss'],
})
export class TodoDialogComponent implements OnInit {
  todos: Todo[];
  todoUpdateForm: FormGroup;
  date: Date = new Date();
  rappel: Date = new Date();
  todo: Todo;
  important: boolean = false;
  constructor(
    public dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: Todo,
    private matDialogRef: MatDialogRef<TodoDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.todoUpdateForm = this.fb.group({
      task: new FormControl(),
      date: new FormControl(),
      rappel: new FormControl(),
      important: new FormControl(),
      completed: new FormControl(),
    });
    let imprt = false;
    //getting the todo item data
    this.dataService.getSingleData(this.data.id).subscribe((res) => {
      this.todo = res.data[0];

      console.log(res, 'res==>');
      this.todoUpdateForm.patchValue({
        task: res.data[0].task,
        date: res.data[0].date,
        rappel: res.data[0].rappel,
        important: res.data[0].important,
        completed: res.data[0].completed,
      });

      this.date = res.data[0].date;
      this.rappel = res.data[0].rappel;
      this.important = res.data[0].important;
      imprt = res.data[0].important;
      console.log('single data');
    });
  }
  getAllData() {
    this.dataService.getAllTodos().subscribe((res) => {
      console.log('today todos');
      this.todos = res.data;
      console.log(res.data);
      console.log('it has been called');
    });
  }
  ngOnDestroy() {
    this.matDialogRef.close(this.data);
  }
  onCloseClick() {
    this.matDialogRef.close();
  }

  modifyForm(): void {
    this.todoUpdateForm = this.fb.group({
      task: '',
      date: null,
      rappel: null,
      important: 0,
      completed: 0,
    });
  }

  onUpdateSubmit() {
    let todoUpdate = this.todoUpdateForm.value;
    if (this.data.important) {
      todoUpdate.important = this.data.important;
    }
    this.dataService.updateTodo(todoUpdate, this.data).subscribe((res) => {
      console.log(res, 'res updated');
    });
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

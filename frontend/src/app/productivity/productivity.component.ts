import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form } from '@angular/forms';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
@Component({
  selector: 'app-productivity',
  templateUrl: './productivity.component.html',
  styleUrls: ['./productivity.component.scss'],
})
export class ProductivityComponent implements OnInit {
  typeProductivity: FormGroup;
  isMonth: boolean;
  isWeek: boolean;
  //the week productivity
  todosP: Todo[];
  completedInTimeTodosP:Todo[];

  

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.initTypeForm();
  }

  ngOnInit(): void {}
  initTypeForm() {
    this.typeProductivity = this.fb.group({
      type: '',
    });
    this.getAllData();
    this.getAllCompletedData();
  }
  onSubmit() {
    if (this.typeProductivity.value.type === 'monthProd') {
      this.isMonth = true;
      this.isWeek = false;
    } else {
      this.isWeek = true;
      this.isMonth = false;
    }
    
  }
  //get week todos
  getAllData() {
    this.dataService.getAllTodos().subscribe((res) => {
 
      this.todosP = res.data;
     
    });
    console.log('this is before');
  }
  //get week completed todos
  getAllCompletedData(){
    let id =  parseInt(localStorage.getItem('userId'));
    this.dataService.getAllCompletedInTimeTodos().subscribe((res)=>{
     
    this.completedInTimeTodosP = res.data
    });
  }
 

}

import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
import * as moment from 'node_modules/moment';
Chart.register(...registerables);
@Component({
  selector: 'app-week-productivity',
  templateUrl: './week-productivity.component.html',
  styleUrls: ['./week-productivity.component.scss'],
})
export class WeekProductivityComponent implements OnInit {
  @Input() todos: Todo[];
  @Input() completedInTimeTodos: Todo[];
  //all the week todos
  weekTodos: Todo[] = [];
  //all the completed in the week
  completedWeekTodos: Todo[] = [];
  //the length of the completed in the week
  completedDaysTodosLength: number[] = [0, 0, 0, 0, 0, 0, 0];
  // length of the remaining week todos (not completed)
  RemainingTodosLength: number[] = [0, 0, 0, 0, 0, 0, 0];
  // //it has the length of all the todos the completed and uncompleted
  TotalTodosLenght: number[] = [0, 0, 0, 0, 0, 0, 0];
  productivity: number[] = [0, 0, 0, 0, 0, 0, 0];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    //get all the week todos
    this.dataService.getWeekTodos(this.todos, this.weekTodos);
    //get all the completed week todos
    this.dataService.getWeekTodos(
      this.completedInTimeTodos,
      this.completedWeekTodos
    );
    //get the length of all the completed todos
    this.getCompletedDaysTodosLength(
      this.completedWeekTodos,
      this.completedDaysTodosLength
    );
    //get the length of all the not completed week todos
    this.getCompletedDaysTodosLength(this.weekTodos, this.RemainingTodosLength);
    //the total of all the todos in the week
    this.getTotalTodosLenght();
    //the productivity of the week
    this.getProductivity();
    this.initChart();
  }

 
  getTotalTodosLenght() {
    for (let i = 0; i < this.completedDaysTodosLength.length; i++) {
      this.TotalTodosLenght[i] =
        this.RemainingTodosLength[i] + this.completedDaysTodosLength[i];
    }
  }
  getProductivity() {
    for (let i = 0; i < this.completedDaysTodosLength.length; i++) {
      if (
        this.completedDaysTodosLength[i] != 0 &&
        this.TotalTodosLenght[i] != 0
      ) {
        this.productivity[i] = Number(
          Number(this.completedDaysTodosLength[i]) /
            Number(this.TotalTodosLenght[i])
        );

        this.productivity[i] = Number(Number(this.productivity[i]).toFixed(2));
      }
    }
  }
  getCompletedDaysTodosLength(weekArray: Todo[], dayArray: number[]) {
    weekArray.forEach((todo) => {
      let date = moment(todo.date, 'YYYY/MM/DD');
      //the number of the week day
      let day = date.day();
      console.log('this is the day of the week');
      console.log(day);
      //to calculate the number of everyday completed todos
      switch (day) {
        case 1:
          dayArray[0] = dayArray[0] + 1;
          console.log('monday+1');
          break;
        case 2:
          dayArray[1] = dayArray[1] + 1;
          console.log('tues+1');
          break;
        case 3:
          dayArray[2] = dayArray[2] + 1;
          console.log('merc+1');
          break;
        case 4:
          dayArray[3] = dayArray[3] + 1;
          console.log('jeu+1');
          break;
        case 5:
          dayArray[4] = dayArray[4] + 1;
          console.log('ven+1');
          break;
        case 6:
          dayArray[5] = dayArray[5] + 1;
          console.log('sam+1');
          break;
        case 0:
          dayArray[6] = dayArray[6] + 1;
          console.log('dim+1');
          break;
      }
    });
  }

  initChart(): void {
    const myChart = new Chart('weekChart', {
      type: 'bar',
      data: {
        labels: [
          'lundi',
          'mardi',
          'mercredi',
          'jeudi',
          'vendredi',
          'samedi',
          'dimanche',
        ],
        datasets: [
          {
            data: this.productivity,
            backgroundColor: ['#973ba3'],
            borderColor: ['rgb(223,216,241)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio:false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              display: false,
            }
          },
          
        },
      },
    });
  }
}

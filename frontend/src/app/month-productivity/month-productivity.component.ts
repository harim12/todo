import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../shared/data.service';
import { Todo } from '../shared/todo.model';
import * as moment from 'node_modules/moment';
Chart.register(...registerables);
@Component({
  selector: 'app-month-productivity',
  templateUrl: './month-productivity.component.html',
  styleUrls: ['./month-productivity.component.scss'],
})
export class MonthProductivityComponent implements OnInit {
  @Input()todos: Todo[];
  @Input() completedInTimeTodos: Todo[];
  monthCompletedTodos: Todo[];
  monthTodos: Todo[];
  startEndDayMonth: Array<Date> = [];
  weeksRemainingTodosLength: number[] = [0, 0, 0, 0, 0];
  weeksCompletedTodosLength: number[] = [0, 0, 0, 0, 0];
  weeksTotalTodosLenght: number[] = [0, 0, 0, 0, 0];
  productivity: number[] = [0, 0, 0, 0, 0];
  weeksLabel: string[] = [];
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
   
    

    //this month todos
    this.monthTodos = this.dataService.getMonthTodos(
      this.todos,
      this.monthTodos
    );
    //this month completed todos
    this.monthCompletedTodos = this.dataService.getMonthTodos(
      this.completedInTimeTodos,
      this.monthCompletedTodos
    );

    this.weeksRemainingTodosLength = this.getWeeksTodos(
      this.monthTodos,
      this.weeksRemainingTodosLength
    );
    this.weeksCompletedTodosLength = this.getWeeksTodos(
      this.monthCompletedTodos,
      this.weeksCompletedTodosLength
    );
    this.getTotalTodosLenght();
    this.getProductivity();
    this.getWeeksLabel();
    this.initChart();
  }

  getAllData(){
    let id =  parseInt(localStorage.getItem('userId'));

    this.dataService.getAllTodos().subscribe((res)=>{    
    this.todos = res.data
    });
  }

  getAllCompletedData(){
    let id =  parseInt(localStorage.getItem('userId'));
    this.dataService.getAllTodos().subscribe((res)=>{    
    this.completedInTimeTodos = res.data
    });
  }
  daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }
  getWeeksLabel() {
    let now = moment();
    let month = now.month() + 1;
    let days = this.daysInMonth(now.month() + 1, now.year());
    switch (days) {
      case 31:
        this.weeksLabel = [
          '1/' + month + '-7/' + month + '',
          '8/' + month + '-14/' + month + '',
          '15/' + month + '-21/' + month + '',
          '22/' + month + '-28/' + month + '',
          '29/' + month + '-31/' + month + '',
        ];
        break;
      case 30:
        this.weeksLabel = [
          '1/' + month + '-7/' + month + '',
          '8/' + month + '-14/' + month + '',
          '15/' + month + '-21/' + month + '',
          '22/' + month + '-28/' + month + '',
          '29/' + month + '-30/' + month + '',
        ];
        break;
      case 29:
        this.weeksLabel = [
          '1/' + month + '-7/' + month + '',
          '8/' + month + '-14/' + month + '',
          '15/' + month + '-21/' + month + '',
          '22/' + month + '-28/' + month + '',
          '29/' + month + '',
        ];
        break;
      case 28:
        this.weeksLabel = [
          '1/' + month + '-7/' + month + '',
          '8/' + month + '-14/' + month + '',
          '15/' + month + '-21/' + month + '',
          '22/' + month + '-28/' + month + '',
        ];
    }
  }

  getTotalTodosLenght() {
    for (let i = 0; i < this.weeksCompletedTodosLength.length; i++) {
      this.weeksTotalTodosLenght[i] =
        this.weeksRemainingTodosLength[i] + this.weeksCompletedTodosLength[i];
    }
  }
  getProductivity() {
    for (let i = 0; i < this.weeksCompletedTodosLength.length; i++) {
      if (
        this.weeksCompletedTodosLength[i] != 0 &&
        this.weeksTotalTodosLenght[i] != 0
      ) {
        this.productivity[i] = Number(
          Number(this.weeksCompletedTodosLength[i]) /
            Number(this.weeksTotalTodosLenght[i])
        );

        this.productivity[i] = Number(Number(this.productivity[i]).toFixed(2));
      }
    }
  }
  getWeeksTodos(monthTodos: Todo[], weeksTodosLength: number[]) {
    //this function return the index of the day
    // if it s the first monday of the month it return 1 if its the second it returns 2

    monthTodos.forEach((todo) => {
      let date = moment(todo.date);
      let nthWeek = Math.ceil(date.date() / 7);
      console.log(nthWeek);
      switch (nthWeek) {
        case 1:
          weeksTodosLength[0] = weeksTodosLength[0] + 1;
         
          break;
        case 2:
          weeksTodosLength[1] = weeksTodosLength[1] + 1;
         
          break;
        case 3:
          weeksTodosLength[2] = weeksTodosLength[2] + 1;
          
          break;
        case 4:
          weeksTodosLength[3] = weeksTodosLength[3] + 1;
         
          break;
        case 5:
          weeksTodosLength[4] = weeksTodosLength[4] + 1;
         
          break;
      }
    });
    return weeksTodosLength;
  }

  initChart(): void {
    const myChart = new Chart('monthChart', {
      type: 'bar',
      data: {
        labels: this.weeksLabel,
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

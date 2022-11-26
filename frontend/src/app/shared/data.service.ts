import { Injectable } from '@angular/core';
import { Todo } from './todo.model';
import * as moment from 'node_modules/moment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import { TimeScale } from 'chart.js';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  todos: Todo[] = [];
  today: Date = new Date();
  completedInTimeTodos: Todo[] = [];
  //the subscribe object that allow us to comunicate data between the source that is the header and the ohter components
  private _headerSearchedTodoSource = new Subject<string>();
  headerTodosSource$ = this._headerSearchedTodoSource.asObservable();
  searchMessage = '';
  
  constructor(private _http: HttpClient) {}

  sendMessage(message:string){
    this.searchMessage = message;
    this._headerSearchedTodoSource.next(message);
  }

  //connect front end to backend

  apiUrl = 'http://localhost:1337/todos/get/all';
  addTodoUrl = 'http://localhost:1337/todos/addTodo';
  deleteTodoUrl = 'http://localhost:1337/todos/deleteTodo';
  updateTodoUrl = 'http://localhost:1337/todos/updateTodo';
  singleTodoUrl = 'http://localhost:1337/todos/get';
  completedTodoAddUrl = 'http://localhost:1337/todos/completedTodoAdd';
  completedGetUrl = 'http://localhost:1337/todos/completed';
  searchDataUrl = 'http://localhost:1337/todos/search';
  notificationURL = "http://localhost:1337/subscribe";
  sendNotificationURL = "http://localhost:1337/sendNotification"
  //subscribe notifications


 
  postSubscription(sub:PushSubscription){
    return this._http.post(this.notificationURL,sub);
  }
  sendNotificationServ(todo){
    return this._http.post(this.sendNotificationURL,todo);
  }
  //getting all the todos data
  getAllTodos(): Observable<any> {
    let userId = parseInt(localStorage.getItem('userId'));
    return this._http.get(`${this.apiUrl}/${userId}`);
  }
  //searching data
  searchTodos():Observable<any>{
    console.log("inside the subscribe method");
    let userId = parseInt(localStorage.getItem('userId'));
    //we send in the url the searched todo and the userId combined with the charachter | and in the api we split them
    let searchMessageAndId = this.searchMessage+"|"+userId; 
    return this._http.get(`${this.searchDataUrl}/${searchMessageAndId}`);
  }
  getAllCompletedInTimeTodos(): Observable<any> {
    let userId = parseInt(localStorage.getItem('userId'));
    return this._http.get(`${this.completedGetUrl}/${userId}`);
  }

  addTodo(data: any): Observable<any> {
    console.log(data, 'createapi');
    let userId = parseInt(localStorage.getItem('userId'));
    return this._http.post(`${this.addTodoUrl}/${userId}`, data);
  }
  //getSingleDate
  getSingleData(id: number): Observable<any> {
    let ids = id;
    return this._http.get(`${this.singleTodoUrl}/${ids}`);
  }

  updateTodo(todo: Todo, data: Todo): Observable<any> {
    let ids = data.id;

    return this._http.put(`${this.updateTodoUrl}/${ids}`, todo);
  }

  deleteData(id: any): Observable<any> {
    let ids = id;
    return this._http.delete(`${this.deleteTodoUrl}/${ids}`);
  }

  addCompletedTodo(todo: Todo) {
    return this._http.post(`${this.completedTodoAddUrl}`, todo);
  }
  deleteCompletedTodo(todo: Todo) {
    let ids = todo.id;
    return this._http.delete(`${this.deleteTodoUrl}/${ids}`);
  }
  important(todo: Todo) {
    let ids = todo.id;
    return this._http.put(`${this.updateTodoUrl}/${ids}`, todo);
  }

  getWeekTodos(arrayTodo: Todo[], arrayWeekTodo: Todo[]): Todo[] {
    let now = moment();
    arrayTodo.forEach((todo) => {
      let todoDate = moment(todo.date);
      if (todoDate.isoWeek() == now.isoWeek()) {
        arrayWeekTodo.push(todo);
      }
    });
    return arrayWeekTodo;
  }
  getMonthDateRange(year: number, month: number) {
    var moment = require('moment');

    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');

    // just for demonstration:
    // console.log(startDate.toDate());
    // console.log(endDate.toDate());

    // make sure to call toDate() for plain JavaScript date type
    return [startDate.toDate(), endDate.toDate()];
  }

  getMonthTodos(arrayTodo: Todo[], arrayMonthTodo: Todo[] = []) {
    const startEndDayMonth = this.getMonthDateRange(
      moment().year(),
      moment().month() + 1
    );
    arrayTodo.forEach((todo) => {
      let isInMonth = moment(todo.date).isBetween(
        startEndDayMonth[0] - 1,
        startEndDayMonth[1]
      );
      if (isInMonth) {
        arrayMonthTodo.push(todo);
      }
    });
    return arrayMonthTodo;
  }
  formatDateService(date){
    let day = moment(date);
    let dateMonth = moment(date).format('D');
    let month = moment(date).format('M');
    let dayWeekNum = day.day();
    let dayWeek;
    switch (dayWeekNum){
      case 0:
        dayWeek = "Sun";
        break;
      case 1:
        dayWeek = "Mon";
        break;
      case 2:
        dayWeek = "Tue";
        break;
      case 3:
        dayWeek = "Wen";
        break;
      case 4:
        dayWeek = "Thu";
        break;
      case 5:
        dayWeek = "Fri";
        break;
      case 6:
        dayWeek = "Sat";
        break;
    }
    return dayWeek +" "+ dateMonth +"-"+month +" ";
  }
  formatRappelService(rappel){
    let rappelDateTime = rappel.split("T");
    let rappelDate = this.formatDateService(rappelDateTime[0]);
    return rappelDate + " at " +rappelDateTime[1]+" ";
  }
}

export class Todo{
    constructor(public id :number,public task:string,public date : Date , public rappel:Date,public important :number = 0,public completed :number = 0,public idUser :number){}
}
import { Request, Response, NextFunction, application } from 'express';
import logging from '../config/logging';
import { Connect, Query } from '../config/mysql';
import bcryptjs from 'bcryptjs';
import IUser from '../interfaces/user';
import IMySQLResult from '../interfaces/result';
import { json } from 'body-parser';
import signJWT from '../functions/signJWT';

const NAMESPACE = 'Todos';

//get all the todos data
const getAllTodos = (req: Request, res: Response, next: NextFunction) => {
    let userId = req.params.userId;
    let query = `SELECT * FROM todos where userId =  ${userId}`;

    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((todos) => {
                    return res.status(200).json({
                        message:"all todos result",
                        data: todos
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getSingleTodo = (req: Request, res: Response, next: NextFunction) => {
    let gid = req.params.id;
    let query = `select * from todos where id = '${gid}'`;

    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((todo) => {
                    return res.status(200).json({
                        message:"the todo teste item",
                        data: todo
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const addTodo = (req: Request, res: Response, next: NextFunction) => {
    let { task, date, rappel ,important ,completed } = req.body;
    let userId = req.params.userId;

  

        let query = `insert into todos(task,date,rappel,important,completed,userId) values('${task}','${date}','${rappel}' , '${important}' ,'${completed}', '${userId}')`;


        Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((todo) => {
                   
                    res.send({
                        message: "data succefuly inserted",
                        data: todo,
                      });
                     
                })

                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
    
};


const updateTodo = (req: Request, res: Response, next: NextFunction) => {
    let { task, date, rappel ,important ,completed } = req.body;

    let gId = req.params.id;

        let query =`update todos set task = '${task}', date = '${date}' , rappel = '${rappel}' , 
                     important = '${important}' , completed = '${completed}' where id = '${gId}' `;


        Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((todo) => {
                   
                    res.send({
                        message: "data succefuly updated"

                      });
                     
                })

                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
    
};
const deleteTodo = (req: Request, res: Response, next: NextFunction) => {
    let { task, date, rappel ,important ,completed } = req.body;

    let gId = req.params.id;

        let query = `delete from todos where id = '${gId}' `;


        Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((todo) => {
                   
                    res.send({
                        message: "data succefuly deleted"

                      });
                     
                })

                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
    
};

const addCompletedTodo = (req: Request, res: Response, next: NextFunction) => {
   
    let { task, date, rappel ,important ,completed,userId } = req.body;

  

        let query = `insert into completedtodos(task,date,rappel,important,completed,userId) 
                    values('${task}','${date}','${rappel}' , '${important}' ,'${completed}','${userId}')`;


        Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((todo) => {
                   
                    res.send({
                        message: "data succefuly inserted",
                        data: todo,
                      });
                     
                })

                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
    
};

const getAllCompletedTodods = (req: Request, res: Response, next: NextFunction) => {
    let userId = req.params.userId
    let query = `SELECT * FROM completedtodos where userId =  ${userId}`;

    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((todos) => {
                    return res.status(200).json({
                        message:"all todos result",
                        data: todos
                    });
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const searchData = (req: Request, res: Response, next: NextFunction) => {
    let searchItemAnduserId = req.params.searchItemAndUserID;
    let searchItem = searchItemAnduserId.split('|')[0];
    let userId = searchItemAnduserId.split('|')[1];
  
    let query = `SELECT * FROM todos where  task LIKE '${searchItem}%' and  userId =  ${userId} `;
   
    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((searchItems) => {
                    return res.status(200).json({
                        message:"all todos result",
                        data: searchItems
                    });
                    
                })
                .catch((error) => {
                    logging.error(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);

            return res.status(500).json({
                message: error.message,
                error
            });
        });
};



export default { getAllTodos, getSingleTodo ,addTodo , updateTodo , deleteTodo,addCompletedTodo,getAllCompletedTodods,searchData};
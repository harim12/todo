import express from 'express';

import todosController from '../controllers/todos';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/get/all/:userId', todosController.getAllTodos);
 router.get('/get/:id',todosController.getSingleTodo);
 router.get('/search/:searchItemAndUserID',todosController.searchData)
router.get('/completed/:userId', todosController.getAllCompletedTodods);
router.post('/addTodo/:userId',todosController.addTodo);
router.put('/updateTodo/:id',todosController.updateTodo);
router.delete('/deleteTodo/:id',todosController.deleteTodo);
router.post('/completedTodoAdd',todosController.addCompletedTodo);


export  = router
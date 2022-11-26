import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import userRoute from './routes/user';
import todosRoute from './routes/todos';
import { Connect, Query } from './config/mysql';
import IUser from './interfaces/user';
const webpush = require('web-push');
const userSub = require('./userSub')
const NAMESPACE = 'Server';
const router = express();
const cors = require('cors');
router.use(cors());
const publicKey = 'BFOHDhriav-4tmaiv7YCeITOi9X1MBmnMnDWusW4g9mGl4JKEC23-NXiWMwAAgZNpGXGfnSIPSzIvRQmzfwE3hk';
const privateKey = 'H4q48eL9PvvFgwxIHdy3Q1Pw-PoBI_BdHX-birRPTo8';
let subscription ={} ;
//notifications



// Logging the request

router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD -[${req.method}], URL - [${req.url}] , IP [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP -[${req.socket.remoteAddress}] , STATUS - [${res.statusCode}]`);
    });
    next();
});
//PARSE THE REQUEST
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// RULES OF OUR API
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});

//check if user is authenticated

// Routes

router.use('/users', userRoute);
router.use('/todos', todosRoute);


router.post('/subscribe', (req, res) => {
       subscription = req.body;
      const payload = JSON.stringify({ title: 'Push Test' });
     webpush.setVapidDetails('mailto:hassaniidrissirim190@gmail.com', publicKey, privateKey);
     return res.status(201).json({
        subscription,
        message:'subscription is succeful',
        
     })
});



router.post('/sendNotification',(req,res)=>{
    let todo = req.body;

     webpush.setVapidDetails('mailto:hassaniidrissirim190@gmail.com', publicKey, privateKey);
    
    const payload = {
          notification: {
            data: { url: 'http://www.youtube.com/funofheuristic' },
            title: todo.task,
            vibrate: [100, 50, 100],
          },
        };
       
     webpush.sendNotification(subscription, JSON.stringify(payload));
    
    
    return res.status(201).json({
        message:'notification is succeful',
     })
    return notification();

})

async function notification() {
  
}


//Error Handling

router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});



//Create the server

const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}: ${config.server.port}`));

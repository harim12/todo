import { Request, Response, NextFunction, application } from 'express';
import logging from '../config/logging';
import { Connect, Query } from '../config/mysql';
import bcryptjs from 'bcryptjs';
import IUser from '../interfaces/user';
import IMySQLResult from '../interfaces/result';
import { json } from 'body-parser';
import signJWT from '../functions/signJWT';

const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'TOKEN VALIDATED,USER AUTHORIZED');
    return res.status(200).json({
        message: 'Authorized'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, email, password } = req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            });
        }

        let query = `INSERT INTO users (username,email,password) values ("${username}","${email}","${hash}")`;

        Connect()
            .then((connection) => {
                if (username == undefined || username == '' || password == undefined || password == '' || email == undefined || email == '') {
                    return res.status(400).json({
                        message: 'Fill all fields'
                    });
                }
                connection.query('SELECT COUNT(*) AS cnt FROM users WHERE email = ? ', email, function (error, data) {
                    if (error) {
                        logging.error(NAMESPACE, error.message, error);
                        return res.status(500).json({
                            message: error.message,
                            error
                        });
                    } else {
                        if (data[0].cnt > 0) {
                            //user already exists
                            return res.status(401).json({
                                message: 'Email already exists'
                            });
                        } else {
                            //inserting user
                            connection.query(query, function (err, insert) {
                                if (err) {
                                    return res.status(500).json({
                                        message: error.message,
                                        error
                                    });
                                } else {
                                    logging.info(NAMESPACE, `User with id ${insert.insertId} inserted`);
                                    return res.status(201).json(insert);
                                }
                            });
                        }
                    }
                });
            })
            .catch((error) => {
                logging.error(NAMESPACE, error.message, error);
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};
const login = (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;

    let query = `SELECT * FROM users WHERE email = '${email}'`;

    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((users) => {
                    if (password == undefined || password == '' || email == undefined || email == '') {
                        return res.status(402).json({
                            message: 'Fill all fields'
                        });
                    }
                    if (users[0] && bcryptjs.compareSync(password, users[0].password)) {
                        signJWT(users[0], (_error, token) => {
                            if (_error) {
                                return res.status(401).json({
                                    auth:false,
                                    message: 'Unable to Sign JWT',
                                    error: _error
                                });
                            } else if (token) {
                                //  res.setHeader('set-cookie',`token =${token}`);
                                //  localStorage.setItem("token",token);
                                global.token = token;
                                return res.status(200).json({
                                    auth:true,
                                    message: 'Auth Successful',
                                    token,
                                    user: users[0]
                                });
                            }
                        });
                    } else {
                        res.status(401).json({
                            auth:false,
                            message: 'Invalid Credentials'
                        });
                    }
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

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    let query = `SELECT id, username FROM users`;

    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((users) => {
                    return res.status(200).json({
                        users,
                        count: users.length
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
const getSingleUser = (req: Request, res: Response, next: NextFunction) => {
    let query = `SELECT id, username FROM users `;

    Connect()
        .then((connection) => {
            Query<IUser[]>(connection, query)
                .then((users) => {
                    return res.status(200).json({
                        users,
                        count: users.length
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
const logout = (req,res)=>{
    
    Connect()
    .then((connection)=>{
        global.token = "";
        return res.status(200).json({
            message:"user logged out"
        })
    })
    .catch((error)=>{
        return res.status(500).json({
            message: error.message,
            error
        });
    })
}
export default { validateToken, register, login, getAllUsers,logout };

// const createBook = (req:Request,res:Response,next:NextFunction)=>{
//     logging.info(NAMESPACE,'creating books');
//     let {author,title} = req.body;
//     let query = `INSERT INTO books (author,title) VALUES ("${author}", "${title}")`;
//     Connect()
//         .then((connection) => {
//             Query(connection, query)
//                 .then((result) => {
//                     return res.status(200).json({
//                         result
//                     });
//                 })
//                 .catch((error) => {
//                     logging.error(NAMESPACE, error.message, error);
//                     return res.status(500).json({
//                         message: error.message,
//                         error
//                     });
//                 })
//                 .finally(() => {
//                     connection.end();
//                 });
//         })
//         .catch((error) => {
//             logging.error(NAMESPACE, error.message, error);
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// }

// const getAllBooks = (req: Request, res: Response, next: NextFunction) => {
//     logging.info(NAMESPACE, 'Getting all books');
//     let query = 'SELECT * FROM books';
//     Connect()
//         .then((connection) => {
//             Query(connection, query)
//                 .then((results) => {
//                     return res.status(200).json({
//                         results
//                     });
//                 })
//                 .catch((error) => {
//                     logging.error(NAMESPACE, error.message, error);
//                     return res.status(500).json({
//                         message: error.message,
//                         error
//                     });
//                 })
//                 .finally(() => {
//                     connection.end();
//                 });
//         })
//         .catch((error) => {
//             logging.error(NAMESPACE, error.message, error);
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

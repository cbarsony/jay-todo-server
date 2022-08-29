import mysql from 'mysql'
require('dotenv').config()
const HTTP_MESSAGE = require('./models/error_message')

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

db.connect(function(err) {
    if (err) throw err
    console.log('Connected to MySQL')
})

export type User = {
    id: number,
    name: string,
}

type Todo = {
    id: number,
    text: string,
    is_completed: boolean,
}

const todos = {
    getAll: (userId: number) => {
        return new Promise<Todo[]>((resolve, reject) => {
            db.query('SELECT * FROM todos WHERE user_id = ?', [userId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                resolve(result)
            })
        })
    },
    getById: (todoId: number, userId: number) => {
        return new Promise<Todo>((resolve, reject) => {
            db.query('SELECT * FROM todos WHERE id = ? AND user_id = ?', [todoId, userId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.length === 0) reject(HTTP_MESSAGE[404])
                resolve(result[0])
            })
        })
    },
    create: (todoText: string, userId: number) => {
        return new Promise<void>((resolve, reject) => {
            db.query('INSERT INTO todos (text, user_id) VALUES (?, ?)', [todoText, userId], err => {
                if(err) reject(HTTP_MESSAGE[500])
                resolve()
            })
        })
    },
    update: (todoId: number, todo: Todo, userId: number) => {
        return new Promise<void>((resolve, reject) => {
            db.query('UPDATE todos SET text = ?, is_completed = ? WHERE id = ? AND user_id = ?', [todo.text, todo.is_completed, todoId, userId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.affectedRows === 0) reject(HTTP_MESSAGE[404])
                resolve()
            })
        })
    },
    delete: (todoId: number, userId: number) => {
        return new Promise<void>((resolve, reject) => {
            db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [todoId, userId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.affectedRows === 0) reject(HTTP_MESSAGE[404])
                resolve()
            })
        })
    }
}

const users = {
    getById: (userId: number) => {
        return new Promise<User>((resolve, reject) => {
            db.query('SELECT id, name FROM users WHERE id = ?', [userId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.length === 0) reject(HTTP_MESSAGE[404])
                resolve(result[0])
            })
        })
    },
    getByNameAndPass: (username: string, password: string) => {
        return new Promise<User>((resolve, reject) => {
            db.query(
                'SELECT id, name FROM users WHERE name = ? AND hash = ?',
                [username, password],
                (err, result) => {
                    if(err) reject(HTTP_MESSAGE[500])
                    resolve(result[0])
                }
            )
        })
    },
}

export default { todos, users }

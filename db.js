const mysql = require('mysql')
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

const todos = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM todos', (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                resolve(result)
            })
        })
    },
    getById: todoId => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM todos WHERE id = ?', [todoId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.length === 0) reject(HTTP_MESSAGE[404])
                resolve(result[0])
            })
        })
    },
    create: todoText => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO todos (text) VALUES (?)', [todoText], err => {
                if(err) reject(HTTP_MESSAGE[500])
                resolve()
            })
        })
    },
    update: (id, todo) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE todos SET text = ?, is_completed = ? WHERE id = ?', [todo.text, todo.is_completed, id], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.affectedRows === 0) reject(HTTP_MESSAGE[404])
                resolve()
            })
        })
    },
    delete: todoId => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM todos WHERE id = ?', [todoId], (err, resulst) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.affectedRows === 0) reject(HTTP_MESSAGE[404])
                resolve()
            })
        })
    }
}

const users = {
    getById: userId => {
        return new Promise((resolve, reject) => {
            db.query('SELECT id, name FROM users WHERE id = ?', [userId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.length === 0) reject(HTTP_MESSAGE[404])
                resolve(result[0])
            })
        })
    },
    getByNameAndPass: (username, password) => {
        return new Promise((resolve, reject) => {
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

module.exports = { todos, users }

const mysql = require('mysql')
require('dotenv').config()
const HTTP_MESSAGE = require('./error_message')

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
            db.query('DELETE FROM todos WHERE id = ?', [todoId], (err, result) => {
                if(err) reject(HTTP_MESSAGE[500])
                else if(result.affectedRows === 0) reject(HTTP_MESSAGE[404])
                resolve()
            })
        })
    }
}

module.exports = {todos}

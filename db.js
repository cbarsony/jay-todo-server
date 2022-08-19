const mysql = require('mysql')
require('dotenv').config()

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

con.connect(function(err) {
    if (err) throw err
    console.log("Connected to MySQL")
})

const todos = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM todos', (err, result) => {
                if(err) reject(err)
                resolve(result)
            })
        })
    },
    getById: todoId => {
        return new Promise((resolve, reject) => {
            con.query('SELECT * FROM todos WHERE id = ?', [todoId], (err, result) => {
                if(err) reject(err)
                else if(result.length === 0) reject(`getById: Todo with id:${todoId} not found|404`)
                resolve(result)
            })
        })
    },
    create: todoText => {
        return new Promise((resolve, reject) => {
            con.query('INSERT INTO todos (text) VALUES (?)', [todoText], err => {
                if(err) reject(err)
                resolve()
            })
        })
    },
    update: (id, todo) => {
        return new Promise((resolve, reject) => {
            con.query('UPDATE todos SET text = ?, is_completed = ? WHERE id = ?', [todo.text, todo.is_completed, id], (err, result) => {
                if(err) reject(err)
                else if(result.affectedRows === 0) reject(`update: Todo with id:${id} not found|404`)
                resolve()
            })
        })
    },
    delete: todoId => {
        return new Promise((resolve, reject) => {
            try {
                con.query('DELETE FROM todos WHERE id = ?', [todoId], (err, result) => {
                    if(err) reject(err)
                    else if(result.affectedRows === 0) reject(`delete: Todo with id:${todoId} not found|404`)
                    resolve()
                })
            }
            catch(ex) {
                console.log(ex)
            }
        })
    }
}

module.exports = {todos}

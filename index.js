const express = require('express')
const db = require('./db')
const cors = require('cors')
const HTTP_MESSAGE = require('./error_message')
require('express-async-errors')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.json())

app.use(cors())

app.use((req, res, next) => {
    console.log(`\n${req.method} ${req.url} ${JSON.stringify(req.body)}`)
    next()
})

app.get('/todos', async(req, res) => {
    const todos = await db.todos.getAll()
    res.json(todos)
})

app.get('/todos/:id', async(req, res, next) => {
    const todoId = Number(req.params.id)
    if(!isFinite(todoId)) throw new Error(HTTP_MESSAGE[400])
    const todo = await db.todos.getById(todoId)
    res.json(todo)
})

app.post('/todos', async(req, res) => {
    await db.todos.create(req.body.text)
    const todos = await db.todos.getAll()
    res.json(todos)
})

app.put('/todos/:id', async(req, res) => {
    const todoId = Number(req.params.id)
    if(!isFinite(todoId)) throw new Error(HTTP_MESSAGE[400])
    await db.todos.update(todoId, req.body)
    const updatedTodo = await db.todos.getById(todoId)
    res.json(updatedTodo)
})

app.delete('/todos/:id', async(req, res) => {
    const todoId = Number(req.params.id)
    if(!isFinite(todoId)) throw new Error(HTTP_MESSAGE[400])
    const todoToDelete = await db.todos.getById(todoId)
    await db.todos.delete(todoToDelete.id)
    res.json(todoToDelete)
})

app.use((error, req, res, next) => {
    const errorMessage = error.message ? error.message : error
    console.log(`${errorMessage}`)
    const [message, rawStatus, code] = errorMessage.split('|');
    const status = rawStatus && Number.isFinite(Number(rawStatus)) ? Number(rawStatus) : 500;
    res.status(status).json({
        message: status >= 400 && status < 500 ? message : 'Something went wrong',
        status,
        code,
    });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

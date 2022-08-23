const express = require('express')
const db = require('./db')
const cors = require('cors')
const HTTP_MESSAGE = require('./error_message')
require('express-async-errors')
const {
    validateParams,
    validateBody,
    schemaPostTodo,
    schemaPutTodo,
    schemaId,
} = require('./validate')

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

app.get('/todos/:id', validateParams(schemaId), async(req, res, next) => {
    const todo = await db.todos.getById(req.params.id)
    res.json(todo)
})

app.post('/todos', validateBody(schemaPostTodo), async(req, res) => {
    await db.todos.create(req.body.text)
    const todos = await db.todos.getAll()
    res.json(todos)
})

app.put('/todos/:id', validateParams(schemaId), validateBody(schemaPutTodo), async(req, res) => {
    await db.todos.update(req.params.id, req.body)
    const updatedTodo = await db.todos.getById(req.params.id)
    res.json(updatedTodo)
})

app.delete('/todos/:id', validateParams(schemaId), async(req, res) => {
    const todoToDelete = await db.todos.getById(req.params.id)
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

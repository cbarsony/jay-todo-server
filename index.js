const express = require('express')
const db = require('./db')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(`\n${req.method} ${req.url} ${JSON.stringify(req.body)}`)
    next()
})

app.get("/todos", async(req, res) => {
    const todos = await db.todos.getAll()
    res.json(todos)
})

app.get('/todos/:id', async(req, res) => {
    const todoId = Number(req.params.id)
    db.todos.getById(todoId)
        .then(todo => res.json(todo))
        .catch(() => res.sendStatus(404))
})

app.post('/todos', async(req, res) => {
    await db.todos.create(req.body.text)
    const todos = await db.todos.getAll()
    res.json(todos)
})

app.put('/todos/:id', async(req, res) => {
    const todoId = Number(req.params.id)
    db.todos.update(todoId, req.body)
        .then(() => res.json({
            id: todoId,
            ...req.body
        }))
        .catch(() => res.sendStatus(404))
})

app.delete('/todos/:id', async(req, res) => {
    const todoId = Number(req.params.id)
    const deleteTodo = todo => db.todos.delete(todoId)
        .then(() => res.json(todo))
        .catch(() => res.sendStatus(404))
    const todoToDelete = await db.todos.getById(todoId)
        .then(deleteTodo)
        .catch(() => res.sendStatus(404))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

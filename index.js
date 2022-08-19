const express = require('express')
const db = require('./db')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(`\n${req.method} ${req.url} ${JSON.stringify(req.body)}`)
    next()
})

app.get("/todos", (req, res) => {
    db.todos.getAll()
        .then(todos => res.json(todos))
        .catch(error => res.sendStatus(500))
})

app.get('/todos/:id', (req, res) => {
    const todoId = Number(req.params.id)

    db.todos.getById(todoId)
        .then(todo => res.json(todo))
        .catch(error => res.sendStatus(500))
})

app.post('/todos', async(req, res) => {
    await db.todos.create(req.body.text)
    const todos = await db.todos.getAll()
    res.json(todos)
})

app.put('/todos/:id', async(req, res) => {
    await db.todos.update(req.body)
    res.json(req.body)
})

app.delete('/todos/:id', async(req, res) => {
    const todoId = Number(req.params.id)

    const todoToDelete = await db.todos.getById(todoId)
    await db.todos.delete(todoId)

    res.json(todoToDelete)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

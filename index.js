const express = require('express')
const db = require('./db')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(`\nRequest: ${req.method} ${req.url}`)
    console.log(`Request body: ${JSON.stringify(req.body)}`)
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

app.post('/todos', (req, res) => {
    db.todos.create({text: req.body.text, is_completed: req.body.isCompleted})
        .then(result => res.json(result.insertId))
        .catch(error => res.sendStatus(500))
})

app.put('/todos/:id', (req, res) => {
    db.todos.update({
        id: Number(req.body.id),
        text: req.body.text,
        is_completed: req.body.isCompleted,
    })
        .then(() => res.sendStatus(200))
        .catch(error => res.sendStatus(500))
})

app.delete('/todos/:id', (req, res) => {
    const todoId = Number(req.params.id)

    db.todos.delete(todoId)
        .then(() => res.sendStatus(200))
        .catch(error => res.sendStatus(500))
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

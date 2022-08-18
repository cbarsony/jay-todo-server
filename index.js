const express = require('express')

const PORT = process.env.PORT || 3001
const app = express()
const nextTodoId = todos => todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
const db = {
    todos: [
        {
          id: 1,
          text: 'Take sunbath',
          isCompleted: false,
        },
        {
          id: 2,
          text: 'Go for a walk',
          isCompleted: true,
        },
    ],
}

app.use(express.json())

app.get("/todos", (req, res) => {
    console.log(`GET /todos ${JSON.stringify(db.todos)}`)
    res.json(db.todos)
})

app.get('/todos/:id', (req, res) => {
    const todoId = Number(req.params.id)
    const todo = db.todos.find(todo => todo.id === todoId)

    console.log(`GET /todos/${todoId}`)
    res.json(todo)
})

app.post('/todos', (req, res) => {
    const newTodo = {
        id: nextTodoId(db.todos),
        text: req.body.text,
        isCompleted: req.body.isCompleted,
    }

    db.todos = [...db.todos, newTodo]

    console.log(`POST /todos ${JSON.stringify(newTodo)}`)
    res.sendStatus(200)
})

app.put('/todos/:id', (req, res) => {
    const todoId = Number(req.params.id)
    const updatedTodo = {
        id: todoId,
        text: req.body.text,
        isCompleted: req.body.isCompleted,
    }

    db.todos = db.todos.map(todo => todo.id === todoId ? updatedTodo : todo)

    console.log(`PUT /todos/${todoId} ${JSON.stringify(updatedTodo)}`)
    res.sendStatus(200)
})

app.delete('/todos/:id', (req, res) => {
    const todoId = Number(req.params.id)

    db.todos = db.todos.filter(todo => todo.id !== todoId)

    console.log(`DELETE /todos/${todoId}`)
    res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

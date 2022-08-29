import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import 'express-async-errors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { KeyExportOptions } from 'crypto'
import db, { User } from './db'
import HTTP_MESSAGE from './models/error_message'
import auth from './models/auth'
import validators from './models/validators'
import schemas from './models/schemas'

const PORT = process.env.PORT || 3001
const app = express()
const jwtSecret = process.env.JWT_SECRET

const {
    validateBody,
    validateParams,
} = validators
const {
    schemaPostTodo,
    schemaPutTodo,
    schemaId,
} = schemas

interface Request extends Express.Request {
    user: User,
}

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}))
app.use(cookieParser())

app.use((req, res, next) => {
    console.log(`\n${req.method} ${req.url} ${JSON.stringify(req.body)}`)
    next()
})

app.post('/login', async(req, res) => {
    const user = await db.users.getByNameAndPass(req.body.username, req.body.password)
    if(user && typeof jwtSecret === 'string') {
        const jwtString = jwt.sign(Object.assign({}, user), jwtSecret)
        res.cookie('jwt', jwtString, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
        res.json({...user, loginSuccess: true})
    }
    else {
        res.json({loginSuccess: false})
    }
})

app.use(auth)

app.get('/me', async(req: Request, res: Express.Response) => {
    const user = await db.users.getById(req.user.id)
    res.json(user)
})

app.get('/todos', async(req, res) => {
    const todos = await db.todos.getAll(req.user.id)
    res.json(todos)
})

app.get('/todos/:id', validateParams(schemaId), async(req, res, next) => {
    const todo = await db.todos.getById(req.params.id, req.user.id)
    res.json(todo)
})

app.post('/todos', validateBody(schemaPostTodo), async(req, res) => {
    await db.todos.create(req.body.text, req.user.id)
    const todos = await db.todos.getAll(req.user.id)
    res.json(todos)
})

app.put('/todos/:id', validateParams(schemaId), validateBody(schemaPutTodo), async(req, res) => {
    await db.todos.update(req.params.id, req.body, req.user.id)
    const updatedTodo = await db.todos.getById(req.params.id, req.user.id)
    res.json(updatedTodo)
})

app.delete('/todos/:id', validateParams(schemaId), async(req, res) => {
    const todoToDelete = await db.todos.getById(req.params.id, req.user.id)
    await db.todos.delete(todoToDelete.id, req.user.id)
    res.json(todoToDelete)
})

app.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.end()
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

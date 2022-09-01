import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { KeyExportOptions } from 'crypto'
import * as db from './db'
import { HTTP_MESSAGE } from './models/error_message'
import { auth } from './models/auth'
import { validateBody, validateParams, validateQuery } from './models/validators'
import { schemaPostTodo, schemaPutTodo, schemaId, schemaGetTodos } from './models/schemas'
import { AuthRequest } from './models/types'

const PORT = process.env.PORT || 3001
const app = express()
const jwtSecret = process.env.JWT_SECRET

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

app.get('/me', async(req: AuthRequest, res) => {
    const user = await db.users.getById(req.user!.id)
    res.json(user)
})

app.get('/todos', validateQuery(schemaGetTodos), async(req: AuthRequest, res) => {
    const todos = await db.todos.get(req.user!.id, req.query.q as string, req.query.state as string)
    res.json(todos)

    /* const todos = await db.todos.getAll(req.user!.id)
    res.json(todos) */
})

app.get('/todos/:id', validateParams(schemaId), async(req: AuthRequest<{id: number}>, res, next) => {
    const todo = await db.todos.getById(req.params.id, req.user!.id)
    res.json(todo)
})

app.post('/todos', validateBody(schemaPostTodo), async(req: AuthRequest, res) => {
    await db.todos.create(req.body.text, req.user!.id)
    const todos = await db.todos.getAll(req.user!.id)
    res.json(todos)
})

app.put('/todos/:id', validateParams(schemaId), validateBody(schemaPutTodo), async(req: AuthRequest<{id: number}>, res) => {
    await db.todos.update(req.params.id, req.body, req.user!.id)
    const updatedTodo = await db.todos.getById(req.params.id, req.user!.id)
    res.json(updatedTodo)
})

app.delete('/todos/:id', validateParams(schemaId), async(req: AuthRequest<{id: number}>, res) => {
    const todoToDelete = await db.todos.getById(req.params.id, req.user!.id)
    await db.todos.delete(todoToDelete.id, req.user!.id)
    res.json(todoToDelete)
})

app.get('/logout', (req, res) => {
    res.clearCookie('jwt')
    res.end()
})

app.use((error: Error | string, req: AuthRequest, res: Response, next: NextFunction) => {
    const errorMessage = typeof error === 'string' ? error : error.message
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

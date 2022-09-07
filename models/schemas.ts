import { object, string, number, bool, mixed } from 'yup'

export const schemaGetTodos = object({
    q: string(),
    state: mixed().oneOf(['all', 'completed', 'pending']),
    skip: number(),
    limit: number(),
})

export const schemaPostTodo = object({
    text: string().required(),
})

export const schemaPutTodo = object({
    text: string().required(),
    is_completed: bool().required(),
})

export const schemaId = object({
    id: number().positive().required(),
})

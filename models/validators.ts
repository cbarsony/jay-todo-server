import { NextFunction, Response } from 'express'
import { ObjectSchema } from 'yup'
import { AuthRequest } from './types'

export const validateParams = <S extends {}>(schema: ObjectSchema<S>) => async(req: AuthRequest<any>, res: Response, next: NextFunction) => {
    try {
        req.params = await schema.validate(req.params)
        next()
    }
    catch(message) {
        throw new Error(`${message}|400|BAD_REQUEST`)
    }
}

export const validateBody = <S extends {}>(schema: ObjectSchema<S>) => async(req: AuthRequest<any>, res: Response, next: NextFunction) => {
    try {
        await schema.validate(req.body)
        next()
    }
    catch(message) {
        throw new Error(`${message}|400|BAD_REQUEST`)
    }
}

export const validateQuery = <S extends {}>(schema: ObjectSchema<S>) => async(req: AuthRequest<any>, res: Response, next: NextFunction) => {
    try {
        await schema.validate(req.query)
        next()
    }
    catch(message) {
        throw new Error(`${message}|400|BAD_REQUEST`)
    }
}

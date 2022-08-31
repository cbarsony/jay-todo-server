import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../db'
import { HTTP_MESSAGE } from './error_message'
import { AuthRequest } from './types'

const jwtSecret = process.env.JWT_SECRET

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    if(jwtSecret === undefined) {
        throw new Error(HTTP_MESSAGE[500])
    }

    const jwtValue = req.cookies.jwt

    try {
        const user = jwt.verify(jwtValue, jwtSecret)
        req.user = user as User
    }
    catch(ex) {
        console.log(ex)
        throw new Error(HTTP_MESSAGE[401])
    }
    
    next()
}

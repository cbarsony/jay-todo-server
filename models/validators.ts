import yup from 'yup'
import { SchemaLike } from 'yup/lib/types'

const validators = {
    validateParams: (schema: SchemaLike) => async(req, res, next) => {
        try {
            req.params = await schema.validate(req.params)
            next()
        }
        catch(message) {
            throw new Error(`${message}|400|BAD_REQUEST`)
        }
    },
    validateBody: (schema: SchemaLike) => async(req, res, next) => {
        try {
            await schema.validate(req.body)
            next()
        }
        catch(message) {
            throw new Error(`${message}|400|BAD_REQUEST`)
        }
    },
}

export default validators

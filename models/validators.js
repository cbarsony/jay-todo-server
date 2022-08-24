const yup = require('yup')

const validators = {
    validateParams: schema => async(req, res, next) => {
        try {
            req.params = await schema.validate(req.params)
            next()
        }
        catch(message) {
            throw new Error(`${message}|400|BAD_REQUEST`)
        }
    },
    validateBody: schema => async(req, res, next) => {
        try {
            await schema.validate(req.body)
            next()
        }
        catch(message) {
            throw new Error(`${message}|400|BAD_REQUEST`)
        }
    },
}

module.exports = validators

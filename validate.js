const yup = require('yup')

const validate = {
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
    schemaPostTodo: yup.object({
        text: yup.string().required(),
    }),
    schemaPutTodo: yup.object({
        text: yup.string().required(),
        is_completed: yup.bool().required(),
    }),
    schemaId: yup.object({
        id: yup.number().positive().required(),
    }),
}

module.exports = validate

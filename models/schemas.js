const yup = require('yup')

const schemas = {
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

module.exports = schemas

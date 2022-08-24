require('dotenv').config()
var jwt = require('jsonwebtoken')
const HTTP_MESSAGE = require('./error_message')

const jwtSecret = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const jwtValue = req.cookies.jwt

    try {
        const user = jwt.verify(jwtValue, jwtSecret)
        req.user = user
    }
    catch(ex) {
        console.log(ex)
        throw new Error(HTTP_MESSAGE[401])
    }
    
    next()
}

module.exports = auth

const express = require('express')

const router = express.Router()

const { getLogin } = require('./auth.controller')

router.get('/login', getLogin)

module.exports = router

const express = require('express')
const path = require('path')

const { rootDir } = require('../util')
const router = express.Router()

router.get('/', (_, res) => {
	res.sendFile(path.join(rootDir, 'views', 'home.html'))
})

module.exports = router

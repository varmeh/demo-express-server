const express = require('express')

const router = express.Router()

router.get('/', (_, res) => {
	res.json({ hello: 'world' })
})

module.exports = router

const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const app = express()

// Apply Middleware
app.use(morgan('common'))

// Setup logging a file (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'server.log'), {
	flags: 'a'
})
app.use(morgan('combined', { stream: accessLogStream }))

app.get('/', (_, res) => {
	res.json({ hello: 'world' })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})

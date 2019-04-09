const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const app = express()

/* Apply Middleware */
app.use(morgan('common'))

// Setup logging a file (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'server.log'), {
	flags: 'a'
})
app.use(morgan('combined', { stream: accessLogStream }))

/* Add routes */
app.get('/', (_, res) => {
	res.json({ hello: 'world' })
})

app.get('/add-product', (_, res) => {
	res.send(
		'<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
	)
})

app.post('/product', (req, res) => {
	console.log(`Req body: ${req.body}`)
	res.redirect('/')
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})

const express = require('express')

const app = express()

app.get('/', (_, res) => {
	res.json({ hello: 'world' })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})

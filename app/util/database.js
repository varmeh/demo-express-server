// Sequelize/index required for js intellisense
const Sequelize = require('sequelize/index')

/* Export Connection Pool */
module.exports = new Sequelize('node-complete', 'root', 'password', {
	dialect: 'mysql',
	host: 'localhost'
})

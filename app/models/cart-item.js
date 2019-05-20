const Sequelize = require('sequelize')
const sequelize = require('../util/database')

module.exports = sequelize.define('cartItem', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		unique: true,
		primaryKey: true
	},
	quantity: Sequelize.INTEGER
})

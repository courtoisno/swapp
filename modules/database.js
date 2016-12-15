/////////////////////////////////////////////////////////////////////////
// ------------ NECESSARY MODULES AND GLOBAL VARIABLES ------------------

const sequelize =	 require ('sequelize');
const pg = 			 require ('pg');

/////////////////////////////////////////////////////////////////////////
// ------------------------- CREATE DATABASES USED ----------------------

let db = {}

// connection to Database

db.conn = new sequelize (process.env.swapp_db, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	server:'localhost',
	dialect:'postgres'
})


//Table for user : username and password -> check for userID
db.User = db.conn.define ('user', {
	username: {
		type: sequelize.STRING,
		unique: true,
	}, 
	password: {
		type: sequelize.STRING, 
	},
	email: sequelize.STRING,
	firstname: sequelize.STRING,
	lastname: sequelize.STRING,
	profilepic: sequelize.STRING
})

//table for posts : title + body ---> connect to userID
db.Offer = db.conn.define('Offer', {
	title: sequelize.STRING,
	about: sequelize.STRING,
	condition: sequelize.STRING,
	picture: sequelize.STRING
})

//table for comments --> Connect to post and user Id
db.Want = db.conn.define('Want', {

})

//create relations
db.User.hasMany( db.Want )
db.User.hasMany( db.Offer )

db.Offer.belongsTo( db.User )
db.Offer.hasMany( db.Want )

db.Want.belongsTo( db.User )
db.Want.belongsTo( db.Offer )

module.exports = db










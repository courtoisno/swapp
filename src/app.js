/////////////////////////////////////////////////////////////////////////
// ------------ NECESSARY MODULES AND GLOBAL VARIABLES ------------------

const express = 	 require ('express');
const pg = 			 require ('pg');
const bodyParser = 	 require ('body-parser');
const bcrypt = require('bcrypt');
const session =		 require ('express-session');

const app = express ();

// Require our routes
let backEnd = require (__dirname + '/backend')

let db = require (__dirname + '/../modules/database')
console.log( db.User )




// Set up PUG (view engines)

app.set ('views', __dirname + '/../views');
app.set ('view engine', 'pug');

// Load static files
app.use(express.static('static'))


//Session
app.use(session({
	secret: 'super secret security',
	resave: true,
	saveUninitialized: false
}));

app.use('/', backEnd)

////////////////////////////////////////////////////////////////////////////
//------------------------------ USE ROUTES  ------------------------------

// app.use('/', Log);
// app.use('/', thinGs);

app.get( '/ping', ( req, res ) => {
 res.send( 'Pong' )
});


/////Create models

db.conn.sync ( { force: false } ).then ( synced => { 
	console.log( 'Data synced' )
	bcrypt.hash ( '123456', 8, ( err, hash ) => {
		db.User.create ( {
		username: 'Nonox111',
		password: hash, 
		email: 'courtoisno@gmail.com',
		firstname: 'Courtois',
		lastname: 'Noémie'
	}).then( user => {
		user.createOffer ( {
			title: "Coffee machine",
			about: "Fantastic coffee machine, perfect condition and fantastic coffee. Probably the best on earth."
		}).then( offer => {
			user.createWant( { } ).then ( want => {
				want.setOffer ( offer )
				})
			})
		})


	})

	bcrypt.hash ( 'halleluja', 8, ( err, hash ) => {
		db.User.create ( {
		username: 'bradley',
		password: hash, 
		email: 'bsf@gmail.com',
		firstname: 'Fletcher',
		lastname: 'bradley'
	}).then( user => {
		user.createOffer ( {
			title: "Big cookie box",
			about: "Amazing cookies, they are with chocolate"
		}).then( offer => {
			user.createWant( { } ).then ( want => {
					want.setOffer ( offer )
				})
			})
		})
	})

	bcrypt.hash ( 'rizotto', 8, ( err, hash ) => {
		db.User.create ( {
		username: 'gougou',
		password: hash, 
		email: 'gougou@gmail.com',
		firstname: 'Auguste',
		lastname: 'gougou'
	}).then( user => {
		user.createOffer ( {
			title: "Collector DVD of HOME ALONE",
			about: "The best christmas movie ever, good condition"
		}).then( offer => {
			user.createWant( { } ).then ( want => {
				want.setOffer ( offer )
				})
			})
		})


	})

})



////////////////////////////////////////////////////////////////////////////
//------------------------------ LISTEN SERVER ------------------------------
app.listen( 8000, () => {
    console.log( "Running on port 8000" )
})

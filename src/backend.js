/////////////////////////////////////////////////////////////////////////
// ------------ NECESSARY MODULES AND GLOBAL VARIABLES ------------------

const express = 	 require ('express');
const bodyParser = 	 require ('body-parser');
const session =		 require ('express-session');
const bcrypt = require('bcrypt');
const router = express.Router ();

// Import database
const db = require ('../modules/database')

/////////////////////////////////////////////////////////////////////////
//------------------------------ ROUTES ---------------------------------



///++++++++++++++++++INDEX PAGE+++++++++++++++++++///

//Get the index page and render all the offers + the user data
router.get('/', (req, res)=>{
	var user = req.session.user
		db.Offer.findAll({
		}).then ( offer => {
			res.render('index', {
 				offers: offer,
 				user: req.session.user

 			})
		} )

})

///++++++++++++++++++PROFILE+++++++++++++++++++///

//redirect to profile IF user is found + render his own offers and wishes
router.get('/profile', (req, res) => {
	var user = req.session.user;
	if (user === undefined) {
		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
	} 
	//Search for the user and include their offers and include their zqnts qnd offers
	db.User.findOne ({	
		where: { username: user.username },
		include: [ { 
			model: db.Offer,
			include : [ 
				{ model: db.Want,
				include: [db.Offer]
			}]
		},
		{
			model: db.Want,
			include : [ db.Offer ]
		}
		]
	}).then ( user => {
		if(req.query.debug) {
			res.send(user)
		} else {
			res.render('profile', {
				user: user
			})
		}
		
	})

});


///++++++++++++++++++LOGIN+++++++++++++++++++///

//Find user in DATABASE for the LOG IN

router.post('/login', bodyParser.urlencoded({extended: true}), (req,res) =>{
	//variables for user -> req body is the input from the user
	var userName = req.body.username
	var userPass = req.body.password
	var user = req.session.user

	// Find user in Database 
	db.User.findOne ({
		where: {
			username: userName
		}
	}).then ( user => {
		
		bcrypt.compare(userPass, user.password, (err,result) => {
			// Store the Hash in the db
			// Now we check if input correspond to what's in the db
			if (result) {
				req.session.user = user;
				res.redirect('/');
			} else {
				res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
			}
		});

		}, (err) => {
			res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		});

})



///++++++++++++++++++NEW USERS+++++++++++++++++++///


router.get ('/newlog', (req,res) => {
	res.redirect('/')
})

router.post('/newlog', bodyParser.urlencoded({extended: true}), (req,res) =>{
	var user = req.session.user
	//create new user
	var newUser = {
		username: req.body.name,
		password: req.body.pass,
		email: req.body.mail
	}
	//check if passwords corresponds
	// if (newUser.email !== req.body.mail2 ){
	// 	res.redirect('/message=' + encodeURIComponent("mail doesnt corresponds"))
	// 	console.log("ALLELJUJA")
	// } 

	//ENcrypting the password in the db -> HAVE TO replace hash in password instead of newUser.password
	bcrypt.hash(req.body.pass, 8, function(err, hash) {

		if (err) throw err

		db.User.findOrCreate ({
			where: {
			username: newUser.username,
			password: hash,
			email: newUser.email
		}

		}).then (user=>{
			//check if username already here or not
			if (newUser.username == user.username){
				res.redirect('/message=' +encodeURIComponent('username already exists'))
			} 
		})
	})
 	res.redirect('/')
});


///++++++++++++++++++ POST THE WANTS +++++++++++++++++++///

router.post('/wants', bodyParser.urlencoded({extended: true}), (req,res) =>{
	var user = req.session.user;
	if (user === undefined) {
		res.redirect ('/?message=' + encodeURIComponent ("Please log in to view your profile.") );
	} else {
		db.Want.create({
			userId: user.id,
			OfferId: req.body.theOffer 
		}).then((want) =>{
			db.Want.findOne({
				where: {
					id: want.id
				},
				include: [db.Offer, db.User]
			}).then ((thewant)=>{
				console.log(thewant)
			})
			res.redirect('/')
		})
	}

});




///++++++++++++++++++ POST THE OFFER IN DB +++++++++++++++++++///
router.post('/offering', bodyParser.urlencoded({extended: true}), (req,res) =>{
	var user = req.session.user;
	db.User.findOne({
		where: {username: user.username}
	}).then( user => {
		user.createOffer({
			title: req.body.title,
			about: req.body.about
		})
	}).then( () =>{
		res.redirect('/')
	})
});


////////////++++++++ DELETE THE OFFER FROM DB ++++++++++//////////
router.post('/delete', (req, res) =>{
	var user= req.session.user;
	db.User.findOne({
		where: {username: user.username}
	}).then( user => {
		db.Offer.destroy({
			where: {
				offerId: offer.id
			}
		}).then(()=>{
			res.send('yayyy')
		})
	})

})




// //get the Wants-_> THE PERSO ONES WHISHLIST
//find all offer that have wants
router.get('/wants', bodyParser.urlencoded({extended: true}), (req,res) =>{
	var user= req.session.user;
	if(!user) res.send('NOT LOGGED IN')
	
	db.Offer.findAll({
		where: { 
			offerId: offer.id
		}, include: [db.User, db.Want]
	}).then ( offer => {
		res.render('profile', {
			user: user,
			// YOU NEED TO ADD OFFERS HERE
			offers: offer //???
			})

		})
		
	})


// if (user === undefined) {
// 		res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
// 	} else {
// 		Post.findAll({	
// 			where: { 
// 				userId: user.id
// 			},
// 			include: [User]

// 		}).then(post => {
// 			res.render('index', {
// 				posts: post,
// 				user: user
// 			})

/////// LOGOUT //////////

router.get('/logout', function (req, res) {
	req.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});


////////HANDLEING FILES UPLOAD
router.post('/file-upload', function(req, res, next) {
    console.log(req.body);
    console.log(req.files);
});



/////////////////////////////////////////////////////////////////////////
// ---------------------------- EXPORT ROUTES ---------------------------

module.exports = router
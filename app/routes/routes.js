var BookHandler = require('../controllers/booksController.js')
var bookHandler = new BookHandler()

var UserHandler = require('../controllers/usersController.js')
var userHandler = new UserHandler()

module.exports = function(app, passport){

																//Functions
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

	//Check for loggin function
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()){
			return next()
		}else{
			req.flash('loginMessage', 'Please log in first.')
			res.redirect('/login')
		}
	}

																//Middleware
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

	//Send user to views
	app.use(function(req, res, next) {
	  res.locals.user = req.user
	  next()
	})

																//Routes
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

	//Home route
	app.get('/', isLoggedIn, bookHandler.displayAllBooks)

	//Login route
	app.get('/login', function(req, res){
		if(req.user){
			console.log(req.user)
			res.redirect('/')
		}else{
			res.render('login', { message: req.flash('loginMessage') })
		}
	})

	//Signup route
	app.get('/signup', function(req,res){
		if(req.user){
			console.log(req.user)
		}
		res.render('signup', { message: req.flash('signupMessage') })
	})

	//Logout route
	app.get('/logout', isLoggedIn, function(req, res){
		req.logout()
		res.redirect('/')
	})

	app.get('/mybooks', isLoggedIn, bookHandler.myBooks)

	app.get('/addbook', isLoggedIn, bookHandler.displaySearched)
	app.get('/addbook/:id', isLoggedIn, bookHandler.addBook)

	app.get('/settings', isLoggedIn, userHandler.displaySettings)

	app.get('/trade/:bookId', isLoggedIn, bookHandler.askTrade)
	app.get('/trades', isLoggedIn, bookHandler.showTrades)
	app.get('/trades/:accept?', isLoggedIn, bookHandler.confirmTrade)




																//Forms
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

	//Login form submit
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}))

	//Signup form submit
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	//Search for books using the Google Books API
	app.post('/addbook', isLoggedIn, bookHandler.search)

	//Update user Settings
	app.post('/settings', isLoggedIn, userHandler.changeSettings)
}
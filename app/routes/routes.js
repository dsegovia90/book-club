module.exports = function(app, passport){

	//Check for loggin function
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()){
			return next()
		}else{
			req.flash('loginMessage', 'Please log in first.')
			res.redirect('/login')
		}
	}

	//Send user to views
	app.use(function(req, res, next) {
	  res.locals.user = req.user
	  next()
	})

	//Home route
	app.get('/', isLoggedIn, function(req, res){
		res.render('index')
	})

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

}
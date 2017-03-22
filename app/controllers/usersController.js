var Book = require('../models/books.js')
var User = require('../models/users.js')

function UserHandler() {

	this.displaySettings = function(req, res){
		console.log(req.user.local.email)
		User.findOne({ 'local.email': req.user.local.email }, function(err, user){
			if(!err){
				console.log(user)

			}else{
				console.log(err)
			}
		})
		res.render('settings', { message: req.flash('settingsMessage') })
	}

	this.changeSettings = function(req, res){
		User.findOne({ 'local.email': req.user.local.email }, function(err, user){
			if(!err){
				console.log(user)
				user.firstName = req.body.firstName
				user.lastName = req.body.lastName
				user.city = req.body.city
				user.state = req.body.state
				user.save()

				req.flash('settingsMessage', 'Settings Updated!')
				res.redirect('/settings')
			}else{
				console.log(err)
			}
		})
		
	}

}

module.exports = UserHandler
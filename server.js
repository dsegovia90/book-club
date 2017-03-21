var express = require('express')

var routes = require('./app/routes/routes.js')

var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash')
var session = require('express-session')
var bodyParser = require('body-parser')

var app = express()
require('dotenv').load()
require('./app/config/passport.js')(passport)
//require passportconfig

mongoose.connect(process.env.MONGO_URI)
// mongoose.Promise = global.Promises

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'pug')
app.set('views', './app/views')

app.use(express.static('./public'))

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

routes(app, passport)

var port = process.env.PORT || 3000
app.listen(port, function(){
	console.log(`Node.js is listening on port ${port}...`)
})
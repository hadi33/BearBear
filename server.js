// modules
require('rootpath')();

var express = require('express'),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'), 
    config = require('config/runconfig'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    expressJwt = require('express-jwt'),
    nodemailer = require('nodemailer'),
    port = process.env.PORT || 3000;

// configuration hadi

app.set('view engine','ejs');
app.set('views',__dirname+'/views');

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// cookies for authentication
app.use(cookieParser());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// use JWT auth to secure the api
app.use('/api',
    expressJwt({ secret: config.secret }).unless(
        { path:
            ['/api/users/authenticate',
                '/api/users/sendEmail',
                '/api/users/validationToken',
                '/api/users/changePassword',
                '/api/users/register']
        }));


//logs
app.use(morgan('dev'));


//routes
app.use('/login',require('./controllers/login.controller'));
app.use('/register',require('./controllers/register.controller'));
app.use('/sendemail',require('./controllers/sendemail.controller.js'));
app.use('/res_pass',require('./controllers/res.password.controller.js'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/user.controller'));
app.use('/api/business', require('./controllers/api/business.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});


// start app
app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;
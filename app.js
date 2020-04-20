const path = require('path');
const https = require('https');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const csurf = require('csurf');
const helmet = require('helmet');
const compression = require('compression');

const db = require('./util/database');


const app = express();
const csrfProtection = csurf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const ticketRoutes = require('./routes/tickets');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
 

const options = {
    host: 'localhost',
    user: process.env.SQL_USER,
    database: process.env.SQL_DEFAULT_DATABASE,
    password: process.env.SQL_PASSWORD,
    expiration: 86400000,
    clearExpired: true
};
//app.use(session({secret: 'verysecretkey', resave: false, saveUninitialized: false}));
const sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

/* const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert'); */

app.use(csrfProtection); 

app.use(flash()); 


app.use((req, res, next) => { // every incoming req will get funnelled through this - i.e. will get sent to all the views
    if (!req.session.isLoggedIn) {
        req.session.isLoggedIn = false;
    }
    res.locals.isAuthenticated = req.session.isLoggedIn,
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(ticketRoutes);
app.use(cartRoutes);
app.use(authRoutes);


app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {    // global error handling middleware
    //res.redirect('/500');
    console.log(error);
    res.status(500).render('500')
});

//https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 4000);

app.listen(process.env.PORT || 4000);



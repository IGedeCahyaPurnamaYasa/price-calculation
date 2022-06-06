/**
 * 
 */
 if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


/**
 * REQUIRED MODULE
 */
 const express = require('express');
 const path = require('path');
 const mongoose = require('mongoose');
 const ejsMate = require('ejs-mate');
 const methodOverride = require('method-override');
 const passport = require('passport');
 const LocalStrategy = require('passport-local');
 const mongoSanitize = require('express-mongo-sanitize');
 const session = require('express-session');
 const flash = require('connect-flash');

 const MongoDBStore = require('connect-mongo');

 const User = require('./models/user');

 
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/price-calculation'
 
/**
 * SECRET
 */
const secret = process.env.SECRET || 'thisshouldbeabettersecret';



/**
 * REQUIRED FILE
 */


 const ExpressError = require('./utils/expressError');
 const userRoutes = require('./routes/users');
 const productRoutes = require('./routes/products');
 const costTypeRoutes = require('./routes/cost_types');
 const rootIngridientRoutes = require('./routes/root_ingridients');
 const orderRoutes = require('./routes/orders');

 /**
 * DATABASE CONNECT
 */

mongoose.connect(DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
    console.log('Database connected');
})
 

const app = express();

/**
 * ENGINE
 */
 app.engine('ejs', ejsMate);

 
/**
 * SETTING
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/**
 * USE
 */
// mmaking urlencoded (form) readed by express
app.use(express.urlencoded({extended: true}));
// declare method override key
app.use(methodOverride('_method'));
// Making public directory path
app.use(express.static(path.join(__dirname, 'public')));
// Using mongosanitize, preventing using $ on query request
app.use(mongoSanitize())

const store = MongoDBStore.create({
    mongoUrl: DB_URL,
    secret,
    touchAfter: 24 * 60 * 60  
})

store.on('error', function(e){
    console.log('SESSION STORE ERROR', e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // can not request by another client
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //milissecond * second * minutes * hour * day
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

// Initialize passport and session login
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

/**
 * ROUTE
 */
 app.get('/', (req, res) => {
    res.render('home')
})


app.use('/', userRoutes);
app.use('/product/', productRoutes);
app.use('/cost-type/', costTypeRoutes);
app.use('/ingridient/', rootIngridientRoutes);
app.use('/order/', orderRoutes);


/**
 * EXCEPTION 404 Page Not Found
 */
 app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

/**
 * GLOBAL ERROR MIDDLEWARE
 */
 app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;

    if(!err.message) err.message = 'Oh No! Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})


/**
 * LISTEN PORT
 */
 const port = process.env.PORT || 3000;

 app.listen(port, () => {
     console.log(`LISTENING TO PORT ${port}`);
 })
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import authRouter from '../routes/auth.mjs';
import adminRouter from '../routes/admin.mjs';

dotenv.config({path: './admin.env'});
const port = process.env.PORT || 10000;
const app = express();

if (process.env.NODE_ENV === 'development') {
    var MONGO_URI = 'mongodb://localhost:27017/edureka-nodejs-cp';
} else {
    var MONGO_URI = 'mongodb://mongoservice:27017/edureka-nodejs-cp';
}

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({secret: process.env.SESSION_SECRET, resave: false,
     saveUninitialized: true}));

app.use('/auth', authRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
    res.redirect('/admin/users');
});

app.listen(port, (err) => {
    if(err) console.log(err);
    else {
        console.log('Server listening on port', port);
        mongoose.connect(MONGO_URI, (err, db) => {
            if(err) console.log(err);
            else console.log('Successfully connected to MongoDB');
        });
    }
});
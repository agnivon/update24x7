import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import initGlobalChat from './gbchat.mjs';

import {homeRouter} from '../routes/home.mjs';
import aboutRouter from '../routes/about.mjs';
import contactRouter from '../routes/contact.mjs';
import sportsRouter from '../routes/sports.mjs';

dotenv.config({ path: './customer.env'});
const port = process.env.PORT || 5000;
const app = express();

if (process.env.NODE_ENV === 'development') {
    var MONGO_URI = 'mongodb://localhost:27017/edureka-nodejs-cp';
} else {
    var MONGO_URI = 'mongodb://mongoservice:27017/edureka-nodejs-cp';
}

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/home', homeRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/sports', sportsRouter);

app.get('/', (req, res) => {
    res.redirect('/home');
});

/* app.listen(port, (err) => {
    if(err) console.log(err);
    else {
        console.log('Server listening on port', port);
        mongoose.connect(MONGO_URI).then(() => {
            console.log('Successfully connected to MongoDB');
        }).catch((err) => {
            console.log(err);
        });
    }
}); */

const server = http.createServer(app).listen(port, function () {
    console.log("Express server listening on port", port);
    mongoose.connect(MONGO_URI).then(() => {
        console.log('Successfully connected to MongoDB');
    }).catch((err) => {
        console.log(err);
    });
});

initGlobalChat(server);





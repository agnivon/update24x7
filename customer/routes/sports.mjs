import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path: './customer.env'})

const NEWSAPI_API_KEY = process.env.NEWSAPI_API_KEY;
const url = `https://newsapi.org/v2/everything?q=sports&from=2022-06-14&sortBy=popularity&apiKey=${NEWSAPI_API_KEY}`;

const sportsRouter = new express.Router();

sportsRouter.get('/', async (req, res) => {
    try {
        const response = await axios.get(url);
        res.render('sports', {
            articles: response.data.articles.slice(0, 20)
        });
        // res.json(response.data);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

export default sportsRouter;
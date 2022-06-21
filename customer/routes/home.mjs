import express from 'express';
import axios from 'axios';
import iplocate from 'node-iplocate';
import publicIp from 'public-ip';
import News from '../models/news.mjs';

const homeRouter = new express.Router();

async function getCityFromIp() {
    const ip = await publicIp.v4();
    const results = await iplocate(ip);
    return results.city;
}

homeRouter.get('/', async (req, res) => {
    const news = await News.find({}).sort({ date: -1 }).limit(3);
    res.render('home', { news });
});

homeRouter.get('/weather', async (req, res) => {
    const { lat, long } = req.query;
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const openWeatherURI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,daily&appid=${OPENWEATHER_API_KEY}&units=metric`;

    try {
        const response = await axios.get(openWeatherURI);
        const city = await getCityFromIp();
        if (response.status === 200) {
            res.json({
                success: true,
                data: response.data,
                city
            });
        } else {
            throw Error('Weather API response status !== 200');
        }
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            err: err.message
        });
    }
});

export { homeRouter, getCityFromIp };
import express from 'express';
import sendMail from '../src/sendmail.mjs';

const contactRouter = new express.Router();

contactRouter.get('/', (req, res) => {
    res.render('contact');
});

contactRouter.post('/', (req, res) => {
    const email = req.body.email;
    const query = req.body.query;
    sendMail(email, query).then(() => {
        res.json({
            success: true,
            message: 'Query successfully submitted'
        });
    }).catch((err) => {
        console.log(err);
        res.json({
            success: false,
            message: 'Server Error. Try again later'
        });
    });
});

export default contactRouter;
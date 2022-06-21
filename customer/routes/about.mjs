import express from 'express';

const aboutRouter = new express.Router();

aboutRouter.get('/', (req, res) => {
    res.render('about');
});

export default aboutRouter;
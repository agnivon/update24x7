import express from 'express';
import auth from '../src/auth.mjs';

const authRouter = new express.Router();

authRouter.get('/login', (req, res) => {
    res.render('login');
});

authRouter.post('/login', async (req, res) => {
    let response = {};
    const result = await auth.login(req.body);
    if (result.success) {
        response = {
            success: true,
            message: "User login successful",
        };
        req.session.authToken = result.token;
    }
    else {
        response = {
            success: false,
            message: result.error
        };
    }
    res.json(response);
});

authRouter.get('/register', (req, res) => {
    res.render('register');
});

authRouter.post('/register', async (req, res) => {
    let response = {};
    const result = await auth.register(req.body);
    if (result.success) {
        response = {
            success: true,
            message: "User registration successful"
        };
    }
    else {
        response = {
            success: false,
            message: result.error
        };
    }
    res.json(response);
});

authRouter.get('/logout', (req, res) => {
    delete req.session.user;
    delete req.session.authToken;
    res.redirect('/auth/login');
});

export default authRouter;
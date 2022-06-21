import express from 'express';
import auth from '../src/auth.mjs';
import User from '../models/user.mjs';
import News from '../models/news.mjs';

const adminRouter = new express.Router();

adminRouter.use(auth.authenticateUser);
adminRouter.use(auth.authorizeAdmin);

function getEntity(req) {
    const entity = req.params.entity;
    if(entity === 'news') {
        var model = News;
    } else if(entity === 'user') {
        var model = User;
    }
    return model;
}

function response(success, message='') {
    return {
        success,
        message
    }
}

adminRouter.get('/', (req, res) => {
    res.redirect('/admin/users');
});

adminRouter.get('/users', async (req, res) => {
    const users = await User.find();
    res.render('users', { users, isAdmin: /* req.session.user.isAdmin */ true });
});

adminRouter.get('/news', async (req, res) => {
    const news = await News.find();
    res.render('news', { news, isAdmin: /* req.session.user.isAdmin */ true });
});

adminRouter.post('/add/:entity', async (req, res) => {
    const model = getEntity(req);
    try {
        if(req.body.password !== req.body.cpassword) {
            return res.json(response(false, 'Passwords do not match'));
        }
        const result = await model.create(req.body);
        res.json(response(true, result));
    } catch (err) {
        console.log(err);
        res.json(response(false, err.message));
    }
});

adminRouter.put('/update/:entity/:id', async (req, res) => {
    const model = getEntity(req);
    try {
        if(req.body.password !== req.body.cpassword) {
            return res.json(response(false, 'Passwords do not match'));
        }
        const result = await model.updateOne({_id: req.params.id}, {$set: req.body}, {upsert: true});
        res.json(response(true, result));
    } catch (err) {
        console.log(err);
        res.json(response(false, err.message));
    }
});

adminRouter.delete('/delete/:entity/:id', async (req, res) => {
    const model = getEntity(req);
    try {
        const result = await model.deleteOne({_id: req.params.id});
        res.json(response(true, result));
    } catch (err) {
        console.log(err);
        res.json(response(false, err.message));
    }
})

export default adminRouter;
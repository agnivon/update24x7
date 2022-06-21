import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.mjs';

dotenv.config({ path: './admin.env' });

function response(success, error = '') {
    return {
        success,
        error
    }
}

function verifyToken(token) {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return data;
    } catch {
        return false;
    }
}

async function login(userC) {
    // console.log(userC);
    try {

        const user = await User.findOne({ username: userC.username });

        if (!user) {
            return response(false, 'User does not exist');
        }
        const passwordValid = bcrypt.compareSync(userC.password, user.password)
        if (!passwordValid) {
            return response(false, 'Invalid password');
        }
        return {
            success: true,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: 86400
            })
        }
    }
    catch (err) {
        console.log(err);
        return response(false, err.message);
    }
}

async function register(user) {
    if (user.password !== user.cpassword) {
        console.log('Passwords do not match')
        return response(false, 'Passwords do not match');
    }
    try {
        const duplicateUsers = await User.find({ $or: [{ username: user.username }, { email: user.email }] });
        if (duplicateUsers.length > 0) {
            return response(false, `User ${user.username} already exists`);
        }

        //const hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));

        const result = await User.create({
            username: user.username,
            email: user.email,
            password: user.password,
        });
        return response(true);
    } catch (err) {
        console.log(err);
        return response(false, err.message);
    }
}

const authenticateUser = async (req, res, next) => {
    const token = req.session.authToken;
    if (!token) {
        return res.redirect('/auth/login');
    }
    try {
        const tokenValid = verifyToken(token);
        if (tokenValid) {
            const userID = tokenValid.id;
            const user = await User.findOne({ _id: userID });
            if (user) {
                req.session.user = {
                    userID: tokenValid.id,
                    isAdmin: user.isAdmin
                }
                return next();
            } else {
                return res.redirect('/auth/login');
            }
        } else {
            return res.redirect('/auth/login');
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.session.user.isAdmin) {
        return next();
    } else if (req.session.authToken) {
        return res.status(403).send('Forbidden. <a href="/auth/logout">Logout</a>');
    } else {
        return res.sendStatus(403);
    }
};

export default {
    register,
    login,
    authenticateUser,
    authorizeAdmin
}
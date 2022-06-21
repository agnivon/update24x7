import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, dropDups: true, required: true },
    email: { type: String, unique: true, dropDups: true, required: false },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
}, { collection: 'users' });

userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    return next();
});

userSchema.pre('updateOne', function (next) {
    let setQuery = this.getUpdate()['$set'];
    Object.keys(setQuery).forEach(function (key) {
        if (key === '') {
            delete setQuery[key];
        } else if (key === 'password') {
            setQuery[key] = bcrypt.hashSync(setQuery[key], bcrypt.genSaltSync(10));
        }
    });
    this.setUpdate({ $set: setQuery });
    return next();
});

const User = mongoose.model('user', userSchema);

export default User;
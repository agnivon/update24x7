import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: {type: String, required: true},
    img: {type: String, required: true},
    story: {type: String, required: true},
    date: {type: Date, required: true}
}, {collection: 'news'});

const News = mongoose.model('news', newsSchema);

export default News;
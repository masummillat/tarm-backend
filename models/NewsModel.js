const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create News Schema & model
const NewsSchema = new Schema({
    title:{
        type:String,
        required:[true, 'News Title Is Required'],
    },
    description:{
        type:String,
        required:[true, 'News Description Is Required'],
    },
    image:{
        type:String,
        required:[true, 'News image Is Required'],
    }
});

const News = mongoose.model('news',NewsSchema);

module.exports = News;
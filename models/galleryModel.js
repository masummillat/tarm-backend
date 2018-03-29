const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Gallery Schema & model
const GallerySchema = new Schema({
    title:{
        type:String,
    },
    image:{
        type:String,
        required:[true, 'Image Is Required']
    }
});

const Gallery = mongoose.model('gallery',GallerySchema);

module.exports = Gallery;
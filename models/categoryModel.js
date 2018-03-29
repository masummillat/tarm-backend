const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create category Schema & model
const CategorySchema = new Schema({
    category:{
        type:String,
        unique:[true, 'Category Already Exists'],
        required:[true, 'Category field is required']
    },
    description:{
        type:String,
        required:[true, 'Category description is required']
    },
    image:{
        type:String,
        required:[true, 'Category image is required']
    }
});

const Category = mongoose.model('category',CategorySchema);

module.exports = Category;
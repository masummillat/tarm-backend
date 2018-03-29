const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Product Schema & model
const ProductSchema = new Schema({
    product:{
      type:String,
        unique:[true, 'This Product Already Exists'],
        required:[true, 'Product Field Is required']
    },
    category:{
        type:String,
        required:[true, 'Category Field Is Required']
    },
    description:{
        type:String,
        required:[true, 'Product Description Is Required']
    },
    stock: {
      type:Number,

    },
    image:{
        type:String,
        required:[true, 'Product Image Is Required']
    }
});

const Product = mongoose.model('product',ProductSchema);

module.exports = Product;
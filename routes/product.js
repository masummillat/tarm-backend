var express = require('express');
var router = express.Router();
var multer = require('multer')
const mime = require('mime');
var fs = require('fs')

const Product = require('../models/productModel')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads/product')
    },
    filename: (req, file, cb) => {
        console.log(file.mimetype)
        cb(null, file.fieldname + '-' + Date.now()+ '.' + mime.getExtension(file.mimetype))
    }
});
var upload = multer({storage: storage});

//fetching product list

router.get('/',(req,res,next)=>{
    Product.find({}).then((product)=> {
        res.send(product).status(200)
    }).catch(next)
})

//upload image
router.post('/image', upload.single('image'), (req, res, next) => {
    console.log(req.file)

    try {
        var errors = req.validationErrors();
        if (errors) {
            res.send(errors);
            return;
        } else {
            res.send({
                fileName: req.file.filename
            }).status(200);
        }

    } catch (err) {
        res.sendStatus(400);
    }
});

//inserting new product
router.post('/',(req,res,next)=>{

    console.log(req.body)

    var product = new Product(req.body)
    product.save(function(err,product) {
        if (err) {

            if (err.code === 11000) {
                console.log("1st")
                // Duplicate username
                return res.status(500).send({ success: false, message: 'Product already exist!' });
            }

            // Some other error
            console.log("2nd")
            return res.status(500).send(err);
        }
        console.log(product)

        res.send(product).status(200);

    });



})

router.delete('/:id',(req,res,next)=>{
    Product.findByIdAndRemove({_id: req.params.id}, (err, product) => {
        console.log(product)
        if (err) {
            return res.send("Failed").status(200);
        }
        fs.unlink(`./public/images/uploads/product/${product.image}`, (err) => {
            if (err) throw err;

            res.send(product).status(200);
        })
    })
})


//update Category route

router.put('/:id', (req, res, next) => {
    console.log("update called")
    // console.log(req.body)
    Product.findOne({_id: req.params.id})
        .then(product => {
            if (product.image != req.body.image) {
                fs.unlink(`./public/images/uploads/product/${product.image}`, (err) => {
                    if (err) throw err;


                })
            }
            Product.findByIdAndUpdate({_id: req.params.id}, req.body)
                .then((err, product) => {
                    if (err) {
                        res.send(err).status(500)
                    }
                    console.log( "product" + product)
                    console.log("err" + err)
                    res.send(product).status(200)
                })
        })


})

module.exports = router;
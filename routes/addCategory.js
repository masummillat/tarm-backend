var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs')
const mime = require('mime');

const Category = require('../models/categoryModel')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads/category')
    },
    filename: (req, file, cb) => {
        console.log(file.mimetype)
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
});
var upload = multer({storage: storage});

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

//save category, category description and imageName

router.post('/', (req, res, next) => {

    // Category.create(req.body).then((category)=>{
    //     console.log(category)
    //     res.send("Successfully Uploaded !").status(200)
    // })

    var category = new Category(req.body)
    category.save(function (err) {
        if (err) {

            if (err.code === 11000) {
                console.log("1st")
                // Duplicate username
                return res.status(500).send({success: false, message: 'Category already exist!'});
            }

            // Some other error
            console.log("2nd")
            return res.status(500).send(err);
        }

        res.send("Successfully Uploaded").status(200);

    });

})

//Get the category details

router.get('/', (req, res, next) => {

    Category.find({}).then((category) => {
        res.send(category).status(200)
    }).catch(next)


})


//delete category
router.delete('/:id', (req, res, next) => {
    Category.findByIdAndRemove({_id: req.params.id}, (err, category) => {
        if (err) {
            return res.send("Failed").status(200);
        }
        fs.unlink(`./public/images/uploads/category/${category.image}`, (err) => {
            if (err) throw err;

            res.send(category).status(200);
        })
    })


})


//     .then( (category)=>{res.send(category).status(200)})
//     .catch(next)
// console.log("delete")
// console.log(req.params.id);
//update Category route

router.put('/:id', (req, res, next) => {
    console.log("update called")
    console.log(req.body)
    Category.findOne({_id: req.params.id})
        .then(category => {
            if (category.image != req.body.image) {
                fs.unlink(`./public/images/uploads/category/${category.image}`, (err) => {
                    if (err) throw err;


                })
            }
            Category.findByIdAndUpdate({_id: req.params.id}, req.body)
                .then((err, category) => {
                    if (err) {
                        res.send(err).status(500)
                    }
                    res.send(category).status(200)
                })
        })


})


//
// router.post('/', function(req, res, next) {
//
//     // var category = new Category(req.body);
//     // category.save()
//     console.log(req.body)
//     console.log(req.files);
//
//
//     // Category.create(req.body).then(function (category) {
//     //     res.send(category)
//     //     console.log("helo")
//     // })
//
// });

module.exports = router;
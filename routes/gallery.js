var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs')
const mime = require('mime');

const Gallery = require('../models/galleryModel');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads/gallery')
    },
    filename: (req, file, cb) => {
        console.log(file.mimetype)
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
});
var upload = multer({storage: storage});

//upload image
router.post('/', upload.single('image'), (req, res, next) => {
    console.log(req.file)
    console.log(req.body)
    req.body.image= req.file.filename
    console.log(req.body)

    const gallery = new Gallery(req.body);
    gallery.save((err, gallery)=>{
        if(err){
            return res.status(500).send(err);
        }

        res.status(200).send(gallery);
    })

});


router.get('/', (req,res,next)=>{
    Gallery.find({}).then( (gallery)=>{
        res.status(200).send(gallery);

    })
})

router.delete('/:id', (req, res, next)=>{
    // console.log(req.params.id)
    Gallery.findByIdAndRemove({_id: req.params.id}, (err, gallery) => {
        console.log(gallery)
        if (err) {
            return res.send("Failed").status(200);
        }
        fs.unlink(`./public/images/uploads/gallery/${gallery.image}`, (err) => {
            if (err) throw err;

            res.send(gallery).status(200);
        })
    })
})
module.exports = router;
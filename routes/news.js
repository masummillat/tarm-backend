var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs')
const mime = require('mime');

const Gallery = require('../models/galleryModel');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads/news')
    },
    filename: (req, file, cb) => {
        console.log(file.mimetype)
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.getExtension(file.mimetype))
    }
});
var upload = multer({storage: storage});

const News = require('../models/NewsModel');

router.get('/', (req,res,next)=>{

    News.find({}).then( (news)=>{
        res.status(200).send(news);

    })
})


//getting single news by id
router.get('/:id', (req,res,next)=>{
    News.find({_id:req.params.id}).then( (news)=>{
        res.status(200).send(news);

    })
    console.log("id got it ")
})

//inserting single news with body and image
router.post('/', upload.single('image'), (req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    req.body.image= req.file.filename
    console.log(req.body)
    const news = new News(req.body);
    news.save((err, news)=>{
        if(err){
            return res.status(500).send(err);
        }

        res.status(200).send(news);
    })
})

//update news route

router.put('/:id', (req, res, next) => {
    console.log("update called")
    // console.log(req.body)

            News.findByIdAndUpdate({_id: req.params.id}, req.body,  {new: true})
                .then((err, news) => {
                    if (err) {
                        res.send(err).status(500)
                    }
                    res.send(news).status(200)
                })
        })


router.delete('/:id',(req,res,next)=>{
    News.findByIdAndRemove({_id: req.params.id}, (err, news) => {
        console.log(news)
        if (err) {
            return res.send("Failed").status(200);
        }
        res.send(news).status(200);
    })
})



module.exports = router;
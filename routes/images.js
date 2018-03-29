 var multer  = require('multer')
var express = require('express');
var router = express.Router();
console.log("heheh")
var storage = multer.diskStorage({
    destination: '../public/images',
    filename: function (req, file, cb) {
        switch (file.mimetype) {
            case 'image/jpeg':
                ext = '.jpeg';
                break;
            case 'image/png':
                ext = '.png';
                break;
        }
        cb(null, file.originalname + ext);
    }
})
var upload = multer({storage: storage});
router.use(upload.single('photo'));

router.post('/', function (req, res) {

    console.log(JSON.stringify(req.body.photo)) // form fields
    console.log(req.photo) // form files
    console.log(req.file) // form files
    res.send(req.body.photo);
});

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.json([{
//         id: 1,
//         username: "samsepi0l"
//     }, {
//         id: 2,
//         username: "D0loresH4ze"
//     }]);
// });



module.exports = router;
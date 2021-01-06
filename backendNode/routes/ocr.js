const express = require('express')
const tessaract = require('tesseract.js')
const multer = require('multer');

const app = express()

app.use(express.static('public'))
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage })

const router = new express.Router()

router.post('/', upload.single('file'), async (req, res) => {
    console.log(req.file)
    // const createWorker = tessaract.createWorker;
    // const worker = createWorker({
    //     logger: m => console.log(m),
    // });

    // await worker.load();
    // await worker.loadLanguage('eng');
    // await worker.initialize('eng')
    // const { data: { text } } = await worker.recognize(req.file)

    // console.log(text)
    res.send('text')
})


module.exports = router

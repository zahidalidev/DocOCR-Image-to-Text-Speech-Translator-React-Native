const ocr = require('../routes/ocr')
const translate = require('../routes/translate')

module.exports = (app) => {
    app.get("/api/testing", (req, res) => {
        res.send('Hi node')
    })

    app.use('/api/ocr', ocr)
    app.use('/api/translate', translate)
}
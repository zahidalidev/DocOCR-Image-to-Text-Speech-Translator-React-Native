const ocr = require('../routes/ocr')

module.exports = (app) => {
    app.get("/api/testing", (req, res) => {
        res.send('Hi node')
    })

    app.use('/api/ocr', ocr)
}
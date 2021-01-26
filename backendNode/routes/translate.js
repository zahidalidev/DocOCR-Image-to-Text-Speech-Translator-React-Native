const express = require('express')
const translatte = require('translatte');

const router = new express.Router()

router.post('/', async (req, res) => {
    // async/await. Options can be a language name (ISO 639)
    const text = req.body.text
    const langTo = req.body.to;

    translatte(text, { to: langTo }).then(result => {
        res.send(result.text)
    }).catch(err => {
        res.send(err)
    });

})

module.exports = router;
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ origin: true, credentials: true }))

app.use(express.json())

app.set('port', (process.env.PORT || 5000))

require('./startup/routes')(app)


app.listen(app.get('port'), function () {
    console.log(`Listing on port ${app.get('port')}...`)
})


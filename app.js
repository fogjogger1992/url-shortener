// include packages and define server related variables
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const password = require('secure-random-password')
const validUrl = require('valid-url')
const mongoose = require('mongoose')
const urlShortener = require('./models/urlShortener')
const app = express()
const PORT = process.env.PORT || 3000
const standardURL = process.env.Basic_Url || `http://localhost:${PORT}/`

// setting monbDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/urlShortener'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// route
app.get('/', (req, res) => {
  res.render('index')
})

// create inputURL & outputURL
app.post('/shortenURL', (req, res) => {
  const inputURL = req.body.inputURL

  // check if inputURL is valid
  if (!validUrl.isWebUri(inputURL)) {
    return res.render('index', { inputURL, error: 'Invalid Input' })
  }

  // check if inputURL is already existed
  urlShortener.find()
    .lean()
    .then((urlList) => {
      existedInputURL = urlList.find((eachUrl) => eachUrl.inputURL === inputURL)
      // inputURL is already existed, get the existed item
      if (existedInputURL) {
        const outputURL = `http://localhost:${PORT}/${existedInputURL.outputURL}`
        return res.render('index', { inputURL: inputURL, outputURL: outputURL })
      } else {
        // inputURL is not existed, create
        let randomString = password.randomPassword({
          length: 5,
          characters: [password.lower, password.upper, password.digits]
        })

        // check if randomString is already an existed outputURL
        existedOutputURL = urlList.find((eachUrl) => eachUrl.outputURL === randomString)
        if (existedOutputURL !== undefined) {
          while (existedOutputURL.outputURL === randomString) {
            randomString = password.randomPassword({
              length: 5,
              characters: [password.lower, password.upper, password.digits]
            })
          }
        }

        const outputURL = standardURL + randomString

        return urlShortener.create({ inputURL: inputURL, outputURL: randomString })
          .then(() => res.render('index', { inputURL: inputURL, outputURL: outputURL }))
          .catch(error => console.log(error))
      }
    })
})

// redirect
app.get('/:outputURL', (req, res) => {
  const shortenedURL = req.params.outputURL
  urlShortener.find({ outputURL: shortenedURL })
    .lean()
    .then((link) => {
      if (link) {
        res.redirect(link[0].inputURL)
      }
    })
    .catch(error => console.log(error))
})

// port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
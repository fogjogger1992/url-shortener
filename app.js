// include packages and define server related variables
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const password = require('secure-random-password')
const mongoose = require('mongoose')
const urlShortener = require('./models/urlShortener')
const app = express()
const PORT = 3000

// setting monbDB connection
mongoose.connect('mongodb://localhost/url-shortener', { useNewUrlParser: true, useUnifiedTopology: true })
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

  // check if inputURL is already existed
  urlShortener.find()
    .lean()
    .then((urlList) => {
      existedInputURL = urlList.find((eachUrl) => eachUrl.inputURL === inputURL)
      // inputURL is already existed
      if (existedInputURL) {
        const outputURL = `http://localhost:${PORT}/${existedInputURL.outputURL}`
        return res.render('index', { inputURL: inputURL, outputURL: outputURL })
      } else {
        // inputURL is not existed
        const randomString = password.randomPassword({
          length: 5,
          characters: [password.lower, password.upper, password.digits]
        })
        const outputURL = `http://localhost:${PORT}/${randomString}`

        return urlShortener.create({ inputURL: inputURL, outputURL: randomString })
          .then(() => res.render('index', { inputURL: inputURL, outputURL: outputURL }))
          .catch(error => console.log(error))
      }
    })
})

// port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

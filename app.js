// include packages and define server related variables
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
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

// route
app.get('/', (req, res) => {
  res.render('index')
})

// port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

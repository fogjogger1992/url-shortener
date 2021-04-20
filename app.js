// include packages and define server related variables
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const PORT = 3000

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

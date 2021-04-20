// express
const express = require('express')
const app = express()

const PORT = 3000

// route
app.get('/', (req, res) => {
  res.send('hello world')
})

// port
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

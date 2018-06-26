const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')

const app = express()
app.set('view engine', 'html')

nunjucks.configure([path.resolve(__dirname, './views')], {
  autoescape: true,
  express: app,
  watch: true,
  noCache: true,
})

app.use((req, res) => {
  res.render('index.html')
})

app.listen(process.env.PORT || 3000)

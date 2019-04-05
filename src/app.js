require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token')
const errorHandler = require('./error-handler')
const bookmarksRouter = require('./bookmarks/bookmarks-router')




const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))





// helmet before cors
app.use(helmet())
app.use(cors())


//validator middleware before routers
app.use(validateBearerToken)


// routers handle CRUD work 
app.use(bookmarksRouter)





app.get('/', (req, res) => {
       res.send('Hello, world!')
     })

// error Handlers at the bottom //
app.use(errorHandler)     


//gets imported to server.js to listen at PORT
module.exports = app
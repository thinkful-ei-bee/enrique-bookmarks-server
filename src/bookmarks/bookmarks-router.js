


// Configure logging and API key handling middleware on the server
// Write a route handler for the endpoint GET /bookmarks that returns a list of bookmarks
// Write a route handler for the endpoint GET /bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid
// Write a route handler for POST /bookmark that accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation.
// Write a route handler for the endpoint DELETE /bookmarks/:id that deletes the bookmark with the given ID.

const express = require('express')
const uuid = require('uuid/v4')
// const { isWebUri } = require('valid-url')
const logger = require('../logger')
const data = require('../data')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(store.bookmarks)
  })
  .post(bodyParser, (req, res) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send(`'${field}' is required`)
      }
    }
    const { title, url, description, rating } = req.body

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }

    // if (!isWebUri(url)) {
    //   logger.error(`Invalid url '${url}' supplied`)
    //   return res.status(400).send(`'url' must be a valid URL`)
    // }

    const bookmark = { id: uuid(), title, url, description, rating }

    data.bookmarks.push(bookmark)

    logger.info(`Bookmark with id ${bookmark.id} created`)
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark)
  })

bookmarksRouter
  .route('/bookmarks/:bookmark_id')
  .get((req, res) => {
    const { bookmark_id } = req.params

    const bookmark = store.bookmarks.find(c => c.id == bookmark_id)

    if (!bookmark) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    res.json(bookmark)
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params

    const bookmarkIndex = store.bookmarks.findIndex(b => b.id === bookmark_id)

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`)
      return res
        .status(404)
        .send('Bookmark Not Found')
    }

    store.bookmarks.splice(bookmarkIndex, 1)

    logger.info(`Bookmark with id ${bookmark_id} deleted.`)
    res
      .status(204)
      .end()
  })

module.exports = bookmarksRouter

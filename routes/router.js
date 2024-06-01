const express = require('express')
const router = express.Router()
const {home} = require('../controllers/controller')

// api routes
router.get('/api/refresher', home)

module.exports = router
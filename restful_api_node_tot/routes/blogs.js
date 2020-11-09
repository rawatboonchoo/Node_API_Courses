const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')

// localhost:3000/api/blogs/
router.get('/', blogController.index );

module.exports = router;

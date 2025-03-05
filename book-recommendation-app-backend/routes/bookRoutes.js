const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/books/:bookId', bookController.getBookDetails);
router.put('/books/:bookId/user-data', verifyToken, bookController.updateUserData);
router.get('/books/:bookId/user-data', verifyToken, bookController.getUserData);

module.exports = router;
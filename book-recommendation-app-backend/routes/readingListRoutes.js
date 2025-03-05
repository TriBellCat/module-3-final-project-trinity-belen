const express = require('express');
const router = express.Router();
const readingListController = require('../controllers/readingListController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/readinglists', verifyToken, readingListController.getReadingLists);
router.post('/readinglists', verifyToken, readingListController.createReadingList);
router.put('/readinglists/:readingListId', verifyToken, readingListController.updateReadingList);
router.delete('/readinglists/:readingListId', verifyToken, readingListController.deleteReadingList);
router.get('/readinglists/:readingListId/books', verifyToken, readingListController.getBooksInReadingList);
router.post('/readinglists/:readingListId/books', verifyToken, readingListController.addBookToReadingList);
router.delete('/readinglists/:readingListId/books/:bookId', verifyToken, readingListController.deleteBookFromReadingList);

module.exports = router;
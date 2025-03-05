const axios = require('axios');
const pool = require('../config/db');  
const { handleAsyncError } = require('../utils/errorHandler');

const getReadingLists = handleAsyncError(async (req, res) => {
    const userId = req.user.userId;

    const [readingLists] = await pool.query(
        'SELECT reading_list_id, list_name FROM reading_lists WHERE user_id = ?',
        [userId]
    );

    res.json(readingLists);
});

const createReadingList = handleAsyncError(async (req, res) => {
    const { list_name } = req.body;
    const userId = req.user.userId;

    const [result] = await pool.query(
        'INSERT INTO reading_lists (user_id, list_name) VALUES (?, ?)',
        [userId, list_name]
    );

    const newReadingListId = result.insertId;

    const [[newReadingList]] = await pool.query(
        'SELECT reading_list_id, list_name FROM reading_lists WHERE reading_list_id = ?',
        [newReadingListId]
    );

    res.status(201).json(newReadingList);
});

const updateReadingList = handleAsyncError(async (req, res) => {
    const { readingListId } = req.params;
    const { list_name } = req.body;
    const userId = req.user.userId;

    const [result] = await pool.query(
        'UPDATE reading_lists SET list_name = ? WHERE reading_list_id = ? AND user_id = ?',
        [list_name, readingListId, userId]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reading list not found or does not belong to user', success: false });
    }

    const [[updatedReadingList]] = await pool.query(
        'SELECT reading_list_id, list_name FROM reading_lists WHERE reading_list_id = ?',
        [readingListId]
    );

    res.json(updatedReadingList);
});

const deleteReadingList = handleAsyncError(async (req, res) => {
    const { readingListId } = req.params;
    const userId = req.user.userId;

    const [result] = await pool.query(
        'DELETE FROM reading_lists WHERE reading_list_id = ? AND user_id = ?',
        [readingListId, userId]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Reading list not found or does not belong to user', success: false });
    }

    res.json({ message: 'Reading list is successfully deleted', success: true });
});

const getBooksInReadingList = handleAsyncError(async (req, res) => {
    const { readingListId } = req.params;
    const userId = req.user.userId;

    const [readingList] = await pool.query(
        'SELECT * FROM reading_lists WHERE reading_list_id = ? AND user_id = ?',
        [readingListId, userId]
    );

    if (!readingList || readingList.length === 0) {
        return res.status(404).json({ message: 'Reading list not found or does not belong to user', success: false });
    }

    const [books] = await pool.query(
        `SELECT b.book_id, b.book_data
         FROM books_in_reading_list bir 
         JOIN books b ON bir.book_id = b.book_id
         WHERE bir.reading_list_id = ?`,
        [readingListId]
    );

    const parsedBooks = books.map(book => ({
        ...book,
        book_data: book.book_data
    }));

    res.json(parsedBooks);
});

const addBookToReadingList = handleAsyncError(async (req, res) => {
    const { readingListId } = req.params;
    const { book_id } = req.body;
    const userId = req.user.userId;

    const [readingList] = await pool.query(
        'SELECT * FROM reading_lists WHERE reading_list_id = ? AND user_id = ?',
        [readingListId, userId]
    );

    if (!readingList || readingList.length === 0) {
        return res.status(404).json({ message: 'Reading list not found or does not belong to user', success: false });
    }

    const [existingBook] = await pool.query(
        'SELECT book_data FROM books WHERE book_id = ?',
        [book_id]
    );

    if (existingBook.length === 0) {
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${book_id}?key=${process.env.VITE_Api_Key}`);

            const bookData = response.data;

            if (!bookData) {
                return res.status(404).json({ message: 'Book not found in Google Books API', success: false });
            }

            const stringifiedBookData = JSON.stringify(bookData);

            await pool.query(
                'INSERT INTO books (book_id, book_data) VALUES (?, ?)',
                [book_id, stringifiedBookData]
            );
        } catch (err) {
            console.error('Error adding book to reading list:', err);
            return res.status(500).json({ message: 'Error adding book to reading list', success: false });
        }
    }

    const [bookInList] = await pool.query(
        'SELECT * FROM books_in_reading_list WHERE reading_list_id = ? AND book_id = ?',
        [readingListId, book_id]
    );

    if (bookInList.length > 0) {
        return res.status(409).json({ message: 'Book already in reading list', success: false });
    }

    await pool.query(
        'INSERT INTO books_in_reading_list (reading_list_id, book_id) VALUES (?, ?)',
        [readingListId, book_id]
    );

    res.status(201).json({ message: 'Book added to reading list successfully', success: true });
});

const deleteBookFromReadingList = handleAsyncError(async (req, res) => {
    const { readingListId, bookId } = req.params;
    const userId = req.user.userId;

    const [readingList] = await pool.query(
        'SELECT * FROM reading_lists WHERE reading_list_id = ? AND user_id = ?',
        [readingListId, userId]
    );

    if (!readingList || readingList.length === 0) {
        return res.status(404).json({ message: 'Reading list not found or does not belong to user', success: false });
    }

    const [result] = await pool.query(
        'DELETE FROM books_in_reading_list WHERE reading_list_id = ? AND book_id = ?',
        [readingListId, bookId]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Book not found in reading list', success: false });
    }

    res.json({ message: 'Book deleted from reading list successfully', success: true });
});

module.exports = {
    getReadingLists,
    createReadingList,
    updateReadingList,
    deleteReadingList,
    getBooksInReadingList,
    addBookToReadingList,
    deleteBookFromReadingList,
};

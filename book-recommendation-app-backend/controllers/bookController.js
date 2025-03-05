const axios = require('axios');
const pool = require('../config/db');
const { handleAsyncError } = require('../utils/errorHandler');

//Get book details through Google Books
const getBookDetails = handleAsyncError(async (req, res) => {
    const { bookId } = req.params;
    const MY_KEY = process.env.VITE_Api_Key;

    const [existingBook] = await pool.query(
        'SELECT * FROM books WHERE book_id = ?',
        [bookId]
    );

    //Parse the book_data JSON string back into a JavaScript object
    if (existingBook.length > 0) {
        res.json(JSON.parse(existingBook[0].book_data));
    }
    //If book not found in the database, fetch from Google Books API
    else {
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${MY_KEY}`);
            const bookData = response.data;

            if (!bookData) {
                return res.status(404).json({ message: 'Book not found in Google Books API', success: false });
            }

            const stringifiedBookData = JSON.stringify(bookData);

            await pool.query(
                'INSERT INTO books (book_id, book_data) VALUES (?, ?)',
                [bookId, stringifiedBookData]
            );

            res.json(bookData);
        } catch (googleBooksErr) {
            console.error('Error fetching book from Google Books API:', googleBooksErr);
            return res.status(500).json({ message: 'Error fetching book from Google Books API', success: false });
        }
    }
});

//Updates user-specific book data
const updateUserData = handleAsyncError(async (req, res) => {
    const { bookId } = req.params;
    const { progress, review_score } = req.body;
    const userId = req.user.userId;

    const [existingBookInBooks] = await pool.query(
        'SELECT book_id FROM books WHERE book_id = ?',
        [bookId]
    );

    if (existingBookInBooks.length === 0) {
        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.VITE_Api_Key}`);
            const bookData = response.data;

            if (!bookData) {
                return res.status(404).json({ message: 'Book not found in Google Books API', success: false });
            }

            const stringifiedBookData = JSON.stringify(bookData);

            await pool.query(
                'INSERT INTO books (book_id, book_data) VALUES (?, ?)',
                [bookId, stringifiedBookData]
            );
        } catch (googleBooksErr) {
            console.error('Error fetching book from Google Books API:', googleBooksErr);
            return res.status(500).json({ message: 'Error fetching book from Google Books API', success: false });
        }
    }

    let updateFields = [];
    let updateValues = [];

    if (progress) {
        updateFields.push('progress = ?');
        updateValues.push(progress);
    }

    if (review_score) {
        updateFields.push('review_score = ?');
        updateValues.push(review_score);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No fields to update', success: false });
    }

    const [existingBook] = await pool.query(
        'SELECT * FROM user_books WHERE user_id = ? AND book_id = ?',
        [userId, bookId]
    );

    let query;

    if (existingBook.length === 0) {
        query = `
            INSERT INTO user_books (user_id, book_id, progress, review_score)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(query, [userId, bookId, progress || 'Not Started', review_score || 0]);
    }

    else {

        const updateQuery = `UPDATE user_books SET ${updateFields.join(', ')} WHERE user_id = ? AND book_id = ?`;
        updateValues.push(userId, bookId);

        await pool.query(updateQuery, updateValues);
    }

    res.json({ message: 'Book data updated successfully', success: true });
});

//Gets user-specific book data
const getUserData = handleAsyncError(async (req, res) => {
    const { bookId } = req.params;
    const userId = req.user.userId;

    const [existingBook] = await pool.query(
        'SELECT progress, review_score FROM user_books WHERE user_id = ? AND book_id = ?',
        [userId, bookId]
    );

    if (existingBook.length > 0) {
        res.json(existingBook[0]);
    } else {
        res.json({ progress: 'Not Started', review_score: 0 });
    }
});

module.exports = {
    getBookDetails,
    updateUserData,
    getUserData,
};

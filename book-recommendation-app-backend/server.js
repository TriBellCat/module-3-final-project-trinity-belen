const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

//CORS options configuration
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

//Use CORS and body-parser middleware
app.use(cors(corsOptions));
app.use(bodyParser.json()); //Parse JSON request bodies

//Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided', success: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; //Attach user info to request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', success: false });
    }
};

/* Endpoints for User Authentication */

//User Registration
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password and email are required', success: false });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [existingUser] = await pool.query(
            'SELECT * FROM user WHERE user_name = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Username or email already taken', success: false });
        }

        const [result] = await pool.query(
            'INSERT INTO user (user_name, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );

        //Generates JWT token for new user
        const jwtEncodedUser = jwt.sign(
            { userId: result.insertId, username: username },
            process.env.JWT_KEY,
            //{ expiresIn: '1h' } //Token expires in 1 hour, can be adjusted
        );

        res.status(201).json({ jwt: jwtEncodedUser, userId: result.insertId, username: username, success: true, message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ err: 'Error registering user', success: false });
    }
});

//User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required', success: false });
    }

    try {
        const [[user]] = await pool.query(
            'SELECT * FROM user WHERE user_name = ?',
            [username]
        );

        if (!user) {
            return res.status(404).json({ message: 'Invalid username or password', success: false });
        }

        //Compares password that user inputted with stored hashed password
        const passwordMatches = await bcrypt.compare(password, user.password);

        if (passwordMatches) {
            const payload = { userId: user.id, username: user.user_name };
            const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY);

            res.json({ jwt: jwtEncodedUser, userId: user.id, username: user.user_name, success: true, message: 'Login successful' });
        }
        else {
            res.status(401).json({ message: 'Invalid username or password', success: false });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ err: 'Error during login', success: false });
    }
});

//Get current user's profile
app.get('/user', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [[userProfile]] = await pool.query(
            'SELECT id, user_name, email FROM user WHERE id = ?', //Selects only safe fields
            [userId]
        );

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        res.json({ user: userProfile, success: true }); //Returns user profile data
    } catch (err) {
        console.error('Error getting user profile:', err);
        res.status(500).json({ err: 'Error getting user profile', success: false });
    }
});

//Delete user's account
app.delete('/delete-account', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [result] = await pool.query(
            'DELETE FROM user WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or already deleted', success: false });
        }

        res.json({ message: 'Account deleted successfully', success: true });
    } catch (err) {
        console.error('Error deleting user account:', err);
        res.status(500).json({ err: 'Error deleting user account', success: false });
    }
});

/* Endpoints for Books */

//Get book details through Google Books
app.get('/books/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const MY_KEY = process.env.VITE_Api_Key;

    try {
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

                //Stringify bookData before saving to the database
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
    } catch (err) {
        console.error('Error getting book details:', err);
        res.status(500).json({ err: 'Error getting book details', success: false });
    }
});

/* Endpoints for Reading List */

//Get all reading lists for the logged-in user
app.get('/readinglists', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [readingLists] = await pool.query(
            'SELECT reading_list_id, list_name FROM reading_lists WHERE user_id = ?',
            [userId]
        );

        res.json(readingLists);
    } catch (err) {
        console.error('Error getting reading lists:', err);
        res.status(500).json({ err: 'Error getting reading lists', success: false });
    }
});

//Create a new reading list
app.post('/readinglists', verifyToken, async (req, res) => {
    const { list_name } = req.body;
    const userId = req.user.userId;

    try {
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
    } catch (err) {
        console.error('Error creating reading list:', err);
        res.status(500).json({ err: 'Error creating reading list', success: false });
    }
});

//Update a reading list's name
app.put('/readinglists/:readingListId', verifyToken, async (req, res) => {
    const { readingListId } = req.params;
    const { list_name } = req.body;
    const userId = req.user.userId;

    try {
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
    } catch (err) {
        console.error('Error updating reading list:', err);
        res.status(500).json({ err: 'Error updating reading list', success: false });
    }
});

//Delete a reading list
app.delete('/readinglists/:readingListId', verifyToken, async (req, res) => {
    const { readingListId } = req.params;
    const userId = req.user.userId;

    try {
        const [result] = await pool.query(
            'DELETE FROM reading_lists WHERE reading_list_id = ? AND user_id = ?',
            [readingListId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reading list not found or does not belong to user', success: false });
        }

        res.json({ message: 'Reading list is successfully deleted', success: true });
    }
    catch (err) {
        console.error('Error deleting reading list:', err);
        res.status(500).json({ err: 'Error deleting reading list', success: false });
    }
});

/* Endpoints for Books In Reading List */

//Get books from a specific reading list
app.get('/readinglists/:readingListId/books', verifyToken, async (req, res) => {
    const { readingListId } = req.params;
    const userId = req.user.userId;

    try {
        //Verifies that the reading list belongs to the user
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
    }
    catch (err) {
        console.error('Error getting books from reading list:', err);
        res.status(500).json({ err: 'Error getting books from reading list', success: false });
    }
});

//Adds book to reading list
app.post('/readinglists/:readingListId/books', verifyToken, async (req, res) => {
    const { readingListId } = req.params;
    const { book_id } = req.body;
    const userId = req.user.userId;

    try {
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

        //Checks if the book is already in the reading list
        const [bookInList] = await pool.query(
            'SELECT * FROM books_in_reading_list WHERE reading_list_id = ? AND book_id = ?',
            [readingListId, book_id]
        );

        if (bookInList.length > 0) {
            return res.status(409).json({ message: 'Book already in reading list', success: false });
        }

        //Add the book to the reading list
        await pool.query(
            'INSERT INTO books_in_reading_list (reading_list_id, book_id) VALUES (?, ?)',
            [readingListId, book_id]
        );

        res.status(201).json({ message: 'Book added to reading list successfully', success: true });
    } catch (err) {
        console.error('Error adding book to reading list:', err);
        res.status(500).json({ err: 'Error adding book to reading list', success: false });
    }
});

//Deletes a book from a reading list
app.delete('/readinglists/:readingListId/books/:bookId', verifyToken, async (req, res) => {
    const { readingListId, bookId } = req.params;
    const userId = req.user.userId;

    try {
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
    } catch (err) {
        console.error('Error deleting book from reading list:', err);
        res.status(500).json({ err: 'Error deleting book from reading list', success: false });
    }
});

/* Endpoints for User-Specific Book Data */

//Updates user-specific book data
app.put('/books/:bookId/user-data', verifyToken, async (req, res) => {
    const { bookId } = req.params;
    const { progress, review_score } = req.body;
    const userId = req.user.userId;

    try {
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
    } catch (err) {
        console.error('Error updating book data:', err);
        res.status(500).json({ err: 'Error updating book data', success: false });
    }
});

//Gets user-specific book data
app.get('/books/:bookId/user-data', verifyToken, async (req, res) => {
    const { bookId } = req.params;
    const userId = req.user.userId;

    try {
        const [existingBook] = await pool.query(
            'SELECT progress, review_score FROM user_books WHERE user_id = ? AND book_id = ?',
            [userId, bookId]
        );

        if (existingBook.length > 0) {
            res.json(existingBook[0]);
        } else {
            res.json({ progress: 'Not Started', review_score: 0 });
        }
    } catch (err) {
        console.error('Error getting book data:', err);
        res.status(500).json({ err: 'Error getting book data', success: false });
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
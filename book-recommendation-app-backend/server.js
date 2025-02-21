const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); //Parse JSON request bodies in order to handle POST requests with JSON Data

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
    } 
    catch (error) {
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

        const jwtEncodedUser = jwt.sign(
            { userId: result.insertId, username: username },
            process.env.JWT_KEY,
            { expiresIn: '1h' } //Token expires in 1 hour, can be adjusted
        );

        res.status(201).json({ jwt: jwtEncodedUser, userId: result.insertId, username: username, success: true, message: 'User registered successfully' }); 
    } 
    catch (err) {
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

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (passwordMatches) {
            const payload = { userId: user.id, username: user.user_name }; 
            const jwtEncodedUser = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

            res.json({ jwt: jwtEncodedUser, userId: user.id, username: user.user_name, success: true, message: 'Login successful' }); 
        }
        else {
            res.status(401).json({ message: 'Invalid username or password', success: false });
        }
    } 
    catch (err) {
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
    } 
    catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ err: 'Error fetching user profile', success: false });
    }
});

//Delete user's account
app.delete('/delete-account', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId; 

        //Delete the user from the database
        const [result] = await pool.query(
            'DELETE FROM user WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or already deleted', success: false });
        }

        res.json({ message: 'Account deleted successfully', success: true });
    }
    catch (err) {
        console.error('Error deleting user account:', err);
        res.status(500).json({ err: 'Error deleting user account', success: false });
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
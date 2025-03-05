const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { handleAsyncError } = require('../utils/errorHandler');

//User Registration
const register = handleAsyncError(async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password and email are required', success: false });
    }

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
});

//User Login
const login = handleAsyncError(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required', success: false });
    }

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
});

//Get current user's profile
const getUser = handleAsyncError(async (req, res) => {
    const userId = req.user.userId;

    const [[userProfile]] = await pool.query(
        'SELECT id, user_name, email FROM user WHERE id = ?', //Selects only safe fields
        [userId]
    );

    if (!userProfile) {
        return res.status(404).json({ message: 'User not found', success: false });
    }

    res.json({ user: userProfile, success: true }); //Returns user profile data
});

//Delete user's account
const deleteAccount = handleAsyncError(async (req, res) => {
    const userId = req.user.userId;

    const [result] = await pool.query(
        'DELETE FROM user WHERE id = ?',
        [userId]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found or already deleted', success: false });
    }

    res.json({ message: 'Account deleted successfully', success: true });
});

module.exports = {
    register,
    login,
    getUser,
    deleteAccount,
};
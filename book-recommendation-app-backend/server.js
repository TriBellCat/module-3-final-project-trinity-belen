const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const readingListRoutes = require('./routes/readingListRoutes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();
const port = process.env.PORT || 3001;

//CORS options configuration
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

//Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json()); //Parse JSON request bodies

// Routes
app.use(authRoutes);
app.use(bookRoutes);
app.use(readingListRoutes);

//Centralized error handling
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
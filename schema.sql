CREATE DATABASE DATABASE_NAME;
USE DATABASE_NAME;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE reading_lists (
    reading_list_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    list_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE books (
    book_id VARCHAR(255) PRIMARY KEY,
    book_data JSON
);

CREATE TABLE books_in_reading_list (
    reading_list_id INT,
    book_id VARCHAR(255),
    PRIMARY KEY (reading_list_id, book_id),
    FOREIGN KEY (reading_list_id) REFERENCES reading_lists(reading_list_id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

CREATE TABLE user_books (
    user_id INT,
    book_id VARCHAR(255),
    progress VARCHAR(255) DEFAULT 'Not Started',
    review_score INT DEFAULT 0,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
);

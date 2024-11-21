/* eslint-disable react/prop-types */

import React from 'react';

function BookInfo({ book }) {
  //Stores user progress and review score
  const [selectedProgress, setSelectedProgress] = React.useState(book.progress || 'Not Started');
  const [reviewScore, setReviewScore] = React.useState(book.review || 0); 

  const reviewStars = [1, 2, 3, 4, 5];

  //For dropdown changes
  //To save progress with the book title and ID as reference
  const handleProgressChange = (event) => {
    setSelectedProgress(event.target.value);
    localStorage.setItem(book.id, JSON.stringify({ title: book.volumeInfo?.title, progress: event.target.value }));
  }

  //For when the user clicks on the star
  //To save review with the book title and ID as reference
  const handleScoreClick = (score) => {
    setReviewScore(score);
    localStorage.setItem(`${book.id}-review`, JSON.stringify({ title: book.volumeInfo?.title, review: score }));
  };

  return (
    <div className="book-info-container">
      <div className="book-details">
        {/* Book Information */}
        <h2>{book.volumeInfo?.title || book.title}</h2>
        <img
          src={book.volumeInfo?.imageLinks?.thumbnail || 'assets/default-thumbnail.png'}
          alt={book.volumeInfo?.title || book.title}
        />
        <p>Author: {book.volumeInfo?.authors?.join(', ') || 'Unknown'}</p>
        <p>Category: {book.volumeInfo?.categories?.join(', ') || 'Uncategorized'}</p>
        <p>Publisher: {book.volumeInfo?.publisher || 'Unknown'}</p>
        <p>Published Date: {book.volumeInfo?.publishedDate || 'Unknown'}</p>

        {/* Display stars for review */}
        {
          reviewStars.map(
            (star) => (
              <span
                key={star}
                onClick={() => handleScoreClick(star)}
                style={{ cursor: 'pointer', color: star <= reviewScore ? 'gold' : 'gray' }}
              >
                ★
              </span>
            )
          )
        }
        <p>Review: {reviewScore} stars</p>

        {/* Dropdown menu for user progress */}
        <select
          value={selectedProgress}
          onChange={handleProgressChange}
        >
          {['Not Started', 'In Progress', 'Finished'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* For the right side of the page */}
      <div className="book-synopsis">
        <h2>Synopsis</h2>
        <p>{book.volumeInfo?.description || 'No description available.'}</p>
      </div>
    </div>
  );
};

export default BookInfo;

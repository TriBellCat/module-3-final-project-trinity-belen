/* eslint-disable react/prop-types */

import React from 'react';

function BookInfo({ book }) {

  const reviewStars = [1, 2, 3, 4, 5];

  /* States */ 
  const [selectedProgress, setSelectedProgress] = React.useState(book.progress || 'Not Started'); //To stores user's progress
  const [reviewScore, setReviewScore] = React.useState(book.review || 0);                         //To stores user's review score

  //Handles changes in the dropdown menu for progress
  const handleProgressChange = (event) => {
    setSelectedProgress(event.target.value); //Sets progress with the one that the user selected

    //Saves book info to local storage when progress changes 
    localStorage.setItem(book.id, JSON.stringify({
      //Checks for book's info/properties from API first
      //Falls back to the one from local storage (for the HomePage View Details button) if that's not possible
      title: book.volumeInfo?.title || book.title,
      authors: book.volumeInfo?.authors || book.authors,
      categories: book.volumeInfo?.categories || book.categories,
      publisher: book.volumeInfo?.publisher || book.publisher,
      publishedDate: book.volumeInfo?.publishedDate || book.publishedDate,
      description: book.volumeInfo?.description || book.description,
      imageLinks: book.volumeInfo?.imageLinks.thumbnail || book.imageLinks,

      progress: event.target.value
    }));
  }

  //Handles the changes in user review score click
  const handleScoreClick = (score) => {
    setReviewScore(score);
    localStorage.setItem(`${book.id}-review`, JSON.stringify({
      review: score
    }));
  };

  return (
    <div className="book-info-container">
      <div className="book-details">
        {/* Book Information */}
        <h2>{book.volumeInfo?.title || book.title}</h2>
        <img
          src={
            book.volumeInfo?.imageLinks?.thumbnail ||
            book.imageLinks?.thumbnail ||
            'assets/default-thumbnail.png'
          }
          alt={book.volumeInfo?.title || book.title || 'Book cover'}
        />
        <p>Author: {book.volumeInfo?.authors?.join(', ') || book.authors || 'Unknown'}</p>
        <p>Category: {book.volumeInfo?.categories?.join(', ') || book.categories || 'Uncategorized'}</p>
        <p>Publisher: {book.volumeInfo?.publisher || book.publisher || 'Unknown'}</p>
        <p>Published Date: {book.volumeInfo?.publishedDate || book.publishedDate || 'Unknown'}</p>

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
        <p>{book.volumeInfo?.description || book.description || 'No description available.'}</p>
      </div>
    </div>
  );
};

export default BookInfo;

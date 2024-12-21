/* eslint-disable react/prop-types */

import React from 'react';

function BookInfo({ book, changeList }) {
  /* States */
  const [selectedProgress, setSelectedProgress] = React.useState(book.progress || 'Not Started');
  const [reviewScore, setReviewScore] = React.useState(book.review || 0);
  const [selectedList, setSelectedList] = React.useState("");

  const reviewStars = [1, 2, 3, 4, 5];

  /* Functions for Reading Lists Buttons */
  const addToListButton = () => {
    if (!selectedList) {
      alert("Please select a reading list.");
      return;
    }
    changeList?.(selectedList, book, 'add');
  };

  const removeFromListButton = () => {
    if (!selectedList) {
      alert("Please select a reading list.");
      return;
    }
    changeList?.(selectedList, book, 'remove');
  };

  /* Functions for Saving User Input */
  //Sets and saves changes in the dropdown menu for progress with the selected one
  const saveUserProgress = (event) => {
    setSelectedProgress(event.target.value);

    const bookData = JSON.parse(localStorage.getItem(book.id)) || {};
    bookData.progress = event.target.value;
    localStorage.setItem(book.id, JSON.stringify(bookData));
  }

  //Sets and saves the changes in user review score when the user clicks on the stars
  const saveUserScoreClick = (score) => {
    setReviewScore(score);

    const bookData = JSON.parse(localStorage.getItem(book.id)) || {};
    bookData.review = score;
    localStorage.setItem(book.id, JSON.stringify(bookData));
  };

  //Loads saved progress and review score from localStorage when the component renders for the first time
  React.useEffect(() => {
    const bookData = JSON.parse(localStorage.getItem(book.id)) || {};
    setSelectedProgress(bookData.progress || 'Not Started');
    setReviewScore(bookData.review || 0);
  }, [book.id]);

  return (
    <div className="book-info-container">
      <div className="book-details">
        {/* Book Information */}
        <h2>{book.volumeInfo?.title} {book.volumeInfo?.subtitle}</h2>
        <img
          src={book.volumeInfo?.imageLinks?.thumbnail}
          alt={book.volumeInfo?.title || 'Book cover'}
        />
        <p>Author: {book.volumeInfo?.authors?.join(', ') || 'Unknown'}</p>
        <p>Category: {book.volumeInfo?.categories?.join(', ') || 'Uncategorized'}</p>
        <p>Publisher: {book.volumeInfo?.publisher || 'Unknown'}</p>
        <p>Published Date: {book.volumeInfo?.publishedDate || 'Unknown'}</p>
        <p>Page Count: {book.volumeInfo?.pageCount || 'Unknown'}</p>

        {/* A way to click stars and save review score */}
        {
          reviewStars.map(
            (star) => (
              <span
                key={star}
                onClick={() => saveUserScoreClick(star)}
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
          onChange={saveUserProgress}
        >
          <option value="" disabled>
            Reading Progress
          </option>
          {['Not Started', 'In Progress', 'Finished'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>


        <div>
          {/* Add and Remove from Reading List Dropdown Menu */}
          <select onChange={(e) => setSelectedList(e.target.value)} value={selectedList}>
            <option value="" disabled>
              Select Reading List
            </option>
            {Object.keys(localStorage.getItem("readingLists") ? JSON.parse(localStorage.getItem("readingLists")) : {}).map(
              (listName, index) => (
                <option key={index} value={listName}>
                  {listName}
                </option>
              )
            )}
          </select>
          <div className="book-details-buttons">
            <button onClick={addToListButton}>Add</button>
            <button onClick={removeFromListButton}>Remove</button>

            {/* Only renders the buy button if it's available*/}
            {book.saleInfo?.buyLink && (
              <a href={book.saleInfo.buyLink} target="_blank" rel="noopener noreferrer">
                <button className="buy-button">Buy</button>
              </a>
            )}
          </div>
        </div>
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

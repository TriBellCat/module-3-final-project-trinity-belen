/* eslint-disable react/prop-types */

import React from 'react';

function BookInfo({ book, changeList }) {

  const reviewStars = [1, 2, 3, 4, 5];

  /* States */
  const [selectedProgress, setSelectedProgress] = React.useState(book.progress || 'Not Started'); //To stores user's progress
  const [reviewScore, setReviewScore] = React.useState(book.review || 0);                         //To stores user's review score
  const [selectedList, setSelectedList] = React.useState("");

  //Adds a book when user presses the button
  const addToListButton = () => {
    if (!selectedList) {
      alert("Please select a reading list.");
      return;
    }

    changeList?.(selectedList, book, 'add');
  };

  //Removes book from list when user presses the button button
  const removeFromListButton = () => {
    if (!selectedList) {
      alert("Please select a reading list.");
      return;
    }

    changeList?.(selectedList, book, 'remove');
  };

  //Saves changes in the dropdown menu for progress
  const saveUserProgress = (event) => {
    setSelectedProgress(event.target.value); //Sets progress with the one that the user selected
    localStorage.setItem(book.id, JSON.stringify({
      //Information saved for when the home page checks for book's info/properties from API first
      //Which will fall back to the one from local storage (for the HomePage View Details button) if that's not possible
      /*
      title: book.volumeInfo?.title || book.title,
      authors: book.volumeInfo?.authors || book.authors,
      categories: book.volumeInfo?.categories || book.categories,
      publisher: book.volumeInfo?.publisher || book.publisher,
      publishedDate: book.volumeInfo?.publishedDate || book.publishedDate,
      description: book.volumeInfo?.description || book.description,
      imageLinks: book.volumeInfo?.imageLinks.thumbnail || book.imageLinks,
      */
      progress: event.target.value
    }));
  }

  //Sets and saves the changes in user review score when the user clicks on the stars
  const saveUserScoreClick = (score) => {
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
          {['Not Started', 'In Progress', 'Finished'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Add and Remove from Reading List UI */}
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
        <button onClick={addToListButton}>Add to Reading List</button>
        <button onClick={removeFromListButton}>Remove from Reading List</button>
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

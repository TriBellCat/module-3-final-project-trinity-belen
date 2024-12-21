/* eslint-disable react/prop-types */

import React from 'react';

function HomePage({ onBookSelect, selectedReadingList, changeList }) {
  /* States */
  const [booksInList, setBooksInList] = React.useState([]);

  //Load books from the selected reading list from the local storage
  React.useEffect(() => {
    const readingLists = JSON.parse(localStorage.getItem('readingLists')) || {};
    const books = readingLists[selectedReadingList] || [];

    //Goes over each book to retrieve and add in the stored additional information
    const bookInformation = books.map((book) => {
      const savedData = JSON.parse(localStorage.getItem(book.id)) || {};
      return {
        ...book,
        progress: savedData.progress || 'Not Started',
        review: savedData.review || 0,
      };
    });

    setBooksInList(bookInformation);
  }, [selectedReadingList]);

  const removeFromListButton = (book) => {
    changeList?.(selectedReadingList, book, 'remove');
  };

  return (
    //Renders books in selected reading lsit
    <div className="home-page-books">
      {booksInList.map((book) => (
        <div key={book.id}>
          <h2>{book.volumeInfo?.title}</h2>
          <h3>Author: {book.volumeInfo?.authors}</h3>
          <p>Publisher: {book.volumeInfo?.publisher || 'Unknown'}</p>
          <img
            src={book.volumeInfo?.imageLinks?.thumbnail}
            alt={book.volumeInfo?.title}
          />
          <p>Progress: {book.progress}</p>
          <p>Review: {book.review} stars</p>

          <div className="book-details-buttons">
            <button onClick={() => onBookSelect(book)}>View Details</button>
            <button onClick={() => removeFromListButton(book)}>Remove</button>
            {book.saleInfo?.buyLink && (
              <a href={book.saleInfo.buyLink} target="_blank" rel="noopener noreferrer">
                <button className="buy-button">Buy Book</button>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default HomePage;

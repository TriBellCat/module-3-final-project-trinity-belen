/* eslint-disable react/prop-types */

import React from 'react';

function HomePage({ onBookSelect }) {
  /* States */
  const [filteredBooks, setFilteredBooks] = React.useState([]); //To store the filtered books based on progress

  //Checks if the value is valid before attempting to parse, returns raw string if parsing fails
  const safeJSONParse = (str) => {
    try {
      return JSON.parse(str);
    }
    catch {
      return str;             
    }
  };

  //Removes a book from localStorage and then updating the filteredBooks state
  const removeBookFromData = (bookId) => {
    localStorage.removeItem(bookId);
    localStorage.removeItem(`${bookId}-review`);

    setFilteredBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
  };

  React.useEffect(() => {
    const fetchBooksByProgress = () => {
      const books = [];

      //Loops through the local storage for user review and progress
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);                                //Gets the key from localStorage
        const storedData = safeJSONParse(localStorage.getItem(key));    //Parses the stored data

        //Checks if the book is either 'In Progress' or 'Finished'
        if (storedData?.progress === 'In Progress' || storedData?.progress === 'Finished') {
          //Get the review scores, default to 0 if not available
          const reviewData = safeJSONParse(localStorage.getItem(`${key}-review`)) || { review: 0 };

          //Processes and stores book information to the books array
          books.push({
            id: key,
            ...storedData,
            covers: storedData.imageLinks?.thumbnail || 'assets/default-thumbnail.png',
            progress: storedData.progress,  
            review: reviewData.review,
          });
          console.log('Book covers:', books.covers);
        }
      }

      setFilteredBooks(books);  //Updates state with the filtered books
    };

    fetchBooksByProgress();
  }, []);

  return (
    //Renders books that are in progress or finished
    <div className="home-page">
      {filteredBooks.map((book) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <h3>Author: {book.authors}</h3>
          <p>Publisher: {book.publisher|| 'Unknown'}</p>
          <img
            src={book.covers || 'assets/default-thumbnail.png'}
            alt={book.title}
          />
          <p>Progress: {book.progress}</p>
          <p>Review: {book.review} stars</p>

          <button onClick={() => removeBookFromData(book.id)}>Remove</button>
          <button onClick={() => onBookSelect(book)}>View Details</button>
        </div>
      ))}
    </div>
  );
}
export default HomePage;

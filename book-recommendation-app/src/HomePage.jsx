/* eslint-disable react/prop-types */

import React from 'react';

function HomePage({ onBookSelect }) {
  const [filteredBooks, setFilteredBooks] = React.useState([]); //Stores the filtered books based on progress

  //Checks if the value is valid before attempting to parse 
  const safeJSONParse = (str) => {
    try {
      return JSON.parse(str);
    }
    catch {
      return str;             //Returns raw string if parsing fails
    }
  };

  //Removes a book from localStorage and update the filteredBooks state
  const handleRemoveBook = (bookId) => {
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

          //Adds book to the array with its title, progress, and review
          books.push({
            id: key,
            title: storedData.title || key,
            progress: storedData.progress,
            review: reviewData.review,
          });
        }
      }

      setFilteredBooks(books);  //Updates state with the filtered books
    };

    fetchBooksByProgress();
  }, []);

  return (
    <div className="home-page">
      {filteredBooks.map((book) => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>Progress: {book.progress}</p>
          <p>Review: {book.review} stars</p>
          
          <button onClick={() => handleRemoveBook(book.id)}>Remove</button>
          {/*<button onClick={() => onBookSelect(book)}>View Details</button>  */}
        </div>
      ))}
    </div>
  );
}
export default HomePage;

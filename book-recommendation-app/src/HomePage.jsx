/* eslint-disable react/prop-types */

import React from 'react';

function HomePage({ onBookSelect }) {
  const [filteredBooks, setFilteredBooks] = React.useState([]); //Stores the filtered books based on progress

  React.useEffect(() => {

    const fetchBooksByProgress = () => {
      const books = [];
      //Loops through the local storage for user review and progress
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);              //Gets the key from localStorage
        const progress = localStorage.getItem(key);   //Gets the progress status

        //Checks if the book is either 'In Progress' or 'Finished'
        if (progress === 'In Progress' || progress === 'Finished') {
          const review = localStorage.getItem(key + 'review') || 0; //Get the review scores, default to 0 if not available
          books.push({ title: key, progress, review });             //Adds book to the array with its title, progress, and review
        }
      }

      setFilteredBooks(books);  //Updates state with the filtered books
    };

    fetchBooksByProgress();
  }, []);

  return (
    <div className="home-page">
      {filteredBooks.map((book) => (
        <div key={book.title}>
          <h3>{book.title}</h3>
          <p>Progress: {book.progress}</p>
          <p>Review: {book.review} stars</p>
          <button onClick={() => onBookSelect(book.title)}>View Details</button>
        </div>
      ))}
    </div>
  );
}
export default HomePage;

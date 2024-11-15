/* eslint-disable react/prop-types */

import React from 'react';
import axios from 'axios';

function BookInfo ({ searchTerm }) {
  const MY_KEY = import.meta.env.VITE_Api_Key; //Retrieve API key from environment variables
  //console.log(MY_KEY);

  const [bookData, setBookData] = React.useState(null); //Stores fetched book data
  const [selectedProgress, setSelectedProgress] = React.useState(localStorage.getItem(searchTerm) || 'Not Started');

  const progressOptions = ['Not Started', 'In Progress', 'Finished'];  //Options for the dropdown

  const [reviewScore, setReviewScore] = React.useState(localStorage.getItem(searchTerm + 'review') || 0); // Store review score
  const reviewStars = [1, 2, 3, 4, 5]; 

  React.useEffect(() => {
    if (searchTerm) {

      //Asynchronous function to fetch data from Google Books API
      const fetchBookData = async () => {
        //Constructs the API URL using the search term and API key
        const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${MY_KEY}`;

        //The 'try...catch' block for error handling during API call
        try {
          const response = await axios.get(url);
          setBookData(response.data.items[0].volumeInfo); //Updates bookData state with the first book's volume information

          //Retrives user score and progress whenever a new book is loaded
          setReviewScore(localStorage.getItem(searchTerm + 'review') || 0);       
          setSelectedProgress(localStorage.getItem(searchTerm) || 'Not Started'); 
        } 
        catch (error) {
          console.error(error);   //Logs any errors encountered during the API call
        }
      };

      fetchBookData();
    }
  }, [searchTerm, MY_KEY]); //Runs effect when searchTerm or MY_KEY changes

   //For dropdown changes
   const handleProgressChange = (event) => {
    setSelectedProgress(event.target.value);
    localStorage.setItem(searchTerm, event.target.value); //Updates local storage with the selected progress
  }

   //For when the user clicks on the star
   const handleScoreClick = (score) => {
    setReviewScore(score);
    localStorage.setItem(searchTerm + 'review', score);
  };

  return (
    <div className="book-info-container">
      {bookData && (
        <div className="book-details">
          {/* Book Information */}
          <h2>{bookData.title}</h2>
          <img 
            src={bookData.imageLinks ? bookData.imageLinks.thumbnail : 'assets/default-thumbnail.png'}  //Conditionally renders the thumbnail
            alt={bookData.title} 
          />
          <p>Author: {bookData.authors && bookData.authors.join(', ')}</p>
          <p>Category: {bookData.categories && bookData.categories.join(', ')}</p>
          <p>Publisher: {bookData.publisher}</p>
          <p>Published Date: {bookData.publishedDate}</p>
          
          {/* Display stars for review */}
          {reviewStars.map((star) => (
            <span 
              key={star} 
              onClick={() => handleScoreClick(star)}
              style={{ cursor: 'pointer', color: star <= reviewScore ? 'gold' : 'gray' }}
            >
            ★
            </span>
          ))}
          <p>Review: {reviewScore} stars</p> 
        
          {/* Dropdown menu for user Progress */}
          <select 
            value={selectedProgress} 
            onChange={handleProgressChange}
          >
            {progressOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

      
        </div>
        
      )}

      {/* For the right side of the page */}
      {bookData && (
        /* Book Synopsis */
        <div className="book-synopsis">
        <h2>Synopsis</h2>
        <p>{bookData.description}</p>
      </div>

      )}
      
    </div>
  );
};

export default BookInfo;

/* eslint-disable react/prop-types */

import React from 'react';
import axios from 'axios';

function BookInfo ({ searchTerm }) {
  const MY_KEY = import.meta.env.VITE_Api_Key; //Retrieve API key from environment variables
  //console.log(MY_KEY);

  const [bookData, setBookData] = React.useState(null); //Stores fetched book data

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
        } 
        catch (error) {
          console.error(error);   //Logs any errors encountered during the API call
        }
      };

      fetchBookData();
    }
  }, [searchTerm, MY_KEY]); //Runs effect when searchTerm or MY_KEY changes

  return (
    <div>
      {bookData && (
        <div>
          <h2>{bookData.title}</h2>
          <img src={bookData.imageLinks.thumbnail} alt={bookData.title} />
          <p>Author: {bookData.authors.join(', ')}</p>
          <p>Category: {bookData.categories.join(', ')}</p>
          <p>Publisher: {bookData.publisher}</p>
          <p>Published Date: {bookData.publishedDate}</p>
          <p>Synopsis: {bookData.description}</p>
        </div>
      )}
    </div>
  );
};

export default BookInfo;

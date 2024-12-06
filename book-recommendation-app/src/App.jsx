import React from 'react';
import axios from 'axios';
import Header from './Header.jsx'
import BookInfo from './BookInfo.jsx'
import HomePage from './HomePage.jsx';
import SearchResults from './SearchResults.jsx';

function App() {
  /* States */ 
  const [searchTerm, setSearchTerm] = React.useState('');                   //To store the current search term entered by the user
  const [submittedSearchTerm, setSubmittedSearchTerm] = React.useState(''); //To store the submitted search term to trigger book information retrieval
  const [selectedBook, setSelectedBook] = React.useState(null);             //To store the currently selected book
  const [searchResults, setSearchResults] = React.useState([]);             //To store search results from the API

  //Handles the user's search submission and fetch data from Google Books API
  const handleSubmit = async (e) => {
    e.preventDefault();                 //Prevents default form submission behavior
    setSubmittedSearchTerm(searchTerm); //Updates the submitted search term with the current one

    //Constructs the API URL using the search term and API key and then fetch search results from the API
    const MY_KEY = import.meta.env.VITE_Api_Key;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${MY_KEY}`;

    //The 'try...catch' block for error handling during API call
    try {
      const response = await axios.get(url);
      setSearchResults(response.data.items || []);  //Updates search results
      setSelectedBook(null);                        //Resets selected book
    }
    catch (error) {
      console.error(error); //Logs any errors encountered during the API call
    }
  }

  //Handles book selection from the HomePage
  const handleBookSelect = (book) => {
    const bookProgress = JSON.parse(localStorage.getItem(book.id))?.progress || 'Not Started';
    const bookReview = JSON.parse(localStorage.getItem(`${book.id}-review`))?.review || 0;

    //Ensures that all fields are present
    const fullBookDetails = {
      id: book.id,
      ...book.volumeInfo,                                               //Spreads volumeInfo for books from SearchResults
      ...JSON.parse(localStorage.getItem(book.id)),                     //Merges stored data for localStorage books
      
      progress: bookProgress,
      review: bookReview,
    };

    setSelectedBook(fullBookDetails);
  };

  return (
    <div>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSubmit={handleSubmit}
      />

      {/* Conditional rendering based on whether a book is selected or a search has been submitted */}
      {selectedBook ?
        (<BookInfo book={selectedBook} />) :
        (submittedSearchTerm ?
          (
            <SearchResults
              results={searchResults}
              onBookSelect={handleBookSelect}
            />
          ) :
          (<HomePage onBookSelect={handleBookSelect} />)
        )
      }
    </div>
  );
}
export default App;

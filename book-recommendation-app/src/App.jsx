import React from 'react';
import axios from 'axios';
import Header from './Header.jsx'
import BookInfo from './BookInfo.jsx'
import HomePage from './HomePage.jsx';
import SearchResults from './SearchResults.jsx';
import ReadingList from './ReadingList.jsx';

function App() {
  /* States */
  //For the book information functionality
  const [selectedBook, setSelectedBook] = React.useState(null);             

  //For the search functionality
  const [searchTerm, setSearchTerm] = React.useState('');                  
  const [submittedSearchTerm, setSubmittedSearchTerm] = React.useState(''); 
  const [searchResults, setSearchResults] = React.useState([]);
  
  //For reading lists
  const [addBookToList, setAddBookToList] = React.useState(null);           
  const [selectedReadingList, setSelectedReadingList] = React.useState(''); 

  //Fetches data from Google Books API and then get results based off of user input
  const fetchUserSubmission = async (e) => {
    e.preventDefault();                 //Prevents default form submission behavior
    setSubmittedSearchTerm(searchTerm); //Updates the submitted search term with the current one

    //Constructs the API URL using the search term and API key and then fetch search results from the API
    const MY_KEY = import.meta.env.VITE_Api_Key;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${MY_KEY}&maxResults=40`;

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

  const updateBookSelect = (book) => {
    setSelectedBook(book);
  };

  const memoizedAddBook = React.useCallback((callback) => {
    setAddBookToList(() => callback);
  }, []);


  return (
    <div>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        fetchUserSubmission={fetchUserSubmission}
      />
      <ReadingList
        addBook={memoizedAddBook}
        setSelectedReadingList={setSelectedReadingList}
      />

      {/* Conditional rendering based on whether a book is selected or a search has been submitted */}
      {selectedBook ?
        (
          <BookInfo
            book={selectedBook}
            changeList={addBookToList}
          />
        ) :
        (
          submittedSearchTerm ?
          (
            <SearchResults
              results={searchResults}
              onBookSelect={updateBookSelect}
            />
          ) :
          (
            <HomePage
              onBookSelect={updateBookSelect}
              selectedReadingList={selectedReadingList}
              changeList={addBookToList}
            />
          )
        )
      }
    </div>
  );
}
export default App;

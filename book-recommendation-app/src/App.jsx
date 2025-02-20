import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header.jsx'
import HomePage from './HomePage.jsx';
import BookInfo from './Main Functionality/BookInfo.jsx'
import SearchResults from './Main Functionality/SearchResults.jsx';
import ReadingList from './Main Functionality/ReadingList.jsx';
import Login from './User Authetication/Login.jsx';
import Register from './User Authetication/Register.jsx';
import UserProfile from './User Authetication/UserProfile.jsx';

function App() {
  /* States */
  //For the book information functionality

  //Saves a selected book to storage so when it's selected, will be retrieved when the component mounts. 
  //This is to prevent an error whenever the page reloads after navigating to the book path
  const [selectedBook, setSelectedBook] = React.useState(() => {
    const savedBook = localStorage.getItem('selectedBook');
    return savedBook ? JSON.parse(savedBook) : null;
  });

  //For the search functionality
  const [searchTerm, setSearchTerm] = React.useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  //For reading lists
  const [addBookToList, setAddBookToList] = React.useState(null);
  const [selectedReadingList, setSelectedReadingList] = React.useState('');

  const navigate = useNavigate();

  //For user authentication
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState('');

  //Stores current user
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      setUsername(JSON.parse(storedUser).username);
    }
  }, []);

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

    navigate('/search');
    console.log("Went to search page!");
  };

  const updateBookSelect = (book) => {
    setSelectedBook(book);
    localStorage.setItem('selectedBook', JSON.stringify(book));
  };

  const memoizedAddBook = React.useCallback((callback) => {
    setAddBookToList(() => callback);
  }, []);

  const setUpAuthor = (authorName) => {
    setSearchTerm(authorName);
    setSubmittedSearchTerm(authorName);
    fetchBooksByAuthor(authorName);
  };

  //Fetches books by an author name rather than the input for the search results
  const fetchBooksByAuthor = async (authorName) => {
    const MY_KEY = import.meta.env.VITE_Api_Key;
    const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${authorName}&key=${MY_KEY}&maxResults=40`;

    try {
      const response = await axios.get(url);
      setSearchResults(response.data.items || []);
      setSelectedBook(null);
    }
    catch (error) {
      console.error(error);
    }

    navigate('/search');
    console.log("Went to search page (for author name)!");
  };

  const setupUserLogin = (loggedInUsername) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
  };

  const setupUserLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    navigate('/');
  };

  return (
    <div>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        fetchUserSubmission={fetchUserSubmission}
        isLoggedIn={isLoggedIn}
      />
      {isLoggedIn && (
        <ReadingList
          addBook={memoizedAddBook}
          setSelectedReadingList={setSelectedReadingList}
        />
      )}

      <Routes>
      <Route
          path="/"
          element={
            isLoggedIn ? (
              <HomePage
                onBookSelect={updateBookSelect}
                selectedReadingList={selectedReadingList}
                changeList={addBookToList}
              />
            ) : (
              <div>
                <h2>Please Login or Register</h2>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
              </div>
            )
          }
        />
        <Route
          path="/book"
          element={
            <BookInfo
              book={selectedBook}
              changeList={addBookToList}
              onAuthorClick={setUpAuthor}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchResults
              results={searchResults}
              onBookSelect={updateBookSelect}
            />
          }
        />

        <Route path="/login" 
          element= {
              <Login 
                onLogin={setupUserLogin} 
              />
            } 
        />
        <Route path="/register" 
          element={
            <Register />
          } 
        />
        <Route
          path="/profile"
          element={
            <UserProfile 
              username={username} 
              onLogout={setupUserLogout} 
            />}
        />
      </Routes>
    </div>
  );
}
export default App;

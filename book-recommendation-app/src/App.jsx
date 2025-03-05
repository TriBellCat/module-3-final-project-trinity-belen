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
  const [selectedBook, setSelectedBook] = React.useState(null);

  //For the search functionality
  const [searchTerm, setSearchTerm] = React.useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  //For reading lists
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

    //Constructs the API URL using the search term and API key (that's gotten through the backend) 
    //And then it fetches search results from the API
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=40`;

    //The 'try...catch' block for error handling during API call
    try {
      const response = await axios.get(url);
      setSearchResults(response.data.items || []);  //Updates search results
      setSelectedBook(null);                        //Resets selected book
    } catch (error) {
      console.error(error); //Logs any errors encountered during the API call
    }

    navigate('/search');
    console.log("Went to search page!");
  };

  const updateBookSelect = (book) => {
    setSelectedBook(book);
    localStorage.setItem('selectedBook', JSON.stringify(book));
  };

  const setUpAuthor = (authorName) => {
    setSearchTerm(authorName);
    setSubmittedSearchTerm(authorName);
    fetchBooksByAuthor(authorName);
  };

  //Fetches books by an author name rather than the input for the search results
  const fetchBooksByAuthor = async (authorName) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${authorName}&maxResults=40`;

    try {
      const response = await axios.get(url);
      setSearchResults(response.data.items || []);
      setSelectedBook(null);
    } catch (error) {
      console.error(error);
    }

    navigate('/search');
    console.log("Went to search page (for author name)!");
  };

  const setupUserLogin = (loggedInUsername) => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
  };

  const clearSelectedReadingList = () => {
    setSelectedReadingList('');
  };
  
  const setupUserLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    clearSelectedReadingList(); 
    navigate('/');
  };

  return (
    <div>
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          fetchUserSubmission={fetchUserSubmission}
          isLoggedIn={isLoggedIn}
        />
      )}
      {isLoggedIn && location.pathname === '/' && (
        <ReadingList
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
              />
            ) : (

              <div className="container px-6 py-16 mx-auto text-center">
                <div className="max-w-lg mx-auto">
                  <h1 className='text-5xl font-extrabold lg:text-7xl 2xl:text-8xl'>
                    <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
                      READ
                    </span>
                  </h1>
                  <p className="max-w-3xl mx-auto mt-6 text-lg text-center text-gray-700 dark:text-white md:text-xl">
                    View books and build reading lists!
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className='px-5 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none'
                  >
                    Login</button>
                  <button
                    onClick={() => navigate('/register')}
                    className='px-5 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none'
                  >
                    Register</button>
                </div>
              </div>
            )
          }
        />
        <Route
          path="/book"
          element={
            <BookInfo
              book={selectedBook}
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
          element={
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
              onLogout={setupUserLogout}
            />}
        />
      </Routes>
    </div>
  );
}
export default App;

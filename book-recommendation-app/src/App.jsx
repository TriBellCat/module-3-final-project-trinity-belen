import React from 'react';
import axios from 'axios';
import Header from './Header.jsx'
import BookInfo from './BookInfo.jsx'
import HomePage from './HomePage.jsx';
import SearchResults from './SearchResults.jsx';

function App() {
    const [searchTerm, setSearchTerm] = React.useState('');                   //Stores the current search term in the input field
    const [submittedSearchTerm, setSubmittedSearchTerm] = React.useState(''); //Stores the submitted search term to trigger book information retrieval
    const [selectedBook, setSelectedBook] = React.useState(null);             //Stores the selected book
    const [searchResults, setSearchResults] = React.useState([]);             //Stores search results
    
    //Asynchronous function to fetch data from Google Books API
    //Also, to handle the user's search submission
    const handleSubmit = async (e) => {
      e.preventDefault();                 //Prevents default form submission behavior
      setSubmittedSearchTerm(searchTerm); //Updates submittedSearchTerm with the current searchTerm
     
      //Constructs the API URL using the search term and API key and then fetch search results from the API
      const MY_KEY = import.meta.env.VITE_Api_Key;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${MY_KEY}`;

      //The 'try...catch' block for error handling during API call
      try {
          const response = await axios.get(url);
          setSearchResults(response.data.items || []);  //Updates search results
          setSelectedBook(null);                        //Resets selected book
      } 
      //Logs any errors encountered during the API call
      catch (error) {
          console.error(error);
      }
    }

    //Handles book selection from the HomePage
    const handleBookSelect = (book) => {
      const bookProgress = JSON.parse(localStorage.getItem(book.id))?.progress || 'Not Started';
      const bookReview = JSON.parse(localStorage.getItem(`${book.id}-review`))?.review || 0;
    
      setSelectedBook({ ...book, progress: bookProgress, review: bookReview });
    };

    return (
      <div>
        <Header 
          searchTerm={searchTerm}         
          setSearchTerm={setSearchTerm}
          handleSubmit={handleSubmit} 
        />
        
        {/* Conditional rendering based on selectedBook depending whether or not a book is searched and selected*/}
        {selectedBook ? 
          (<BookInfo book={selectedBook} />) : 
          (submittedSearchTerm ? 
            (
            <SearchResults 
                results={searchResults} 
                onBookSelect={handleBookSelect} 
            />
            ): 
            ( <HomePage onBookSelect={handleBookSelect} />)
          )
        }
      </div>
    );
}
export default App;

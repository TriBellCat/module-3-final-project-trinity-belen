import React from 'react';
import Header from './Header.jsx'
import BookInfo from './BookInfo.jsx'
import HomePage from './HomePage.jsx';

function App() {
    const [searchTerm, setSearchTerm] = React.useState('');                   //Stores the current search term in the input field
    const [submittedSearchTerm, setSubmittedSearchTerm] = React.useState(''); //Stores the submitted search term to trigger book information retrieval
    const [selectedBook, setSelectedBook] = React.useState(null);             //Stores the selected book

    //Handles form submission
    const handleSubmit = (e) => {
      e.preventDefault();                 //Prevents default form submission behavior
      setSubmittedSearchTerm(searchTerm); //Updates submittedSearchTerm with the current searchTerm
      setSelectedBook(searchTerm);        //Sets the selected book to the user's search
    }

    //Handles book selection from the HomePage
    const handleBookSelect = (bookTitle) => {
      setSelectedBook(bookTitle);
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
          (<BookInfo searchTerm={selectedBook} />)  : 
          (<HomePage onBookSelect={handleBookSelect} />)
        }
      </div>
    );
}
export default App;

import React from 'react';
import Header from './Header.jsx'
import BookInfo from './BookInfo.jsx'

function App() {
    const [searchTerm, setSearchTerm] = React.useState('');                   //Stores the current search term in the input field
    const [submittedSearchTerm, setSubmittedSearchTerm] = React.useState(''); //Stores the submitted search term to trigger book information retrieval

    //Handles form submission
    const handleSubmit = (e) => {
      e.preventDefault();                 //Prevents default form submission behavior
      setSubmittedSearchTerm(searchTerm); //Updates submittedSearchTerm with the current searchTerm
    }

    return (
      <div>
        <Header 
          searchTerm={searchTerm}         
          setSearchTerm={setSearchTerm}
          handleSubmit={handleSubmit} 
        />
        <BookInfo 
          searchTerm={submittedSearchTerm}
        />
      </div>
    );
}
export default App;

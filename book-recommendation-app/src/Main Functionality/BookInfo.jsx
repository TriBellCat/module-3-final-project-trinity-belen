/* eslint-disable react/prop-types */

import React from 'react';
import axiosInstance from '../axiosInstance.jsx';

function BookInfo({ book, onAuthorClick }) {
  console.log("Book info:", book); //Debug log to check the book object in

  const reviewStars = [1, 2, 3, 4, 5];
  const token = localStorage.getItem('token');

  /* States */
  const [selectedProgress, setSelectedProgress] = React.useState('Not Started');
  const [reviewScore, setReviewScore] = React.useState(0);
  const [readingLists, setReadingLists] = React.useState([]);
  const [selectedReadingList, setSelectedReadingList] = React.useState('');

  React.useEffect(() => {
    const getReadingLists = async () => {
      const response = await axiosInstance.get('/readinglists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReadingLists(response.data);

      //After getting reading lists, check which one a book is in
      const listsContainingBook = [];
      for (const list of response.data) {
        const booksInListResponse = await axiosInstance.get(`/readinglists/${list.reading_list_id}/books`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bookIsInList = booksInListResponse.data.some(bookInList => bookInList.book_id === book.id);
        if (bookIsInList) {
          listsContainingBook.push(list.list_name);
        }
      }
      setSelectedReadingList(listsContainingBook);

    };
    getReadingLists();
  }, [token, book.id]);

  //Toggles list to affect its position in list
  const toggleList = async (selectedListName) => {
    const selectedListObject = readingLists.find(list => list.list_name === selectedListName);
    if (!selectedListObject) {
      console.error("Selected reading list not found in fetched lists.");
      return;
    }
    const readingListIdToToggle = selectedListObject.reading_list_id;

    const isHighlighted = selectedReadingList.includes(selectedListName);
    const token = localStorage.getItem('token');

    console.log(readingListIdToToggle);
    console.log(book.id);

    //Removes book from reading list
    if (isHighlighted) {
      await axiosInstance.delete(`/readinglists/${readingListIdToToggle}/books/${book.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReadingList(prev => prev.filter(name => name !== selectedListName));
      alert(`${book.volumeInfo.title} removed from "${selectedListName}"!`);
    }
    //Adds book to reading list
    else {
      await axiosInstance.post(`/readinglists/${readingListIdToToggle}/books`, { book_id: book.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReadingList(prev => [...prev, selectedListName]);
      alert(`${book.volumeInfo.title} added to "${selectedListName}"!`);
    }
  };

  /* Functions for Saving User Input */

  //Get data from user_books table when the BookInfo component mounts
  React.useEffect(() => {
    const getInitialUserData = async () => {
      const response = await axiosInstance.get(`/books/${book.id}/user-data`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedProgress(response.data.progress || 'Not Started');
      setReviewScore(response.data.review_score || 0);
    };

    if (book && book.id) {
      getInitialUserData();
    }
  }, [book, token]);

  //Sets and saves changes in the dropdown menu for progress with the selected one
  const saveUserProgress = async (event) => {
    const progress = event.target.value;
    setSelectedProgress(progress);

    console.log("book.id in saveUserProgress:", book.id);

    await axiosInstance.put(`/books/${book.id}/user-data`,
      { progress: progress },
      { headers: { Authorization: `Bearer ${token}` } }
    );

  };

  //Sets and saves the changes in user review score when the user clicks on the stars
  const saveUserScoreClick = async (score) => {
    setReviewScore(score);

    console.log("book.id in saveUserScoreClick:", book.id);

    await axiosInstance.put(`/books/${book.id}/user-data`,
      { review_score: score },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className="flex mt-4 gap-4 bg-gray-200">
      <div className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md dark:bg-gray-800">
        {/* Book Information */}
        <img
          src={book.volumeInfo?.imageLinks?.thumbnail}
          alt={book.volumeInfo?.title || 'Book cover'}
          className="w-70 h-70"
        />
        <div className="py-5 text-center">

          <h2 className='block text-xl font-bold text-gray-800 dark:text-white'>{book.volumeInfo?.title} {book.volumeInfo?.subtitle}</h2>
        </div>

        <p>
          {book.volumeInfo?.authors?.map((author, index) => (
            <span
              key={index}
              onClick={() => onAuthorClick(author)}
              className="book-info-author"
            >
              <mark className='bg-teal-500 text-white rounded-sm shadow-md'>
                {author}
              </mark>
            </span>
          )) || 'Unknown'}
        </p>
        <div className="mt-2">
          <p className='mt-2 text-gray-600 dark:text-gray-300'>Category: {book.volumeInfo?.categories?.join(', ') || 'Uncategorized'}</p>
          <p className='mt-2 text-gray-600 dark:text-gray-300'>Publisher: {book.volumeInfo?.publisher || 'Unknown'}</p>
          <p className='mt-2 text-gray-600 dark:text-gray-300'>Published Date: {book.volumeInfo?.publishedDate || 'Unknown'}</p>
          <p className='mt-2 text-gray-600 dark:text-gray-300'> Page Count: {book.volumeInfo?.pageCount || 'Unknown'}</p>
        </div>

        {/* A way to click stars and save review score */}
        {
          reviewStars.map(
            (star) => (
              <span
                key={star}
                onClick={() => saveUserScoreClick(star)}
                style={{ cursor: 'pointer', color: star <= reviewScore ? 'gold' : 'gray' }}
              >
                ★
              </span>
            )
          )
        }

        {/* Dropdown menu for user progress */}
        <select
          value={selectedProgress}
          onChange={saveUserProgress}
        >
          <option value="" disabled>
            Reading Progress
          </option>
          {['Not Started', 'In Progress', 'Finished'].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>


        <div className="flex items-center justify-between mt-4">
          {/* Add and Remove from Reading List Dropdown Menu */}
          <select
            onChange={(e) => toggleList(e.target.value)}
            value=""
          >
            <option value="" disabled>
              Select Reading List
            </option>
            {readingLists.map(
              (list, index) => (
                <option
                  key={index}
                  value={list.list_name}
                  className={selectedReadingList.includes(list.list_name) ? 'highlighted-lists' : 'non-highlighted-lists'}
                >
                  {list.list_name}
                </option>
              )
            )}
          </select>
          {/* Only renders the buy button if it's available*/}
          {book.saleInfo?.buyLink && (
            <a href={book.saleInfo.buyLink} target="_blank" rel="noopener noreferrer">
              <button className="cursor-pointer px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-rose-600 rounded-lg hover:bg-rose-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                Buy
              </button>
            </a>
          )}
        </div>
      </div>

      {/* For the right side of the page */}
      <div className="flex-grow px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>Synopsis</h2>
        <p className='text-xl text-gray-600 dark:text-gray-300'>{book.volumeInfo?.description || 'No description available.'}</p>
      </div>
    </div>
  );
};
export default BookInfo;

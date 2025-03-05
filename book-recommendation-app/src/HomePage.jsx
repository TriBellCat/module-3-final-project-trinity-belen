/* eslint-disable react/prop-types */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance.jsx';

function HomePage({ onBookSelect, selectedReadingList }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  /* States */
  const [booksInList, setBooksInList] = React.useState([]);

  //Load books from the selected reading list from the local storage
  React.useEffect(() => {
    const getBooks = async () => {
      if (selectedReadingList) {
        const response = await axiosInstance.get(`/readinglists/${selectedReadingList.reading_list_id}/books`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const booksWithUserData = await Promise.all(response.data.map(async (book) => {
          const userDataResponse = await axiosInstance.get(`/books/${book.book_id}/user-data`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          return {
            ...book,
            progress: userDataResponse.data.progress,
            review_score: userDataResponse.data.review_score
          };
        }));
  
        setBooksInList(booksWithUserData);
      } 
      
      else {
        setBooksInList([]);
      }
    };
  
    getBooks();
  }, [selectedReadingList, token]);

  console.log(booksInList);

  return (
    //Renders books in selected reading lsit
    <div className='min-h-screen'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {booksInList.map((book) => (
          <div
            key={book.book_data.volumeInfo?.book_id}
            className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800"
          >
            <img
              src={book.book_data.volumeInfo?.imageLinks.thumbnail}
              alt={book.book_data.volumeInfo?.title}
              className='object-cover object-center w-full h-56'
            />
            <div className="flex items-center px-6 py-3 bg-gray-900 truncate">
              <h1 className='mx-3 text-lg font-semibold text-white'>{book.book_data.volumeInfo?.title}</h1>
            </div>

            <div className="px-6 py-4">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{book.book_data.volumeInfo?.authors?.[0]}</h1>
              <p className="py-2 text-gray-700 dark:text-gray-400">{book.book_data.volumeInfo?.publisher}</p>

              <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
                <h1 className="px-2 text-sm">{book.book_data.volumeInfo?.categories?.[0] || 'Unknown'}</h1>
              </div>
              <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
                <h1 className="px-2 text-sm">{book.progress || 'Not Started'}</h1>
              </div>
              <div className="flex items-center mt-4 text-gray-700 dark:text-gray-200">
                <h1 className="px-2 text-sm">{book.review_score || 0} ★</h1>
              </div>
              <div className="flex items-center mt-4 text-blue-700 dark:text-gray-200">
                <a
                  href="#"
                  onClick={() => {
                    onBookSelect(book.book_data);
                    navigate('/book');
                  }}
                  className="px-2 text-sm"
                >
                  View Details
                </a>
              </div>
              {book.book_data.saleInfo?.buyLink && (
                <div className="flex items-center mt-4 text-red-700 dark:text-gray-200">
                  <a
                    href={book.book_data.saleInfo.buyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 text-sm"
                  >
                    Buy Book
                  </a>
                </div>
              )}
              {/*<button onClick={() => removeBookFromReadingList()}>Remove</button>*/}
            </div>
          </div>
        ))}
      </div>


    </div>

  );
}
export default HomePage;
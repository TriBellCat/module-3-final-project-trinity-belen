/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';

function SearchResults({ results, onBookSelect }) {
    const navigate = useNavigate();

    //Renders search results based on what the user searched up
    return (
        <div className="grid grid-cols-2 gap-4 justify-between mt-6 bg-gray-200 dark:bg-gray-800">
            {results.map((result) => (
                <div key={result.id} className="max-w-5xl px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <div className="flex items-start space-x-4">
                        <img
                            src={result.volumeInfo?.imageLinks?.thumbnail}
                            alt={result.volumeInfo?.title || 'Book cover'}
                            className="size-25 rounded-lg object-cover"
                        />
                        <div>
                            <h3 className='text-2xl/tight font-medium text-gray-900'>{result.volumeInfo?.title}</h3>
                            <p className='text-lg/tight mt-0.5 text-gray-700'>Author: {result.volumeInfo?.authors && result.volumeInfo?.authors.join(', ') || 'Unknown'} · Publisher: {result.volumeInfo?.publisher || 'Unknown'}, {result.volumeInfo?.publishedDate} · Category: {result.volumeInfo?.categories?.join(', ') || 'Unknown'}</p>
                        </div>
                    </div>
                    <div>

                        <div>
                            <p className='mt-0.5 text-gray-700'>{result.searchInfo?.textSnippet}</p>
                            <button
                                onClick={() => {
                                    onBookSelect(result);
                                    navigate('/book');
                                }}
                                className='px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-sky-600 rounded-lg hover:bg-sky-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
                            >
                                View Details
                            </button>
                            {result.saleInfo?.buyLink && (
                                <a href={result.saleInfo.buyLink} target="_blank" rel="noopener noreferrer">
                                    <button
                                        className='px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-rose-600 rounded-lg hover:bg-rose-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
                                    >
                                        Buy Book
                                    </button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default SearchResults;

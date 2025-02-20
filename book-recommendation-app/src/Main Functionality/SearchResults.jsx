/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';

function SearchResults({ results, onBookSelect }) {
    const navigate = useNavigate();

    //Renders search results based on what the user searched up
    return (
        <div className="search-results">
            <h1> Search Results </h1>
            <hr className="top-divider" />
            {results.map((result) => (
                <div key={result.id} className="search-result-item">
                    <div className="search-result-item-left">
                        <img
                            src={result.volumeInfo?.imageLinks?.thumbnail}
                            alt={result.volumeInfo?.title || 'Book cover'}
                        />
                    </div>
                    <div className="search-result-item-right">
                        <div className="search-result-item-info">
                            <h3>{result.volumeInfo?.title}</h3>
                            <p>Author: {result.volumeInfo?.authors && result.volumeInfo?.authors.join(', ') || 'Unknown'} · Publisher: {result.volumeInfo?.publisher || 'Unknown'}, {result.volumeInfo?.publishedDate} · Category: {result.volumeInfo?.categories?.join(', ') || 'Unknown'}</p>
                            <p>{result.searchInfo?.textSnippet}</p>
                        </div>
                        <div className="book-details-buttons">
                            <button onClick={() =>{
                                    onBookSelect(result);
                                    navigate('/book');
                                }
                            }>
                                View Details
                            </button>
                            {result.saleInfo?.buyLink && (
                                <a href={result.saleInfo.buyLink} target="_blank" rel="noopener noreferrer">
                                    <button className="buy-button">Buy Book</button>
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

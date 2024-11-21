/* eslint-disable react/prop-types */

function SearchResults({ results, onBookSelect }) {
    //Renders search results based on what the user searched up
    return (
        <div className="search-results">
            {results.map((result) => (
                <div key={result.id} className="search-result-item">
                    <h3>{result.volumeInfo.title}</h3>
                    <p>Author: {result.volumeInfo.authors && result.volumeInfo.authors.join(', ')}</p>
                    <button onClick={() => onBookSelect(result)}>View Details</button>
                </div>
            ))}
        </div>
    );
}
export default SearchResults;

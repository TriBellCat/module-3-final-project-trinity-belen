/* eslint-disable react/prop-types */

function Header({ searchTerm, setSearchTerm, fetchUserSubmission }) {
    //Updates searchTerm state whenever the input field value changes
    const updateSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <header className='site-header'>
            <div className="header-left">
                <span className="bi--book-half"></span>
                <h1>Bookosphere</h1>
            </div>

            <form
                onSubmit={fetchUserSubmission}
                className='search-bar'
            >
                <input
                    type="text"
                    value={searchTerm}
                    onChange={updateSearch}
                    placeholder="Search for a book..."
                />
                <button type="submit"> Search </button>
            </form>
        </header>
    );
}
export default Header;

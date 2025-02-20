/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router-dom';

function Header({ searchTerm, setSearchTerm, fetchUserSubmission, isLoggedIn }) {
    const navigate = useNavigate();

    //Updates searchTerm state whenever the input field value changes
    const updateSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const navigateHome = () => {
        navigate('/');
        console.log("Went back home!");
    }

    const navigateProfile = () => {
        navigate('/profile');
    };

    return (
        <header className='site-header'>
            <div className="header-left" >
                <span
                    className="bi--book-half"
                    onClick={navigateHome}>
                </span>
                <h1 className="site-name">Bookosphere</h1>
                {isLoggedIn && (
                    <button onClick={navigateProfile}>
                        Profile
                    </button>
                )}
            </div>

            {/* Search functionality is for logged in users only */}
            {isLoggedIn && (
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
            )}

        </header>
    );
}
export default Header;

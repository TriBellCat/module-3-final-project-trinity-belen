/* eslint-disable react/prop-types */

import React from 'react';

function Header({ searchTerm, setSearchTerm, handleSubmit }) {

    //Updates searchTerm state whenever the input field value changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <header className='site-header'>
            <img src="logo.png" alt="logo" className="logo" />
            <h1>Bookler</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={searchTerm}              //The value is bound to searchTerm sstate
                    onChange={handleSearchChange}   //Calls handleSearchChange on input change
                    placeholder="Search for a book..."
                />
                <button type="submit">Search</button>
            </form>
        </header>
    );
}
export default Header;

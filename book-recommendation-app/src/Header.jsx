/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router-dom';

function Header({ searchTerm, setSearchTerm, fetchUserSubmission, isLoggedIn }) {
    const navigate = useNavigate();

    //Updates searchTerm state whenever the input field value changes
    const updateSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <nav className='relative bg-gray-800 shadow dark:bg-gray-800'>
            <div className="container px-6 py-3 mx-auto md:flex" >
                <div className="flex items-center justify-between">
                    <p className="bi--book-half"> </p>
                    <h1 className="text-2xl text-gray-50 font-bold">Bookosphere</h1>
                </div>

                <div className="absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out md:mt-0 md:p-0 md:top-0 md:relative md:opacity-100 md:translate-x-0 md:flex md:items-center md:justify-between">
                    <div className="flex flex-col px-2 -mx-4 md:flex-row md:mx-10 md:py-0">
                        <a href="#"
                            className="px-2.5 py-2 text-gray-50 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-slate-400 dark:hover:bg-gray-700 md:mx-2"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </a>
                        {isLoggedIn && (
                            <a href="#"
                                className="px-2.5 py-2 text-gray-50 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-slate-400 dark:hover:bg-gray-700 md:mx-2"
                                onClick={() => navigate('/profile')}
                            >
                                User
                            </a>
                        )}
                    </div>

                    {/* Search functionality is for logged in users only */}
                    {isLoggedIn && (
                        <div className="relative mt-4 md:mt-0">
                            <form
                                onSubmit={fetchUserSubmission}
                            >
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={updateSearch}
                                    placeholder="Search for a book..."
                                    className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                                />
                            </form>
                        </div>
                    )}
                </div>
            </div>


        </nav>
    );
}
export default Header;

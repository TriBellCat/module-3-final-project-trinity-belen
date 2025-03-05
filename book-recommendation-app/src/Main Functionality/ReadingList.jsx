/* eslint-disable react/prop-types */

import React from 'react';
import axiosInstance from '../axiosInstance.jsx';

function ReadingList({ setSelectedReadingList }) {
    /* States */
    const [readingLists, setReadingLists] = React.useState([]);
    const [selectedList, setSelectedList] = React.useState("");

    const token = localStorage.getItem('token');

    //Get reading list from backend
    const getReadingLists = async () => {
        const response = await axiosInstance.get('/readinglists', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReadingLists(response.data);
    };

    React.useEffect(() => {
        getReadingLists();
    });

    //Changes value to the currently selected reading list from the dropdown menu
    const selectCurrentList = (event) => {
        const listId = event.target.value;
        setSelectedList(listId);

        const selectedListObj = readingLists.find(list => list.reading_list_id === parseInt(listId))
        setSelectedReadingList(selectedListObj);

        //Debug Logs
        console.log("Currently Selected:", listId);         //Checks if currently selected list is in fact currently selected
        console.log("Reading Lists Info:", readingLists);   //Checks books in all reading lists
    };

    const createReadingList = async () => {
        const listName = window.prompt('Enter the name of the new reading list:');

        if (listName) {
            const response = await axiosInstance.post('/readinglists',
                { list_name: listName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReadingLists(prev => [...prev, response.data]);
        }
    };

    const deleteReadingList = async () => {
        if (!selectedList) {
            alert("Please select a reading list to delete.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this reading list?")) {
            await axiosInstance.delete(`/readinglists/${selectedList}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReadingLists(prev => prev.filter(list => list.reading_list_id !== parseInt(selectedList)));
            setSelectedList("");; //Resets the selection after deletion
            setSelectedReadingList(null);
        }
    };

    return (
        <div className="flex items-center space-x-4">
            <select
                name="dropdown-menu"
                value={selectedList}
                onChange={selectCurrentList}
                className='block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white'
            >
                <option value="" disabled>Reading Lists</option>
                {
                    readingLists.map((list) => (
                        <option key={`user_${list.user_id}_list_${list.reading_list_id}`} value={list.reading_list_id}>
                            {list.list_name.slice(0, 10)}
                        </option>
                    )
                    )
                }
            </select>
            <button
                onClick={createReadingList}
                className='px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
            >+ Create</button>
            <button
                onClick={deleteReadingList}
                className='px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'
            >
                - Delete</button>
        </div>
    );

} export default ReadingList;

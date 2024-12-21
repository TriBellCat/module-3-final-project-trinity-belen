/* eslint-disable react/prop-types */

import React from 'react';

function ReadingList({ addBook, setSelectedReadingList }) {
    /* States */
    const [readingLists, setReadingLists] = React.useState(() => {
        //Loads reading lists from local storage on initial render
        const savedLists = localStorage.getItem('readingLists');
        return savedLists ? JSON.parse(savedLists) : {};
    });
    const [selectedList, setSelectedList] = React.useState("");

    //Saves reading lists to local storage whenever there's change
    React.useEffect(() => {
        localStorage.setItem('readingLists', JSON.stringify(readingLists));
    }, [readingLists]);

    //Changes value to the currently selected reading list from the dropdown menu
    const selectCurrentList = (event) => {
        const listName = event.target.value;
        setSelectedList(listName);
        setSelectedReadingList(listName);

        //Debug Logs
        console.log("Currently Selected:", listName);       //Checks if currently selected list is in fact currently selected
        console.log("Reading Lists Info:", readingLists);   //Checks books in all reading lists
    };

    const createReadingList = () => {
        const listName = window.prompt('Enter the name of the new reading list:');

        if (listName && !readingLists[listName]) {
            setReadingLists(prev => ({ ...prev, [listName]: [] }))
        }
        else if (readingLists[listName]) {
            alert('A reading list with that name already exists.');
        }
    };

    const deleteReadingList = () => {
        if (Object.keys(readingLists).length === 0) {
            alert("No reading lists to delete!");
            return;
        }
        else if (selectedList === "") {
            alert("Please select a reading list to delete.");
            return;
        }

        setReadingLists((prev) => {
            const newList = { ...prev };
            delete newList[selectedList];

            return newList;
        });

        setSelectedList(""); //Resets the selection after deletion
    };

    //Updates a book in a reading list, depending on which button the user clicked on
    const updateBookInReadingList = (listName, book, action) => {
        setReadingLists((prev) => {
            const newList = { ...prev };
            const isInList = newList[listName]?.some((existingBook) => existingBook.id === book.id);

            //Adds a book to a specified reading list
            if (action === 'add') {
                if (isInList) {
                    alert(`${book.volumeInfo.title} is already in the "${listName}" list.`);
                    return prev;
                }
                else {
                    alert(`Book added to "${listName}"!`);
                    newList[listName] = [...newList[listName], book];
                }
            }

            //Removes book from a specified reading list
            else if (action === 'remove') {
                if (!isInList) {
                    alert(`${book.volumeInfo.title} is not in the "${listName}" list!`);
                    return prev;
                }
                else {
                    alert(`${book.volumeInfo.title} removed from "${listName}"! (Refresh the home page to see it removed.)`);
                    newList[listName] = newList[listName].filter((existingBook) => existingBook.id !== book.id);
                }
            }

            return newList;
        });
    };

    const clearLocalStorageButton = () => {
        if (confirm("WARNING: This will delete all your data!")) {
            localStorage.clear();
            alert("Local storage is now empty!");
        } 
    };

    React.useEffect(() => {
        if (addBook) {
            addBook((listName, book, action) => updateBookInReadingList(listName, book, action));
        }
    }, [addBook]);

    return (
        <div className="reading-list">
            <select
                name="dropdown-menu"
                value={selectedList}
                onChange={selectCurrentList}
            >
                <option value="" disabled>Reading Lists</option>
                {
                    Object.keys(readingLists).map((listName, index) => (
                        <option key={index} value={listName}>
                            {listName}
                        </option>)
                    )
                }
            </select>
            <button onClick={createReadingList}>+ Create</button>
            <button onClick={deleteReadingList}>- Delete</button>
            <button onClick={clearLocalStorageButton}>Reset Local Storage</button>
        </div>
    );

} export default ReadingList;

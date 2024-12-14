/* eslint-disable react/prop-types */

import React from 'react';

function ReadingList({ addBook }) {
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
        setSelectedList(event.target.value);

        //Debug Logs
        console.log("Currently Selected:", event.target.value);
        console.log("Reading Lists Info:", readingLists);    //Checks books in all reading lists
    };

    //Creates reading list out of user prompt answer if possible
    const createReadingList = () => {
        const listName = window.prompt('Enter the name of the new reading list:');
        if (listName && !readingLists[listName]) {
            setReadingLists(prev => ({ ...prev, [listName]: [] }))
        }
        else if (readingLists[listName]) {
            alert('A reading list with that name already exists.');
        }
    };

    //Deletes a reading list
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
                    alert(`${book.title} is already in the "${listName}" list.`);
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
                    alert(`${book.title} is not in the "${listName}" list.`);
                    return prev;
                }
                else {
                    alert(`Book removed from "${listName}"!`);
                    newList[listName] = newList[listName].filter((existingBook) => existingBook.id !== book.id);
                }
            }

            return newList;
        });
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
            <button onClick={createReadingList}>Create New Reading List</button>
            <button onClick={deleteReadingList}>Delete Reading List</button>
        </div>
    );

} export default ReadingList;

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';

export function SortingButton({caption, sortInitialValues, onSort}) {
  const [isAscending, setIsAscending] = useState(sortInitialValues.isAscending);
  const buttonWasClicked = useRef(false);

    useEffect(() => {
        if (!buttonWasClicked.current)  // activate callback only on explicit user-click
            return;
        onSort(sortInitialValues.key, isAscending); 
    }, [isAscending])

    const toggleSorting = (event) => {
        event.preventDefault();
        buttonWasClicked.current = true;
        setIsAscending((prevAscending) => !prevAscending);
    };

  return (
    <button onClick={toggleSorting}>
      {isAscending ? '▴' : '▾'}{caption}
    </button>
  )
}



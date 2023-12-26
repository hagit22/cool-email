/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { SortingButton } from '../cmps-utils/SortingButton'

export function EmailFilter({ filterBy, onSetFilter, sortObj, onSetSort, sortInitialValues}) {

    const [currentFilter, setCurrentFilter] = useState(filterBy)
    const [currentSortObj, setCurrentSortObj] = useState(sortObj)

    useEffect(() => {
        onSetFilter(currentFilter);
    }, [currentFilter])

    useEffect(() => {
        onSetSort(currentSortObj)
    }, [currentSortObj])


    function handleChange({target}) {
        let { name: field, value } = target
        setCurrentFilter(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function handleClickRadio({target}) {
        let { id: field } = target
        resetReadUnread();
        setCurrentFilter(prevFilter => ({ ...prevFilter, [field]: true }))
    }

    function handleResetRadio() {
        resetReadUnread();
    }

    function resetReadUnread() {
        const readUnread = {onlyReadMails: false, onlyUnreadMails: false}
        setCurrentFilter(prevFilter => ({ ...prevFilter, ...readUnread}))
    }
    
    function onSort(key, isAscending) {
        setCurrentSortObj({sortBy: key, isAscending: isAscending});
    }

    const { search, onlyReadMails, onlyUnreadMails } = currentFilter
    const { date: dateInitialValues, subject: subjectInitialValues} = sortInitialValues
    return (
        <form className="email-filter">
            <div>
                <SortingButton caption="Date" sortInitialValues={dateInitialValues} onSort={onSort}/>
            </div>
            <div>
                <SortingButton caption="Subject" sortInitialValues={subjectInitialValues} onSort={onSort}/>
            </div>
            <div className="label-input">
                <label htmlFor="search">Search</label>
                <input onChange={handleChange} id="search" value={search} name="search" type="search" />
            </div>
            <div className="label-input-radio-group pretty-border">
                <div>
                    <label htmlFor="onlyReadMails">Only Read</label>
                    <input onClick={handleClickRadio} id="onlyReadMails" 
                        value={onlyReadMails} defaultChecked={onlyReadMails} name="read-unread-group" type="radio" />
                </div>
                <div>
                    <label htmlFor="onlyUnreadMails">Only Unread</label>
                    <input onClick={handleClickRadio} id="onlyUnreadMails" 
                        value={onlyUnreadMails} defaultChecked={onlyUnreadMails} name="read-unread-group" type="radio" />
                </div>
                <input onClick={handleResetRadio} type="reset" className="reset-button-style"/>
            </div>
        </form>
    )
}

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"

export function EmailFilter({ filterBy, onSetFilter }) {

    const [currentFilter, setCurrentFilter] = useState(filterBy)

    useEffect(() => {
        onSetFilter(currentFilter);
    }, [currentFilter])


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

    const { search, onlyReadMails, onlyUnreadMails } = currentFilter
    return (
        <form className="email-filter">
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

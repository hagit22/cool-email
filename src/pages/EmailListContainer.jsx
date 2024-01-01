/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { Outlet } from "react-router-dom";
import { emailService } from '../services/email.service';
import { messageService } from '../services/message.service'
import { EmailList } from "../cmps/EmailList";
import { EmailFilter } from "../cmps/EmailFilter";
import { SidePanel } from "../cmps/SidePanel";
import { EmailComposeModal } from "../cmps/EmailComposeModal";
import { Pencil } from 'react-bootstrap-icons';


export function EmailListContainer({emailBox, emailTypes, onEmailSave}) {

    const [emails, setEmails] = useState(null)
    const [unReadsMap, setUnReadsMap] = useState({})
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(emailBox))
    const [sortObj, setSortObj] = useState(emailService.getDefaultSort()) 
    const [showComposeModal, setShowComposeModal] = useState(false)

    const sortInitialValues = useRef();

    useEffect(() => {
        sortInitialValues.current = emailService.getInitialSortValues();
    }, [])

    useEffect(() => {
        loadEmails()
    }, [filterBy, sortObj, emails])


    const loadEmails = async() => {
        try {
            const emails = await emailService.query(filterBy, sortObj)
            setEmails(emails)
            const unReads = await emailService.queryUnreadMails();
            setUnReadsMap(unReads)
        }
        catch (error) {
            console.log('loadEmails: error:', error)
        }
    }

    const onUpdateEmail = (updatedEmail) => {  
        setEmails(existingEmails => 
            existingEmails.some(currentEmail => currentEmail.id === updatedEmail.id) ?
                existingEmails.map(currentEmail => (currentEmail.id === updatedEmail.id ? updatedEmail : currentEmail)) :
                [...existingEmails, updatedEmail]
        );
        onEmailSave(updatedEmail) // Its ok if asynchronous, because we also updated the local copy, for the coming render
    }

    const onSendEmail = (email) => {    
        if (email) {    // null email means user closed modal explicitly
            const { from, to, subject, body } = email;   
            emailService.createEmailMessage(from, to, subject, body);
            messageService.toastMessage("Message sent")
        }
        setShowComposeModal(false)
    }

    const onSetFilter = (updatedFilter) => {      
        setFilterBy(prevFilter => ({ ...prevFilter, ...updatedFilter }))
    }

    const onSetSort = (sortObj) => {      
        setSortObj(sortObj)
    }

    const onShowComposeModal = () => {      
        setShowComposeModal(true)
    }

    if (!emails) return <div>Loading...</div>
    return (
        <section className="email-index">
            <div className="email-compose" onClick={onShowComposeModal} >
                <Pencil className="image-with-hover"/> Compose
            </div>
            {!showComposeModal ? '' :
                    <EmailComposeModal initialEdit={emailService.getInitialEditMail()} onSendEmail={onSendEmail}/>}
            <div>
                <EmailFilter filterBy=
                            {{search: filterBy.search, 
                            onlyReadMails: filterBy.onlyReadMails,
                            onlyUnreadMails: filterBy.onlyUnreadMails}}
                            onSetFilter={onSetFilter} 
                            sortObj={sortObj}
                            onSetSort={onSetSort}
                            sortInitialValues={sortInitialValues.current} />
            </div>
            <div>
                <SidePanel filterBy={filterBy} onSetFilter={onSetFilter} 
                    emailTypes={emailTypes} unReadsMap={unReadsMap}/>
            </div>
            <div>
                <EmailList emails={emails} emailBox={filterBy.emailType} emailTypes={emailTypes}
                    onUpdateEmail={onUpdateEmail}/>
            </div>
        </section>
    )
}


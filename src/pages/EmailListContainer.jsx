/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { Outlet, useSearchParams } from "react-router-dom";
import { utilService } from '../services/util.service';
import { emailService } from '../services/email.service';
import { messageService } from '../services/message.service'
import { EmailList } from "../cmps/EmailList";
import { EmailFilter } from "../cmps/EmailFilter";
import { SidePanel } from "../cmps/SidePanel";
import { EmailComposeModal } from "../cmps/EmailComposeModal";
import { Pencil } from 'react-bootstrap-icons';


export function EmailListContainer({emailBox, emailTypes, onEmailSave}) {

    const MAX_OPEN_MODALS = 4

    const [filterParams, setFilterParams] = useSearchParams({})
    const [sortParams, setSortParams] = useSearchParams({})
    const [emails, setEmails] = useState(null)
    const [unReadsMap, setUnReadsMap] = useState({})
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(emailBox))
    const [sortObj, setSortObj] = useState(emailService.getDefaultSort()) 
    const [createNewCompose, setCreateNewCompose] = useState(false)
    const [newEmailMessages, setNewEmailMessages] = useState([])
    const [emailsUpdated, setEmailsUpdated] = useState(false)

    const sortInitialValues = useRef();
    const numOpenComposeModals = useRef(0)
    const navigate = useNavigate()

    useEffect(() => {
        sortInitialValues.current = emailService.getInitialSortValues();
        setFilterBy(prevFilterBy => utilService.getObjectFromQueryParams(filterParams,prevFilterBy))
        setSortObj(prevSortObj => utilService.getObjectFromQueryParams(sortParams,prevSortObj))
    }, [])
    
    useEffect(() => {
        if (emailsUpdated)
            setEmailsUpdated(false)
    }, [emailsUpdated])
    
    useEffect(() => {
        loadEmails()
    }, [filterBy, sortObj, emailsUpdated])    
    
    useEffect(() => {
        setFilterParams(filterBy)
    }, [filterBy])    
    
    useEffect(() => {
        setSortParams(sortObj)
    }, [sortObj])    
    
    useEffect(() => {
        let newEmail = {}
        const addNewEmail = async () => {
            newEmail = await emailService.createNewEmailMessage()
            setNewEmailMessages(list => list.length < MAX_OPEN_MODALS ? 
                [...list, newEmail] : [...list.slice(1), newEmail])
            numOpenComposeModals.current += 1
        }
        if (createNewCompose) {
            addNewEmail()
            setCreateNewCompose(false)
        }
    }, [createNewCompose])    


    const loadEmails = async() => {
        try {
            const emails = await emailService.query(filterBy, sortObj)
            setEmails(emails)
            const unReads = await emailService.queryNumUnReads();
            setUnReadsMap(unReads)
        }
        catch (error) {
            console.log('loadEmails: error:', error)
        }
    }

    // called by email-details - for star manipulation updates
    const onUpdateEmail = async (updatedEmail) => {  
        await onEmailSave(updatedEmail) 
        setEmailsUpdated(true)
    }

    const onSendEmail = async(email) => {  
        await emailService.sendEmailMessage(email);
        setEmailsUpdated(true) 
        messageService.toastMessage("Message sent")
        closeComposeModal(email.id)
    }

    const onDraftEmail = async (emailDraft) => {  
        await emailService.draftEmailMessage(emailDraft);
        setEmailsUpdated(true)
    }

    const onDiscardDraft = async (email) => {  
        await emailService.remove(email.id); 
        setEmailsUpdated(true) 
        messageService.toastMessage("Draft discarded")
        closeComposeModal(email.id)
    }

    const onCloseDraft = (email) => {  
        // removing email stub, caused by email-create with empty-draft
        const { to, subject, body } = email;
        if (!to && !subject && !body)  { 
            emailService.remove(email.id); 
        } 
        closeComposeModal(email.id)
    }

    const onNavigate = (toEmail, emailBox=emailTypes.DRAFTS) => {
        if (emailBox != emailTypes.DRAFTS) {
            navigate(`/email/${emailBox}/${toEmail.id}`)
            return
        }
        /*setNewEmailMessages(list => list.map(email => email.id).indexOf(toEmail.id) == -1 ? // check that doesn't already exist
            list.length < MAX_OPEN_MODALS ?  [...list, toEmail] : [...list.slice(1), toEmail] : // add according to size limit
            [...list.filter(email => email.id != toEmail.id), toEmail]) // already exists -> just move to top*/

        const alreadyOpenModal = newEmailMessages.map(email => email.id).indexOf(toEmail.id) >= 0
        setNewEmailMessages(list => !alreadyOpenModal ? // isn't already open
            list.length < MAX_OPEN_MODALS ?  [...list, toEmail] : [...list.slice(1), toEmail] : // add according to size limit
            [...list.filter(email => email.id != toEmail.id), toEmail]) // already open -> just move to top
        if (!alreadyOpenModal)
            numOpenComposeModals.current += 1;
}

    const onSetFilter = (updatedFilter) => {      
        setFilterBy(prevFilter => ({ ...prevFilter, ...updatedFilter }))
    }

    const onSetSort = (sortObj) => {      
        setSortObj(sortObj)
    }

    const onShowComposeModal = () => {  
        setCreateNewCompose(true)
   }

   const closeComposeModal = (emailId) => {  
        setNewEmailMessages(list => list.filter(email => email.id != emailId))
        numOpenComposeModals.current = (newEmailMessages.length == 0) ? 0 : numOpenComposeModals.current - 1
    }   

    if (!emails) return <div>Loading...</div>
        return (
            <section className="email-index">
                <div className="email-compose" onClick={onShowComposeModal} >
                    <Pencil className="image-with-hover"/> Compose
                </div>
                    {newEmailMessages.length <= 0 ? '' :
                        newEmailMessages.map( (message) => 
                            (<EmailComposeModal key={message.id} index={numOpenComposeModals.current} emailMessage={message} 
                                onSendEmail={onSendEmail} onDraftEmail={onDraftEmail} 
                                onDiscardDraft={onDiscardDraft} onCloseDraft={onCloseDraft}
                                onNavigate={onNavigate} numModals={newEmailMessages.length}/>)
                        )
                    }
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
                        onUpdateEmail={onUpdateEmail} onNavigate={onNavigate}/>
                </div>
            </section>
        )
}


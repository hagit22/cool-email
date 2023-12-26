import { useState, useEffect, useRef } from "react"
import { Link, Outlet } from "react-router-dom";
import { useParams } from "react-router"
import { emailService } from '../services/email.service';
import { EmailList } from "../cmps/EmailList";
import { EmailFilter } from "../cmps/EmailFilter";
import { SidePanel } from "../cmps/SidePanel";
import imgUrl from '../assets/imgs/compose-image.jpg'


export function EmailIndex() {

    const emailBox = useParams().box;
    const [emails, setEmails] = useState(null)
    const [unReadsMap, setUnReadsMap] = useState({})
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(emailBox))
    const [sortObj, setSortObj] = useState(emailService.getDefaultSort()) 

    const emailTypes = useRef();
    const sortInitialValues = emailService.getInitialSortValues();

    useEffect(() => {
        emailTypes.current = emailService.getEmailTypes();
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
            console.log('loadEmail: error:', error)
        }
    }

    const onUpdateEmail = (email) => {  
        try {
            setEmails(prevEmails => 
                prevEmails.some(currentEmail => currentEmail.id === email.id) ?
                  prevEmails.map(currentEmail => (currentEmail.id === email.id ? email : currentEmail)) :
                  [...prevEmails, email]
            );
            emailService.save(email) // may be asynchronous because we also updated the local copy, for the coming render
        }
        catch (error) {
            console.log('onUpdateEmail: error:', error)
        }
      }

    const onSetFilter = (updatedFilter) => {      
        setFilterBy(prevFilter => ({ ...prevFilter, ...updatedFilter }))
    }

    const onSetSort = (sortObj) => {      
        setSortObj(sortObj)
    }

    if (!emails) return <div>Loading...</div>
    return (
        <section className="email-index">
            <div>
                <Link to={`/email/single/${filterBy.emailType}`}> 
                    <img className="email-compose image-with-hover" src={imgUrl} alt="Compose"title="Compose" width="45%"/>
                </Link>
            </div>
            <div>
                <EmailFilter filterBy=
                            {{search: filterBy.search, 
                            onlyReadMails: filterBy.onlyReadMails,
                            onlyUnreadMails: filterBy.onlyUnreadMails}}
                            onSetFilter={onSetFilter} 
                            sortObj={sortObj}
                            onSetSort={onSetSort}
                            sortInitialValues={sortInitialValues} />
            </div>
            <div>
                <SidePanel filterBy={filterBy} onSetFilter={onSetFilter} 
                    emailTypes={emailTypes.current} unReadsMap={unReadsMap}/>
            </div>
            <div>
                <EmailList emails={emails} 
                    emailBox={filterBy.emailType} 
                    emailTypes={emailTypes.current}
                    onUpdateEmail={onUpdateEmail}/>
            </div>
        </section>
    )
}


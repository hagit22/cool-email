import { useEffect, useState, useRef } from "react"
import { Link, Outlet } from "react-router-dom";
import { useParams } from "react-router"
import { emailService } from '../services/email.service';
import { EmailList } from "../cmps/EmailList";
import { EmailFilter } from "../cmps/EmailFilter";
import imgUrl from '../assets/imgs/compose-image.jpg'
import { SidePanel } from "../cmps/SidePanel";


export function EmailIndex() {

    const emailBox = useParams().box;
    const [emails, setEmails] = useState(null)
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter(emailBox))

    const emailTypes = useRef();

    useEffect(() => {
        emailTypes.current = emailService.getEmailTypes();
    }, [])

    useEffect(() => {
        loadEmails()
    }, [filterBy])


    const loadEmails = async() => {
        const emails = await emailService.query(filterBy)
        setEmails(emails)
    }

    const onUpdateEmail = (email) => {  
        emailService.save(email)
    }

    const onSetFilter = (updatedFilter) => {      
        setFilterBy(prevFilter => ({ ...prevFilter, ...updatedFilter }))
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
                    onSetFilter={onSetFilter} />
            </div>
            <div>
                <SidePanel filterBy={filterBy} onSetFilter={onSetFilter} emailTypes={emailTypes.current}/>
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


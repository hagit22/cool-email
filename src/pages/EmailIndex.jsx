import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom";
import { emailService } from '../services/email.service';
import { EmailList } from "../cmps/EmailList";
import { EmailFilter } from "../cmps/EmailFilter";
import imgUrl from '../assets/imgs/compose-image.jpg'
import { SidePanel } from "../cmps/SidePanel";


export function EmailIndex() {

    const [emails, setEmails] = useState(null)
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter())

    const emailTypes = useRef();

    useEffect(() => {
        emailTypes.current = emailService.getEmailTypes();
    }, [])

    useEffect(() => {
        console.log("EmailIndex: ",filterBy)
        loadEmails()
    }, [filterBy])


    const loadEmails = async() => {
        const emails = await emailService.query(filterBy)
        setEmails(emails)
    }

    const onSetFilter = (updatedFilter) => {      
        setFilterBy(prevFilter => ({ ...prevFilter, ...updatedFilter }))
    }

    if (!emails) return <div>Loading...</div>
    return (
        <section className="email-index">
            <div>
                <Link to={`/email/compose`}>
                    <img className="email-compose image-with-hover" src={imgUrl} alt="Compose" width="45%"/>
                </Link>
            </div>
            <div>
                <EmailFilter filterBy = {filterBy} onSetFilter={onSetFilter} />
            </div>
            <div>
                <SidePanel filterBy={filterBy} onSetFilter={onSetFilter} emailTypes={emailTypes.current}/>
            </div>
            <div>
                <EmailList emails={emails} />
            </div>
        </section>
    )
}

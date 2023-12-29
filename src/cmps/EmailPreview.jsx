/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { emailUtilService } from '../services/email-utils.service';
import { EmailStar } from "./EmailStar";
import { Trash } from 'react-bootstrap-icons';


export function EmailPreview({ email: initialEmail, emailBox, emailTypes, onUpdateEmail }) {
    
    const [updatedEmail, setUpdatedEmail] = useState(initialEmail)

    useEffect(() => {
        if (updatedEmail !== initialEmail ) // not the first time
            onUpdateEmail(updatedEmail)
    }, [updatedEmail]); 


    const onUpdateEmailType = (emailType) => {
        setUpdatedEmail(prevEmail => ({...prevEmail, emailType}));
    }

    const {id, from, subject, sentAt, wasRead, emailType} = updatedEmail;
    return (
        <article className={"email-preview1 pretty-border" + (!wasRead ? " email-preview-unread" : '')}>
            <div className="email-preview-content">
                <div className="email-preview-main">
                    <div className="email-preview-start">
                        {!emailType.includes(emailTypes.TRASH) ?
                            <EmailStar emailType={emailType} emailTypes={emailTypes} onUpdateEmailType={onUpdateEmailType}/> :
                            <Trash className="icon-style"></Trash>}
                        <Link to={`/email/single/${emailBox}/${id}`}>
                            <div className="email-preview-from">{from}</div>
                        </Link>
                    </div>
                    <Link to={`/email/single/${emailBox}/${id}`}>
                        <div className="email-preview-subject">{subject.substring(0, 50) + ((subject.length >= 50) ? '...' : '')}</div>
                    </Link>
                </div>
                <Link to={`/email/single/${emailBox}/${id}`}>
                    <div className="email-preview-date"> {emailUtilService.emailDateTimeShortDisplay(sentAt)}</div>
                </Link>
            </div>
        </article>
    )
}

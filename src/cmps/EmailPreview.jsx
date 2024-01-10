/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { emailUtilService } from '../services/email-utils.service';
import { EmailStar } from "./EmailStar";
import { Trash } from 'react-bootstrap-icons';


export function EmailPreview({ email: initialEmail, emailBox, emailTypes, onUpdateEmail, onNavigate }) {
    
    const [updatedEmail, setUpdatedEmail] = useState(initialEmail)

    useEffect(() => {
        if (updatedEmail !== initialEmail ) // not the first time
            onUpdateEmail(updatedEmail)
    }, [updatedEmail]); 


    const onUpdateEmailType = (emailType) => {
        setUpdatedEmail(prevEmail => ({...prevEmail, emailType}));
    }

    const onGotoDetails = () => {
        onNavigate(updatedEmail, emailBox)
    }

    const {from, to, subject, sentAt, createdAt, wasRead, emailType} = updatedEmail;
    return (
        <article className={"email-preview pretty-border" + (!wasRead ? " email-preview-unread" : '')}>
            <div className="email-preview-content">
                <div className="email-preview-main">
                    <div className="email-preview-start">
                        {!emailType.includes(emailTypes.TRASH) ?
                            <EmailStar emailType={emailType} emailTypes={emailTypes} onUpdateEmailType={onUpdateEmailType}/> :
                            <Trash className="icon-style"></Trash>}
                        <div onClick={onGotoDetails}>
                            {(emailBox === emailTypes.DRAFTS) ? <div className="email-preview-from"><span>Draft</span></div> :
                             (emailBox === emailTypes.SENT) ?
                                <div className="email-preview-from">To: {to}</div> :
                                <div className="email-preview-from">{from}</div>}
                        </div>
                    </div>
                    <div className="email-preview-subject" onClick={onGotoDetails}>
                        {subject.substring(0, 50) + ((subject.length >= 50) ? '...' : '')}
                    </div>
                </div>
                <div className="email-preview-date" onClick={onGotoDetails}>
                    {emailUtilService.emailDateTimeShortDisplay(
                        emailType.includes(emailTypes.DRAFTS) ? createdAt : sentAt
                    )}
                </div>
            </div>
        </article>
    )
}

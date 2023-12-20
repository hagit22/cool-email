/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { emailUtilService } from '../services/email-utils.service';

export function EmailPreview({ email, emailBox }) {

    const {id, from, subject, sentAt, wasRead} = email;
    return (
        <article className={"email-preview pretty-border" + (wasRead ? " email-preview-read" : '')}>
            <Link to={`/email/single/${emailBox}/${id}`}>
                <div className="email-preview-content">
                    <div className="email-preview-main">
                        <div className="email-preview-from">{from}</div>
                        <div className="email-preview-subject">{subject.substring(0, 55) + ((subject.length >= 55) ? '...' : '')}</div>
                    </div>
                    <div className="email-preview-date">
                        {emailUtilService.emailDateTimeShortDisplay(sentAt)}
                    </div>
                </div>
            </Link>
        </article>
    )
}

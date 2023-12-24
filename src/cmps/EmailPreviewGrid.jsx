/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { emailUtilService } from '../services/email-utils.service';

export function EmailPreviewGrid({ email }) {

    const {id, from, subject, sentAt, wasRead} = email;
    return (
        <article className={"email-preview pretty-border" + (!wasRead ? " email-preview-unread" : '')}>
            <Link to={`/email/${id}`}>
                <div className="email-preview-grid-container">
                    <div>{from}</div>
                    <div>{subject.substring(0, 80) + ((subject.length >= 80) ? '...' : '')}</div>
                    <div className="email-preview-grid-date">
                        {emailUtilService.emailDateTimeShortDisplay(sentAt)}
                    </div>
                </div>
            </Link>
        </article>
    )
}
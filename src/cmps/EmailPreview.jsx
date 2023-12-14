import { Link } from "react-router-dom";
import { emailUtils } from '../services/email.service';

export function EmailPreview({ email }) {

    const {id, from, subject, sentAt, wasRead} = email;
    return (
        <article className={"email-preview pretty-border" + (wasRead ? " email-preview-read" : '')}>
            <Link to={`/email/${id}`}>
                <div className="email-preview-content">
                    <div className="email-preview-main">
                        <div className="email-preview-from">{from}</div>
                        <div className="email-preview-subject">{subject.substring(0, 55) + ((subject.length >= 55) ? '...' : '')}</div>
                    </div>
                    <div className="email-preview-date">
                        {emailUtils.emailDateTimeShortDisplay(sentAt)}
                    </div>
                </div>
            </Link>
        </article>
    )
}

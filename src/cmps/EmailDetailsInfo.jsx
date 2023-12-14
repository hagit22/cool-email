
import { emailUtils } from '../services/email.service';

export function EmailDetailsInfo({ from, to, sentAt, show }) {

    if (!show) return "";
    return (
        <div className="email-details-info pretty-border">
            <div className="details-info-row"><span>From:</span> {from}</div>
            <div className="details-info-row"><span>To:</span> {to}</div>
            <div className="details-info-row"><span>Sent at:</span> {emailUtils.emailDateTimeLongDisplay(sentAt)}</div>
        </div>
    )
}

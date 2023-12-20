/* eslint-disable react/prop-types */

import { emailUtilService } from '../services/email-utils.service';

export function EmailDetailsInfo({ from, to, sentAt, show }) {

    if (!show) return "";
    return (
        <div className="email-details-info pretty-border">
            <div className="details-info-row"><span>From:</span> {from}</div>
            <div className="details-info-row"><span>To:</span> {to}</div>
            <div className="details-info-row"><span>Sent at:</span> {emailUtilService.emailDateTimeLongDisplay(sentAt)}</div>
        </div>
    )
}

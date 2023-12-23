/* eslint-disable react/prop-types */

import { useState } from "react"
import { emailUtilService } from '../services/email-utils.service';
import { EmailDetailsInfo } from './EmailDetailsInfo'

export function EmailDetails({currentEmail}) {
  
    const [extraInfo, setExtraInfo] = useState(false);

    const onClickArrowDown = () => {
      setExtraInfo( prev => setExtraInfo(!prev) );
    }

    if (!currentEmail) return <div>Loading...</div>
    const {sentAt, from, to, subject, body} = currentEmail;
    return (  
      <section className="email-details pretty-border">
        <div className="details-subject">
          <h4>{subject}</h4>
        </div>
        <div className="details-from-date">
          <div className="details-from">
            <h5> {from} </h5>
            <span className="arrow" onClick={onClickArrowDown}>&#x1F893;</span>
            <EmailDetailsInfo from={from} to={to} sentAt={sentAt} show={extraInfo}/>
          </div>
          <h5>{emailUtilService.emailDateTimeShortDisplay(sentAt)}</h5>
        </div>
        <div className="details-body">
          <div>{body}</div>
        </div>
      </section>
    )
}


import { useEffect, useState } from "react"
import { emailService } from "../services/email.service"
import { emailUtils } from '../services/email.service';
import { EmailDetailsInfo } from './EmailDetailsInfo'

export function EmailDetails({emailId}) {
  
    const [email, setEmail] = useState(null)
    const [extraInfo, setExtraInfo] = useState(false);

    useEffect(() => {
        loadEmail()
    }, [])

    async function loadEmail() {
        try {
          console.log("EmailDetails: emailId = ",emailId)
          const email = await emailService.getById(emailId)
          setEmail(email)
        }
        catch (error) {
            console.log('error:', error)
        }
    }

    const onClickArrowDown = () => {
      setExtraInfo( prev => setExtraInfo(!prev) );
    }

    if (!email) return <div>Loading...</div>
    const {sentAt, from, to, subject, body} = email;
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
          <h5>{emailUtils.emailDateTimeShortDisplay(sentAt)}</h5>
        </div>
        <div className="details-body">
          <div>{body}</div>
        </div>
      </section>
    )
}

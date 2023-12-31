import { useRef } from "react"
import { useParams } from "react-router"
import { emailService } from '../services/email.service';
import { EmailListContainer } from "./EmailListContainer";
import { EmailDetailsContainer } from "./EmailDetailsContainer";


export function EmailIndex() {

    const emailId = useParams().details
    const emailBox = useParams().box;

    const emailTypes = useRef(emailService.getEmailTypes());

    function onEmailSave(email) {
        emailService.save(email)
    }


    if (!emailId)
        return <EmailListContainer emailBox={emailBox} emailTypes={emailTypes.current} onEmailSave={onEmailSave}/>
    return <EmailDetailsContainer emailId={emailId} emailBox={emailBox} emailTypes={emailTypes.current} onEmailSave={onEmailSave}/>
}


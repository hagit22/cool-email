import { useRef } from "react"
import { useParams } from "react-router"
import { emailService } from '../services/email.service';
import { EmailListContainer } from "./EmailListContainer";
import { EmailDetailsContainer } from "./EmailDetailsContainer";


export function EmailIndex() {

    const emailId = useParams().details
    const emailBox = useParams().box;

    const emailTypes = useRef(emailService.getEmailTypes());


    async function onEmailSave(email) {
        try {
            await emailService.save(email)
        }
        catch (error) {
            console.log('onEmailSave: error:', error)
        }
    }

    return(
        <div>
            {(emailId) ? 
                <EmailDetailsContainer emailId={emailId} 
                    emailBox={emailBox} emailTypes={emailTypes.current} onEmailSave={onEmailSave}/> :
                <EmailListContainer emailBox={emailBox} emailTypes={emailTypes.current} onEmailSave={onEmailSave}/>}
        </div>
    )
}


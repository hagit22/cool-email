
import { useNavigate, useParams } from "react-router"
import { emailService } from "../services/email.service"
import { ArrowLeft } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';
import { EmailDetails } from '../cmps/EmailDetails'
import { EmailCompose } from '../cmps/EmailCompose'


export function SingleEmailContainer() {
  
    const emailId = useParams().details;
    const navigate = useNavigate()

    const onClickArrowBack = () => {
      navigate('/email')   // doesn't browse know where to go?  
    }

    const onClickTrash = async() => {
      try {
        await emailService.remove(emailId);
        onClickArrowBack();
      }
      catch (error) {
        console.log("onClickTrash: error=",error)
      }
    }

    return (  
        <section className="single-email-container pretty-border">
          <div className="single-email-control">
            <ArrowLeft className="icon-style image-with-hover" onClick={onClickArrowBack}/>
            <Trash className="icon-style image-with-hover"  onClick={onClickTrash}/>
          </div> 
          {emailId ? <EmailDetails emailId={emailId}/> : <EmailCompose/>}
        </section>
    )
}

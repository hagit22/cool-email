import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { emailService } from "../services/email.service"
import { ArrowLeft } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';
import { XLg } from 'react-bootstrap-icons';
import { SendFill } from 'react-bootstrap-icons';
import { EmailDetails } from '../cmps/EmailDetails'
import { EmailCompose } from '../cmps/EmailCompose'


export function SingleEmailContainer() {
  
    const emailId = useParams().details;
    const navigate = useNavigate()

    const [editMail, setEditMail] = useState(emailService.getInitialEditMail())
    const [reset, setReset] = useState(false);

    const onClickArrowBack = () => {
      navigate('/email')   
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

    const onClickDiscard = () => {
      setReset(true);
    }

    const onClickSend = () => {
      !editMail.to ? alert("Please specify at least one recipient") :
        emailService.createEmailMessage(editMail.from, editMail.to, editMail.subject, editMail.body);
    }

    const onUpdateEditMail = (newMailEdit) => {   
      if (reset) {  
        setReset(false);
        return;
      }
      setEditMail(prevEdit => ({ ...prevEdit, ...newMailEdit }))
  }

  return (  
        <section className="single-email-container pretty-border">
          <div className="single-email-icons">
            <div className="single-email-control">
              <ArrowLeft className="icon-style image-with-hover" onClick={onClickArrowBack}/>
              {emailId ?
                <Trash className="icon-style image-with-hover"  onClick={onClickTrash}/> :
                <XLg className="icon-style image-with-hover"  onClick={onClickDiscard}/> }
            </div>
            <div>
              {emailId ? '' : <SendFill className="icon-style image-with-hover"  onClick={onClickSend}/>}
            </div> 
          </div>
          {emailId ? <EmailDetails emailId={emailId}/> : <EmailCompose editMail={emailService.getInitialEditMail()} reset={reset} onUpdateEditMail={onUpdateEditMail}/>}
        </section>
    )
}

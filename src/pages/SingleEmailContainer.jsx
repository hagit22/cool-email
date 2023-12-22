import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useOutletContext } from 'react-router-dom'
import { emailService } from "../services/email.service"
import { emailUtilService } from "../services/email-utils.service"
import { ArrowLeft } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';
import { XLg } from 'react-bootstrap-icons';
import { SendFill } from 'react-bootstrap-icons';
import { EmailDetails } from '../cmps/EmailDetails'
import { EmailCompose } from '../cmps/EmailCompose'


export function SingleEmailContainer() {
  
    const emailBox = useParams().box;
    const emailId = useParams().details;
    const navigate = useNavigate()

    const [editMail, setEditMail] = useState(emailService.getInitialEditMail())
    const [reset, setReset] = useState(false);

    useEffect(() => {
      if (reset)
        setReset(false)
    }, [reset])


    const onClickArrowBack = () => {
      navigate(`/email/${emailBox}`)   
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
      const { from, to, subject, body } = editMail;
      const message = !to ? 
        "Please specify at least one recipient" :
          !emailUtilService.isValidEmail(to) ? 
            `The address "${to}" in the "To" field was not recognized. Please make sure that all addresses are properly formed` :
            '';
      if (message) {
        alert(message)
        return;
      }
      if (subject.trim().length == 0 && body.trim().length == 0) 
        if (!confirm("Send this message without a subject or text in the body?" ))
          return;
      emailService.createEmailMessage(from, to, subject, body);
      onClickArrowBack();
    }

    const onUpdateEditMail = (newMailEdit) => {   
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
          {emailId ? 
            <EmailDetails emailId={emailId}/> : 
            <EmailCompose editMail={emailService.getInitialEditMail()} reset={reset} onUpdateEditMail={onUpdateEditMail}/>}
        </section>
    )
}

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useOutletContext } from 'react-router-dom'
import { emailService } from "../services/email.service"
import { emailUtilService } from "../services/email-utils.service"
import { ArrowLeft } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';
import { Envelope } from 'react-bootstrap-icons';
import { XLg } from 'react-bootstrap-icons';
import { SendFill } from 'react-bootstrap-icons';
import { EmailDetails } from '../cmps/EmailDetails'
import { EmailCompose } from '../cmps/EmailCompose'


export function SingleEmailContainer() {
  
    const emailBox = useParams().box;
    const emailId = useParams().details;
    const navigate = useNavigate()

    const [currentEmail, setCurrentEmail] = useState(null)
    const [reset, setReset] = useState(false);
    const [markAsUnread, setMarkAsUnread] = useState(false);

    useEffect(() => {
      if(emailId)
        loadEmail()
    }, [])

    useEffect(() => {
      if(emailId && currentEmail) { // details-page and not initial 'empty' render
        saveWasReadOrNot(true)  // Always save as-read, when entering the details view (unless already so)
      }
    }, [currentEmail])

    useEffect(() => {
      if(emailId && currentEmail) { // details-page and not initial 'empty' render
        saveWasReadOrNot(false)
      }
    }, [markAsUnread])

    useEffect(() => {
      if (reset)
        setReset(false)
    }, [reset])


    async function loadEmail() {
      try {
        const emailLoaded = await emailService.getById(emailId)
        setCurrentEmail(emailLoaded);
      }
      catch (error) {
          console.log('loadEmail: error:', error)
      }
    }

    async function saveWasReadOrNot(markWasReadOrNot) {
      try {
        const hasBeenRead = currentEmail.wasRead;
        if (markWasReadOrNot === hasBeenRead) // Already what we need to mark
          return;
        if (markWasReadOrNot) { // mark as read
          let updatedEmail = {...currentEmail, wasRead: true}
          emailService.save(updatedEmail); // No need to wait for save. Staying in details-view
          return;
        }
        let updatedEmail = {...currentEmail, wasRead: false} // mark as unread
        await emailService.save(updatedEmail); // Wait for save, so the change will be visible when going back to list-view
        onClickArrowBack();
      }
      catch (error) {
          console.log('saveWasReadOrNot: error:', error)
      }
    }

    const onClickArrowBack = () => {
        navigate(`/email/${emailBox}`)   
    }

    const onClickTrash = () => {
      try {
        emailService.remove(emailId);
        onClickArrowBack();
      }
      catch (error) {
        console.log("onClickTrash: error=",error)
      }
    }

    const onClickMarkUnread = async() => {
      setMarkAsUnread(true);
    }

    const onClickDiscard = () => {
      setReset(true);
    }

    const onClickSend = () => {
      const { from, to, subject, body } = currentEmail;
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

    // callback from child
    const onUpdateEmail = (newEmail) => {   
      setCurrentEmail(prevEmail => ({ ...prevEmail, ...newEmail }))
    }

  return (  
        <section className="single-email-container pretty-border">
          <div className="single-email-icons">
            <div className="single-email-control">
              <ArrowLeft className="icon-style image-with-hover" onClick={onClickArrowBack}/>
              {emailId ?
                <Trash className="icon-style image-with-hover"  onClick={onClickTrash}/> :
                <XLg className="icon-style image-with-hover"  onClick={onClickDiscard}/> }
              {emailId ? <Envelope className="icon-style image-with-hover"  onClick={onClickMarkUnread}/> : ''}
            </div>
            <div>
              {emailId ? '' : <SendFill className="icon-style image-with-hover"  onClick={onClickSend}/>}
            </div> 
          </div>
          {emailId ? 
            <EmailDetails currentEmail={currentEmail}/> :
            <EmailCompose editEmail={emailService.getInitialEditMail()} reset={reset} onUpdateEmail={onUpdateEmail}/>}
        </section>
    )
}

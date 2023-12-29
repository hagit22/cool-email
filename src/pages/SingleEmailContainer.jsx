/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router"
import { useOutletContext } from 'react-router-dom'
import { emailService } from "../services/email.service"
import { emailUtilService } from "../services/email-utils.service"
import { messageService } from "../services/message.service"
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
    //const [markAsUnread, setMarkAsUnread] = useState(false);
    //const [wasRemoved, setWasRemoved] = useState(false);

    const emailTypes = useRef();

    useEffect(() => {
      if(emailId)
        loadEmail()
      emailTypes.current = emailService.getEmailTypes();
    }, [])

    useEffect(() => {
      if(emailId && currentEmail) { // details-page and not initial 'empty' render
        saveAsRead()  // Always mark as read, when entering the details view 
      }
    }, [currentEmail])

    /*useEffect(() => {
      if(emailId && currentEmail) { // details-page and not initial 'empty' render
        saveAsUnread()
      }
    }, [markAsUnread])*/

    /*useEffect(() => {
      onClickArrowBack();
    }, [wasRemoved])*/

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

    async function saveAsRead() {
      if (currentEmail.wasRead) // already marked as read
        return
      let updatedEmail = {...currentEmail, wasRead: true}
      emailService.save(updatedEmail); // No need to wait for save. Staying in details-view
      return;
    }

    async function saveAsUnread() {
      try {
        let updatedEmail = {...currentEmail, wasRead: false} 
        await emailService.save(updatedEmail); // Wait for save, so the change will be visible when going back to list-view
        messageService.toastMessage("Conversation marked as unread.")
        onClickArrowBack();
      }
      catch (error) {
          console.log('saveAsUnread: error:', error)
      }
    }

    const onClickArrowBack = () => {
        navigate(`/email/${emailBox}`)   
    }

    const onClickTrash = () => {
      if (currentEmail.emailType.includes(emailTypes.current.TRASH)) {
        emailService.remove(emailId);
        messageService.toastMessage("Conversation deleted forever.")
      }
      else {
        let updatedEmail = {...currentEmail, emailType: [emailTypes.current.TRASH], removedAt: Date.now()}
        emailService.save(updatedEmail); 
        messageService.toastMessage("Conversation moved to Trash.")
      }
      onClickArrowBack();
    }

    const onClickMarkUnread = async() => {
      saveAsUnread();
      //setMarkAsUnread(true);
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
                (currentEmail && currentEmail.emailType.includes(emailTypes.current.TRASH) ?
                  <button onClick={onClickTrash} className="simple-button image-with-hover delete-forever">Delete forever</button> :
                  <Trash onClick={onClickTrash} className="icon-style image-with-hover"/>) :
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

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useOutletContext } from 'react-router-dom'
import { emailService } from "../services/email.service"
import { messageService } from "../services/message.service"
import { EmailDetails } from '../cmps/EmailDetails'
import { ArrowLeft } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';
import { Envelope } from 'react-bootstrap-icons';


export function EmailDetailsContainer({emailId, emailBox, emailTypes, onEmailSave}) {
  
    const navigate = useNavigate()

    const [currentEmail, setCurrentEmail] = useState(null)

    useEffect(() => {
      loadEmail()
    }, [])

    useEffect(() => {
    if(currentEmail)  // Not initial 'empty' render
        saveAsRead()  // Always mark as read, when entering the details view 
    }, [currentEmail])


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
      onEmailSave(updatedEmail); // No need to wait for save. Staying in details-view
    }

    async function saveAsUnread() {
      try {
        let updatedEmail = {...currentEmail, wasRead: false} 
        await onEmailSave(updatedEmail); // Wait for save, so the change will be visible when going back to list-view
        messageService.toastMessage("Conversation marked as unread.")
        onClickArrowBack();
      }
      catch (error) {
          console.log('saveAsUnread: error:', error)
      }
    }

    const onClickTrash = async () => {
      try {
        if (currentEmail.emailType.includes(emailTypes.TRASH)) {
          await emailService.remove(emailId);
          messageService.toastMessage("Conversation deleted forever.")
        }
        else {
          let updatedEmail = {...currentEmail, emailType: [emailTypes.TRASH], removedAt: Date.now()}
          await onEmailSave(updatedEmail); 
          messageService.toastMessage("Conversation moved to Trash.")
        }
        onClickArrowBack();
      }
      catch (error) {
        console.log('onClickTrash: error:', error)
    }
  }

  const onClickMarkUnread = () => {
      saveAsUnread();
    }

    const onClickArrowBack = () => {
      navigate(`/email/${emailBox}`) /* This is like initial routing with original defaults (e.g. sort, filter) */
  }

  return (  
        <section className="details-container pretty-border">
          <div className="details-icons">
            <div className="details-control">
              <ArrowLeft className="icon-style image-with-hover" onClick={onClickArrowBack}/>
              {currentEmail && currentEmail.emailType.includes(emailTypes.TRASH) ?
                <button onClick={onClickTrash} className="simple-button image-with-hover delete-forever">Delete forever</button> :
                <Trash onClick={onClickTrash} className="icon-style image-with-hover"/>}
              <Envelope className="icon-style image-with-hover"  onClick={onClickMarkUnread}/> 
            </div>
          </div>
          <EmailDetails currentEmail={currentEmail}/> 
        </section>
    )
}

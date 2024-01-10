/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { EmailComposeForm } from "./EmailComposeForm"
import { XLg } from 'react-bootstrap-icons';


export function EmailComposeModal({index, emailMessage, onSendEmail, onDraftEmail, 
                                    onDiscardDraft, onCloseDraft, onNavigate, numModals}) {

  const [currentEmail, setCurrentEmail] = useState(emailMessage)
  const position = useRef(40 + (index-1) % numModals * 250)

  useEffect(() => {
    onDraftEmail(currentEmail)
  }, [currentEmail])


  function onTouchModal ({target}) {
    if (target.classList.contains('close')) {
      onCloseDraft(currentEmail)
      return
    }
    onNavigate(currentEmail)
  }

  function onSaveDraft (email) {
    setCurrentEmail(email)  // we keep it in local-state, so we can use it when needed, (e.g. onCloseModal() or onSelectModal() 
                            // that are controlled here) The original emailMessage (in props) may have changed by periodical drafts
  }

  return (  
      <section className="compose-modal" style={{right: position.current}}>
        <header onClick={onTouchModal}>
          <h1>New Message</h1>
          <div className="close-modal close">
            <XLg size={16} className="close"/>
          </div>
        </header>
        <EmailComposeForm emailMessage={emailMessage} onSendEmail={onSendEmail} 
          onSaveDraft={onSaveDraft} onDiscardDraft={onDiscardDraft}/>
      </section>
    )
}
  
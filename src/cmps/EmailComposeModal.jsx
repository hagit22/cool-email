/* eslint-disable react/prop-types */
import { XLg } from 'react-bootstrap-icons';
import { EmailComposeForm } from "./EmailComposeForm"


export function EmailComposeModal({initialEdit, onSendEmail}) {


  function onCloseModal () {
    onSendEmail(null)
  }

  return (  
      <section className="compose-modal">
        <header>
          <h1>New Message</h1>
          <XLg size={16} className="close" onClick={onCloseModal}/>
        </header>
        <EmailComposeForm initialEdit={initialEdit} onSendEmail={onSendEmail}/>
      </section>
    )
}

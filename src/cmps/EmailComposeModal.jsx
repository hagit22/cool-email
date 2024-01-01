/* eslint-disable react/prop-types */
import { EmailComposeForm } from "./EmailComposeForm"
import { XLg } from 'react-bootstrap-icons';


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

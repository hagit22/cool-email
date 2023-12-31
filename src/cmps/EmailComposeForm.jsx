/* eslint-disable react/prop-types */
import { useState } from 'react';

export function EmailComposeForm({initialEdit, onSendEmail}) {

  const [currentEdit, setCurrentEdit] = useState(initialEdit);


  function handleChange({target}) {
      let { name: field, value } = target
      setCurrentEdit(prevEdit => ({ ...prevEdit, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const { to, subject, body } = currentEdit;
    const message = !to ? "Please specify at least one recipient" : ''
    if (message) {
      alert(message)
      return;
    }
    if (subject.trim().length == 0 && body.trim().length == 0) 
      if (!confirm("Send this message without a subject or text in the body?" ))
        return;
    onSendEmail(currentEdit)
  }

return (  
    <section className="component pretty-border">
      <form className="email-compose-form" onSubmit={handleSubmit}>
        <div className="email-compose-fields">
          <div>From:</div>
          <div> {currentEdit.from} </div>
          <label htmlFor="to">To:</label>
          <input className="compose-text" onChange={handleChange} id="to" name="to" value={currentEdit.to} type="email" />
          <label htmlFor="subject">Subject:</label>
          <input className="compose-text" onChange={handleChange} id="subject" name="subject" value={currentEdit.subject} type="text" />
          <label htmlFor="body">Body:</label>
          <textarea className="compose-text" onChange={handleChange} id="body" name="body" value={currentEdit.body} />
          <input type="submit" value="Send" className='compose-submit-button'/>
        </div>
      </form>
    </section>
  )
}

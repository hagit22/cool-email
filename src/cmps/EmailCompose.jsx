/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';

export function EmailCompose({editMail, reset, onUpdateEditMail}) {

  const [currentEdit, setCurrentEdit] = useState(editMail);
  const initialEdit = useRef(editMail)

  if (reset) {
    setCurrentEdit(initialEdit.current);
  }
    
  useEffect(() => {
    console.log("in use effect: ", currentEdit);
    if (reset)
      return;
    onUpdateEditMail(currentEdit);
}, [currentEdit])


function handleChange({target}) {
    let { name: field, value } = target
    setCurrentEdit(prevEdit => ({ ...prevEdit, [field]: value }))
  }

  return (  
    <section className="component pretty-border">
      <form className="email-compose-form"> {/*onSubmit={handleSubmit} >*/} 
        <div className="email-compose-fields">
          <label htmlFor="from">From:</label>
          <div> {currentEdit.from} </div>
          <label htmlFor="to">To:</label>
          <input className="compose-text" onChange={handleChange} id="to" name="to" value={currentEdit.to} type="email" />
          <label htmlFor="subject">Subject:</label>
          <input className="compose-text" onChange={handleChange} id="subject" name="subject" value={currentEdit.subject} type="text" />
          <label htmlFor="body">Body:</label>
          <textarea className="compose-text" onChange={handleChange} id="body" name="body" value={currentEdit.body} />
          {/*<input type="submit" value="Send"/>*/}
        </div>
      </form>
    </section>
  )
}

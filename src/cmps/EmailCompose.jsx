

export function EmailCompose() {
  
  function handleChange({target}) {
    console.log("Compose: ",target);
  }

  function handleSubmit({target}) {
    console.log("Submit: ",target);
  }

  return (  
    <section className="component pretty-border">
      <form className="email-compose-form"  onSubmit={handleSubmit}>
        <div>
          <label htmlFor="from">From:</label>
          <div>my-email@gmail.com</div>
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input onChange={handleChange} id="subject" name="subject" value={""} type="text" />
        </div>
        <div>
          <label htmlFor="body">Body:</label>
          <input onChange={handleChange} id="body" name="body" value={""} type="textarea" />
        </div>
        <div>
          <input type="submit" value="Send"/>
        </div>
      </form>
    </section>
  )
}

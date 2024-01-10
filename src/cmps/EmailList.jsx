/* eslint-disable react/prop-types */
import { EmailPreview } from "./EmailPreview";

export function EmailList({ emails, emailBox, emailTypes, onUpdateEmail, onNavigate }) {
    return (
        <ul className="email-list">
            {emails.map(email =>
                <li key={email.id}>
                    <EmailPreview email={email} emailBox={emailBox} 
                        emailTypes={emailTypes} onUpdateEmail={onUpdateEmail} onNavigate={onNavigate}/>
                </li>
            )}
        </ul>
    )
}

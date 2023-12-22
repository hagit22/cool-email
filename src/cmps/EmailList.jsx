/* eslint-disable react/prop-types */
import { EmailPreview } from "./EmailPreview";
/*import { EmailPreviewGrid } from "./EmailPreviewGrid";*/

export function EmailList({ emails, emailBox, emailTypes, onUpdateEmail }) {
    return (
        <ul className="email-list">
            {emails.map(email =>
                <li key={email.id}>
                    <EmailPreview email={email} emailBox={emailBox} 
                        emailTypes={emailTypes} onUpdateEmail={onUpdateEmail}/>
                </li>
            )}
        </ul>
    )
}

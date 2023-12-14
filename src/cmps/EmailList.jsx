import { EmailPreview } from "./EmailPreview";
import { EmailPreviewGrid } from "./EmailPreviewGrid";

export function EmailList({ emails }) {
    return (
        <ul className="email-list">
            {emails.map(email =>
                <li key={email.id}>
                    <EmailPreview email={email} />
                </li>
            )}
        </ul>
    )
}

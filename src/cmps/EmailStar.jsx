/* eslint-disable react/prop-types */
import { Star } from 'react-bootstrap-icons';
import { StarFill } from 'react-bootstrap-icons';

export function EmailStar({ emailType: initialEmailType, emailTypes, onUpdateEmailType }) {

    const updatedEmailType = initialEmailType;
    
    const onToggleIcon = () => {
        if (updatedEmailType.includes(emailTypes.STARRED)) 
            updatedEmailType.splice(updatedEmailType.indexOf(emailTypes.STARRED), 1)
        else
            updatedEmailType.push(emailTypes.STARRED);
        onUpdateEmailType(updatedEmailType)
    } 

    return (
        <section>
            {updatedEmailType.includes(emailTypes.STARRED) ? 
                <StarFill className="icon-style fill-star" onClick={onToggleIcon}/> : 
                <Star className="icon-style" onClick={onToggleIcon}/> }
        </section>
    )
}

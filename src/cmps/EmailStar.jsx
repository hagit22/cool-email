/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import { Star } from 'react-bootstrap-icons';
import { StarFill } from 'react-bootstrap-icons';

export function EmailStar({ emailType: initialEmailType, emailTypes, onUpdateEmailType }) {

    const [updatedEmailType, setUpdatedEmailType] = useState(initialEmailType);
    
    useEffect(() => {
        onUpdateEmailType(updatedEmailType)
    }, [updatedEmailType]); 


    const onToggleIcon = () => {
        setUpdatedEmailType(prevType => prevType.includes(emailTypes.STARRED) ?
            prevType.filter(type => type!= emailTypes.STARRED) :
            [...prevType, emailTypes.STARRED])
    } 

    return (
        <section>
            {updatedEmailType.includes(emailTypes.STARRED) ? 
                <StarFill className="icon-style fill-star" onClick={onToggleIcon}/> : 
                <Star className="icon-style" onClick={onToggleIcon}/> }
        </section>
    )
}

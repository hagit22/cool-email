import { useEffect, useState } from "react"
import { eventBusService } from "../services/event-bus.service"


export function Toast() {
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        const unsubscribe = eventBusService.signUpTo('toast-event', (eventId, { message, timeout }) => {
            setToastMessage(message)
            setTimeout(() => {
                onCloseMessage()
            }, timeout)
        })
        return unsubscribe
    }, [])

    /*useEffect(() => {
            console.log("Toast Message: ",toastMessage)
    }, [toastMessage])*/


    function onCloseMessage() {
        setToastMessage('')
    }

    if (!toastMessage) return ''
    return (
        <div className="toast-message">
            <div>{toastMessage}</div>
            <button onClick={onCloseMessage}>X</button>
        </div>
    )
}


import { eventBusService } from "./event-bus.service"

export const messageService = {
    toastMessage,
    alertMessage
}

const DEFAULT_TOAST_TIMEOUT = 4000

const messageEvents = {
    TOAST_EVENT: 'toast-event',
    ALERT_EVENT: 'alert-event'
}

function toastMessage(message, timeout = DEFAULT_TOAST_TIMEOUT) {
    eventBusService.emit(messageEvents.TOAST_EVENT, {message, timeout})
}

function alertMessage(message) {
    eventBusService.emit(messageEvents.ALERT_EVENT, message)
}


//  Internal

const debugMessageHandler = (eventId, data) => console.log("Message-Service:\n",eventId,": data = ",data)

eventBusService.signUpTo(messageEvents.TOAST_EVENT, debugMessageHandler)
eventBusService.signUpTo(messageEvents.ALERT_EVENT, debugMessageHandler)
    














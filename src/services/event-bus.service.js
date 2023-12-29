
function createEventEmitter() {
    const listenersMap = {}
    return {
        // Use this function to subscribe to an event
        signUpTo(eventId, listenerFunction) {
            listenersMap[eventId] = 
                (listenersMap[eventId]) ? 
                    [...listenersMap[eventId], listenerFunction] : 
                    [listenerFunction]

            return () => {  // cleanup function
                listenersMap[eventId] = listenersMap[eventId].filter(anyListener => anyListener !== listenerFunction)
            }
        },
        // Use this function to emit an event
        emit(eventId, data) {
            console.log(listenersMap)
            if (!listenersMap[eventId]) return
            listenersMap[eventId].forEach(listenerFunction => listenerFunction(eventId, data))
        }
    }
}

export const eventBusService = createEventEmitter()



/* Trick for DEBUG
window.listenersMap = listenersMap
window.ebs = eventBusService */




import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { emailUtilService } from './email-utils.service.js'

export const emailService = {
    query,
    save,
    remove,
    getById,
    createEmailMessage,
    getDefaultFilter,
    getEmailTypes,
    getInitialEditMail
}

export const emailUtils = {
    emailDateTimeShortDisplay,
    emailDateTimeLongDisplay,

}

const STORAGE_KEY = 'email_db'
const EMAIL_ID_LENGTH = 6;

const loggedInUser = {
    email: 'student@coding.com',
    fullName: 'React Student'
}

// Enum
const emailBound = Object.freeze({
    INBOUND: "inbound",
    OUTBOUND: "outbound",
});

const emailTypes = Object.freeze({
    INBOX: "Inbox",
    STARRED: "Starred",
    SENT: "Sent",
    DRAFTS: "Drafts",
    TRASH: "Trash"
});

_generateEmailMessages()

async function query(filterBy) {
    let emailMessages = await storageService.query(STORAGE_KEY)
    if (filterBy) {
        let {search = '', onlyReadMails, onlyUnreadMails, emailType} = filterBy
        const regexModelTerm = new RegExp(search, 'i')
        emailMessages = emailMessages.filter (email =>
            ((regexModelTerm.test(email.subject) || regexModelTerm.test(email.body) || regexModelTerm.test(email.from)) 
                && !(onlyUnreadMails && email.wasRead) && !(onlyReadMails && !email.wasRead)
                && email.emailType == emailType)
        )
    }
    return emailMessages
}

function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function save(emailMessage) {
    if (emailMessage.id) {
        return storageService.put(STORAGE_KEY, emailMessage)
    } else {
        emailMessage.isOn = false
        return storageService.post(STORAGE_KEY, emailMessage)
    }
}

function createEmailMessage(from = loggedInUser.email, to = '', subject = '', body = '') {
    let emailMessage =  {
        subject,
        body,
        from,
        to,
        sentAt: Date.now(),
        removedAt: null,
        wasRead: false,
        isStarred: false,
        emailType: emailTypes.SENT
        // send upon <enter>? 
        // field validation...
        // grid with name tags...
        // send yourself!! 
        // back arrow from details ==> go to correct folder (should we preserve all filters?)
        // compose X icon... & also dont send mail if all empty!
    }
    save(emailMessage);
}

function getDefaultFilter() {
    return {
        search: '',
        onlyReadMails: false,
        onlyUnreadMails: false,
        emailType: emailTypes.INBOX
    }
}

function getEmailTypes() {
    return emailTypes;
}

function getInitialEditMail() {
    return {
        from: loggedInUser.email,
        to: '',
        subject: '',
        body: '',
    }
}

function emailDateTimeShortDisplay(dateTime) {
    let dateTimeDisplay = new Date(dateTime);
    return dateTimeDisplay.toDateString() == new Date().toDateString() ? 
        dateTimeDisplay.toLocaleTimeString(undefined, {
            second: '2-digit',
            minute: '2-digit',
            hour: '2-digit'
          }) : 
        dateTimeDisplay.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          })
}  
   
function emailDateTimeLongDisplay(dateTime) {
    let dateTimeDisplay = new Date(dateTime);
    return dateTimeDisplay.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        second: '2-digit',
        minute: '2-digit',
        hour: '2-digit',
      })
}  
   
function _generateEmailMessages() {
    let emailMessages = utilService.loadFromStorage(STORAGE_KEY)
    if (!emailMessages || !emailMessages.length) {
        emailMessages = [];
        for (let i = 0; i < 5; i++) 
            emailMessages.push (_generateMessage(loggedInUser.email, emailBound.INBOUND));
        for (let i = 0; i < 5; i++) 
            emailMessages.push (_generateMessage(loggedInUser.email, emailBound.OUTBOUND));
        utilService.saveToStorage(STORAGE_KEY, emailMessages)
    }
}

function _generateMessage(userEmail, bound = emailBound.INBOUND) {
    let emailMessage = {
        subject: emailUtilService.generateSubject(),
        body: emailUtilService.generateBody(),
        from: bound == emailBound.OUTBOUND ? userEmail : emailUtilService.generateRandomEmailAddress(),
        to: bound == emailBound.INBOUND ? userEmail : emailUtilService.generateRandomEmailAddress(),
        sentAt: emailUtilService.generateRandomDate(),
        removedAt: null,
        wasRead: emailUtilService.generateRandomBoolean(),
        isStarred: emailUtilService.generateRandomBoolean(),
        emailType: bound == emailBound.INBOUND ? emailTypes.INBOX : emailTypes.SENT
    }
    save(emailMessage);
}






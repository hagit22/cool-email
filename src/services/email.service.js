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
        let { search = '', onlyReadMails, onlyUnreadMails, emailType } = filterBy
        const regexModelTerm = new RegExp(search, 'i')
        emailMessages = emailMessages.filter(email =>
        ((regexModelTerm.test(email.subject) || regexModelTerm.test(email.body) || regexModelTerm.test(email.from))
            && !(onlyUnreadMails && email.wasRead) && !(onlyReadMails && !email.wasRead)
            && email.emailType.includes(emailType))
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
    let emailType = [emailTypes.SENT]
    if (to === loggedInUser.email)
        emailType.push(emailTypes.INBOX)
    let emailMessage = {
        subject,
        body,
        from,
        to,
        sentAt: Date.now(),
        removedAt: null,
        wasRead: false,
        //isStarred: false,
        emailType: emailType
    }
    save(emailMessage);
}

function getDefaultFilter(emailType = emailTypes.INBOX) {
    return {
        search: '',
        onlyReadMails: false,
        onlyUnreadMails: false,
        emailType: emailType
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

function _generateEmailMessages() {
    let emailMessages = utilService.loadFromStorage(STORAGE_KEY)
    if (!emailMessages || !emailMessages.length) {
        emailMessages = [];
        for (let i = 0; i < 5; i++)
            emailMessages.push(_generateMessage(loggedInUser.email, emailBound.INBOUND));
        for (let i = 0; i < 5; i++)
            emailMessages.push(_generateMessage(loggedInUser.email, emailBound.OUTBOUND));
        utilService.saveToStorage(STORAGE_KEY, emailMessages)
    }
}

function _generateMessage(userEmail, bound = emailBound.INBOUND) {
    let emailType = [(bound == emailBound.INBOUND) ? emailTypes.INBOX : emailTypes.SENT];
    if (emailUtilService.generateRandomBoolean())
        emailType.push(emailTypes.STARRED);
    return {
        id: utilService.makeId(EMAIL_ID_LENGTH),
        subject: emailUtilService.generateSubject(),
        body: emailUtilService.generateBody(),
        from: bound == emailBound.OUTBOUND ? userEmail : emailUtilService.generateRandomEmailAddress(),
        to: bound == emailBound.INBOUND ? userEmail : emailUtilService.generateRandomEmailAddress(),
        sentAt: emailUtilService.generateRandomDate(),
        removedAt: null,
        wasRead: emailUtilService.generateRandomBoolean(),
        //isStarred: emailUtilService.generateRandomBoolean(),
        emailType: emailType
    
    }
}






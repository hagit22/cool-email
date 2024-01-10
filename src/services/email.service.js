import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { emailUtilService } from './email-utils.service.js'

export const emailService = {

    // CRUDL
    query,
    queryNumUnReads,
    save,
    remove,
    getById,
    createNewEmailMessage,

    // Email Message Handling
    sendEmailMessage,
    draftEmailMessage,

    // Initializers
    getEmailTypes,
    getDefaultFilter,
    getDefaultSort,
    getInitialSortValues
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

// Enum
const emailTypes = Object.freeze({
    INBOX: "Inbox",
    STARRED: "Starred",
    SENT: "Sent",
    DRAFTS: "Drafts",
    TRASH: "Trash"
});

_generateEmailMessages()

async function query(filterBy, sortObj) {
    let emailMessages = await storageService.query(STORAGE_KEY)

    if (filterBy) {
        let { search = '', onlyReadMails, onlyUnreadMails, emailType } = filterBy
        const regexModelTerm = new RegExp(search, 'i')
        emailMessages = emailMessages.filter(email =>
        ((regexModelTerm.test(email.subject) || regexModelTerm.test(email.body) || regexModelTerm.test(email.from))
            && !(onlyUnreadMails && email.wasRead) && !(onlyReadMails && !email.wasRead)
            && email.emailType.includes(emailType)
            && (email.to || email.subject || email.body))
        )
    }

    if (filterBy && filterBy.emailType.includes(emailTypes.DRAFTS) && 
        sortObj && sortObj.sortBy == 'sentAt') 
            sortObj.sortBy = 'createdAt'

    if (sortObj) {
        const sortDir = sortObj.isAscending ? 1 : -1
        const sortKey = sortObj.sortBy;
        emailMessages = emailMessages.sort((a,b) => 
            (utilService.toLowerCaseTolerant(a[sortKey]) > utilService.toLowerCaseTolerant(b[sortKey]) ? 1 : -1) * sortDir);
    }
    return emailMessages
}

async function queryNumUnReads() {
    let emailMessages = await storageService.query(STORAGE_KEY)
    let unreadMap = {}
    Object.values(emailTypes).forEach( value => {
        unreadMap = {...unreadMap, [value]: emailMessages.filter(email => 
            email.emailType.includes(value) && email.wasRead == false).length
        }
    })
    return unreadMap;
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
        return storageService.post(STORAGE_KEY, emailMessage)
    }
}

function createNewEmailMessage() {
    const emailMessage = {
        from: loggedInUser.email,
        to: '',
        subject: '',
        body: '',
        createdAt: new Date(Date.now()).toISOString(),
        sentAt: null,
        removedAt: null,
        wasRead: false,
        emailType: []
    }
    return save(emailMessage)
}

function sendEmailMessage(emailMessage) {
    let emailType = [emailTypes.SENT]
    if (emailMessage.to === loggedInUser.email)
        emailType.push(emailTypes.INBOX)
    emailMessage.emailType = emailType
    emailMessage.sentAt = new Date(Date.now()).toISOString()
    return save(emailMessage);
}

function draftEmailMessage(emailMessage) {
    emailMessage.emailType = [emailTypes.DRAFTS]
    emailMessage.sentAt = new Date(Date.now()).toISOString()
    emailMessage.wasRead = true // gmail marks drafts as 'read' by default
    return save(emailMessage);
}

function getEmailTypes() {
    return emailTypes;
}

function getDefaultFilter(emailType = emailTypes.INBOX) {
    return {
        search: '',
        onlyReadMails: false,
        onlyUnreadMails: false,
        emailType: emailType
    }
}

function getDefaultSort() {
    return {
        sortBy: 'sentAt',
        isAscending: false
    }
}

function getInitialSortValues() {
    return {
        date: {key: 'sentAt', isAscending: false},
        subject: {key: 'subject', isAscending: false}
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
    const randDate = emailUtilService.generateRandomDate()
    return {
        id: utilService.makeId(EMAIL_ID_LENGTH),
        subject: emailUtilService.generateSubject(),
        body: emailUtilService.generateBody(),
        from: bound == emailBound.OUTBOUND ? userEmail : emailUtilService.generateRandomEmailAddress(),
        to: bound == emailBound.INBOUND ? userEmail : emailUtilService.generateRandomEmailAddress(),
        createdAt: randDate,
        sentAt: randDate,
        removedAt: null,
        wasRead: emailUtilService.generateRandomBoolean(),
        emailType: emailType
    }
}






import { LoremIpsum } from "lorem-ipsum";

export const emailUtilService = {
    generateRandomEmailAddress,
    generateRandomBoolean,
    generateRandomDate,
    generateSubject,
    generateBody
}

function generateRandomEmailAddress () {
    var letters = 'abcdefghijklmnopqrstuvwxyz';
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var iterations = Math.floor(Math.random() * 5) + 3;
    var string = '';
    for(let i=0; i<iterations; i++){
        string += letters[Math.floor(Math.random() * letters.length)];
    }
    string += '.';
    for(let i=0; i<3; i++){
        string += chars[Math.floor(Math.random() * chars.length)];
    }
    return (string + '@gmail.com');
}

function generateRandomBoolean() {
    return Math.random() < 0.5;
}

function generateRandomDate() {
    const startDate = new Date('2022-01-01').getTime();
    const endDate = Date.now();
    const timeDiff = endDate - startDate
    const randomTime = Math.random() * timeDiff;
    const randomDate = new Date(startDate + randomTime);
    return randomDate;
}

function generateSubject() {
    return new LoremIpsum().generateSentences(1);
}

function generateBody() {
    return new LoremIpsum().generateParagraphs(1);
}

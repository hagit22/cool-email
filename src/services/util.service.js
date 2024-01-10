
export const utilService = {
    makeId,
    saveToStorage,
    loadFromStorage,
    alignTexts,
    getObjectFromQueryParams,
    toLowerCaseTolerant,
    objectsEqual
}

function makeId(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function loadFromStorage(key, defaultValue = null) {
    var value = localStorage[key] || defaultValue;
    return JSON.parse(value);
}

function alignTexts (textArray) {
    const maxLength = Math.max(...(textArray.map(item => item.length)));
    return textArray.map(item => item.padEnd(maxLength,' '));
}

function getObjectFromQueryParams(queryParams, initialObject) {
    let paramsObject = initialObject
    Object.entries(queryParams).forEach( ([key, value]) => {
        if (paramsObject.includes(key) )
        paramsObject[key] = value
    })
    return paramsObject
}

function toLowerCaseTolerant(obj) {
    try {
        return String(obj).toLowerCase()
    }
    catch(error) { // for example, a blank string
        return obj
    }
}

function objectsEqual(obj1, obj2) {
    return Object.keys(obj1).every((key) =>  obj1[key] === obj2[key])
}

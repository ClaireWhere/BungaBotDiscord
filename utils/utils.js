/**
 * 
 * @param {Array} a 
 * @param {Array} b 
 * @returns {boolean}
 * @example
 * ```js
 * arrayMatch([1, 5, 3], [1, 3, 5]); // returns true
 * arrayMatch([1, 3, 3], [1, 3, 5]); // returns false
 * arrayMatch([], []); // returns true
 * arrayMatch([], undefined); // returns false
 * ```
 */
function arrayMatch(a, b) {    
    if (isEmpty(a) && isEmpty(b)) { return true; }
    if (a === undefined || b === undefined || a.length != b.length ) { return false; }
    return a.every(x => b.includes(x)) && b.every(x => a.includes(x));
}

/**
 * 
 * @param {Object} obj 
 * @returns {boolean}
 * @example
 * ```js
 * isEmpty({}); // returns true
 * isEmpty(undefined); // returns true
 * isEmpty([]); // returns true
 * isEmpty(1); // returns true
 * 
 * isEmpty({"property": 1}); // returns false
 * isEmpty([{}]); // returns false
 * isEmpty("1"); // returns false
 * ```
 */
function isEmpty(obj) {
    if (obj === undefined) { return true; }
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

/**
 * 
 * @param {Array} arr 
 * @returns {string} a comma separated string of arr
 * @example
 * ```js
 * formatList(['a','b','c']); // returns 'a, b, and c'
 * formatList(['a','b']); // returns 'a and b'
 * formatList(['a']); // returns 'a'
 * ```
 */
function formatList(arr) {
    if (arr === undefined) { return undefined; }
    if (arr.length <= 1) { return arr.shift(); }
    const separator = arr.length > 2 ? ', ' : ' ';
    var formattedList = ``;
    const lastElement = arr.pop();
    arr.forEach(element => {
        formattedList += `${element}${separator}`;
    });
    formattedList += `and ${lastElement}`;
    return formattedList;
}

/**
 * Returns an array containing all elements of 'search' that do not intersect with 'intersection'
 * @param {Array | string} search 
 * @param {Array | string} intersection
 * @returns {Array}
 */
function removeIntersection(search, intersection) {
    if ((typeof(search) != "object" && typeof(intersection) != "object")) {
        return search === intersection ? [] : [search];
    }

    if (typeof(search) != "object") {
        return intersection.includes(search) ? [] : [search];
    }
    if (typeof(intersection) != "object") {
        return search.filter(e => e != intersection);
    }
    return search.filter(e => !intersection.includes(e));
}

/**
 * 
 * @param {Array<string>} arr 
 * @returns 
 */
function arrayToLowerCase(arr) {
    return arr.map(e => e.toLowerCase());
}

/**
 * 
 * @param {string|number} str 
 * @returns {number?} integer representation of `str`. null if invalid
 */
function toNum(str) {
    if (!isNumeric(str)) {
        return null;
    }
    if (typeof(str) === typeof(0)) { 
        return str;
    }
    return parseInt(str, 10);
}

function isNumeric(input){
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
}

/**
 * 
 * @param {import('discord.js').GuildChannel} channel 
 * @returns {string}
 */
function getChannelParentName(channel) {
    if (!channel['parent']) { return ''; }
    if (!channel.parent['name']) { return ''; }
    return channel.parent.name.toLowerCase();
}

function getDate() {
    var date = new Date();
    return `${date.getFullYear()}-${pad(date.getMonth(), 2)}-${pad(date.getDay(), 2)} ${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}`;
}
function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

/**
 * 
 * @param {int} date 
 * @returns {{days: int,hours: int,minutes: int,seconds: int,ms: int}}
 */
function dateToObject(date) {
    const msSecond = 1000;
    const msMinute = msSecond * 60;
    const msHour = msMinute * 60;
    const msDay = msHour * 24;

    const days = Math.floor(date / msDay);
    date %= msDay;
    const hours = Math.floor(date / msHour);
    date %= msHour;
    const minutes = Math.floor(date / msMinute);
    date %= msMinute;
    const seconds = Math.floor(date / msSecond);
    date %= msSecond;
    const ms = date;
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        ms: ms
    }
}


function dateToString(date) {
    const objDate = dateToObject(date);
    console.log(objDate);
    if (objDate.days === 0 && objDate.hours === 0 && objDate.minutes === 0 && objDate.seconds === 0) {
        return `${objDate.ms} Milliseconds`
    }
    let message = objDate.days > 1 ? `${objDate.days} Days, ` : '';
    message += objDate.days === 1 ? `${objDate.days} Day, ` : '';
    message += objDate.hours > 1 ? `${objDate.hours} Hours, ` : '';
    message += objDate.hours === 1 ? `${objDate.hours} Hour, ` : '';
    message += objDate.minutes > 1 ? `${objDate.minutes} Minutes, ` : '';
    message += objDate.minutes === 1 ? `${objDate.minutes} Minute, ` : '';
    message += objDate.seconds > 1 ? `${objDate.seconds} Seconds, ` : '';
    message += objDate.seconds === 1 ? `${objDate.seconds} Second, ` : '';

    console.log(message);
    return message.slice(0, -2);
}

module.exports = { arrayMatch, isEmpty, formatList, removeIntersection, arrayToLowerCase, toNum, isNumeric, getChannelParentName, getDate, dateToString }
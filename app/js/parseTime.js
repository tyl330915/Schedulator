var firstDayCells = [
    "M 8:30 AM", "M 10:00 AM", "M 11:30 AM", "M 1:00 PM", "M 2:30 PM", "M 4:00 PM", "M 5:30 PM", "M 7:00 PM",
    "T 8:30 AM", "T 10:00 AM", "T 11:30 AM", "T 1:00 PM", "T 2:30 PM", "T 4:00 PM", "T 5:30 PM", "T 7:00 PM",
    "TH 5:30 PM", "W 9:00 AM", "W 12:15 PM"
];

var secondaryCells = [
    "W 5:30 PM", "W 7:00 PM", "W 10:30 AM", "W 1:45 PM",
    "TH 8:30 AM", "TH 10:00 AM", "TH 11:30 AM", "TH 1:00 PM", "TH 2:30 PM", "TH 4:00 PM", "TH 5:30 PM", "TH 7:00 PM",
    "F 8:30 AM", "F 10:00 AM", "F 11:30 AM", "F 1:00 PM", "F 2:30 PM", "F 4:00 PM",

];

const twoDayFirstCells = [
    "M 8:30 AM", "M 10:00 AM", "M 11:30 AM", "M 1:00 PM", "M 2:30 PM", "M 4:00 PM", "M 5:30 PM", "M 7:00 PM",
    "T 8:30 AM", "T 10:00 AM", "T 11:30 AM", "T 1:00 PM", "T 2:30 PM", "T 4:00 PM", "T 5:30 PM", "T 7:00 PM"
];

function parseTeachingTimes(dayTime) { //Takes the "desired" and "undesired" teaching times data from the Faculty Preferences, and returns an array of the times.
    var array = dayTime.split(';');

    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].trim();
    }
    // console.log(array);
    return array;
};

function parsePartTime(aClass) { //for parsing the saved faculty course and times in Schedulate

    var firstDay = aClass[0];
    var spacer = aClass.split(" ")[1];
    var time = spacer.split(":")[0];
    //console.log(firstDay, time);

    return firstDay + time;
};

function parseFullTime(aClass) { //takes the Fac class desired and undesired data and finds the first weekly class
    var dayTim = [];
    //console.log(aClass);
    aClass = aClass.toString();

    /*Schedule Requests [Mon/Thu 8:30-9:45 ]	Schedule Requests [Mon/Thu 10:00-11:15]	Schedule Requests [Mon/Thu 11:30-12:45]	Schedule Requests [Mon/Thu 1-2:15]	Schedule Requests [Mon/Thu 2:30-3:45]	Schedule Requests [Mon/Thu 4:00-5:15]	Schedule Requests [Tue/Fri 8:30-9:45]	Schedule Requests [Tue/Fri 10:00-11:15]	Schedule Requests [Tue/Fri 11:30-12:45]	Schedule Requests [Tue/Fri 1-2:15]	Schedule Requests [Tue/Fri 2:30-3:45]	Schedule Requests [Tue/Fri 4:00-5:15]	Schedule Requests [Wed 9:00-11:45 (double class only)]	Schedule Requests [Wed 12:15-3:00 (double class only)]	Schedule Requests [Mon 5:30-6:45]	Schedule Requests [Mon 7:00-8:15]	Schedule Requests [Mon 5:30-8:15]	Schedule Requests [Tue 5:30-6:45]	Schedule Requests [Tue 7:00-8:15]	Schedule Requests [Wed 5:30-6:45]	Schedule Requests [Wed 7:00-8:15]	Schedule Requests [Thu 5:30-6:45]	Schedule Requests [Thu 7:00-8:15]

    */

    if (aClass.includes("Mon/Thu 8:30-9:45") || aClass.includes("M/TH 8:30 AM-9:45 AM")) { dayTim.push("M 8:30 AM", "TH 8:30 AM") };
    if (aClass.includes("Mon/Thu 10:00-11:15") || aClass.includes("M/TH 10:00 AM-11:15 AM")) { dayTim.push("M 10:00 AM", "TH 10:00 AM") };
    if (aClass.includes("Mon/Thu 11:30-12:45") || aClass.includes("M/TH 11:30 AM-12:45 PM")) { dayTim.push("M 11:30 AM", "TH 11:30 AM") };
    if (aClass.includes("Mon/Thu 1-2:15") || aClass.includes("M/TH 1:00-2:15")) { dayTim.push("M 1:00 PM", "TH 1:00 PM") };
    if (aClass.includes("Mon/Thu 2:30-3:45") || aClass.includes("M/TH 2:30 PM-3:45 PM")) { dayTim.push("M 2:30 PM", "TH 2:30 PM") };
    if (aClass.includes("Mon/Thu 4:00-5:15") || aClass.includes("M/TH 4:00 PM-5:15 PM")) { dayTim.push("M 4:00 PM", "TH 4:00 PM") };

    if (aClass.includes("Tue/Fri 8:30-9:45") || aClass.includes("T/F 8:30 AM-9:45 AM")) { dayTim.push("T 8:30 AM", "F 8:30 AM") };
    if (aClass.includes("Tue/Fri 10:00-11:15") || aClass.includes("T/F 10:00 AM-11:15 AM")) { dayTim.push("T 10:00 AM", "F 10:00 AM") };
    if (aClass.includes("Tue/Fri 11:30-12:45") || aClass.includes("T/F 11:30 AM-12:45 PM")) { dayTim.push("T 11:30 AM", "F 11:30 AM") }; ///NEED TO FIX THIS IN SURVEY
    if (aClass.includes("Tue/Fri 1-2:15") || aClass.includes("T/F 1:00 PM-2:15 PM")) { dayTim.push("T 1:00 PM", "F 1:00 PM") };
    if (aClass.includes("Tue/Fri 2:30-3:45") || aClass.includes("T/F 2:30 PM-3:45 PM")) { dayTim.push("T 2:30 PM", "F 2:30 PM") };
    if (aClass.includes("Tue/Fri 4:00-5:15") || aClass.includes("T/F 4:00 PM-5:15 PM")) { dayTim.push("T 4:00 PM", "F 4:00 PM") };

    if (aClass.includes("Mon/Wed 5:30-6:45") || aClass.includes("M/W 5:30 PM-6:45 PM")) { dayTim.push("M 5:30 PM", "W 5:30 PM") };
    if (aClass.includes("Mon/Thu 5:30-6:45") || aClass.includes("M/TH 5:30 PM-6:45 PM")) { dayTim.push("M 5:30 PM", "TH 5:30 PM") };
    if (aClass.includes("Tue/Thu 5:30-6:45") || aClass.includes("T/TH 5:30 PM-6:45 PM")) { dayTim.push("T 5:30 PM", "TH 5:30 PM") };
    if (aClass.includes("Mon/Wed 7:00-8:15") || aClass.includes("M/W 7:00 PM-8:15 PM")) { dayTim.push("M 7:00 PM", "W 7:00 PM") };
    if (aClass.includes("Mon/Thu 7:00-8:15") || aClass.includes("M/TH 7:00 PM-8:15 PM")) { dayTim.push("M 7:00 PM", "TH 7:00 PM") };
    if (aClass.includes("Tue/Thu 7:00-8:15") || aClass.includes("T/TH 7:00 PM-8:15 PM")) { dayTim.push("T 7:00 PM", "TH 7:00 PM") };

    // if (aClass.includes("Mon/Thurs 5:00pm-6:15pm") || aClass.includes("Mon/Wed 5:30-6:45")) { dayTim.push("M 5:30 PM") };
    // if (aClass.includes("Mon/Thurs 7:00pm-8:15pm") || aClass.includes("Mon/Wed 7:00-8:15")) { dayTim.push("M 7:00 PM") };

    if (aClass.includes("Wed 9:00-11:45") || aClass.includes("W 9:00 AM-11:45 AM")) { dayTim.push("W 9:00 AM", "W 10:30 AM") };
    if (aClass.includes("Wed 12:15-3:00") || aClass.includes("W 12:15 PM-3:00 PM")) { dayTim.push("W 12:15 PM", "W 1:45 PM") };
    if (aClass.includes("Mon 5:30-8:15") || aClass.includes("M 5:30 PM-8:15 PM")) { dayTim.push("M 5:30 PM", "M 7:00 PM") };
    if (aClass.includes("Tue 5:30-8:15") || aClass.includes("T 5:30 PM-8:15 PM")) { dayTim.push("T 5:30 PM", "T 7:00 PM") };
    if (aClass.includes("Wed 5:30-8:15") || aClass.includes("W 5:30 PM-8:15 PM")) { dayTim.push("W 5:30 PM", "W 7:00 PM") };
    if (aClass.includes("Thu 5:30-8:15") || aClass.includes("TH 5:30 PM-8:15 PM")) { dayTim.push("TH 5:30 PM", "TH 7:00 PM") };

    if (aClass.includes("Mon 5:30-6:45") || aClass.includes("M 5:30 PM-6:45 PM")) { dayTim.push("M 5:30 PM") };
    if (aClass.includes("Tues 5:30-6:45") || aClass.includes("T 5:30 PM-6:45 PM")) { dayTim.push("T 5:30 PM") };
    if (aClass.includes("Wed 5:30-6:45") || aClass.includes("W 5:30 PM-6:45 PM")) { dayTim.push("W 5:30 PM") };
    if (aClass.includes("Thu 5:30-6:45") || aClass.includes("TH 5:30 PM-6:45 PM")) { dayTim.push("TH 5:30 PM") };


    if (aClass.includes("Mon 7:00 PM-8:15 PM") || aClass.includes("M 7:00 PM-8:15 PM")) { dayTim.push("M 7:00 PM") };
    if (aClass.includes("Tue 7:00-8:15") || aClass.includes("T 7:00 PM-8:15 PM")) { dayTim.push("T 7:00 PM") };
    if (aClass.includes("Wed 7:00-8:15") || aClass.includes("W 7:00 PM-8:15 PM")) { dayTim.push("W 7:00 PM") };
    if (aClass.includes("Thu 7:00-8:15") || aClass.includes("TH 7:00 PM-8:15 PM")) { dayTim.push("TH 7:00 PM") };




    // console.log("aclass: ", aClass);
    // console.log("dayTim: ", dayTim);
    //let testDiv = document.getElementById("W 10:30 AM");


    return dayTim;

};

function doubleClassParse(dropID) {

    //console.log("doubleClassParse: ", dropID);

    switch (dropID) {

        case "M 8:30 AM":
            dcDrop = "M 10:00 AM";
            break;

        case 'M 10:00 AM':
            dcDrop = "M 11:30 AM";
            break;

        case 'M 11:30 AM':
            dcDrop = "M 1:00 PM";
            break;

        case 'M 1:00 PM':
            dcDrop = 'M 2:30 PM';
            break;

        case 'M 2:30 PM':
            dcDrop = "M 4:00 PM";
            break;

        case 'M 4:00 PM':
            dcDrop = "M 5:30 PM";
            break;

        case 'M 5:30 PM':
            dcDrop = "M 7:00 PM";
            break;

        case 'M 7:00 PM':
            dcDrop = "Cannot Drop";
            break;


        case "T 8:30 AM":
            dcDrop = "T 10:00 AM";
            break;

        case 'T 10:00 AM':
            dcDrop = "T 11:30 AM";
            break;

        case 'T 11:30 AM':
            dcDrop = "T 1:00 PM";
            break;

        case 'T 1:00 PM':
            dcDrop = 'T 2:30 PM';
            break;

        case 'T 2:30 PM':
            dcDrop = "T 4:00 PM";
            break;

        case 'T 4:00 PM':
            dcDrop = "T 5:30 PM";
            break;

        case 'T 5:30 PM':
            dcDrop = "T 7:00 PM";
            break;

        case 'T 7:00 PM':
            dcDrop = "Cannot Drop";
            break;



        case 'W 9:00 AM':
            dcDrop = "W 10:30 AM";
            break;

        case 'W 12:15 PM':
            dcDrop = "W 1:45 PM";
            break;

        case 'W 5:30 PM':
            dcDrop = "W 7:00 PM";
            break;

        case 'W 7:00 PM':
            dcDrop = "Cannot Drop";
            break;


        case "TH 8:30 AM":
            dcDrop = "TH 10:00 AM";
            break;

        case 'TH 10:00 AM':
            dcDrop = "TH 11:30 AM";
            break;

        case 'TH 11:30 AM':
            dcDrop = "TH 1:00 PM";
            break;

        case 'TH 1:00 PM':
            dcDrop = 'TH 2:30 PM';
            break;

        case 'TH 2:30 PM':
            dcDrop = "TH 4:00 PM";
            break;

        case 'TH 4:00 PM':
            dcDrop = "TH 5:30 PM";
            break;

        case 'TH 5:30 PM':
            dcDrop = "TH 7:00 PM";
            break;

        case 'TH 7:00 PM':
            dcDrop = "Cannot Drop";
            break;


        case "F 8:30 AM":
            dcDrop = "F 10:00 AM";
            break;

        case 'F 10:00 AM':
            dcDrop = "F 11:30 AM";
            break;

        case 'F 11:30 AM':
            dcDrop = "F 1:00 PM";
            break;

        case 'F 1:00 PM':
            dcDrop = 'F 2:30 PM';
            break;

        case 'F 2:30 PM':
            dcDrop = "F 4:00 PM";
            break;

        case 'F 4:00 PM':
            dcDrop = "Cannot Drop";
            break;


        default:
            dcDrop = "Invalid time";

    };
    return dcDrop;
};


function chopAMPM(timeStr) {

    timeStr = timeStr.slice(0, -3);
    return timeStr;
};

function sisterParse(dropID) {

    let sisterDrop = "";


    if (dropID === "addingCourse") { sisterDrop = "AddCourse" };
    if (dropID === "M 8:00 AM" || dropID === "M 8:30 AM") { sisterDrop = "TH 8:30 AM" };
    if (dropID === "M 9:30 AM" || dropID === "M 10:00 AM") { sisterDrop = "TH 10:00 AM" };
    if (dropID === "M 11:00 AM" || dropID === "M 11:30 AM") { sisterDrop = "TH 11:30 AM" };
    if (dropID === "M 12:30 PM" || dropID === "M 1:00 PM") { sisterDrop = "TH 1:00 PM" };
    if (dropID === "M 2:30 PM" || dropID === "M 2:00 PM") { sisterDrop = "TH 2:30 PM" };
    if (dropID === "M 3:30 PM" || dropID === "M 4:00 PM") { sisterDrop = "TH 4:00 PM" };
    if (dropID === "M 5:30 PM") { sisterDrop = "W 5:30 PM" };
    if (dropID === "M 7:00 PM") { sisterDrop = "W 7:00 PM" };

    if (dropID === "T 8:00 AM" || dropID === "T 8:30 AM") { sisterDrop = "F 8:30 AM" };
    if (dropID === "T 9:30 AM" || dropID === "T 10:00 AM") { sisterDrop = "F 10:00 AM" };
    if (dropID === "T 11:00 AM" || dropID === "T 11:30 AM") { sisterDrop = "F 11:30 AM" };
    if (dropID === "T 12:30 PM" || dropID === "T 1:00 PM") { sisterDrop = "F 1:00 PM" };
    if (dropID === "T 2:30 PM" || dropID === "T 2:00 PM") { sisterDrop = "F 2:30 PM" };
    if (dropID === "T 3:30 PM" || dropID === "T 4:00 PM") { sisterDrop = "F 4:00 PM" };
    if (dropID === "T 5:30 PM") { sisterDrop = "TH 5:30 PM" };
    if (dropID === "T 7:00 PM") { sisterDrop = "TH 7:00 PM" };

    // if (dropID === "W 9:00 AM" || dropID === "W 8:30 AM") { sisterDrop = "W 10:30 AM" };
    // if (dropID === "W 11:30 AM" || dropID === "W 12:15 PM") { sisterDrop = "W 1:45 PM" };


    //if (dropID === "M 5:00 PM" || dropID === "M 5:30 PM") { sisterDrop = "W 5:30 PM" };
    //if (dropID === "T 5:00 PM" || dropID === "T 5:30 PM") { sisterDrop = "TH 7:00 PM" };
    // if (dropID === "W 5:30 PM") { sisterDrop = "W 7:00 PM" };
    // if (dropID === "TH 5:30 PM") { sisterDrop = "TH 7:00 PM" };

    //if (dropID === "W 8:30 AM") { sisterDrop = "W 10:00 AM" };
    //if (dropID === "W 11:30 AM") { sisterDrop = "W 1:00 PM" };



    return sisterDrop;
};
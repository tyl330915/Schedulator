function classBlocks(day, timePart, perWeek) {
    //console.log("Blox One: ", day, timePart, perWeek);
    if (perWeek === "2" || perWeek === 2) {
        switch (timePart) {
            case "8:30 AM":
                return "Block 1: 8:30 AM-9:45 AM";
            case "10:00 AM":
                return "Block 2: 10:00 AM-11:15 AM";
            case "11:30 AM":
                return "Block 3: 11:30 AM-12:45 PM";
            case "1:00 PM":
                return "Block 4: 1:00 PM-2:15 PM";
            case "2:30 PM":
                return "Block 5: 2:30 PM-3:45 PM";
            case "4:00 PM":
                return "Block 6: 4:00 PM-5:15 PM";
            case "5:30 PM":
                return "Block 7: 5:30 PM-6:45 PM";
            case "7:00 PM":
                return "Block 8: 7:00 PM-8:15 PM";
            default:
                console.log("Error: Check time");
        }
    }

    if (day !== "W" && (perWeek === "1" || perWeek === 1)) {
        //console.log("Blox Two: ", day, timePart);
        switch (timePart) {
            case "8:30 AM":
                return "Block 1&2: 8:30 AM-11:15 AM";
                //case "9:00 AM":
                //    return "* Wed Block A: 9:00 AM-11:45 AM";
            case "10:00 AM":
                return "Block 2&3: 10:00 AM-12:45 PM";
            case "11:30 AM":
                return "Block 3&4: 11:30 AM-2:15 PM";
            case "12:15 PM":
                return "* Wed Block B: 12:15-3:00 PM";
            case "1:00 PM":
                return "Block 4&5: 1:00 PM-3:45 PM";
            case "2:30 PM":
                return "Block 5&6: 2:30 PM-5:15 PM";
            case "4:00 PM":
                return "Block 6&7: 4:00 PM-6:45 PM";
            case "5:30 PM":
                return "Block 7&8: 5:30 PM-8:15 PM";
            default:
                console.log("Error: Check time");
        }

    }


    if (day === "W" && (perWeek === "1" || perWeek === 1)) {
        // console.log("Blox Three: ", day, timePart);
        switch (timePart) {
            case "9:00 AM":
                return "* Wed Block A: 9:00-11:45 AM";
            case "12:15 PM":
                return "* Wed Block B: 12:15-3:00 PM";
            case "5:30 PM":
                return "* Wed Block 9: 5:30 PM-8:15 PM";
            default:
                console.log("Error: Check time");
        }
    }

};

function parseSisterDay(day) {
    let dayParse = "";
    let finalDays = "";
    if (day === "M") { dayParse = "/TH" };
    if (day === "T") { dayParse = "/F" };

    finalDays = day + dayParse;

    return finalDays;
}

function reverseBlockTime(time) {
    //console.log("SwitchTime: ", time);
    switch (time) {
        case "Block 1: 8:30 AM-9:45 AM":
            return "8:30 AM";
        case "Block 2: 10:00 AM-11:15 AM":
            return "10:00 AM";
        case "Block 3: 11:30 AM-12:45 PM":
            return "11:30 AM";
        case "Block 4: 1:00 PM-2:15 PM":
            return "1:00 PM";
        case "Block 5: 2:30 PM-3:45 PM":
            return "2:30 PM";
        case "Block 6: 4:00 PM-5:15 PM":
            return "4:00 PM";
        case "Block 7: 5:30 PM-6:45 PM":
            return "5:30 PM";
        case "Block 8: 7:00 PM-8:15 PM":
            return "7:00 PM";

        case "Block A: 9:00-11:45 AM":
            return "9:00 AM";
        case "* Wed Block A: 9:00-11:45 AM":
            return "9:00 AM";
        case "* Wed Block B: 12:15-3:00 PM":
            return "12:15 PM";
        case "Block B: 12:15 PM-3:00 PM":
            return "12:15 PM";
        case "Block 9: 5:30 PM-8:15 PM":
            return "5:30 PM";
        case "* Wed Block 9: 5:30 PM-8:15 PM":
            return "5:30 PM";

        case "Block 1&2: 8:30 AM-11:15 AM":
            return "8:30 AM";
        case "Block 2&3: 10:00 AM-12:45 PM":
            return "10:00 AM";
        case "Block 3&4: 11:30 AM-2:15 PM":
            return "11:30 AM";
        case "Block 4&5: 1:00 PM-3:45 PM":
            return "1:00 PM";
        case "Block 5&6: 2:30 PM-5:15 PM":
            return "2:30 PM";
        case "Block 6&7: 4:00 PM-6:45 PM":
            return "4:00 PM";
        case "Block 7&8: 5:30 PM-8:15 PM":
            return "5:30 PM";


        default:
            return "Something is wrong with the time";
    }
};
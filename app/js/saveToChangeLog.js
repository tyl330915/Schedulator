///AS OF OCT 2023, THIS IS NOT BEING USED, BUT IS LEFT HERE IN CASE IT IS NEEDED LATER


function saveToChangeLog(info) {
    localforage.getItem('changeLog', function(err, cLog) {
        if (!cLog) {
            cLog = [];
        }


        let currentDateandTime = getDateAndTime();

        let fullRecord = [currentDateandTime[0], currentDateandTime[1], info];
        console.log("Date and Time: ", currentDateandTime, info);

        cLog.unshift(fullRecord); //ADD RECORD TO BEGINNING OF LOG
        if (cLog.length > 200) { //IF LOG IS LONGER THAN 200 ENTRIES, CUT OFF THE LAST ENTRY	
            cLog.length = 200;
        }

        localforage.setItem('changeLog', cLog, function(err, cLogger) {
            // console.table(cLogger);


        });
    });

};

function displayHistory() {
    localforage.getItem('changeLog', function(err, hist) {
        drawTableAddHeaders(hist, ["Date", "Time", "Change"], "historyTable");
    });
};

function getDateAndTime() {
    let current_datetime = new Date();
    let formatted_date = (current_datetime.getMonth() + 1) + "/" + current_datetime.getDate() + "/" + current_datetime.getFullYear();
    //let hrsMins = new Date();
    let mins = current_datetime.getMinutes();
    console.log(mins);
    console.group(current_datetime);
    if (mins < 10) {
        mins = "0" + mins;
    }
    let time = current_datetime.getHours() + ":" + mins;
    let dateAndTime = [formatted_date, time];
    return dateAndTime;

};
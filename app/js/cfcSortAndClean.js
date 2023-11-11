function cleanCFC(CFC) {
    //console.log(CFC);
    for (var c = 0; c < CFC.length; c++) {
        let currCourses = CFC[c].currentCourses;
        let dryCleaned = sortCFCAndClean(currCourses);
        //console.log(dryCleaned);
        CFC[c].currentCourses = dryCleaned;
    }
    //console.log(CFC);
};


function sortCFCAndClean(currArray) {
    if (currArray) {

        console.log("sortCFCAndClean");
        // console.log(currArray);

        let condensedCFC = [];

        for (let idx = 0; idx < currArray.length; idx++) {
            if (currArray[idx].num !== "holdingPen" && currArray[idx].num !== "") {
                condensedCFC.push(currArray[idx]);
            }
        }

        // Define the order for days and time
        var daysOrder = { 'M': 1, 'T': 2, 'W': 3, 'TH': 4, 'F': 5 };
        var timeOrder = { '8': 1, '10': 2, '11': 3, '1': 4, '2': 5, '4': 6, '5': 7, '7': 8 };

        // Filter out the entries with an empty "num" field or "holdingPen"
        condensedCFC = condensedCFC.filter(function(entry) {
            return entry.num && entry.num !== "holdingPen";
        });
        // console.log(currArray);
        // Sort the array
        condensedCFC.sort(function(a, b) {
            // Sort by num (alphabetically)
            if (a.num < b.num) return -1;
            if (a.num > b.num) return 1;

            // If num is equal, sort by days
            if (daysOrder[a.days] < daysOrder[b.days]) return -1;
            if (daysOrder[a.days] > daysOrder[b.days]) return 1;

            // If days is also equal, sort by time
            return timeOrder[a.time] - timeOrder[b.time];
        });
        // console.log(condensedCFC);
        return condensedCFC;
    }
};
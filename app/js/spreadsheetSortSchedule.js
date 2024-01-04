document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    // Now you can use currentStore

    asssembleData();
});

function asssembleData() {
    console.log(currStore);
    let scheduleArray = [];
    let courseLocation;
    let currStartTime, currEndTime;
    currentStore.getItem("faculty", function(err, fac) {
        if (err) {
            console.log(err);
        }
        currentStore.getItem("courses", function(err, courses) {
            if (err) {
                console.log(err);
            }
            console.table(courses);

            for (let i = 0; i < fac.length; i++) {
                //console.log(fac[i].currentCourses);
                if (fac[i].currentCourses) {

                    for (let j = 0; j < fac[i].currentCourses.length; j++) {
                        let currNum = fac[i].currentCourses[j].num;
                        //let courseLocation = fac[i].currentCourses[j].loc;
                        //console.log("Fac", fac[i].lastName, fac[i].currentCourses);
                        //console.log(currNum);
                        let numIndex = courses.findIndex(obj => obj.num === currNum);
                        // console.log(numIndex, currNum, courses[numIndex]);
                        try {
                            courseLocation = courses[numIndex].loc;
                        } catch (err) {
                            alert("Could not find " + currNum + " in the list of courses. Please go back and enter it if necessary.");
                            console.log(err);
                            return;

                        }

                        if (courseLocation === "General Classroom") {
                            courseLocation = "";
                        }
                        //console.log(courses[numIndex]);
                        if (fac[i].currentCourses[j].time) {
                            currStartTime = fac[i].currentCourses[j].time.split(": ")[1].split("-")[0];
                            currEndTime = fac[i].currentCourses[j].time.split(": ")[1].split("-")[1];
                        } else {
                            currStartTime = "";
                            currEndTime = "";
                        }

                        //Get the current semester and format it 
                        let currSemester = currStore.split(" ")[2] + currStore.split(" ")[1].substring(0, 2).toUpperCase();
                        let currDivision = courses[numIndex].div;
                        let currTitle = courses[numIndex].title;
                        let currMethod = courses[numIndex].method;
                        let currClassroom = "";
                        if (currMethod === "ONLSY") {
                            currClassroom = "VIRT";
                            console.log(currMethod, currClassroom);
                        } else {
                            currClassroom = "";
                        }
                        let currPerson = {
                            'division': currDivision,
                            'num': fac[i].currentCourses[j].num,
                            'name': fac[i].lastName + ", " + fac[i].firstName,
                            'title': currTitle,
                            'term': currSemester,
                            'location': courseLocation,
                            'method': currMethod,
                            'classroom': currClassroom,
                            'time': fac[i].currentCourses[j].time,
                            'startTime': currStartTime,
                            'endTime': currEndTime,
                            'days': fac[i].currentCourses[j].days



                        }
                        scheduleArray.push(currPerson);
                    }
                }
            }
            //console.table(scheduleArray);
            let sortedData = scheduleArray.sort(
                firstBy(function(v1, v2) { return v1.name - v2.name; })
                .thenBy("num")
            );
            sortDayAndTime(sortedData);
        });
    });
};



function sortDayAndTime(dataArray) {
    const dayTimes = ["M 8:30 AM", "M 10:00 AM", "M 11:30 AM", "M 1:00 PM", "M 2:30 PM", "M 4:00 PM", "M 5:30 PM", "M 7:00 PM", "T 8:30 AM", "T 10:00 AM", "T 11:30 AM", "T 1:00 PM", "T 2:30 PM", "T 4:00 PM", "T 5:30 PM", "T 7:00 PM", "W 9:00 AM", "W 12:15 PM", "W 5:30 PM", "W 7:00 PM", "TH 8:30 AM", "TH 10:00 AM", "TH 11:30 AM", "TH 1:00 PM", "TH 2:30 PM", "TH 4:00 PM", "TH 5:30 PM", "TH 7:00 PM", "F 8:30 AM", "F 9:00 AM", "F 12:15 PM", "F 2:30 PM", "F 4:00 PM"];

    let currName, savedName, currCourse, savedCourse, currTime, currDays, dayTime;
    let newArray = [];
    let multiSort;

    for (let i = 0; i < dataArray.length; i++) {
        currName = dataArray[i].name;
        //savedName = currName;
        currCourse = dataArray[i].num;
        //savedCourse = currCourse;
        currTime = reverseBlockTime(dataArray[i].time);
        currDays = dataArray[i].days;
        if (currDays.includes("/")) {
            currDays = currDays.split("/")[0];
        }
        dayTime = currDays + " " + currTime;

        newArray.push({
            'division': dataArray[i].division,
            'name': currName,
            'num': currCourse,
            'title': dataArray[i].title,
            'term': dataArray[i].term,
            'location': dataArray[i].location,
            'method': dataArray[i].method,
            'time': dataArray[i].time,
            'startTime': dataArray[i].startTime,
            'endTime': dataArray[i].endTime,
            'days': dataArray[i].days,
            'classroom': dataArray[i].classroom,
            'dayTime': dayTime
        });
    }
    //console.table(newArray);
    //  SORTS BY COURSE NUMBER, THEN BY NAME, AND THEN WITHIN EACH COURSE BY TIME
    multiSort = newArray.sort(function(a, b) {
        // Sort by num
        if (a.num < b.num) return -1;
        if (a.num > b.num) return 1;

        // If nums are equal, sort by name
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        // If names are also equal and belong to the same course, sort by time index in dayTimes
        if (a.name === b.name && a.num === b.num) {
            var aTimeIndex = dayTimes.indexOf(a.dayTime);
            var bTimeIndex = dayTimes.indexOf(b.dayTime);
            //console.log("aTime: ", a.dayTime, "aTimeIndex: ", aTimeIndex, "BTime: ", b.dayTime, "bTimeIndex: ", bTimeIndex);
            return aTimeIndex - bTimeIndex;
        }
    });
    // console.table(multiSort);
    addSectionNumbers(multiSort);
};


// create an async function to sort the array and add a number to each of the nums
function addSectionNumbers(array) {
    // Add a dash and a 2-digit number to each of the “num” fields
    // Create two counters to keep track of the sequential numbers for the -01 and -51 numbers
    let currentNum, counter01, counter51, counterHybrid, counterOnline;

    // Iterate over the array
    for (const element of array) {
        // If the "num" field changes, reset the counters
        if (element.num !== currentNum) {
            counter01 = 1;
            counter51 = 51;
            counterHybrid = 71;
            counterOnline = 81;
        }

        // Update the current "num" value
        currentNum = element.num;

        if (element.location === "HYBRD") {
            element.num += "-" + counterHybrid.toString().padStart(2, "0");
            counterHybrid++;
        } else if (element.location === "OL") {
            element.num += "-" + counterOnline.toString().padStart(2, "0");
            counterOnline++;
        } else if (element.time === "" || (!element.time.includes("Block 7") && !element.time.includes("Block 8") && !element.time.includes("Block 9"))) {
            element.num += "-" + counter01.toString().padStart(2, "0");
            counter01++;
        } else if (element.time.includes("Block 7") || element.time.includes("Block 8") || element.time.includes("Block 9")) {
            element.num += "-" + counter51.toString().padStart(2, "0");
            counter51++;
        }





    }
    // console.table(array);

    createFinalForm(array);
};

function createFinalForm(array) {
    let registrarFormat = [];

    for (let i = 0; i < array.length; i++) {
        //console.log(array[i]);

        registrarFormat.push({
            'division': array[i].division,
            'sectionName': array[i].num,
            'shortTitle': array[i].title,
            'term': array[i].term,
            'location': array[i].location,
            'method': array[i].method,
            //'splitSection': "",
            //'capacity': "",
            //'activeStudentCount': "",

            'facultyFirst': array[i].name.split(", ")[1],
            'facultyLast': array[i].name.split(", ")[0],
            'meetingDay': array[i].days,
            //'courseSectionsID': "",
            //            Block 2: 10:00 AM-11:15 AM

            'startTime': array[i].startTime,
            'endTime': array[i].endTime,
            'timeBlock': array[i].time,
            'classroom': array[i].classroom,
            //'startDate': "",
            //'endDate': "",
            'crossList': "",
            'notes': ""

        })
    }
    //    Division	Section Name	Title 	Term 	Location 	Instructional Method	Room	Days	Start Time	End Time	Block TimeFaculty First 	Faculty Last 	E-Mail address	Cross Listed

    drawTableAddHeaders(registrarFormat, ["Division", "Section Name", "Title", "Term", "Location", "Instructional Method", "Faculty First", "Faculty Last", "Days", "Start Time", "End Time", "Time Block", "Classroom", "Cross List", "Notes"], "objTable");

};
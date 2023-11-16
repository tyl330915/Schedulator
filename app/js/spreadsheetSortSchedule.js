window.addEventListener('load', function() {
    asssembleData();
});

function asssembleData() {
    let scheduleArray = [];
    localforage.getItem("faculty", function(err, fac) {
        if (err) {
            console.log(err);
        }
        localforage.getItem("courses", function(err, courses) {
            if (err) {
                console.log(err);
            }
            console.table(courses);

            for (let i = 0; i < fac.length; i++) {
                console.log(fac[i].currentCourses);
                if (fac[i].currentCourses) {

                    for (let j = 0; j < fac[i].currentCourses.length; j++) {
                        let currNum = fac[i].currentCourses[j].num;
                        //console.log("Fac", fac[i].lastName, fac[i].currentCourses);
                        //console.log(currNum);
                        let numIndex = courses.findIndex(obj => obj.num === currNum);
                        console.log(numIndex, currNum, courses[numIndex]);
                        let courseLocation = courses[numIndex].loc;
                        if (courseLocation === "General Classroom") {
                            courseLocation = "";
                        }


                        //console.log(courses[numIndex]);

                        let currTitle = courses[numIndex].title;
                        let currMethod = courses[numIndex].meth;
                        let currPerson = {
                            'num': fac[i].currentCourses[j].num,
                            'name': fac[i].lastName + ", " + fac[i].firstName,
                            'title': currTitle,
                            'location': courseLocation,
                            'method': currMethod,
                            'time': fac[i].currentCourses[j].time,
                            'days': fac[i].currentCourses[j].days


                        }
                        scheduleArray.push(currPerson);
                    }
                }
            }
            console.table(scheduleArray);
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
            'name': currName,
            'num': currCourse,
            'title': dataArray[i].title,
            'location': dataArray[i].location,
            'method': dataArray[i].method,
            'time': dataArray[i].time,
            'days': dataArray[i].days,
            'dayTime': dayTime
        });
    }
    console.table(newArray);
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
            console.log("aTime: ", a.dayTime, "aTimeIndex: ", aTimeIndex, "BTime: ", b.dayTime, "bTimeIndex: ", bTimeIndex);
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
    let currentNum;
    let counter01 = 1;
    let counter51 = 51;

    // Iterate over the array
    for (const element of array) {
        // If the "num" field changes, reset the counters
        if (element.num !== currentNum) {
            counter01 = 1;
            counter51 = 51;
        }

        // Update the current "num" value
        currentNum = element.num;

        // If the "time" field is empty, add "-01" to the "num" field, incrementing the counter01 variable
        if (element.time === "" || (!element.time.includes("Block 7") && !element.time.includes("Block 8") && !element.time.includes("Block 9"))) {
            element.num += "-" + counter01.toString().padStart(2, "0");
            counter01++;
        }
        // Add the dash and the 2-digit number to the "num" field, incrementing the counter51 variable
        if (element.time.includes("Block 7") || element.time.includes("Block 8") || element.time.includes("Block 9")) {
            element.num += "-" + counter51.toString().padStart(2, "0");
            counter51++;
        }


    }
    console.table(array);

    createFinalForm(array);
};

function createFinalForm(array) {
    let registrarFormat = [];

    for (let i = 0; i < array.length; i++) {


        registrarFormat.push({
            'sectionName': array[i].num,
            'shortTitle': array[i].title,
            'location': array[i].location,
            'method': array[i].method,
            'splitSection': "",
            'capacity': "",
            'activeStudentCount': "",
            'crossList': "",
            'faculty1': array[i].name,
            'faculty2': "",
            'meetingDay': array[i].days,
            'courseSectionsID': "",
            'formerStart': "",
            'formerEnd': "",
            'timeBlock': array[i].time,
            'startDate': "",
            'endDate': "",
            'notes': ""

        })
    }

    drawTableAddHeaders(registrarFormat, ["Section Name", "Short Title", "Location", "Instructional Method", "Split Section", "Capacity", "Active Student Count", "Cross List", "Faculty 1", "Faculty 2", "Meeting Day", "Course Sections ID", "Former Start", "Former End", "Time Block", "Start Date", "End Date", "Notes"], "objTable");

};
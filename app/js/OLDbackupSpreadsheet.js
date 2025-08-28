function loadSpreadsheet() {
    let dia = document.getElementById("uploadSSModal");
    dia.style.display = "none";

    const file = document.getElementById('loadSS').files[0];
    //console.log(file);
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const allTextLines = text.split(/\r\n|\n/);
            // console.log(allTextLines);
            const headers = allTextLines[0].split(',').map(header => header.trim());
            console.log(headers);
            const lines = [];

            let sectionNameIndex = headers.indexOf('Section Name');
            //console.log("Section Name Index: " + sectionNameIndex)

            // Initialize an empty object to store the course counts
            let courseCounts = {};

            // Loop over the data, starting from the second row
            for (let i = 1; i < allTextLines.length; i++) {
                // Split the current line into columns
                if (allTextLines[i].length > 0) {
                    let columns = allTextLines[i].split(',');
                    //console.log(allTextLines[i]);

                    // Extract the course number from the section name
                    ///////////////////////let courseNumber = columns[sectionNameIndex].split('-')[0].trim();
                    if (columns[sectionNameIndex].includes('-')) {
                        // Handle the case with a hyphen
                        let lastHyphen = columns[sectionNameIndex].lastIndexOf('-');
                        courseNumber = columns[sectionNameIndex].substring(0, lastHyphen).trim();
                        //  console.log("A: ", courseNumber);
                    } else if (columns[sectionNameIndex].includes(' ')) {
                        // Handle the case with a space
                        let parts = columns[sectionNameIndex].split(' ');
                        courseNumber = parts[0].trim() + ' ' + parts[1].trim();
                        //console.log("B: ", courseNumber);
                    } else {
                        // Handle the case with no hyphen or space
                        courseNumber = columns[sectionNameIndex].trim();
                        // console.log("C: ", courseNumber);
                    }
                    // console.log("D: ", courseNumber);


                    // If the course number is already in the courseCounts object, increment its count
                    // Otherwise, add it to the courseCounts object with a count of 1
                    if (courseNumber in courseCounts) {
                        courseCounts[courseNumber]++;
                    } else {
                        courseCounts[courseNumber] = 1;
                    }
                }

            }
            // Convert the courseCounts object to an array of arrays
            let courseCountsArray = Object.entries(courseCounts);
            //console.table(courseCountsArray);
            saveCourseCounts(courseCountsArray);

            ///CODE IN HERE TO SAVE IT TO THE COURSES LIST IN currentStore
            //return courseCountsArray;

            parseIndividualCourses(allTextLines);
        };
        reader.readAsText(file);
    }
};

function parseIndividualCourses(data) {
    let facultyName, firstName, lastName, meetingDay, timeBlock, courseNumber;
    // Find the index of 'Faculty 1', 'Meeting Day', 'Time Block', and 'Section Name' in the data
    //let facultyIndex = data[0].indexOf('Faculty 1');
    const headers = data[0].split(',').map(header => header.trim());
    console.log(headers); // Add this line to log the headers array
    let meetingDayIndex = headers.indexOf('Days');
    //console.log("Meeting Day Index: " + meetingDayIndex);
    let timeBlockIndex = headers.indexOf('Time Block');
    // console.log("Time Block Index: " + timeBlockIndex);
    let startTimeIndex = headers.indexOf('Start Time');
    //console.log("Start Time Index: " + startTimeIndex);
    let sectionNameIndex = headers.indexOf('Section Name');
    //console.log("Section Name Index: " + sectionNameIndex);

    let firstNameIndex = headers.indexOf('Faculty First');
    //console.log("First Name Index: " + firstNameIndex);
    let lastNameIndex = headers.indexOf('Faculty Last');
    //console.log("Last Name Index: " + lastNameIndex);
    let methodIndex = headers.indexOf('Instructional Method');
    let locationIndex = headers.indexOf('Location');

    // Initialize an empty object to store the faculty and their courses
    let facultyCourses = {};

    // Loop over the data, starting from the second row
    for (let i = 1; i < data.length; i++) {
        let columns = CSVtoArray(data[i])
            //console.log("Columns", columns);

        // Split the faculty name into first name and last name
        if (columns !== undefined) {
            if (columns[sectionNameIndex].includes('-')) {
                // Handle the case with a hyphen
                let lastHyphen = columns[sectionNameIndex].lastIndexOf('-');
                courseNumber = columns[sectionNameIndex].substring(0, lastHyphen).trim();
                //console.log("A: ", courseNumber);
            } else if (columns[sectionNameIndex].includes(' ')) {
                // Handle the case with a space
                let parts = columns[sectionNameIndex].split(' ');
                courseNumber = parts[0].trim() + ' ' + parts[1].trim();
                //console.log("B: ", courseNumber);
            } else {
                // Handle the case with no hyphen or space
                courseNumber = columns[sectionNameIndex].trim();
                //console.log("C: ", courseNumber);
            }
            //console.log("D: ", courseNumber);
            firstName = columns[firstNameIndex];
            lastName = columns[lastNameIndex];
            // Extract the meeting day and time block
            meetingDay = columns[meetingDayIndex];
            if (timeBlockIndex > -1) {
                timeBlock = columns[timeBlockIndex];
            } else {
                timeBlock = getTimeBlockValue(meetingDay, columns[startTimeIndex]);
            }
            // console.log("TimeBlock: ", timeBlock);
            method = columns[methodIndex];
            location = columns[locationIndex];
        }
        // If the faculty name is already in the facultyCourses object, add the course to their currentCourses
        // Otherwise, add the faculty name to the facultyCourses object with the course in their currentCourses

        //if (location !== "MONT" && location !== "DUBL") {

        if (firstName + ' ' + lastName in facultyCourses) {
            facultyCourses[firstName + ' ' + lastName]['currentCourses'].push({
                'num': courseNumber,
                'days': meetingDay,
                'time': timeBlock,
                'method': method
            });
        } else {
            facultyCourses[firstName + ' ' + lastName] = {
                'firstName': firstName,
                'lastName': lastName,
                'currentCourses': [{
                    'num': courseNumber,
                    'days': meetingDay,
                    'time': timeBlock,
                    'method': method
                }]
            };
        }
        //}
    }


    //////saveNewFacultyCourses(facultyCourses);
    console.table(facultyCourses);
    //return facultyCourses;
    console.log("Saving new courses");

};

function ssSemesterData() {
    const uploadDiv = document.getElementById('uploadDiv');
    const messageLine = document.getElementById('dialogMessage');

    const department = document.getElementById('department').value;
    const term = document.getElementById('semester').value;
    const year = document.getElementById('year').value;

    console.log(department, term, year);
    if (department && term && year) {
        newSem = department + ' ' + term + ' ' + year;
        messageLine.innerHTML = '';
        console.log(uploadDiv);
        uploadDiv.style.display = 'block';

        currentStore = localforage.createInstance({
            name: newSem
        });


    } else {
        //alert("Please select a department, semester, and year");
        messageLine.innerHTML = "Please select a department, semester, and year";
    }
}



function saveCourseCounts(courseArray) {
    console.table(courseArray);
    currentStore.getItem('courses', function(err, oldCourses) {
        console.table(oldCourses);
        if (oldCourses == null) {
            alert("This semester does not yet exist. Please create a semester on the home page first.");
            return;
        }
        if (err) {
            console.log(err);
            alert("This semester does not yet exist. Please create a semester on the home page first.");
            return;
        }

        //set all oldcourses sections to 0
        for (i = 0; i < oldCourses.length; i++) {
            oldCourses[i].sections = 0;
            //console.log("oldcourses")
            // console.log(oldCourses[i].num, oldCourses[i].sections);
            //console.log("course array:", courseArray);
        }


        //console.log(oldCourses.map(obj => obj.num))
        //compare the old courses with the new courses and update the sections
        for (j = 0; j < courseArray.length; j++) {
            // console.log(courseArray[j], courseArray[j][0]);
            if (courseArray[j][0] !== '') {
                //get the index of the course in courseArray from oldCourses
                let newCourseNum = courseArray[j][0];
                if (newCourseNum.includes('-')) {
                    newCourseNum = newCourseNum.split('-')[0].trim() + '-' + newCourseNum.split('-')[1].trim();
                }
                //TO FIND INDEX WHETHER THERE IS A HY[PHEN OR A SPACE BETWEEN THE COURSE NUMBER
                let index = oldCourses.findIndex(obj => obj.num.replace(/ /g, '-') === newCourseNum);

                if (index < 0) {
                    // console.log("Course not found: ", newCourseNum);
                    continue;
                } else {
                    oldCourses[index].sections = courseArray[j][1];
                    // console.log(oldCourses[index].num, oldCourses[index].sections);
                }
            }
        }

        //save courses in currentStore
        currentStore.setItem('courses', oldCourses, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("saved courses");
            console.table(oldCourses);

        })

    });
};


function saveNewFacultyCourses(newFac) {
    console.log("saving new faculty courses");


    console.log(newFac);
    //get faculty list from currentStore
    currentStore.getItem('faculty', function(err, oldFac) {
        if (err) {
            console.log(err);
        }
        console.table(oldFac);
        //set all old faculty sections to empty
        for (i = 0; i < oldFac.length; i++) {
            oldFac[i].currentCourses = [];
        };
        //get index of old faculty in new faculty
        let newFacArray = Object.values(newFac);

        for (let i = 0; i < oldFac.length; i++) {
            oldFac[i].currentCourses = [];
            //get index of old faculty in new faculty
            let facindex = newFacArray.findIndex(obj => obj.firstName + ' ' + obj.lastName === oldFac[i].firstName + ' ' + oldFac[i].lastName);
            if (facindex > -1) {
                oldFac[i].currentCourses = newFacArray[facindex].currentCourses;
                //console.log(newFacArray[facindex].currentCourses);
            }
        };
        //save faculty in currentStore
        currentStore.setItem('faculty', oldFac, function(err) {
            if (err) {
                console.log(err);
                alert("Could not save. Please try again.");
            }
            console.log("saved faculty");
            console.table(oldFac);
            alert("Spreadsheet loaded successfully");
            //go to courses.html
            window.location.href = "courses.html";
        })
    });
}


function CSVtoArray(text) {
    let ret = [''],
        i = 0,
        p = '',
        s = true;
    for (let l in text) {
        l = text[l];
        if ('"' === l) {
            s = !s;
            if ('"' === p) {
                ret[i] += '"';
                l = '';
            } else if ('' === p)
                l = '';
        } else if (s && ',' === l)
            l = ret[++i] = '';
        ret[i] += l;
        p = l;
    }
    return ret.map(field => field.trim().replace(/^"|"$/g, ''));
}


function getTimeBlockValue(day, time) {
    try {
        let perWeek = 1;
        if (day.includes(',')) {
            perWeek = 2;
        }

        let block = classBlocks(day, time, perWeek);
        // console.log("Day: ", day, "Time: ", time, "Per Week: ", perWeek);
        //console.log("Block: ", block);

        return block;
    } catch (error) {
        console.log(error);
    }
};
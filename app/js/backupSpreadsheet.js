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
            //console.log(headers);
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
                    let courseNumber = columns[sectionNameIndex].split('-')[0].trim();

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

            ///CODE IN HERE TO SAVE IT TO THE COURSES LIST IN LOCALFORAGE
            //return courseCountsArray;

            parseIndividualCourses(allTextLines);
        };
        reader.readAsText(file);
    }
};

function parseIndividualCourses(data) {
    let facultyName, firstName, lastName, meetingDay, timeBlock;
    // Find the index of 'Faculty 1', 'Meeting Day', 'Time Block', and 'Section Name' in the data
    //let facultyIndex = data[0].indexOf('Faculty 1');
    const headers = data[0].split(',').map(header => header.trim());
    console.log(headers); // Add this line to log the headers array
    let meetingDayIndex = headers.indexOf('Meeting Day');
    console.log("Meeting Day Index: " + meetingDayIndex);
    let timeBlockIndex = headers.indexOf('Time Block');
    console.log("Time Block Index: " + timeBlockIndex);
    let sectionNameIndex = headers.indexOf('Section Name');
    console.log("Section Name Index: " + sectionNameIndex);
    let facultyIndex = headers.indexOf('Faculty 1');
    console.log("Faculty 1 Index: " + facultyIndex);
    let methodIndex = headers.indexOf('Instructional Method');

    // Initialize an empty object to store the faculty and their courses
    let facultyCourses = {};

    // Loop over the data, starting from the second row
    for (let i = 1; i < data.length; i++) {
        let columns = CSVtoArray(data[i])
        console.log("Columns", columns, facultyIndex);
        // Split the faculty name into first name and last name
        if (columns.length > 0) {
            facultyName = columns[facultyIndex].split(',').map(name => name.trim());
            //    console.log(facultyName);
            firstName = facultyName[1];
            lastName = facultyName[0];
            // Extract the course number from the section name
            courseNumber = columns[sectionNameIndex].includes('-') ? columns[sectionNameIndex].split('-')[0].trim() : columns[sectionNameIndex].trim();
            // Extract the meeting day and time block
            meetingDay = columns[meetingDayIndex].trim();
            timeBlock = columns[timeBlockIndex].trim();
            method = columns[methodIndex].trim();
        }
        // If the faculty name is already in the facultyCourses object, add the course to their currentCourses
        // Otherwise, add the faculty name to the facultyCourses object with the course in their currentCourses
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
    }
    console.table(facultyCourses);
    //return facultyCourses;
    saveNewFacultyCourses(facultyCourses);
};


function saveCourseCounts(courseArray) {
    localforage.getItem('courses', function(err, oldCourses) {
        //console.log(oldCourses);
        if (err) {
            console.log(err);
        }

        //set all oldcourses sections to 0
        for (i = 0; i < oldCourses.length; i++) {
            oldCourses[i].sections = 0;
        }

        //compare the old courses with the new courses and update the sections
        for (i = 0; i < courseArray.length; i++) {
            //console.log(courseArray[i], courseArray[i][0]);
            if (courseArray[i][0] !== '') {
                //get the index of the course in courseArray from oldCourses
                let newCourseNum = courseArray[i][0];
                let index = oldCourses.findIndex(obj => obj.num === newCourseNum);
                // console.log(newCourseNum, oldCourses[index].num);
                oldCourses[index].sections = courseArray[i][1];
            }
        }
        //console.table(oldCourses);

        //save courses in localforage
        localforage.setItem('courses', oldCourses, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("saved courses");

        })
    });
};

function saveNewFacultyCourses(newFac) {
    console.log(newFac[0]);
    //get faculty list from localforage
    localforage.getItem('faculty', function(err, oldFac) {
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
                console.log(oldFac[i].firstName + ' ' + oldFac[i].lastName, newFacArray[facindex]);
            }
        };
        //save faculty in localforage
        localforage.setItem('faculty', oldFac, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("saved faculty");
            alert("Spreadsheet loaded successfully");
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
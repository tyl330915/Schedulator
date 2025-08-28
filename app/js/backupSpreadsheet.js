function loadSpreadsheet() {
    let dia = document.getElementById("uploadSSModal");
    dia.style.display = "none";

    const file = document.getElementById('loadSS').files[0];

    Papa.parse(file, {
        download: true,
        header: true,
        transformHeader: header => header.trim(),
        transform: value => value.trim(),
        complete: function(results) {
            let data = results.data;
            let fields = results.meta.fields;

            let indexes = {
                "Division": fields.indexOf("Division"),
                "Section Name": fields.indexOf("Section Name"),
                "Title": fields.indexOf("Title"),
                "Term": fields.indexOf("Term"),
                "Location": fields.indexOf("Location"),
                "Instructional Method": fields.indexOf("Instructional Method"),
                "Days": fields.indexOf("Days"),
                "Start Time": fields.indexOf("Start Time"),
                "End Time": fields.indexOf("End Time"),
                "Faculty First": fields.indexOf("Faculty First"),
                "Faculty Last": fields.indexOf("Faculty Last"),
                "E-Mail address - Primary": fields.indexOf("E-Mail address - Primary")
            };

            let filteredData = data.map(row => {
                let filteredRow = {};
                for (let key in indexes) {
                    if (indexes[key] !== -1) {
                        filteredRow[key] = row[key];
                    }
                }
                return filteredRow;
            });

            console.table(filteredData);
            countCourses(filteredData);
        }
    });
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
};

function countCourses(filteredData) {
    let courseCounts = {};

    filteredData.forEach(row => {
        let courseName = row["Section Name"];
        // Check if courseName is defined
        if (courseName) {
            // Remove the section number from the end of the course name
            let hyphenIndex = courseName.lastIndexOf("-");
            if (hyphenIndex !== -1) {
                courseName = courseName.substring(0, hyphenIndex).trim();
            }

            // Increment the count for this course
            if (courseCounts[courseName]) {
                courseCounts[courseName]++;
            } else {
                courseCounts[courseName] = 1;
            }
        }
    });

    console.log(courseCounts);
    updateCourseCounts(courseCounts, filteredData); // Pass filteredData and courseCounts
};

function updateCourseCounts(counts, fData) {
    currentStore.getItem('courses', function(err, cList) {

        cList.forEach(course => {
            if (counts[course.num]) {
                // If the course is in courseCounts, update the sections count
                course.sections = counts[course.num];
            } else {
                // If the course is not in courseCounts, set the sections count to 0
                course.sections = 0;
            }

        });

        currentStore.setItem('courses', cList, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("saved courses");
            console.table(cList);
            ////window.location.href = "courses.html";
            setFacultyCourses(fData);
        })

    });

};

function setFacultyCourses(fData) {

    console.table(fData);

    let people = {};

    fData.forEach(row => {
        // Skip if row is empty or first name or last name is undefined
        if (!row || Object.keys(row).length === 0 || !row["Faculty First"] || !row["Faculty Last"]) {
            return;
        }

        let firstName = row["Faculty First"];
        let lastName = row["Faculty Last"];
        let email = row["E-Mail address - Primary"];
        // If there are multiple emails, pick the first one
        if (email && email.includes(',')) {
            email = email.split(',')[0].trim();
        }
        let personKey = `${firstName} ${lastName} ${email}`;

        if (!people[personKey]) {
            people[personKey] = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                currentCourses: []
            };
        }

        let days = row["Days"];
        let time = "";
        if (typeof days === 'string') {
            let perWeek = days.includes("/") ? 2 : 1;
            time = classBlocks(days, row["Start Time"], perWeek);
        }

        // Remove the section number from the end of the course name
        let courseName = row["Section Name"];
        let hyphenIndex = courseName.lastIndexOf("-");
        if (hyphenIndex !== -1) {
            courseName = courseName.substring(0, hyphenIndex).trim();
        }

        let course = {
            num: courseName,
            days: days,
            time: time,
            method: row["Instructional Method"]
        };

        people[personKey].currentCourses.push(course);
    });

    // Convert the people object to an array and sort it
    let peopleArray = Object.values(people);
    peopleArray.sort((a, b) => {
        // Sort by last name, then by first name
        let lastNameComparison = a.lastName.localeCompare(b.lastName);
        if (lastNameComparison !== 0) {
            return lastNameComparison;
        } else {
            return a.firstName.localeCompare(b.firstName);
        }
    });

    console.log(peopleArray);
    addCurrentCoursesToFaculty(peopleArray);

};

//ADD THE CURRENT COURSES TO THE FACULTY ARRAY, AND SAVE THE FACULTY ARRAYfunction addCurrentCoursesToFaculty(peopleArray) {
function addCurrentCoursesToFaculty(peopleArray) {
    currentStore.getItem('faculty', function(err, fac) {
        if (err) {
            console.log(err);
        }

        fac.forEach(person => {
            // Find a match in peopleArray by email or by first name and last name
            let match = peopleArray.find(p => p.email === person.email || (p.firstName === person.firstName && p.lastName === person.lastName));

            if (match) {
                // If a match is found, update currentCourses
                person.currentCourses = match.currentCourses.map(course => {

                    console.log(course);
                    let days = course.days;
                    let time = course.time;
                    if (typeof days === 'string') {
                        days = days.replace(", ", "/");
                    }

                    return {...course, days, time }; // Include the updated days value in the returned object
                });
            } else {
                // If no match is found, set currentCourses to an empty array
                person.currentCourses = [];
            }
        });

        console.log(fac);
        currentStore.setItem('faculty', fac, function(err) {
            if (err) return console.log(err);
            alert("Data saved successfully!");
            setTimeout(function() {
                window.location.href = "courses.html";
            }, 2000);

        })


    });
}
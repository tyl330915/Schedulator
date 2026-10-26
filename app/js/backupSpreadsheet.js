function loadSpreadsheet() {
    var newSem = document.getElementById('department').value + ' ' + document.getElementById('semester').value + ' ' + document.getElementById('year').value;
    if (document.getElementById('uploadDiv').style.display !== 'block') {
        alert("Please select a Department, Semester, and Year first by clicking 'Select Semester'.");
        return;
    }

    let dia = document.getElementById("uploadSSModal");
    dia.style.display = "none";

    const file = document.getElementById('loadSS').files[0];

    Papa.parse(file, {
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
                "Time Block": fields.indexOf("Time Block"),
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

async function ssSemesterData() {
    const uploadDiv = document.getElementById('uploadDiv');
    const messageLine = document.getElementById('dialogMessage');

    const department = document.getElementById('department').value;
    const term = document.getElementById('semester').value;
    const year = document.getElementById('year').value;

    console.log(department, term, year);
    if (department && term && year) {
        let newSem = department + ' ' + term + ' ' + year;
        messageLine.innerHTML = '';
        console.log(uploadDiv);
        uploadDiv.style.display = 'block';

        await switchCurrentStore(newSem);

    } else {
        messageLine.innerHTML = "Please select a department, semester, and year";
    }
};

function countCourses(filteredData) {
    let courseCounts = {};

    filteredData.forEach(row => {
        let courseName = row["Section Name"];
        if (courseName) {
            let hyphenIndex = courseName.lastIndexOf("-");
            if (hyphenIndex !== -1) {
                courseName = courseName.substring(0, hyphenIndex).trim();
            }
            courseName = courseName.toUpperCase();

            courseCounts[courseName] = (courseCounts[courseName] || 0) + 1;
        }
    });

    console.log(courseCounts);
    updateCourseCounts(courseCounts, filteredData);
};

function buildCoursesFromSpreadsheet(counts, fData) {
    let courseMap = {};

    fData.forEach(row => {
        let sectionName = row["Section Name"];
        if (!sectionName) return;

        let hyphenIndex = sectionName.lastIndexOf("-");
        let courseNum = hyphenIndex !== -1 ? sectionName.substring(0, hyphenIndex).trim() : sectionName.trim();

        if (!courseMap[courseNum]) {
            let title = row["Title"];
            courseMap[courseNum] = {
                div: row["Division"],
                num: courseNum.toUpperCase(),
                title: title ? title.charAt(0).toUpperCase() + title.slice(1) : "",
                loc: row["Location"],
                method: row["Instructional Method"],
                sem: row["Term"],
                sections: counts[courseNum] || 0
            };
        }
    });

    return Object.values(courseMap);
}

function updateCourseCounts(counts, fData) {
    currentStore.getItem('courses', function(err, cList) {

        if (err) {
            console.log(err);
            alert("Error loading this semester's course list.");
            return;
        }

        if (!Array.isArray(cList)) {
            cList = [];
        }

        var byNum = {};
        cList.forEach(function(c) {
            if (c && c.num) byNum[c.num.toUpperCase()] = c;
        });

        var added = 0;
        var updated = 0;

        fData.forEach(function(row) {
            var sectionName = row["Section Name"];
            if (!sectionName) return;
            var hyphenIndex = sectionName.lastIndexOf("-");
            var courseNum = hyphenIndex !== -1 ? sectionName.substring(0, hyphenIndex).trim().toUpperCase() : sectionName.trim().toUpperCase();
            var existingCourse = byNum[courseNum];
            var sectionCount = counts[courseNum] || 0;

            if (existingCourse) {
                existingCourse.sections = sectionCount;
                updated++;
            } else {
                byNum[courseNum] = {
                    div: row["Division"] || "",
                    num: courseNum,
                    title: row["Title"] || "",
                    loc: row["Location"] || "",
                    method: row["Instructional Method"] || "",
                    sem: row["Term"] || "",
                    sections: sectionCount
                };
                added++;
            }
        });

        var mergedCourses = Object.values(byNum);
        currentStore.setItem('courses', mergedCourses, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("saved courses: " + added + " added, " + updated + " updated");
            console.table(mergedCourses);
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
        if (typeof days === 'string') {
            days = days.replace(/, ?/g, "/");
        }
        let time = "";
        if (typeof days === 'string') {
            let perWeek = days.includes("/") ? 2 : 1;
            time = classBlocks(days, row["Start Time"], perWeek);
        }
        if (!time && row["Time Block"]) {
            time = row["Time Block"];
        }
        if (!time) {
            time = "";
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

function buildFacultyFromSpreadsheet(peopleArray) {
    return peopleArray.map(person => ({
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        status: "",
        available: true,
        currentCourses: person.currentCourses.map(course => {
            let days = course.days;
            let time = course.time;
            if (typeof days === 'string') {
                days = days.replace(", ", "/");
            }
            return {...course, days, time };
        })
    }));
}

function addCurrentCoursesToFaculty(peopleArray) {
    currentStore.getItem('faculty', function(err, fac) {
        if (err) {
            console.log(err);
            alert("Error loading this semester's faculty list.");
            return;
        }

        if (!Array.isArray(fac)) {
            fac = [];
        }

        var byName = {};
        fac.forEach(function(p) {
            if (p && p.firstName && p.lastName) {
                byName[(p.firstName + "|" + p.lastName).toLowerCase()] = p;
            }
        });

        var added = 0;
        var updated = 0;

        peopleArray.forEach(function(spreadsheetPerson) {
            var key = (spreadsheetPerson.firstName + "|" + spreadsheetPerson.lastName).toLowerCase();
            var existing = byName[key];

            var normalizedCourses = spreadsheetPerson.currentCourses.map(function(course) {
                var days = course.days;
                if (typeof days === 'string') {
                    days = days.replace(", ", "/");
                }
                return {
                    num: course.num,
                    days: days,
                    time: course.time,
                    method: course.method
                };
            });

            if (existing) {
                existing.currentCourses = normalizedCourses;
                if (!existing.email && spreadsheetPerson.email) {
                    existing.email = spreadsheetPerson.email;
                }
                updated++;
            } else {
                fac.push({
                    firstName: spreadsheetPerson.firstName,
                    lastName: spreadsheetPerson.lastName,
                    email: spreadsheetPerson.email,
                    status: "",
                    available: true,
                    currentCourses: normalizedCourses
                });
                added++;
            }
        });

        console.log(fac);
        currentStore.setItem('faculty', fac, function(err) {
            if (err) return console.log(err);
            alert(added + " new faculty added (" + updated + " updated). Courses and section counts saved.");
            setTimeout(function() {
                window.location.href = "courses.html";
            }, 2000);

        })
    });
}
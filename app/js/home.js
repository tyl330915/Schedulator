//const localforage = require('localforage');

document.getElementById("newSemesterButton").addEventListener("click", function() {
    document.getElementById("newSemester").style.display = "block";
});

document.getElementById("cancelButton").addEventListener("click", function() {
    window.location.href = "./app/html/assignCourses.html";
});

document.getElementById("continueButton").addEventListener("click", function() {
    window.location.href = "./app/html/assignCourses.html";
});

var modal = document.getElementById('newSemester');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const newDialog = document.getElementById('newSemester');

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    const deptSelect = document.getElementById('dept');
    const semesterSelect = document.getElementById('semester');
    const yearSelect = document.getElementById('year');
    const saveButton = document.getElementById('saveButton');
    let dsy = {};

    saveButton.addEventListener('click', () => {
        console.log(semesterSelect.value, deptSelect.value, yearSelect.value);
        dsy = {
            "dept": deptSelect.value,
            "semester": semesterSelect.value,
            "year": yearSelect.value,
        };

        const sData = {
            "semYear": dsy,
            "currProf": "",
            "currRequiredCoursesCount": 0,
            "currSections": [],
            "currSectionCount": 0,
            "registrarMaxCount": 0
        };

        localforage.getItem('semesterData', function(err, semData) {
            console.log("semData 1: ", semData);
            if (!semData) {
                localforage.setItem('semesterData', sData, function(err) {
                    console.log("set semData: ", semData, err);
                    // window.location.href = "faculty.html";
                });

            } else {
                try {
                    killOldData(sData);
                    saveSemesterData(sData);
                } catch (err) {
                    alert("Error saving data.")
                    console.log(err);
                }
            }
        });
    });
});

function killOldData(semesterData) {
    // Show a confirm dialog box
    var r = confirm("If you do this, all of last semester's data will be deleted. Are you sure you want to delete the old data?");
    if (r == true) {
        // If confirmed, delete the old data
        localforage.getItem('faculty', function(err, fac) {
            if (!fac) { return };
            localforage.getItem('courses', function(err, courses) {
                if (!courses) { return };
                localforage.removeItem('facultyPreferences').then(function() {

                    // Run this code once the key has been removed.
                    console.log('Faculty Preferences is cleared!');
                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });

                if (err) {
                    console.log(err);
                }

                for (let i = 0; i < fac.length; i++) {
                    fac[i].currentCourses = [];
                    fac[i].available = true;
                    fac[i].notes = "";
                };

                for (let c = 0; c < courses.length; c++) {
                    courses[c].sections = 0;
                };

                localforage.setItem('faculty', fac, function(err) {
                    /// console.log(fac);
                    saveSemesterData(semesterData);
                    console.log("Old data deleted.");

                    if (err) {
                        console.log(err);
                    }

                    localforage.setItem('courses', courses, function(err) {
                        ///console.log(courses);
                        console.log("Courses sections set to 0.");
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            });
        });

    } else {
        console.log("Operation cancelled.");
    }
}


function saveSemesterData(sData) {
    localforage.setItem('semesterData', sData, function(err) {
        console.log("Save semData here");
        console.table(sData);
        modal.style.display = "none";
        window.location.href = "./app/html/faculty.html";
    });
}

function createRectangle() {
    var rect = document.createElement('div');
    rect.classList.add('rectangle');

    // Set random color
    var color = 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ', 0)';
    rect.style.backgroundColor = color;

    // Set random size
    var size = Math.floor(Math.random() * 150) + 10;
    rect.style.width = size + 'px';
    rect.style.height = size / 3 + 'px';

    // Set random position
    rect.style.left = Math.floor(Math.random() * window.innerWidth) + 'px';

    document.body.appendChild(rect);

    // Animate the rectangle
    var pos = -size;

    // Set random speed
    var speed = Math.random() * 30 + 1;

    // Set random rotation speed
    var rotationSpeed = Math.random();

    var id = setInterval(frame, speed);

    function frame() {
        if (pos >= window.innerHeight) {
            clearInterval(id);
            document.body.removeChild(rect);
        } else {
            pos++;
            rect.style.top = pos + 'px';

            // Rotate the rectangle as it falls
            rect.style.transform = 'rotate(' + pos * rotationSpeed + 'deg)';

            // Increase the opacity as the rectangle falls
            var opacity = Math.min(0.2, pos / window.innerHeight);
            rect.style.backgroundColor = rect.style.backgroundColor.replace(/[^,]+(?=\))/, opacity);
        }
    }
}

// Create a new rectangle at a random interval between 0.5 and 1.5 seconds
function createRectangleAtRandomInterval() {
    createRectangle();
    setTimeout(createRectangleAtRandomInterval, Math.random() * 1000 + 500);
}

createRectangleAtRandomInterval();
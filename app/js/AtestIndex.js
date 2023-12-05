document.addEventListener("DOMContentLoaded", function(event) {
    // loadLocalForageFiles();
});

let oldSemesterData;
let messages = ["Changing semester....", "Collating files...", "Copying files...", "Done.", ""];
let counter = 0;
const loadingModal = document.getElementById('loadingModal');
const modalMessage = document.getElementById('modalMessage');
let deptSel = document.getElementById('dept');
let semSel = document.getElementById('semester');
let yearSel = document.getElementById('year');
let currentSemester;
const element = document.getElementById("saveButton");
element.addEventListener("click", function() {
    //compareSemesterData();
    checkIfStorageExists();
});
let cont = document.getElementById('continueButton');
cont.addEventListener("click", function() {
    console.log("continue");
    //window.location.href = "../html/weekGrid.html";
});


function getSemesterData() {
    localforage.getItem("semesterData", function(err, oldSemesterData) {
        //localforage.getItem('courses', function(err, courses) {
        console.log(oldSemesterData);

        ///   let deptSel = document.getElementById('dept');
        //   let semSel = document.getElementById('semester');
        //   let yearSel = document.getElementById('year');
        //    let oldSemYear = oldSemesterData.semester + " " + oldSemesterData.year;

        deptSel.value = oldSemesterData.semYear.dept;
        semSel.value = oldSemesterData.semYear.semester;
        yearSel.value = oldSemesterData.semYear.year;

        currentSemester = "Current Semester is: " + oldSemesterData.semYear.dept + ' ' + oldSemesterData.semYear.semester + " " + oldSemesterData.semYear.year;
        document.getElementById("messageDiv").innerHTML = currentSemester;
        checkIfStorageExists();
    });
};

async function checkIfStorageExists() {
    let dropDownCurrentSemester = deptSel.value + semSel.value + yearSel.value;
    console.log(dropDownCurrentSemester);

    // Configure localForage to use the potential store
    var instance = localforage.createInstance({
        name: dropDownCurrentSemester
    });

    var keyList = [];

    localforage.iterate(function(value, key, iterationNumber) {
        console.log([key, value]);
        keyList.push(key);
    }).then(function() {
        console.log('Iteration has completed');
        console.log("Keys: ", keyList);
        console.log(keyList.length);
        if (keyList.length > 0) {
            console.log("Storage Exists");
        } else {
            console.log("Storage does not exist");
            prepareNewSemester(dropDownCurrentSemester);
        }

    }).catch(function(err) {
        console.log(err);
    });
    //console.log(loadLocalForageFiles());

};


function compareSemesterData() {
    localforage.getItem("semesterData", function(err, oldSemesterData) {
        // Configure localForage to use the potential store
        let newSem = semSel.value;
        let newYear = yearSel.value;
        let newDept = deptSel.value;

        let newSemYear = newDept + " " + newSem + " " + newYear;
        let oldSemYear = oldSemesterData.semYear.dept + " " + oldSemesterData.semYear.semester + " " + oldSemesterData.semYear.year;

        if (newSemYear === oldSemYear) {
            console.log("Match");
            setStorageLocation(oldSemYear);
            //window.location.href = "../html/weekGrid.html";
        } else {
            console.log("No Match");
            console.log(newSemYear);
            let deptSemYear = {
                "dept": newDept,
                "year": newYear,
                "semester": newSem
            }
            oldSemesterData.semYear = deptSemYear;

            localforage.setItem('semesterData', oldSemesterData, function(err, value) {
                console.log(value);
                setStorageLocation(newSemYear);
                //get faculty and courses
                localforage.getItem('faculty', function(err, fac) {
                    localforage.getItem('courses', function(err, courses) {
                        prepareNewSemester(fac, courses);
                    });
                });
            });
        }
    });
}

/*
function setStorageLocation(semYear) {
    console.log(semYear);
    localforage.config({
        name: 'Schedulator',
        storeName: semYear
    });
    console.log("storage location set to: " + semYear);
};
*/

function prepareNewSemester(sem) { //// courses) {

    localforage.setItem('store', sem, function(err, value) {
        console.log(value);

    });
};

/*
        for (let i = 0; i < faculty.length; i++) {
            faculty[i].currentCourses = [];
            faculty[i].available = true;
            faculty[i].notes = "";
        };

        // for (let i = 0; i < courses.length; i++) {
        //     courses[i].sections = 0;
        // };

        localforage.setItem('faculty', faculty, function(err) {
            if (err) {
                console.log(err);
            }
            // localforage.setItem('courses', courses, function(err) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.table(faculty);
            console.table(courses);
            changeDisplay();
        });
        //});
        
};
*/
function changeDisplay() {
    //<dialog id="loadingModal" class="modal">
    //        <div id="modalMessage"></div>
    //    </dialog>


    loadingModal.showModal();

    // Get the display element
    let display = document.getElementById('messageDiv');
    // Change the text of the display element
    //display.textContent = messages[counter];
    modalMessage.textContent = messages[counter];
    // Increment the counter
    counter++;

    // If we've displayed all messages, redirect to people.html
    if (counter >= messages.length) {
        loadingModal.close();
        window.location.href = "faculty.html";
    } else {
        // Otherwise, set a timeout to change the display again in 5 seconds
        setTimeout(changeDisplay, 2000);
    }
};
document.addEventListener("DOMContentLoaded", function(event) {
    loadLocalForageFiles();
});

let oldSemesterData;
let messages = ["Changing semester....", "Collating files...", "Copying files...", "Done.", ""];
let counter = 0;
const loadingModal = document.getElementById('loadingModal');
const modalMessage = document.getElementById('modalMessage');
let deptSel = document.getElementById('dept');
let semSel = document.getElementById('semester');
let yearSel = document.getElementById('year');
const element = document.getElementById("saveButton");
element.addEventListener("click", function() {
    compareSemesterData();
});
let cont = document.getElementById('continueButton');
cont.addEventListener("click", function() {
    console.log("continue");
    //window.location.href = "../html/weekGrid.html";
});

function loadLocalForageFiles() {
    var keyList = [];

    localforage.iterate(function(value, key, iterationNumber) {
        //console.log([key, value]);
        keyList.push(key);
    }).then(function() {
        console.log('Iteration has completed');
        console.log(keyList);
    }).catch(function(err) {
        console.log(err);
    });

    getSemesterData();
};

function getSemesterData() {
    localforage.getItem("semesterData", function(err, oldSemesterData) {
        //localforage.getItem('courses', function(err, courses) {
        console.log(oldSemesterData);
        let deptSel = document.getElementById('dept');
        let semSel = document.getElementById('semester');
        let yearSel = document.getElementById('year');
        let oldSemYear = oldSemesterData.semester + " " + oldSemesterData.year;

        deptSel.value = oldSemesterData.semYear.dept;
        semSel.value = oldSemesterData.semYear.semester;
        yearSel.value = oldSemesterData.semYear.year;

        let currString = "Current Semester is: " + oldSemesterData.semYear.dept + ' ' + oldSemesterData.semYear.semester + " " + oldSemesterData.semYear.year;
        document.getElementById("messageDiv").innerHTML = currString;
    });
};

function compareSemesterData() {
    localforage.getItem("semesterData", function(err, oldSemesterData) {
        let newSem = semSel.value;
        let newYear = yearSel.value;
        let newDept = deptSel.value;

        let newSemYear = newDept + " " + newSem + " " + newYear;
        let oldSemYear = oldSemesterData.semYear.dept + " " + oldSemesterData.semYear.semester + " " + oldSemesterData.semYear.year;

        if (newSemYear === oldSemYear) {
            console.log("Match");
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

            // localforage.setItem("faculty", CFC, function(err, value) {

            localforage.setItem('semesterData', oldSemesterData, function(err, value) {
                console.log(value);
            });
        }



    });
}


/*
//If there is no old semester data, create a new one
if (!oldSemesterData) {
    localforage.setItem('semesterData', {
        semYear: {
            dept: "",
            year: "",
            semester: "",
            courses: [],
            preferences: []
        }
    })
}

//if the old semester data === new semester Data, go to "Week Grid"
else if (JSON.stringify(oldSemesterData) === JSON.stringify(semYear)) {
    //go to weekGrid.html
    window.location.href = "../html/weekGrid.html";
}
*/

prepareNewSemester();






function prepareNewSemester() {

    // changeDisplay();



};

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
        //window.location.href = "faculty.html";
    } else {
        // Otherwise, set a timeout to change the display again in 5 seconds
        setTimeout(changeDisplay, 2000);
    }
};

/*
let department = "Computer Science";
let semester = "Fall";
let year = "2023";

// Create a unique store name using these values
let storeName = `${department}_${semester}${year}`;

// Check if the storeName exists in sessionStorage
if (sessionStorage.getItem(storeName)) {
    // If it exists, configure localForage to use this store
    localforage.config({
        name: 'MyApp',
        storeName: storeName
    });
} else {
    // If it doesn't exist, create a new store and save the storeName in sessionStorage
    sessionStorage.setItem(storeName, storeName);
    localforage.config({
        name: 'MyApp',
        storeName: storeName
    });
}
*/
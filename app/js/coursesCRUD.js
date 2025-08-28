function addCourse() {
    currentStore.getItem('courses', function(err, courseList) {

        if (err || courseList === undefined || courseList === null) {
            var dialog = document.getElementById("noCourseDialog");
            dialog.showModal();
            return;
        }

        let cList = courseList;
        console.log(cList);

        //

        var newCourse = {};
        var entryError = false;
        var div = document.getElementById("division").value;
        var courseNum = document.getElementById("number").value;
        if (courseNum[3] !== '-' || courseNum.includes(" ")) {
            entryError = true;
            alert("Please make sure that the course number has a hyphen and no spaces, e.g. 'BUS-001TVL'");
            return;
        }
        var tempcourseName = document.getElementById("title").value;
        var courseName = tempcourseName.charAt(0).toUpperCase() + tempcourseName.slice(1);
        var loc = document.getElementById("location").value;
        var method = document.getElementById("method").value;
        var semester = document.getElementById("semester").value;

        console.log(div, courseNum, courseName, loc, method, semester);


        newCourse = ({
            "div": div,
            "num": courseNum.toUpperCase(),
            "title": courseName,
            "loc": loc,
            "method": method,
            "sem": semester,
            "sections": 0
        });
        console.log(newCourse);

        console.log(cList);
        cList.push(newCourse);


        try {
            saveData(cList, function(err) {

                // generateDeleteSelect(cList);

            })
        } catch (err) {
            console.log(err);
        }
        let addConfirm = document.querySelector('#addConfirm');
        var closeButton = document.getElementById("alertOk");
        addConfirm.showModal();

        closeButton.onclick = function() {
            addConfirm.close();
        }

        //alert("Course added: " + courseName);
        let addDiv = document.querySelector('#addModal');
        addDiv.close();
        //document.getElementById("number").innerHTML = "";
        //document.getElementById("title").innerHTML = "";

    });
};


function deleteCourse() {
    const deleteSelect = document.getElementById("deleteSelect");
    const selectedIndex = deleteSelect.value;
    console.log(selectedIndex);

    const selectedOption = deleteSelect.options[deleteSelect.selectedIndex];
    const selectedText = selectedOption.textContent;
    var confirmDelete = document.getElementById("confirmDelete");
    var deleteText = document.getElementById("deleteText");
    var alertDialog = document.getElementById("alertDialog");
    var alertText = document.getElementById("alertText");
    var alertClose = document.getElementById("alertClose");
    var confirmYes = document.getElementById("confirmYes");
    var confirmNo = document.getElementById("confirmNo");
    var deleteYes = document.getElementById("deleteYes");
    var deleteNo = document.getElementById("deleteNo");
    console.log(selectedText, selectedOption);

    if (selectedOption.value) {
        deleteText.textContent = `Are you sure you want to delete ${selectedText}?`;
        confirmDelete.showModal();
    } else {
        alertDialog.showModal();
        alertText.textContent = "Please select a course to delete.";
        return;
    }

    // var confirmDelete = document.getElementById("confirmDelete");
    console.log(confirmDelete.showModal); // Should log a function if showModal is supported
    confirmDelete.showModal(); // Should display the dialog


    // Check if an event listener has already been added
    if (!deleteYes.hasAttribute('listener')) {
        deleteYes.addEventListener('click', function() {
            // Close the confirmation dialog
            confirmDelete.close();

            // Get the courses from the store
            currentStore.getItem('courses', function(err, allCourses) {
                // Remove the selected course
                allCourses.splice(selectedIndex, 1);

                // Log the remaining courses
                console.log(allCourses);

                // Show an alert dialog with the deletion message
                alertText.textContent = `Course ${selectedText} deleted.`;
                alertDialog.showModal();

                // Close the delete modal
                let deleteDiv = document.querySelector('#deleteModal');
                deleteDiv.close();

                // Save the updated course list
                saveData(allCourses, function() {
                    // Callback function after saving data
                });
            });
        });

        // Add an attribute to indicate that an event listener has been added
        confirmYes.setAttribute('listener', 'true');
    }
}


function saveData(data) {
    console.table("Save Data: ", data);

    sortDataByProperty(data, 'num');
    currentStore.setItem('courses', data, function(err) {
        // if err is non-null, we got an error. otherwise, value is the value
        if (err) {
            console.log(err);
        } else {
            // console.log(data);
            // checkForZeroSections(data);
            // Regenerate the table
            generateTable(data, tableHeaders, 'courseTable');

        }
        generateDeleteSelect(data);

        // getCurrentTotalSections(data);


    });
};

function confirmLoad(csvFile) {
    console.log("Courses, confirmLoad");
    const confirmDialog = document.getElementById('confirmDialog');
    /*
        
        const alertDialog = document.getElementById('alertDialog');
        const loadOptions = document.getElementById('loadModal');
        // Show the confirmation dialog
        */
    confirmDialog.showModal();

    document.getElementById('confirmYes').onclick = function() {
        confirmDialog.close();

        const fileInput = document.getElementById('csv-file');
        const csvFile = fileInput.files[0];



        if (csvFile) {
            readCourseCSVFile(csvFile);
            loadOptions.close();
        } else {
            // Show the alert dialog
            alertDialog.showModal();
        }
    };

    document.getElementById('confirmNo').onclick = function() {
        confirmDialog.close();
        loadOptions.close();
    };

    document.getElementById('alertOk').onclick = function() {
        alertDialog.close();
    };
};
let dialog = document.getElementsByClassName('modal');
const confirmDialog = document.getElementById('confirmDialog');
const alertDialog = document.getElementById('alertDialog');
const loadOptions = document.getElementById('loadModal');
var addDialog = document.getElementById('addModal');
var addBtn = document.getElementById('addButton');
var deleteDialog = document.getElementById('deleteModal');
var deleteBtn = document.getElementById('deleteButton');
var loadDialog = document.getElementById('loadModal');
var loadBtn = document.getElementById('loadButton');
var closeBtn = document.getElementById('closeBtn');
var confirmDelete = document.getElementById("confirmDelete");
var confirmText = document.getElementById("confirmText");
var alertText = document.getElementById("alertText");
var alertClose = document.getElementById("alertClose");
var confirmYes = document.getElementById("confirmYes");
var confirmNo = document.getElementById("confirmNo");

addBtn.addEventListener('click', function() {
    document.getElementById("addModal").showModal();
    console.log("Show add modal");
    //addDialog.showModal();
});

deleteBtn.addEventListener('click', function() {
    deleteDialog.showModal();
    console.log("Show delete modal");
});

loadBtn.addEventListener('click', function() {
    console.log("show load model");
    loadDialog.showModal();
});

confirmNo.onclick = function() {
    confirmDelete.close();
}

alertClose.onclick = function() {
    alertDialog.close();
}

// Close the modal when clicking outside of it
window.addEventListener('click', function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        var modal = modals[i];
        if (event.target == modal) {
            modal.close();
        }
    }
});

//Go through the list of currentCourses,for each person, and check if they have any courses which match the course number. 
//If so, delete those classes, and consolidate any remaining classes
function killZeroSections(courseNum) {
    currentStore.getItem('faculty', function(err, fac) {
        for (let i = 0; i < fac.length; i++) {
            let currentCourses = fac[i].currentCourses;
            if (currentCourses) {
                for (let j = currentCourses.length - 1; j >= 0; j--) {
                    if (currentCourses[j].num === courseNum) {
                        currentCourses.splice(j, 1);
                    }
                }
                if (currentCourses.length > 0) {
                    fac[i].currentCourses = currentCourses;
                } else {
                    delete fac[i].currentCourses;
                }
            }
        }
        currentStore.setItem('faculty', fac, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Classes consolidated successfully');
            }
        });
    });
}
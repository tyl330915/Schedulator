function addCourse() {
    localforage.getItem('courses', function(err, courseList) {

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
        var tempcourseName = document.getElementById("title").value;
        var courseName = tempcourseName.charAt(0).toUpperCase() + tempcourseName.slice(1);
        var loc = document.getElementById("location").value;
        var meth = document.getElementById("method").value;
        var semester = document.getElementById("semester").value;

        console.log(div, courseNum, courseName, loc, meth, semester);


        newCourse = ({
            "div": div,
            "num": courseNum.toUpperCase(),
            "title": courseName,
            "loc": loc,
            "meth": meth,
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
    var confirmText = document.getElementById("confirmText");
    var alertDialog = document.getElementById("alertDialog");
    var alertText = document.getElementById("alertText");
    var alertClose = document.getElementById("alertClose");
    var confirmYes = document.getElementById("confirmYes");
    var confirmNo = document.getElementById("confirmNo");
    console.log(selectedText, selectedOption);

    if (selectedOption.value) {
        confirmText.textContent = `Are you sure you want to delete ${selectedText}?`;
        confirmDelete.showModal();

        confirmYes.onclick = function() {
            confirmDelete.close();
            // Implement your course deletion logic here
            localforage.getItem('courses', function(err, allCourses) {
                allCourses.splice(selectedIndex, 1);

                console.log(allCourses[selectedIndex], allCourses[selectedIndex].title);
                console.log(selectedOption.value);

                console.log(deleteSelect[0].value);
                alertText.textContent = `Course ${selectedText} deleted.`;
                alertDialog.showModal();

                let deleteDiv = document.querySelector('#deleteModal');
                deleteDiv.close();



                saveData(allCourses, function() {

                });
            });

        }

    } else {
        // alert("Please select a course to delete.");
        alertDialog.showModal();
        alertText.textContent = "Please select a course to delete.";
        return;
    }
};

function saveData(data) {
    console.table("Save Data: ", data);
    sortDataByProperty(data, 'num');
    localforage.setItem('courses', data, function(err) {
        // if err is non-null, we got an error
        // if err is non-null, we got an error. otherwise, value is the value
        if (err) {
            console.log(err);
        } else {
            console.log(data);
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
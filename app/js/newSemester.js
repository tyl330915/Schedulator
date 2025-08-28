document.addEventListener('DOMContentLoaded', () => {
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



        const semData = currentStore.getItem('semesterData', function(err, semData) {
            console.log("semData 1: ", semData);
        });

        const sData = {
            "semYear": dsy,
            "currProf": "",
            "currRequiredCoursesCount": 0,
            "currSections": [],
            "currSectionCount": 0,
            "registrarMaxCount": 0
        };

        console.log(JSON.stringify(sData));


        try {
            saveSemesterData(sData);
        } catch (err) {
            alert("Error saving data.")
        }
    })
});


function saveSemesterData(data) {

    currentStore.setItem("semesterData", data, function(err, result) {
        console.log(result);
        alert('Data saved successfully 2!');
        if (err) {
            alert('Error saving data.');
        }
    });

};
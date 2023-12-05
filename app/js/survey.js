//const currentcurrentStore = require("currentcurrentStore");

// anotherScript.js
document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    // Now you can use currentStore
    console.log(currentStore);
    loadExistingPrefs();
});


let buttonState = false;

function loadSurvey() {
    document.getElementById("surveyModal").style.display = "block";
};

document.getElementById('fileInputCSV').addEventListener('change', function(evt) {
    var file = evt.target.files[0];
    Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: function(results) {
            var pData = results.data;
            //console.table(pData);
            document.getElementById("surveyModal").style.display = "none";
            surveyParse(pData);
        }
    });
});





function loadExistingPrefs() {
    currentStore.getItem('facultyPreferences', function(err, fPrefs) {
        if (err) {
            console.log(err);
        } else {
            showNamesAndEmails(fPrefs);
            matchPrefsNametoFacultyName(fPrefs);
        }
    });
};

function showNamesAndEmails(prefs) {
    let nameAndEmail = [];
    if (prefs == null) {
        document.getElementById("surveysCompleted").innerHTML = "No surveys uploaded."
        return;
    } else {
        for (let i = 0; i < prefs.length; i++) {
            nameAndEmail.push([prefs[i].name, prefs[i].prefEmail]);
        }
        // console.table(nameAndEmail);
        let headers = ["Name", "Email"];
        drawTableAddHeaders(nameAndEmail, headers, "objTable");
    }
}


function sortAndDisplayPrefs(facPrefs) {
    facPrefs.sort(function(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
    currentStore.setItem('facultyPreferences', facPrefs, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(facPrefs);
            //drawTable(facPrefs, "displayAllPrefs");
            let headers = ["Email", "Name"];
            //drawTableAddHeaders(facPrefs, headers, "objTable");
            showNamesAndEmails(facPrefs);
        }
    })

};

function showPrefsByClass() {
    currentStore.getItem('courses', function(err, courseList) {
        currentStore.getItem('facultyPreferences', function(err, fPrefs) {
            let pByClass = [];

            for (let i = 0; i < courseList.length; i++) {
                let clNum = courseList[i].num;
                let tautArray = [];
                let wantsArray = [];
                for (let j = 0; j < fPrefs.length; j++) {

                    if (typeof fPrefs[j] !== 'undefined') {
                        let pastTaut = fPrefs[j].past;
                        let wanted = fPrefs[j].wouldLike;

                        if (pastTaut.includes(clNum)) {
                            tautArray.push(" " + fPrefs[j].name.split(", ")[0] + " " + fPrefs[j].name.split(", ")[1][0] + ".");
                        }

                        if (wanted.includes(clNum)) {
                            wantsArray.push(" " + fPrefs[j].name.split(", ")[0] + " " + fPrefs[j].name.split(", ")[1][0] + ".");
                        }

                    }
                };
                pByClass.push({ "Course": clNum, "Has Taught": tautArray, "Wants": wantsArray });
            };

            console.table(pByClass);
            drawTable(pByClass, "objTable");

        });
    });
};



function toggleButton() {

    let button = document.getElementById('showByClass');
    if (buttonState) {
        loadExistingPrefs();
        button.innerHTML = 'Show Preferences by Course';
    } else {
        showPrefsByClass();
        button.innerHTML = 'Show Preferences by Faculty';
    }
    buttonState = !buttonState;
}
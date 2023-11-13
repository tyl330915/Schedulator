//const localforage = require("localforage");

window.addEventListener('load', function() {
    startUp();
});

function startUp() {
    console.log("startup");
    localforage.getItem("faculty", function(err, currFaC) {
        if (err) {
            console.log(err);
            alert("Could not load faculty list. You may need to enter them manually, or use the 'Load Spreadsheet' button on the Faculty page.");
        } else {
            makeDropDown(currFaC);
        }
        clearDivs();
    });
};

function makeDropDown(currFC) {
    console.table(currFC);
    var sel = document.getElementById("facultySelect");
    sel.innerHTML = "";
    let fullName = "";
    let arrayLen = currFC.length;

    var defaultOption = document.createElement("option");
    defaultOption.value = "Select Faculty Name";
    defaultOption.text = "Select Faculty Name";

    sel.appendChild(defaultOption);

    for (var i = 0; i < arrayLen; i++) {
        if (currFC[i].available === true || currFC[i].available === "true") {

            fullName = currFC[i].lastName + ", " + currFC[i].firstName;
            // console.log(fullName);
            var option = document.createElement("option");
            option.value = fullName;
            option.text = fullName;
            if (currFC[i].currentCourses && currFC[i].currentCourses.length > 0) {
                for (let j = 0, len = currFC[i].currentCourses.length; j < len; j++) {
                    if (currFC[i].currentCourses[j].num && !currFC[i].currentCourses[j].days && currFC[i].currentCourses[j].method !== "ONL") {
                        console.log(fullName);
                        option.style.color = "red";
                        option.style.fontStyle = "italic";
                    }
                }
            }
            sel.appendChild(option);
        }
    }
    // defaultOption.selected = true;
    // var selectElement = document.getElementById('mySelect');

    getCurrProfessor();
};



function getCurrProfessor() {

    localforage.getItem('semesterData', function(err, currData) {
        console.log("currData: ", currData);
        var element = document.getElementById('facultySelect');
        let crPrf = currData.currProf;
        //console.log("Prof:", crPrf);
        if (crPrf !== "") {
            element.value = crPrf;
            displayFacPrefs();
        } else {
            element.selectedIndex = 0;
        };

    });
};

function displayFacPrefs() {
    console.log("displayFacPrefs");
    document.getElementById("preferencesDiv").style.display = 'block';
    document.getElementById("TYTable").innerHTML = "";
    let chosenName;
    //let chosenName = document.getElementById("facultySelect").value;
    //console.log(chosenName);
    localforage.getItem('faculty', function(err, fac) {
        localforage.getItem('semesterData', function(err, semData) {


            //clearCourseTable();

            //semData.currProf = chosenName;

            chosenName = document.getElementById("facultySelect").value;
            console.log("chosenName: ", chosenName);


            let index = fac.findIndex(obj => obj.lastName + ", " + obj.firstName === chosenName);
            let chosenEmail = fac[index].email;
            // console.log("1stFacEmail: ", facEmail);

            resetDragnDropTableColors();
            if (fac[index].currentCourses && fac[index].currentCourses.length > 0) {
                showThisSemesterCourses(fac[index].currentCourses);
            }
            // else {
            //     alert("No courses assigned to this faculty member.");
            //  }


            localforage.getItem('facultyPreferences', function(err, facPrefsData) {

                if (facPrefsData) {
                    //  console.log(facPrefsData);
                    showFacPrefsData(facPrefsData, chosenName, chosenEmail);
                } else {
                    document.getElementById("preferencesDiv").style.display = 'none';

                }
            });


            semData.currProf = chosenName;

            localforage.setItem('semesterData', semData, function(err, sData) {
                if (sData) {

                    showIndividualClasses(fac[index].currentCourses);
                }
                if (err) {
                    console.log(err);
                }
            });
        });
    });
};

function showFacPrefsData(facPrefsData, name, CFCemail) {
    console.log("showFacPrefsData");
    let indivPrefs, shortName;

    let prefIndex = facPrefsData.findIndex(obj => obj.prefEmail === CFCemail);
    console.log("1st try: ", prefIndex);
    // console.log(facPrefsData[prefIndex]);
    shortName = name.split(",")[0] + name.split(", ")[1][0];
    if (prefIndex < 0) {


        prefIndex = facPrefsData.findIndex(obj => obj.name.split(", ")[0] + " " + obj.name.split(", ")[1][0].toLowerCase() === shortName);
        console.log("2nd try: ", facPrefsData[prefIndex]);
    }


    if (prefIndex < 0) {
        document.getElementById("preferencesDiv").style.display = 'none';
    } else {
        document.getElementById("preferencesDiv").style.display = 'block';
        console.log("Ready to fill preferences");
        indivPrefs = facPrefsData[prefIndex];

        console.log(indivPrefs.past);
        console.log(document.getElementById("haveTaught"));
        try {
            document.getElementById("unavailReasons").innerHTML = indivPrefs.factors;
            document.getElementById("haveTaught").innerHTML = indivPrefs.past;
            document.getElementById("shouldNot").innerHTML = indivPrefs.shouldNot;
            if (typeof indivPrefs.shouldNot == 'undefined') { document.getElementById("shouldNot").innerHTML = "" };
            document.getElementById("wouldLike").innerHTML = indivPrefs.wouldLike;
            document.getElementById("numBackToBack").innerHTML = indivPrefs.numBackToBack;
            document.getElementById("PTNumLast").innerHTML = indivPrefs.PTLastYear;
            document.getElementById("PTNumThisYear").innerHTML = indivPrefs.PTThisYear;
            document.getElementById("FTThisYear").innerHTML = indivPrefs.FTThisYear;
            document.getElementById("splainin").innerHTML = indivPrefs.whyNot4;
            document.getElementById("ftORpt").innerHTML = indivPrefs.status;

            if (typeof ruFTPT == 'undefined') { document.getElementById("ftORpt").innerHTML = "" };
            document.getElementById("overLoad").innerHTML = indivPrefs.overLoad;
            if (typeof indivPrefs.overLoad == 'undefined') { document.getElementById("overLoad").innerHTML = "" };
            document.getElementById("comments").innerHTML = indivPrefs.comments;
            if (typeof indivPrefs.comments == 'undefined') { document.getElementById("comments").innerHTML = "" };




        } catch (e) {
            console.log(e);
        }
    }

    //var unAvailTimes = parseFullTime(indivPrefs.notAvail);
    //var idealTimes = parseFullTime(indivPrefs.dream);
    console.log(shortName);
    colorGoodAndBadTimes(shortName);



    //resetDragnDropTableColors();
};

function clearDivs() {
    document.getElementById("preferencesDiv").style.display = 'none';
};
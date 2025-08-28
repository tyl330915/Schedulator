//const currentStore = require("currentStore");
document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    // Now you can use currentStore
    startUp();
});


function startUp() {
    console.log("startup");
    currentStore.getItem("faculty", function(err, currFaC) {
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
    //console.table(currFC);
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
    currentStore.getItem('semesterData', function(err, currData) {
        if (err) {
            console.error("Error getting semesterData:", err);
            return;
        }
        console.log("currData: ", currData);
        var element = document.getElementById('facultySelect');
        let crPrf = currData.currProf;
        if (crPrf) {
            element.value = crPrf;
            displayFacPrefs();
        } else {
            element.value = "Select Faculty Name";
        }
    });
}

function displayFacPrefs() {
    console.log("displayFacPrefs");
    //document.getElementById("preferencesDiv").style.display = 'block';
    document.getElementById("TYTable").innerHTML = "";
    document.getElementById("nonClassroomDiv").style.display = "none";
    let chosenName;
    //let chosenName = document.getElementById("facultySelect").value;
    //console.log(chosenName);
    currentStore.getItem('faculty', function(err, fac) {
        currentStore.getItem('semesterData', function(err, semData) {
            chosenName = document.getElementById("facultySelect").value;
            //console.log("chosenName: ", chosenName);
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


            currentStore.getItem('facultyPreferences', function(err, facPrefsData) {
                document.getElementById("preferencesDiv").style.display = 'none';
                if (facPrefsData) {
                    console.log(facPrefsData);
                    showFacPrefsData(facPrefsData, chosenName);
                } 
            });


            semData.currProf = chosenName;

            currentStore.setItem('semesterData', semData, function(err, sData) {
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
    console.log(facPrefsData, name);
    let indivPrefs, shortName;
    let prefIndex = -1;

    //let prefIndex = facPrefsData.findIndex(obj => obj.prefEmail === CFCemail);
    //console.log("1st try: ", prefIndex);
    //console.log(facPrefsData[prefIndex]);
    if (name.includes(", ")) {
        shortName = name.split(", ")[0] + name.split(", ")[1][0];
    } else {
        console.error("Invalid name format:", name);
        return;
    }
    if (prefIndex < 0) {
        prefIndex = facPrefsData.findIndex(function(obj) {
            console.log(shortName, obj.name.split(", ")[0] + obj.name.split(", ")[1][0].toUpperCase());
            return obj.name.split(", ")[0] + obj.name.split(", ")[1][0].toUpperCase() === shortName;
        });
        console.log("2nd try: ", facPrefsData[prefIndex], shortName, facPrefsData[prefIndex].name.split(", ")[0] + " " + facPrefsData[prefIndex].name.split(", ")[1][0].toLowerCase());
    }

    if (prefIndex < 0) {
        document.getElementById("preferencesDiv").style.display = 'none';
    } else {
        document.getElementById("preferencesDiv").style.display = 'block';
        console.log("Ready to fill preferences");
        indivPrefs = facPrefsData[prefIndex];

        console.log(indivPrefs);
        //console.log(document.getElementById("haveTaught"));
        try {
            document.getElementById("unavailReasons").innerHTML = indivPrefs.factors;
            document.getElementById("haveTaught").innerHTML = indivPrefs.past;
            document.getElementById("shouldNot").innerHTML = indivPrefs.shouldNot;
            if (typeof indivPrefs.shouldNot == 'undefined') { document.getElementById("shouldNot").innerHTML = "" };
            document.getElementById("wouldLike").innerHTML = indivPrefs.wouldLike;
            document.getElementById("numBackToBack").innerHTML = indivPrefs.numBackToBack;
            document.getElementById("PTNumThisYear").innerHTML = indivPrefs.PTThisYear;
          document.getElementById("summer").innerHTML = indivPrefs.PTSummer;
            document.getElementById("FTThisYear").innerHTML = indivPrefs.FTThisYear;
            document.getElementById("splainin").innerHTML = indivPrefs.whyNot4;
            //document.getElementById("ftORpt").innerHTML = indivPrefs.status;
            document.getElementById("overLoad").innerHTML = indivPrefs.overLoad;
            
            document.getElementById("comments").innerHTML = indivPrefs.comments;
           // if (typeof indivPrefs.overLoad == 'undefined') { document.getElementById("overLoad").innerHTML = "" };
            //if (typeof ruFTPT == 'undefined') { document.getElementById("ftORpt").innerHTML = "" };
            if (typeof indivPrefs.comments == 'undefined') { document.getElementById("comments").innerHTML = "" };




        } catch (e) {
            console.log(e);
        }
    }

    //var unAvailTimes = parseFullTime(indivPrefs.notAvail);
    //var idealTimes = parseFullTime(indivPrefs.dream);
    //console.log(shortName);
    colorGoodAndBadTimes(shortName);



    //resetDragnDropTableColors();
};

function clearDivs() {
    document.getElementById("preferencesDiv").style.display = 'none';
};
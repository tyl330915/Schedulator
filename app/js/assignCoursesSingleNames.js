//const localforage = require("localforage");

//Manages the coloring and display functions. Allows Preferences to be displayed if mouse hovers on name. 
localforage.keys().then(function(keys) {
    // An array of all the key names.
    console.log(keys);
});





function setMouseOver() {
    let draggerArray = document.getElementsByClassName('dragger');
    for (let a = 0; a < draggerArray.length; a++) {
        let dragger = draggerArray[a];
        dragger.addEventListener('mouseover', function() {
            // 'this' refers to the element that received the 'mouseover' event
            //comment(this.id);
            //console.log("Mouseover", this.id);
            var targetID = this.id.split('.')[0];

            changeBackgroundColor(targetID);

        });
        dragger.addEventListener('mouseout', function() {
            // This code will run when the mouse pointer leaves the element
            // console.log('Mouseover event ended');
            getRidOfRedBoxes();
        });
        dragger.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Prevent the default right-click menu from showing up
            var nameID = this.id.split('.')[0];
            mouseNote(nameID, true);
        });

    }
};

function changeBackgroundColor(name) { //CHANGES BACKGROUND COLOR OF DIVS FOR NAME HIGHLIGHTED
    let relevantBox;

    localforage.getItem("faculty", function(err, facArray) {
        // localforage.getItem("courses", function(err, crses) {
        //console.table(facArray);
        let index = facArray.findIndex(obj => obj.lastName + ", " + obj.firstName === name);

        if (facArray[index].currentCourses && facArray[index].currentCourses.length > 0) {
            console.log(facArray[index].currentCourses);
            for (var c = 0; c < facArray[index].currentCourses.length; c++) {
                relevantBox = document.getElementById("box" + facArray[index].currentCourses[c].num);
                console.log("Relevant Box: ", relevantBox);
                if (relevantBox) {
                    //console.log(relevantBox);
                    relevantBox.style.backgroundColor = "red";
                }
            };
        }
        //});
    });
};

function getRidOfRedBoxes() {
    //console.log("getRidOfRedBoxes");

    localforage.getItem("courses", function(err, crses) {
        let boxArray = [];
        for (let a = 0; a < crses.length; a++) {
            //let boxElements = document.getElementsByClassName("box");
            if (crses[a].sections > 0) {
                boxArray.push("box" + crses[a].num);
            }
        };

        //var allCourseBoxes = Array.from(boxElements);
        //console.log(boxArray);
        for (let b = 0; b < boxArray.length; b++) {
            var relevantBox = document.getElementById(boxArray[b]);
            relevantBox.style.backgroundColor = "";
        };
    });
};



function mouseNote(name) { //DISPLAYS DATA FOR FACULTY MEMBER, AND CHANGES COLOR OF "SCHEDULED" IF THERE IS A DIFFERENCE BETWEEN "NORM" OR "WANTS"
    //localforage.getItem("currentFacultyCourses", function(err, currFC) {
    console.log("mousenote", name);
    localforage.getItem("facultyPreferences", function(err, facPrefs) {
        // console.log(facPrefs);
        let nameIndex = -1;
        let shortName = abbrevName(name);
        ///let nameIndex = facPrefs.findIndex(obj => obj.name === name);
        //console.log(facPrefs[nameIndex]);
        var elements = document.getElementsByClassName('modalTitle');

        for (let i = 0; i < facPrefs.length; i++) {
            //console.log(facPrefs[i].name, abbrevName(facPrefs[i].name));
            if (abbrevName(facPrefs[i].name) === shortName || facPrefs[i].name === name) {
                nameIndex = i;
                break;
            }


        };
        //console.log(facPrefs[nameIndex]);


        if (nameIndex > -1) {
            document.getElementById("messageDiv").innerHTML = "";
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }
            document.getElementById("name").innerHTML = name;
            document.getElementById("haveTaut").innerHTML = facPrefs[nameIndex].past;
            document.getElementById("want2Teach").innerHTML = facPrefs[nameIndex].wouldLike;
            document.getElementById("shouldNotTeach").innerHTML = facPrefs[nameIndex].shouldNot;
        } else {
            document.getElementById("name").innerHTML = name;
            document.getElementById("messageDiv").innerHTML = "No preferences returned for " + name;
            document.getElementById("haveTaut").innerHTML = "";
            document.getElementById("want2Teach").innerHTML = "";
            document.getElementById("shouldNotTeach").innerHTML = "";



            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
        }

        showModal();

    });

};

var modal = document.getElementById('classPrefModal');

function showModal() {
    document.getElementById('classPrefModal').style.display = "block";
};

function closeModal() {
    document.getElementById('classPrefModal').style.display = "none";
};

window.onclick = function(event) {
    if (event.target == classPrefModal) {
        modal.style.display = "none";
    }
}


function abbrevName(name) { //CAN BE USED TO PROVIDE ABBREVIATED DISPLAY NAME. NOT CURRENTLY USED.
    var abName = name.split(', ')[0] + name.split(', ')[1][0];
    return abName;
}
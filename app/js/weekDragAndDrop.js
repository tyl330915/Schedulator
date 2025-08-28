//Drag and drop functions 

//const currentstore = require("currentstore");

function drag(target, e) {
    console.log("drag", e, target)
    console.log("targetID: ", target.id);
    colorGoodAndBadTimes(target.id.split("#")[0]);
    //checkForDuplicates(target.id);
    e.dataTransfer.setData('id', target.id);
};


document.addEventListener('dragover', function(event) {
    // Check if the target has the class "Undroppable"
    var tId = event.target;
    firstDayCellIndex = firstDayCells.indexOf(tId);
    if (firstDayCellIndex < 0) {
        // Prevent the drop
        event.preventDefault();
    }
});


function drop(target, e) {
    console.log("Drop");
    console.log(e);
    console.log("Drop Target", target.id);
    resetDragnDropTableColors();

    //console.log("CFC: ", CFC);


    var id = e.dataTransfer.getData('id');
    console.log("id: ", id);

    var parentID = e.target.parentNode.id;
    console.log("ParentID: ", parentID);
    var tId = target.id;
    let sisterPlace, sisterTarget, currentCourse, firstDayCellIndex;
    let hour = tId.split(" ")[1] + " " + tId.split(" ")[2];
    console.log('tid: ', tId, "parentID: ", parentID, "id: ", id, "hour: ", hour);
    // tid T 2:30 PM parentID holdingPen id:  COR-101.0
    let idMethod = document.getElementById(id).getAttribute("method");
    console.log("HYBRID: ", idMethod, tId);
    if (idMethod === "HYB" && (tId === "W 9:00 AM" || tId === "W 12:15 PM")) {
        alert("Cannot put a hybrid class here.");
        return;
    }

    currentStore.getItem('faculty', function(err, CFC) {
        let chosenName = id.split("#")[0];
        console.log(chosenName);
        nameIndex = CFC.findIndex(obj => obj.lastName + obj.firstName[0] === chosenName);
        //console.log(nameIndex);
        var courseIndex = id.split("#")[1].split("/")[0];

        //console.log(nameIndex, courseIndex);
        //console.log(CFC[nameIndex].currentCourses[courseIndex]);
        currentCourse = CFC[nameIndex].currentCourses[courseIndex];
        currentNum = currentCourse.num;
        currentTime = currentCourse.time;
        currentDays = currentCourse.days;
        currentMethod = currentCourse.method;
        let currentPerWeek;

        console.log("currentTime: ", currentTime, "currentDays: ", currentDays);
        //  if (currentDays === "" || currentDays === undefined || currentDays.includes("/") || currentDays === null || currentTime === "" || currentTime === undefined) {
        //      currentPerWeek = 2;
        //  }

        if (currentMethod === "HYB" || (!currentDays.includes("/") && currentDays !== "")) {
            currentPerWeek = 1;
        } else {
            currentPerWeek = 2;
        }
        console.log("currentCourse: ", currentCourse, "currentMethod: ", currentMethod, "currentTime: ", currentTime, "currentDays: ", currentDays, "currentPerWeek: ", currentPerWeek);
        firstDayCellIndex = twoDayFirstCells.indexOf(tId);
        console.log("firstdaycellindex: ", twoDayFirstCells.indexOf(tId));

        console.log("currentCourse: ", currentCourse);
        console.log("Sister possibilities: ", sisterParse(tId), doubleClassParse(tId));

        // var checkIfOccupied = document.getElementById(tId).hasChildNodes(); //CHECKS TO SEE IF THERE IS ALREADY A CLASS SCHEDULED AT THAT TIME, AND PREVENTS DROP
        //console.log("checkIfOccupied: ", checkIfOccupied);
        //if (checkIfOccupied) {
        //    alert("Already occupied.");
        //    return;
        //}
        console.log("currentPerWeek: ", currentPerWeek, "firstDayCellIndex: ", firstDayCellIndex);
        if ((currentPerWeek === "2" || currentPerWeek === 2 || currentPerWeek === "") && firstDayCellIndex < 0) {
            alert("A: Cannot put a twice-a-week class here.");
            return; //DOES NOT ALLOW TWICE-A-WEEK CLASSES
        }
        if ((currentPerWeek === "1" || currentPerWeek === 1) && doubleClassParse(tId) === "Cannot Drop" && idMethod !== "HYB") {
            console.log("DoubleDrop: ", doubleClassParse(tId))
            alert("A: Cannot put a once-a-week class here.");
            return;

        } else {
            target.appendChild(document.getElementById(id));
            e.preventDefault();

            console.log(document.getElementById(id));


            //makeAndPlaceSister(tId, id);

            // let perWeek = parseInt(document.getElementById(id).getAttribute("perWeek"));



            if (parentID === "holdingPen") {
                let newShortDay = tId.split(" ")[0];
                let newShortTime = tId.split(" ")[1] + " " + tId.split(" ")[2];
                console.log("newShortDay: ", newShortDay, "newShortTime: ", newShortTime);

            }
        }


        var updatedClass = id.split(".")[0];
        var updatedIndex = id.split(".")[1];
        var sisterDragger = document.getElementById(id + '-sister');
        let updatedTime;

        if (sisterDragger) {
            console.log("sisterDragger: ", sisterDragger.id);
            //sisterPW = currentPerWeek;
            //console.log("sisterPW: ", sisterPW);

            console.log("sisterDragger: " + sisterDragger.id + " " + currentPerWeek);
            if (currentPerWeek === "2" || currentPerWeek === 2) {
                sisterPlace = sisterParse(tId);
                if (secondaryCells.indexOf(sisterPlace) === -1) { /////} || checkIfOccupied(sisterPlace)) {
                    alert("B: Cannot put a twice-a-week class here.");
                    return;
                }
                newDays = tId.split(" ")[0] + "/" + sisterPlace.split(" ")[0];
                updatedTime = classBlocks(newDays, hour, currentPerWeek);
                sisterTarget = document.getElementById(sisterPlace);
                console.log("single placed ", sisterPlace, sisterTarget);
            } else {
                sisterPlace = doubleClassParse(tId);
                console.log("SisterPlace: ", sisterPlace);
                if (sisterPlace === "Cannot Drop" || sisterPlace === null) {
                    alert("C: Cannot put a double class here.");
                    return;
                } else {
                    sisterTarget = document.getElementById(sisterPlace);

                    newDays = tId.split(" ")[0];
                    updatedTime = classBlocks(newDays, hour, currentPerWeek);
                    console.log("doublePlaced", sisterPlace, sisterTarget);
                }
            };
            try {
                console.log("Sister target: ", sisterPlace);
                // if (document.getElementById(sisterPlace).hasChildNodes()) {
                //     alert("Already occupied.");
                //     return;
                // };
                document.getElementById(sisterPlace).appendChild(sisterDragger);

            } catch (e) {
                console.log(e);

            }



        } else {

            console.log("No existing sister");
            if ((currentPerWeek = 2 || currentPerWeek === "2" || currentPerWeek === "") && currentMethod !== 'HYB') {
                console.log(tId);
                if (twoDayFirstCells.indexOf(tId) < 0) {
                    alert("Cannot put a twice-a-week class here.");
                    return;
                }
                firstDay = tId.split(" ")[0];
                hour = tId.split(" ")[1] + " " + tId.split(" ")[2];
                console.log(tId.split(" ")[1] + " " + tId.split(" ")[2]);
                sisterPlace = sisterParse(tId);
                secondDay = sisterPlace.split(" ")[0];
                sisterTarget = document.getElementById(sisterPlace);
                newDays = firstDay + "/" + secondDay;
                console.log("single sister placed ", sisterPlace, sisterTarget.id, currentPerWeek, hour, firstDay, secondDay);
                makeAndPlaceSister(tId, id, currentPerWeek, hour);


                if (currentMethod === "HYB") {
                    newDays = tId.split(" ")[0];
                    hour = tId.split(" ")[1] + " " + tId.split(" ")[2];
                    currentPerWeek = 1;

                }

            } else {
                if (currentMethod !== "HYB") {
                    console.log(tId, document.getElementById(id));
                    firstDay = tId.split(" ")[0];
                    hour = tId.split(" ")[1] + " " + tId.split(" ")[2];
                    console.log(tId.split(" ")[1] + " " + tId.split(" ")[2]);
                    sisterPlace = doubleParse(tId);
                    newDays = firstDay;
                    sisterTarget = document.getElementById(sisterPlace);
                    console.log("double placed ", sisterPlace, sisterTarget.id, currentPerWeek, hour);
                    makeAndPlaceSister(tId, id, currentPerWeek, hour); //perWeek, document.getElementById(id), target, classType);
                } else {
                    newDays = tId.split(" ")[0];
                    hour = tId.split(" ")[1] + " " + tId.split(" ")[2];
                    console.log(tId.split(" ")[1] + " " + tId.split(" ")[2]);
                    currentPerWeek = 1;
                }
            }
            console.log("newDays: ", newDays, "hour: ", hour, "currentPerWeek: ", currentPerWeek);

            if (currentMethod === "HYB") {
                updatedTime = classBlocks(newDays, hour, 2);
            } else {
                updatedTime = classBlocks(newDays, hour, currentPerWeek);
            }
            console.log("perWeek: ", currentPerWeek, "updatedClass: ", updatedClass, "updatedIndex: ", updatedIndex, "updatedDays: ", newDays, "updatedTime: ", updatedTime);

            console.log(updatedTime);
        };

        //console.log(e.parentNode);
        //e.parentNode.removeChild(e);  	///CLEARS DRAGGER FROM OLD DIV

        console.log("Saving: ", updatedClass, updatedTime, parentID, updatedIndex);
        //saveSchedule(updatedClass, updatedTime, parentID, updatedIndex, updatedFacName);

        //checkForDuplicateTimes();
        currentCourse.time = updatedTime;
        currentCourse.days = newDays;
        //currentCourse.perWeek = currentPerWeek;




        currentStore.setItem("faculty", CFC, function(err, value) {
            console.log(value[nameIndex].currentCourses);
            createGraph(value);
            getTimeCount();
            //makeDropDown(value);
            //showThisSemesterCourses(value[nameIndex].currentCourses);



            if (err) {
                console.log(err);
            }
        });

    });
};

function highlightDuplicateDraggers(tableName) {

    // Get all td elements within the named table
    let tds = document.querySelectorAll(`table#${tableName} td`);

    // Loop through each td
    tds.forEach((td) => {
        let divs = td.getElementsByTagName('div');
        let ids = {};
        let hasDuplicates = false;

        // Loop through each div within the td
        for (let i = 0; i < divs.length; i++) {
            // Ignore divs that don't contain '#'
            if (!divs[i].id.includes('#')) {
                continue;
            }

            // Extract the name part of the id (before the '/')
            let name = divs[i].id.split('#')[0];

            // If the name already exists in the ids object, set hasDuplicates to true
            if (ids[name]) {
                hasDuplicates = true;
                break;
            } else {
                // If the name doesn't exist in the ids object, add it
                ids[name] = divs[i];
            }
        }

        // If duplicates were found, change the background color of the td to red
        if (hasDuplicates) {
            td.style.backgroundColor = 'red';
        }
    });
}





function unschedDrop(target, e) {
    //resetDragnDropTableColors();
    //var facName = document.getElementById("facultySelect").value;
    var id = e.dataTransfer.getData('id');
    var parentID = document.getElementById(id).parentElement.id;
    var tId = target.id;
    var newClass = id.split(".")[0];
    var newDays = "";
    var newTime = "";
    var newIndex = id.split(".")[1];
    var facName = id.split("#")[0];
    var currentCoursesIndex = id.split("#")[1].split("/")[0];

    console.log("ID: " + id, "ParentID: " + parentID, "tId: " + tId, "newClass: " + newClass, "newTime: " + newTime, "currentCoursesIndex: " + currentCoursesIndex);

    target.appendChild(document.getElementById(id));
    e.preventDefault();

    console.log("Unsched: ", newClass, newDays, newTime, facName);

    currentStore.getItem("faculty", function(err, nameCourses) {

        let nameIndex = nameCourses.map(function(e) { return e.lastName + e.firstName[0]; }).indexOf(facName);
        console.log(nameCourses[nameIndex]);
        let theseCourses = nameCourses[nameIndex].currentCourses;
        let thisCourse = theseCourses[currentCoursesIndex];
        thisCourse.time = "";
        thisCourse.days = "";
        thisCourse.perWeek = "";

        var killSister = document.getElementById(id + "-sister");
        //console.log(killSister);
        if (killSister) {
            killSister.parentNode.removeChild(killSister);
        }

        currentStore.setItem("faculty", nameCourses, function(err, value) {
            console.log(value[nameIndex].currentCourses);
            // colorDraggers();
            createGraph(value);
            //checkForDuplicateTimes();
            //////////////////highlightDuplicateDraggers("dayTable");

            //showThisSemesterCourses(value[nameIndex].currentCourses);

        })

    });

};
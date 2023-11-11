//Drag and drop functions 

//const localforage = require("localforage");

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

    localforage.getItem('faculty', function(err, CFC) {
        let chosenName = id.split("#")[0];
        console.log(chosenName);
        nameIndex = CFC.findIndex(obj => obj.lastName + obj.firstName[0] === chosenName);
        console.log(nameIndex);
        var courseIndex = id.split("#")[1].split("/")[0];

        console.log(nameIndex, courseIndex);
        console.log(CFC[nameIndex].currentCourses[courseIndex]);
        currentCourse = CFC[nameIndex].currentCourses[courseIndex];
        currentNum = currentCourse.num;
        currentTime = currentCourse.time;
        currentDays = currentCourse.days;
        currentMethod = currentCourse.method;
        let currentPerWeek;


        if (currentDays === "" || currentDays === undefined || currentDays.includes("/")) {
            currentPerWeek = 2;
        }

        if (currentMethod === "HYB" || !currentDays.includes("/")) {
            currentPerWeek = 1;
        }

        console.log("currentCourse: ", currentCourse, "currentMethod: ", currentMethod, "currentTime: ", currentTime, "currentDays: ", currentDays);
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
        if ((currentPerWeek === "1" || currentPerWeek === 1) && doubleClassParse(tId) === "Cannot Drop") {
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




        localforage.setItem("faculty", CFC, function(err, value) {
            console.log(value[nameIndex].currentCourses);
            createGraph(CFC);
            getTimeCount();
            //makeDropDown(value);
            //showThisSemesterCourses(value[nameIndex].currentCourses);



            if (err) {
                console.log(err);
            }
        });

    });
};

function checkForDuplicateTimes() {
    localforage.getItem('faculty', function(err, CFC) {
        //console.log(CFC);
        for (var i = 0; i < CFC.length; i++) {
            let name = CFC[i].lastName + ", " + CFC[i].firstName;
            if (CFC[i].currentCourses !== undefined) {
                checkDupes(name, CFC[i].currentCourses);

            }
            //check all of the faculty members, and see if any of them have duplicate days and times
            //if they do, alert the user
        }

    })
}

function checkDupes(profName, courses) {
    // Create an empty object to store the days and times
    var times = {};
    // console.log(profName, courses);
    if (courses.length === 0) {
        return;
    } else {
        // Iterate over each course
        for (var i = 0; i < courses.length; i++) {
            // Get the days and time of the course
            if (courses[i].time && courses[i].days) {

                var daysTime = courses[i].days + ' ' + courses[i].time;
                //console.log(daysTime);
                // Check if the days and time is already in the times object
                if (times[daysTime]) {
                    console.log('Duplicate time found: ', profName, daysTime);
                    //clearTableCells();
                    console.log(courses[i].days, reverseBlockTime(courses[i].time));
                    if (courses[i].days.includes("/")) {
                        let days1 = courses[i].days.split("/")[0] + ' ' + reverseBlockTime(courses[i].time);
                        let days2 = courses[i].days.split("/")[1] + ' ' + reverseBlockTime(courses[i].time);
                        document.getElementById(days1).style.backgroundColor = 'red';
                        document.getElementById(days2).style.backgroundColor = 'red';
                    } else {
                        days1 = courses[i].days + ' ' + reverseBlockTime(courses[i].time);
                        document.getElementById(days1).style.backgroundColor = 'red';
                    }

                } else {
                    // If the days and time is not in the times object, add it
                    times[daysTime] = true;
                }
            }
        }
    }
};
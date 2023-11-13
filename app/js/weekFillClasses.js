//const localforage = require("localforage");

window.addEventListener('load', function() {
    showIndividualClasses();
});

function showIndividualClasses() {
    //console.log("showIndividualClasses");

    localforage.getItem('faculty', function(err, CFC) {
        //clearTableCells();
        createGraph(CFC);
        document.getElementById("unScheduled").innerHTML = "";
        for (i = 0; i < CFC.length; i++) {
            createDragnDropInformation(CFC[i]);

        }
    });
};


function createDragnDropInformation(personData) {

    // console.log("personData", personData);
    ///localforage.getItem('courses', function(err, courses) {
    //console.table(courses);

    let assignedCourses = personData.currentCourses;
    //console.log(personData.lastName, assignedCourses);
    if (assignedCourses) {
        for (j = 0; j < assignedCourses.length; j++) {
            let currentClass = assignedCourses[j];
            assembleDraggerID(personData.lastName + ", " + personData.firstName, currentClass, j);
        };
    }
    colorWeekDraggers(personData);


    ///});
};

function assembleDraggerID(personName, classDT, arrayNumber) {
    //console.log("Called shorterTest");
    // console.log(personName, classDT, arrayNumber);
    let class1, class2, DT1, DT2, hour1, hour2, day1, day2;
    let courseNum = classDT.num;
    let method = classDT.method;
    let shortName = personName.split(",")[0] + personName.split(", ")[1][0];

    if (method === "STN" || method === "HYB") {
        if (classDT.time !== undefined && classDT.time !== null && classDT.time !== "" && classDT.days !== undefined && classDT.days !== null && classDT.days !== "") {


            let classTime = classDT.time;
            let classDays = classDT.days;
            let perWeek;

            //console.log("ShortName: ", shortName);

            if (classDays.includes("/")) {
                perWeek = 2;
            } else {
                perWeek = 1;
            }
            //console.log("perWeek: ", perWeek);

            //  console.log("classTime: ", classTime, "classDays: ", classDays);
            //   console.log(classDT, arrayNumber, method);


            if (perWeek === "2" || perWeek === 2) {
                day1 = classDays.split("/")[0];
                day2 = classDays.split("/")[1];
                hour1 = classTime.split(": ")[1].split("-")[0];
                DT1 = day1 + " " + hour1;
                DT2 = day2 + " " + hour1;

                // console.log("courseNum: ", courseNum, "method: ", method, "DT1: ", DT1, "day2", "DT2: ", DT2, "courseIndex: ", arrayNumber, "perWeek: ", perWeek);
            }

            if ((perWeek === "1" || perWeek === 1) && day1 !== "W") {
                day1 = classDays;
                //console.log(classTime);
                // console.log("classDays: ", classDays, "classTime: ", classTime);
                hour1 = reverseBlockTime(classTime);
                /// hour1 = classTime.split(": ")[1].split("-")[0] + " " + classTime.split("-")[1].split(" ")[1];
                // console.log(hour1);
                DT1 = day1 + " " + hour1;
                DT2 = doubleClassParse(DT1);

                //  console.log("courseNum: ", courseNum, "method: ", method, "DT1: ", DT1, "DT2: ", DT2, "courseIndex: ", arrayNumber, "perWeek: ", perWeek);

            }

            if ((perWeek === "1" || perWeek === 1) && day1 === "W") {
                day1 = classDays;

                // console.log("classDays: ", classDays, "classTime: ", classTime);
                hour1 = reverseBlockTime(classTime);
                /// hour1 = classTime.split(": ")[1].split("-")[0] + " " + classTime.split("-")[1].split(" ")[1];
                //console.log("Wed Hours 1: ", hour1);
                DT1 = day1 + " " + hour1;
                DT2 = doubleClassParse(DT1);

                // console.log("courseNum: ", courseNum, "method: ", method, "DT1: ", DT1, "DT2: ", DT2, "courseIndex: ", arrayNumber, "perWeek: ", perWeek);

            }

            if ((perWeek === "1" || perWeek === 1) && method === "HYB") {
                day1 = classDays;
                // console.log("classDays: ", classDays, "classTime: ", classTime);
                hour1 = reverseBlockTime(classTime);
                /// hour1 = classTime.split(": ")[1].split("-")[0] + " " + classTime.split("-")[1].split(" ")[1];
                //console.log("Wed Hours 1: ", hour1);
                DT1 = day1 + " " + hour1;
                //DT2 = doubleClassParse(DT1);
            }
        } else {
            console.log("Not a schedualable class: ", "shortName: ", shortName, "courseNum: ", courseNum, "method: ", method, "arrayNumber: ", arrayNumber);

        }


        createDragger(shortName, courseNum, DT1, DT2, method, arrayNumber);
    };
};

function createDragger(coursePerson, courseNum, DT1, DT2, method, arrayNumber) {
    // console.log("courseNum: ", courseNum, "DT1: ", DT1, "DT2: ", DT2, "method: ", method, "arrayNumber: ", arrayNumber);
    // console.log("Called createDragger");
    // console.log(coursePerson);
    var dragName = coursePerson + "#" + arrayNumber + "/" + courseNum;
    //console.log("dragName: ", dragName);

    let target;
    var dragger = document.createElement("div");

    if (method === "HYB") {
        dragger.setAttribute("class", "hybridDragger");
    } else {
        dragger.setAttribute("class", "dragger");
    }

    dragger.setAttribute("draggable", "true");
    dragger.setAttribute("ondragstart", "drag(this, event)");
    dragger.setAttribute("id", dragName);
    dragger.setAttribute("name", courseNum);
    dragger.setAttribute("method", method);


    if ((DT1 === null || DT1 === undefined)) {
        target = "unScheduled";
    } else {
        target = DT1;
    }

    let draggerMethod = dragger.getAttribute("method");
    if (draggerMethod !== "STN" && draggerMethod !== "HYB") {
        console.log("Abnormal dragger Method", draggerMethod);
    }
    //console.log("Target: ", target);
    try {
        var t = document.createTextNode(coursePerson + "/" + courseNum); // Create a text node
        dragger.appendChild(t);
        document.getElementById(target).appendChild(dragger);

    } catch (e) {
        console.log(e);
    }

    if (target !== "unScheduled" && draggerMethod !== "HYB") {

        var sisterDragger = document.getElementById(dragger.id).cloneNode(true); //CLONE THE NAME AND PUT IT IN THE SECOND DAY
        sisterDragger.setAttribute("id", dragName + "-sister");
        sisterDragger.setAttribute("draggable", "false");
        //sisterDragger.setAttribute("onmousedown", "rightSelect(event)");
        sisterDragger.setAttribute("class", "sisterDragger");
        sisterDragger.setAttribute("method", method);
        displayCurrTarget();

        try {
            // console.log("trying to place sister");
            // console.log(DT2, sisterDragger.id);
            document.getElementById(DT2).appendChild(sisterDragger);
        } catch (e) {
            console.log(e);
        }
    } else if (draggerMethod === "HYB") {
        console.log("HYBRID: No sister");

    } else {
        console.log("unScheduled");
        return;
    }


};

function makeAndPlaceSister(primaryTarget, id, perWeek, hour) {
    // console.log("makeAndPlaceSister");
    // console.log("primaryTarget: ", primaryTarget, "id: ", id, "perWeek: ", perWeek, "hour: ", hour);
    let sisterTarget, firstDay, secondDay, days, updatedClass, updatedTime, updatedIndex, updatedFacName;

    //console.log("sister hour: ", hour);

    //console.log(nameDragger.id, sisterPlace, doublePlace,  sisterTarget);
    var sisterDragger = document.getElementById(id).cloneNode(true); //CLONE THE NAME AND PUT IT IN THE SECOND DAY
    sisterDragger.setAttribute("id", id + "-sister");
    sisterDragger.setAttribute("draggable", "false");
    sisterDragger.setAttribute("onmousedown", "rightSelect(event)");
    sisterDragger.setAttribute("class", "sisterDragger");
    //sisterDragger.setAttribute("perWeek", perWeek);
    // console.log(primaryTarget, id, perWeek);
    //    console.log(sisterParse(primaryTarget));

    if ((perWeek === 2 || perWeek === "2") && hour.includes("&")) {
        perWeek = 1;
    };

    if (perWeek === "2" || perWeek === 2) {
        sisterTarget = sisterParse(primaryTarget);
        // console.log(sisterTarget);
    }
    if (perWeek === "1" || perWeek === 1) {
        sisterTarget = doubleClassParse(primaryTarget);
        // console.log(sisterTarget);
    }

    //console.log(sisterTarget);
    // if (courseName[7] === "L" || meth === "LAB") {
    //     sisterDragger.setAttribute("class", "labSister");
    // } else {

    //};
    //console.log(sisterDragger.getAttribute("class"), sisterTarget);

    try {

        //console.log("trying to place sister");
        document.getElementById(sisterTarget).appendChild(sisterDragger);
        //console.log("primarytarget: ", primaryTarget, "id: ", id, "perWeek: ", perWeek, "hour: ", hour, "sisterTarget: ", sisterTarget);
        if (perWeek === 2 || perWeek === "2") {
            firstDay = primaryTarget.split(" ")[0];
            secondDay = sisterTarget.split(" ")[0];
            days = firstDay + "/" + secondDay;

        } else {
            days = primaryTarget.split(" ")[0];
        }

        //console.log(days);

        // console.log("firstDay: ", firstDay, "hour: ", hour, "perWeek: ", perWeek);
        // console.log(classBlocks(firstDay, hour, perWeek));
        updatedClass = id.split(".")[0];
        updatedTime = classBlocks(firstDay, hour, perWeek);
        classListIndex = id.split(".")[1];
        updatedIndex = classListIndex;
        updatedFacName = id.split(".")[2];

        //console.log("updatedClass: ", updatedClass, "updatedTime: ", updatedTime, "classListIndex: ", classListIndex, "updatedIndex: ", updatedIndex, "updatedFacName: ", updatedFacName);





    } catch (e) {
        console.log(e);
        if (sisterTarget === null) {
            return;

        };
    };
    /////saveSchedule(updatedClass, updatedTime, oldTime, updatedIndex, updatedFacName)
    //colorDraggers();

};

function clearTableCells() {
    //console.log("Called clearTableCells");
    var divs = document.getElementsByClassName("dayCell");
    for (var i = 0; i < divs.length; i++) {
        divs[i].innerHTML = "";
    };
};
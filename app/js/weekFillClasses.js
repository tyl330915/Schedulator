document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    // Now you can use currentStore
    console.log(currentStore);
    showIndividualClasses();
});

function showIndividualClasses() {
    //console.log("showIndividualClasses");

    currentStore.getItem('faculty', function(err, CFC) {
        //clearTableCells();
        createGraph(CFC);
        document.getElementById("holdingPen").innerHTML = "";
        for (i = 0; i < CFC.length; i++) {
            createDragnDropInformation(CFC[i]);

        }
    });
};


function createDragnDropInformation(personData) {

    //console.log("personData", personData);
    ///currentstore.getItem('courses', function(err, courses) {
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

};

function assembleDraggerID(personName, classDT, arrayNumber) {
    //console.log("Called assembleDraggerID");
    // console.log(personName, classDT, arrayNumber);
    let class1, class2, DT1, DT2, hour1, hour2, day1, day2, perWeek;
    let courseNum = classDT.num;
    let method = classDT.method;
    let shortName = personName.split(",")[0] + personName.split(", ")[1][0];

    if (method === "STN" || method === "HYB" || method === "ONLSY") {
        if (classDT.time !== undefined && classDT.time !== null && classDT.time !== "" && classDT.days !== undefined && classDT.days !== null && classDT.days !== "") {


            let classTime = classDT.time;
            let classDays = classDT.days;
            //console.log("ShortName: ", shortName);

            if (classDays.includes("/")) {
                perWeek = 2;
            } else {
                perWeek = 1;
            }
            // console.log("perWeek: ", perWeek);


            if (perWeek === "2" || perWeek === 2) {
                day1 = classDays.split("/")[0];
                day2 = classDays.split("/")[1];
                hour1 = classTime.split(": ")[1].split("-")[0];
                DT1 = day1 + " " + hour1;
                DT2 = day2 + " " + hour1;
            }

            if ((perWeek === "1" || perWeek === 1) && day1 !== "W") {
                day1 = classDays;
                hour1 = reverseBlockTime(classTime);
                DT1 = day1 + " " + hour1;
                DT2 = doubleClassParse(DT1);
            }

            if ((perWeek === "1" || perWeek === 1) && day1 === "W") {
                day1 = classDays;
                hour1 = reverseBlockTime(classTime);
                DT1 = day1 + " " + hour1;
                DT2 = doubleClassParse(DT1);
            }

            if ((perWeek === "1" || perWeek === 1) && method === "HYB" || method === "ONLSY") {
                day1 = classDays;
                hour1 = reverseBlockTime(classTime);
                DT1 = day1 + " " + hour1;
            }
        } else {
            console.log("Not a schedualable class: ", "shortName: ", shortName, "courseNum: ", courseNum, "method: ", method, "arrayNumber: ", arrayNumber);

        }


        createDragger(shortName, courseNum, DT1, DT2, method, arrayNumber, perWeek);
    };
};

function createDragger(coursePerson, courseNum, DT1, DT2, method, arrayNumber, perWeek) {

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
    dragger.setAttribute("perWeek", perWeek);


    if ((DT1 === null || DT1 === undefined)) {
        target = "holdingPen";
    } else {
        target = DT1;
    }

    let draggerMethod = dragger.getAttribute("method");
    if (draggerMethod !== "STN" && draggerMethod !== "HYB" && draggerMethod !== "ONLSY") {
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

    if (target !== "holdingPen" && draggerMethod !== "HYB" && draggerMethod !== "ONLSY") {

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
        console.log("holdingPen");
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
    //sisterDragger.setAttribute("onmousedown", "rightSelect(event)");
    sisterDragger.setAttribute("class", "sisterDragger");

    console.log("sisterID", sisterDragger.getAttribute("id"));

    if ((perWeek === 2 || perWeek === "2") && hour.includes("&")) {
        perWeek = 1;
    };

    if (perWeek === "2" || perWeek === 2) {
        sisterTarget = sisterParse(primaryTarget);
        // console.log(sisterTarget);
    }
    if (perWeek === "1" || perWeek === 1) {
        sisterTarget = doubleClassParse(primaryTarget);
        console.log("sisterID", sisterDragger.id);
        // console.log(sisterTarget);
    }

    try {
        //console.log("trying to place sister");
        document.getElementById(sisterTarget).appendChild(sisterDragger);
        if (perWeek === 2 || perWeek === "2") {
            firstDay = primaryTarget.split(" ")[0];
            secondDay = sisterTarget.split(" ")[0];
            days = firstDay + "/" + secondDay;

        } else {
            days = primaryTarget.split(" ")[0];
        };

        updatedClass = id.split(".")[0];
        updatedTime = classBlocks(firstDay, hour, perWeek);
        classListIndex = id.split(".")[1];
        updatedIndex = classListIndex;
        updatedFacName = id.split(".")[2];

    } catch (e) {
        console.log(e);
        if (sisterTarget === null) {
            return;

        };
    };

};

function clearTableCells() {
    //console.log("Called clearTableCells");
    var divs = document.getElementsByClassName("dayCell");
    for (var i = 0; i < divs.length; i++) {
        divs[i].innerHTML = "";
    };
};

function setDraggerBorders() {
    //console.log("Called setDraggerBorders");
    //get all of the elements with the attribute "perWeek"
    var elements = document.querySelectorAll('[perWeek]');

    // Loop through each element
    for (var i = 0; i < elements.length; i++) {
        // Check if the "perWeek" attribute's value is "1"
        if (elements[i].getAttribute('perWeek') === '1') {
            // Set the border to be 1pt dashed black
            elements[i].style.border = '1pt dashed black';
        }
    }
};
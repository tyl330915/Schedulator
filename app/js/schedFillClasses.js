function showIndividualClasses() {
    console.log("showIndividualClasses");

    currentStore.getItem('faculty', function(err, fac) {

        clearTableCells();
        // clearDivs();


        createGraph(fac);
        document.getElementById("holdingPen").innerHTML = "";
        document.getElementById("notesText").innerHTML = "";

        //        console.log(fac);
        let nameIndex = -1;
        let cleanClassList = [];

        let chosenName = document.getElementById("facultySelect").value;
        //console.log(chosenName);
        nameIndex = fac.findIndex(obj => obj.lastName + ", " + obj.firstName === chosenName);

        if (nameIndex < 0) {
            alert("Cannot find the data for this professor.");

        } else {

            classList = fac[nameIndex].currentCourses;

            //FILL IN THE STATUS FIELD 
            document.getElementById("fullOrPart").innerHTML = fac[nameIndex].status;
            ///FILL IN THE NOTES FIELD
            if (fac[nameIndex].notes !== undefined) {
                document.getElementById("notesText").innerHTML = fac[nameIndex].notes;
            } else {
                document.getElementById("notesText").innerHTML = "";
            }

            cleanClassList = sortCFCAndClean(classList);
            //console.log("clean class list: ", cleanClassList);
            fac[nameIndex].currentCourses = cleanClassList;
            currentStore.setItem('faculty', fac, function(err, value) {
                //console.log("Clean CFC saved: ", value);
                createDragnDropInformation(fac[nameIndex]);
            })
        }
        document.getElementById("holdingPen").innerHTML = "";
    });
};



function createDragnDropInformation(personData) {
    console.log(personData);

    //currentStore.getItem('courses', function(err, courses) {
    let assignedCourses = personData.currentCourses;

    if (assignedCourses) {
        for (j = 0; j < assignedCourses.length; j++) {
            console.log(assignedCourses[j]);
            let method = assignedCourses[j].method;
            let currentClass = assignedCourses[j];

            shorterTest(personData, currentClass, j, method);

        };
        colorDraggers();
    }

};

function shorterTest(personData, classDT, arrayNumber, method) {
    console.log("Called shorterTest");
    //console.log(classDT, arrayNumber, method);
    let class1, class2, DT1, DT2, hour1, hour2, day1, day2;
    let courseNum = classDT.num;

    if (method !== "STN" && method !== "HYB" && method !== "ONLSY") {
        console.log("Not standard: " + method);
        return;
    } else {

        if (classDT.time !== undefined && classDT.time !== null && classDT.time !== "" && classDT.days !== undefined && classDT.days !== null && classDT.days !== "") {
            let classTime = classDT.time;
            let classDays = classDT.days;

            let perWeek;
            // console.log("classTime: ", classTime, classDays.includes("/"));

            if (classDays === "" || classDays === undefined || classDays.includes("/")) {
                perWeek = 2;
            } else {
                perWeek = 1;
            }

            if (method === "HYB") {
                perWeek = 1;
            }

            // console.log("classTime: ", classTime, "classDays: ", classDays, "perWeek: ", perWeek);

            //console.log(classDT, arrayNumber, method);


            if (perWeek === "2" || perWeek === 2) {
                day1 = classDays.split("/")[0];
                day2 = classDays.split("/")[1];
                hour1 = classTime.split(": ")[1].split("-")[0];


                DT1 = day1 + " " + hour1;
                DT2 = day2 + " " + hour1;

                //console.log("courseNum: ", courseNum, "method: ", method, "DT1: ", DT1, "day2", "DT2: ", DT2, "courseIndex: ", arrayNumber, "perWeek: ", perWeek);
            }

            if ((perWeek === "1" || perWeek === 1) && day1 !== "W") {
                day1 = classDays;
                //console.log(classTime);
                // console.log("classDays: ", classDays, "classTime: ", classTime);
                hour1 = reverseBlockTime(classTime);
                /// hour1 = classTime.split(": ")[1].split("-")[0] + " " + classTime.split("-")[1].split(" ")[1];
                //console.log(hour1);
                DT1 = day1 + " " + hour1;
                DT2 = doubleClassParse(DT1);
                // console.log("Single Class: ", DT1, DT2);
                //  console.log("courseNum: ", courseNum, "method: ", method, "DT1: ", DT1, "DT2: ", DT2, "courseIndex: ", arrayNumber, "perWeek: ", perWeek);

            }

            if ((perWeek === "1" || perWeek === 1) && day1 === "W") {
                day1 = classDays;

                // console.log("classDays: ", classDays, "classTime: ", classTime);
                hour1 = reverseBlockTime(classTime);
                /// hour1 = classTime.split(": ")[1].split("-")[0] + " " + classTime.split("-")[1].split(" ")[1];
                // console.log("Wed Hours 1: ", hour1);
                DT1 = day1 + " " + hour1;
                DT2 = doubleClassParse(DT1);

                // console.log("courseNum: ", courseNum, "method: ", method, "DT1: ", DT1, "DT2: ", DT2, "courseIndex: ", arrayNumber, "perWeek: ", perWeek);

            }

            createDragger(personData, courseNum, DT1, DT2, method, arrayNumber);

        } else {
            console.log("No time", personData.name, DT1, DT2, courseNum, method, arrayNumber);
            createDragger(personData, courseNum, DT1, DT2, method, arrayNumber);
        }
    }

};

function createDragger(personData, courseNum, DT1, DT2, method, arrayNumber) {
    console.log("Called createDragger");
    console.log("courseNum: ", courseNum, "DT1: ", DT1, "DT2: ", DT2, "method: ", method, "arrayNumber: ", arrayNumber);
    let target;
    var dragger = document.createElement("div");

    if (method !== "STN" && method !== "HYB" && method !== "ONLSY") {
        console.log("Not standard");
        return;

    } else {
        if (method === "HYB") {
            dragger.setAttribute("class", "hybridDragger");
        } else {
            dragger.setAttribute("class", "dragger");
        }
        dragger.setAttribute("draggable", "true");
        dragger.setAttribute("ondragstart", "drag(this, event)");
        dragger.setAttribute("id", courseNum + "." + arrayNumber);
        dragger.setAttribute("name", courseNum);
        dragger.setAttribute("method", method);

        //console.log(DT1, DT2);

        //if (dragger.getAttribute("method") !== "STN") {
        //    console.log("Abnormal dragger Method", dragger.getAttribute("method"));
        //}

        if (DT1 === null || DT1 === undefined) {
            target = "holdingPen";
        } else {
            target = DT1;
        }

        // console.log("dragger.id: ", dragger.id, "target: ", target, "course: ", courseNum);

        try {
            var t = document.createTextNode(courseNum); // Create a text node
            dragger.appendChild(t);

            document.getElementById(target).appendChild(dragger);
            // console.log(dragger.id);
        } catch (e) {
            console.log(e);
        }

        if (target !== "holdingPen" && method !== "HYB") {

            var sisterDragger = document.getElementById(dragger.id).cloneNode(true); //CLONE THE NAME AND PUT IT IN THE SECOND DAY
            sisterDragger.setAttribute("id", dragger.id + "-sister");
            sisterDragger.setAttribute("draggable", "false");
            sisterDragger.setAttribute("onmousedown", "rightSelect(event)");
            sisterDragger.setAttribute("class", "sisterDragger");
            sisterDragger.setAttribute("method", method);

            try {
                console.log("Placing sister");
                //console.log(DT2, sisterDragger.id);
                document.getElementById(DT2).appendChild(sisterDragger);

            } catch (e) {
                console.log(e);
            }
        }
        //console.log("personData: ", personData);
        //colorDraggers(personData);

    }
};

function makeAndPlaceSister(primaryTarget, id, perWeek, hour) {
    console.log("makeAndPlaceSister");
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
    // if (courseName[7] === "L" || method === "LAB") {
    //     sisterDragger.setAttribute("class", "labSister");
    // } else {

    //};
    //console.log(sisterDragger.getAttribute("class"), sisterTarget);

    try {

        console.log("trying to place sister");
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

};

function clearTableCells() {
    console.log("Called clearTableCells");

    var divs = document.getElementsByClassName("dayCell");
    for (var i = 0; i < divs.length; i++) {
        divs[i].innerHTML = "";
    };
};



function showThisSemesterCourses(array) {

    console.log("showThisSemesterCourses");
    // console.table(array);

    if (array.length < 1) {
        alert("You need to assign courses to faculty before they can be scheduled.")
    }

    let classArray = [];
    let nonClassroomArray = [];


    for (let i = 0; i < array.length; i++) {
        //CURRENTLY, ONLY STN AND HYB CLASSES GET ADDED TO THE TABLES
        if (array[i].method === "STN" || array[i].method === undefined || array[i].method === "HYB" || array[i].method === "ONLSY") {

            if (array[i].days === undefined) {
                array[i].days = "";
            }
            if (array[i].time === undefined) {
                array[i].time = "";
            }
            classArray.push([array[i].num, array[i].days, array[i].time, array[i].method]);
        } else {
            nonClassroomArray.push([array[i].num, array[i].days, array[i].time, array[i].method]);
        }
    }
    console.table(classArray);
    console.table(nonClassroomArray);

    drawTableAddHeaders(classArray, ["Course", "Days", "Time", "Method"], "TYTable");
    if (nonClassroomArray.length > 0) {
        document.getElementById("nonClassroomDiv").style.display = "block";
        drawTableAddHeaders(nonClassroomArray, ["Course", "Days", "Time", "Method"], "nonClassroomTable");

    } else {
        document.getElementById("nonClassroomDiv").style.display = "none";

    }

};

function saveNote(newNote) {

    currentStore.getItem("faculty", function(err, CFCSched) {
        let teacherName = document.getElementById("facultySelect").value;
        let nameIndex = CFCSched.findIndex(obj => obj.lastName + ", " + obj.firstName === teacherName);
        //ADD ANY NOTES	
        let noteArea = document.getElementById("notesText");

        //console.log("notes: ", noteArea);
        //console.log("NOTESAVING: ", newNote);
        //console.log(nameIndex);
        //console.log(teacherName);

        CFCSched[nameIndex].notes = newNote;

        currentStore.setItem("faculty", CFCSched, function(err, value) {
            console.log("Note Saved", value);
        });

    });
};
//Displays the table of courses, the number of courses needed, and the faculty available to teach them. 

document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    // Now you can use currentStore
    console.log(currentStore);
    startup();
});

var upDateCourse = [];
let courseArray = [];
let nameCountArray = [];
let colorArray = [];


function startup() {
    currentStore.getItem("faculty", function(err, currFac) {
        tableCreate(currFac);
        pastelColors();

    });
};

document.addEventListener('keydown', function(e) {
    if (e === 123) { // F12 maps to 123
        mainWindow.webContents.openDevTools();
    }
});


function tableCreate(CFC) {
    //console.log('tableCreate'); //THIS CREATES THE TABLE FOR THE COURSES

    document.getElementById('courseNameContainer').innerHTML = "";

    var body = document.body,
        tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('class', 'nameDragTable');
    tbl.setAttribute('id', 'nameDragTable');


    currentStore.getItem('semesterData', function(err, semData) {
        console.log(semData);
        if (!semData) {
            alert("There seems to be an error here: you may need to go back and fill in how many sections are needed for the courses. Go to 'Input', then 'Sections'.")
        };

        let semesterCourses = semData.currSections;
        //console.log(semesterCourses);
        if (!semesterCourses) {
            alert("There seems to be an error here: you may need to go back and fill in how many sections are needed for the courses. Go to 'Input', then 'Sections'.")
        }


        for (var i = 0; i < semesterCourses.length; i++) {
            var fullCourse = semesterCourses[i];
            console.log(fullCourse);
            courseArray.push(fullCourse);
            var tr = tbl.insertRow();
            for (var j = 0; j < 2; j++) {
                var td = tr.insertCell();
                td.setAttribute('id', ('cell' + j + i));
                td.style.border = '1px solid black';
                //td.setAttribute('title', 'First number is the count of those scheduled. Second number is how many are required. Final number is the difference: a positive number means more are needed, a negative number means that there are too many. Yellow color means there are more needed, red that there are fewer needed, and green is just right.  ');
            }
        };


        document.getElementById('courseNameContainer').appendChild(tbl);
        makeCourseBoxes(semesterCourses);

    });

    //initialPopulateTable();

};

function makeCourseBoxes(tyCourses) { //THIS MAKES THE DROP AREAS FOR EACH COURSE
    console.log('makeCourseBoxes');
    var boxContainer = document.createDocumentFragment();

    //console.table(tyCourses)

    for (var i = 0; i < tyCourses.length; i++) {
        var box = document.createElement("div");
        var boxID = "box" + tyCourses[i].num;
        //console.log("Boxid: ", boxID);
        //var boxID = tyCourses[i].CourseNum;

        box.setAttribute('id', boxID);
        box.setAttribute('class', 'box');
        box.setAttribute('class', 'dropTarget');
        box.setAttribute('ondrop', 'drop(event, this)');
        box.setAttribute('ondragover', "allowDrop(event)");
        //box.onchange = readDragTable;

        document.getElementById("cell" + "1" + i).appendChild(box);
    };
    makeCourseDivs(tyCourses);
    ///initialPopulateTable();
    //readDragTable();	
};

function makeCourseDivs(ttyCourses) {
    //MAKE THE COURSE TITLES AND COUNTS FOR THE TABLE
    console.log('makeCourseDivs');
    console.log(ttyCourses);

    for (var a = 0; a < ttyCourses.length; a++) {
        //console.log('cell0' + a);
        //console.log(ttyCourses[a], ttyCourses[a].num, ttyCourses[a].sections);
        document.getElementById('cell0' + a).innerHTML = '<b>' + ttyCourses[a].num + "</b> <br>" + 0 + "/" + ttyCourses[a].sections;
    };
    //initialPopulateTable(courseArray); //initializes the table
    makeAllNames();

};

function makeAllNames() {
    //CALCULATES HOW MANY CLASSES EACH PERSON IS SCHEDULED FOR
    let actualLength;
    currentStore.getItem("faculty", function(err, fac) {
        //console.table(fac);

        console.log('makeAllNames');
        // console.table(pData);
        let howManyClasses = 4;

        //CHECK TO SEE IF NONE OF THE AVAILABILTY IS TRUE
        const isAvailable = fac.some(facultyMember => facultyMember.available === true || facultyMember.available === "true");
        if (!isAvailable) {
            alert('None of the faculty members are set to "available." Please set at least one faculty member to "available."');
            return;
        } else {
            for (var i = 0; i < fac.length; i++) {
                if (fac[i].available === true || fac[i].available === "true") {

                    let facCourses = fac[i].currentCourses;
                    if (facCourses) {
                        actualLength = facCourses.length;
                    }

                    let currentName = fac[i].lastName + ", " + fac[i].firstName;
                    let target = "holdingPen";
                    // console.log(currFC[i].status, currFC[i]);

                    if (fac[i].status === "PT") {
                        howManyClasses = 2;

                    }
                    if (fac[i].status === "FT") {
                        howManyClasses = 4;
                    }

                    //console.log(howManyClasses, currentName);

                    if (actualLength > howManyClasses) {
                        howManyClasses = actualLength;
                    }

                    for (var d = 0; d < howManyClasses; d++) {
                        nameDivID = currentName + '.' + d;
                        target = "holdingPen";
                        makeUpperNameBox(currentName, nameDivID, target);
                    };
                }
                //console.log("currentName: ", currentName, "actualLength: ", actualLength, "howManyClasses: ", howManyClasses, "target: ", target, "cfcCourses: ", cfcCourses);

            }
            fillCoursesFromHoldings(fac);
            updateDragTable();
            setMouseOver();
        }
    });
};

function makeUpperNameBox(abName, nameDivID, targ) { //ADDS ALL NAMES TO UPPER NAME BOX. THEY MAY THEN BE MOVED AUTOMATICALLY TO THE CORRECT COURSE.
    //console.log('makeUpperNameBox');
    //console.log(abName, nameDivID);
    let nameDiv = document.createElement('div');
    nameDiv.setAttribute('class', 'dragger');
    nameDiv.setAttribute('id', nameDivID);
    nameDiv.setAttribute('name', nameDivID);
    nameDiv.setAttribute('draggable', "true");
    nameDiv.setAttribute('ondragstart', "drag(event, this)");
    //nameDiv.addEventListener('onmouseover', comment(abName));
    nameDiv.style.backgroundColor = getNameColor(abName);
    nameDiv.innerHTML = abName;
    targ = "holdingPen";
    document.getElementById(targ).appendChild(nameDiv);
    //targ.appendChild(nameDiv);
};


function comment(id) {
    console.log("Name: " + id);
}

function getNameColor(lname) {

    for (var i = 0; i < colorArray.length; i++) {
        if (lname == colorArray[i][0]) {
            return colorArray[i][1];
        }
    }

};

//var colorArray = [];

function pastelColors() {

    currentStore.getItem('faculty', function(err, fac) {
        // console.table(cfac);
        for (var pc = 0; pc < fac.length; pc++) {

            var r = (Math.round(Math.random() * 127) + 127).toString(16);
            var g = (Math.round(Math.random() * 127) + 127).toString(16);
            var b = (Math.round(Math.random() * 127) + 127).toString(16);
            pColor = '#' + r + g + b;
            var fullName = fac[pc].lastName + ", " + fac[pc].firstName;
            //console.log(fullName);
            //console.log(pColor, fullName);
            colorArray.push([fullName, pColor]);

        };
        makeAddSelect(fac);
    });
};


function makeAddSelect(fac) { //CREATES DROP-MENU FOR NAMES
    //console.table(fac);
    console.log('makeAddSelect');
    var facNames = [];
    ////ADDED 30/1/22 TO MAKE SURE AVAIL FAC WAS ADDED TO SELECT, RATHER THAN JUST CFC NAMES
    for (var i = 0; i < fac.length; i++) {
        if (fac[i].available === true || fac[i].available === "true") {
            facNames.push(fac[i].lastName + ", " + fac[i].firstName);
        }
    }


    var sel = document.getElementById("addName");
    sel.innerHTML = "";
    var arrayLen = facNames.length;

    var option = document.createElement("option");
    option.value = "";
    option.text = "Select faculty name";
    sel.appendChild(option);
    for (var i = 0; i < arrayLen; i++) {
        var option = document.createElement("option");
        option.value = facNames[i];
        option.text = facNames[i];
        //console.log(array[i]);
        sel.appendChild(option);
    };
};


function addNameToTable() { //IF NAME ADDED TO TABLE, ADDS NAME BOX AT TOP
    try {
        console.log('addNameToTable');
        currentStore.getItem("faculty", function(err, cFC) {
            //console.table(cFC);
            let target = "holdingPen";
            let draggerCount = 0;
            let scheduledLength = 0;
            var facName = document.getElementById("addName").value;
            if (facName !== "") {
                var ind = cFC.map(function(e) { return e.lastName + ", " + e.firstName; }).indexOf(facName);
                console.log(ind);

                //cFC[ind].Wants++; 
                console.log("facCoursesCalc: ", cFC[ind].lastName + ", " + cFC[ind].firstName, "Staus: ", cFC[ind].status);
                //console.table(cFC);


                /////// console.log(facName + "." + (cFC[ind].currentCourses.length), target);
                if (cFC[ind].currentCourses) {
                    scheduledLength = cFC[ind].currentCourses.length;
                }
                ///// 

                let parentDiv = document.getElementById('holdingPen');
                let childDivs = parentDiv.children;

                var elements = document.getElementsByClassName('dragger');
                console.log(elements);

                for (let i = 0; i < childDivs.length; i++) {
                    //console.log("childDivs ids: ", childDivs[i].id.split(".")[0], facName);
                    if (childDivs[i].id.split(".")[0] === (facName)) {
                        console.log("facname found");
                        draggerCount++;
                    }
                }
                let finalCount = scheduledLength + draggerCount;
                console.log(facName, draggerCount, scheduledLength, "finalCount: ", finalCount);
                makeUpperNameBox(facName, facName + "." + finalCount, target);
                console.log(cFC[ind].currentCourses);

                currentStore.setItem("faculty", cFC, function(err, facCourses) {
                    //console.table(facCourses);
                    //fillCoursesFromHolding(facCourses);

                });
            };
        });
    } catch (err) {
        console.log(err);
    }

};

function clearHolding() {
    let r = confirm("Are you sure you want to do this? \r\nThis will clear all of the names from the box on the right!");
    if (r == true) {
        const myNode = document.getElementById("holdingPen");
        myNode.innerHTML = '';
    }
};
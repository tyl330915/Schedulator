//Drag and drop functions 

//const localforage = require("localforage");

nameCountArray = [];
colorArray = [];
parentID = "";

function addEventToClass(cls, fx, node = document, e = 'click') {
    Array.from(node.querySelectorAll('.' + cls)).forEach(elem => elem.addEventListener(e, fx));
}

function clickEvent(ev) { console.log('clicked item:', ev.target.id); }

addEventToClass('dragger', clickEvent);

function allowDrop(ev) { ev.preventDefault(); }

function drag(ev) {
    var id = ev.target.id;
    console.log("ID: ", id);
    ev.dataTransfer.setData("itemid", id);
    var source = id ? document.getElementById(ev.target.id).parentNode.id : '';
    ev.dataTransfer.setData("source", source);
}



function drop(ev, target, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (ev.target.id.indexOf('box') < 0 && ev.target.id.indexOf(',') > -1) {
        target = ev.target.parentNode;
        target.appendChild(document.getElementById(item));
        console.log(target.id);

    };

    var item = ev.dataTransfer.getData("itemid");


    ev.target.appendChild(document.getElementById(item));

    var startCourse = ev.dataTransfer.getData("source");
    console.log(startCourse);
    if (startCourse.includes("box")) {
        var startCourse = startCourse.slice(3, startCourse.length);
    };
    var endCourse = target.id;
    console.log(endCourse, ev);

    if (endCourse === "trash") {
        console.log("sending to trash");
        trashName(item, startCourse);
    } else {

        var facName = item.split(".")[0];
        var cIndex = item.split(".")[1];


        if (endCourse.includes("box")) {
            var endCourse = endCourse.slice(3, endCourse.length);
        };

        console.log("courseIndex is: ", cIndex);
        console.log('Name of dragged item is:', facName);
        console.log('id of startCourse:', startCourse);
        console.log('id of endCourse:', endCourse);
        console.log("id of dragger:", item);


        let moveRecord = facName + " moved from " + startCourse + " to " + endCourse;
        if (startCourse !== endCourse) {
            //saveToChangeLog(moveRecord);
        }


        saveDragData(facName, cIndex, startCourse, endCourse, item);
    };
};


//////////////BIN STUFF  
function trashName(item, sCourse) {
    console.log(item);

    var facName = item.split(".")[0];
    var cIndex = item.split(".")[1];

    console.log("courseIndex is: ", cIndex);
    console.log('Name of dragged item is:', facName);
    console.log('id of startCourse:', sCourse);
    console.log('length of startCourse:', sCourse.length);
    var nameDiv = document.getElementById(item);
    nameDiv.outerHTML = "";
    delete element;

    localforage.getItem('faculty', function(err, CFC) {

        var nameIndex = CFC.map(function(e) { return e.lastName + ", " + e.firstName; }).indexOf(facName);

        console.log(nameIndex);
        console.table(CFC);
        if (sCourse === "holdingPen" && CFC[nameIndex].Norm > 0) {
            if (CFC[nameIndex].Norm > 0) {
                CFC[nameIndex].Norm = CFC[nameIndex].Norm - 1;
            };
        } else {
            var courseGroup = CFC[nameIndex].TYCourses;
            console.log(courseGroup);
            var courseIndex = courseGroup.indexOf(sCourse);
            CFC[nameIndex].TYCourses.splice(courseIndex, 1);
            CFC[nameIndex].TYTimes.splice(courseIndex, 1);
            if (CFC[nameIndex].Norm > 0) {
                CFC[nameIndex].Norm = CFC[nameIndex].Norm - 1;
            };
        };

        localforage.setItem("faculty", CFC, function(err, facCourses) {
            console.log(item + "deleted!");
            document.getElementById("trashAlert").innerHTML = "One " + facName.split(",")[0] + "<br> deleted!";
            console.log(facCourses[nameIndex].Norm);
        });

    });
};


//////////////END BIN STUFF 


function saveDragData(facName, courseIndex, oldCourse, newCourse, draggerID) {
    let cfcCourses;
    console.log(facName, courseIndex, oldCourse, newCourse, draggerID);

    ///// localforage.getItem('currentFacultyCourses', function(err, CFC) {
    localforage.getItem('courses', function(err, crses) {
        /// console.table(crses);
        localforage.getItem('faculty', function(err, CFC) {

            let newCourseArray = {};
            var nameIndex = CFC.map(function(e) { return e.lastName + ", " + e.firstName; }).indexOf(facName);
            console.log(nameIndex);


            cfcCourses = CFC[nameIndex].currentCourses;
            if (!cfcCourses) {
                CFC[nameIndex].currentCourses = [];
                cfcCourses = CFC[nameIndex].currentCourses;
            }
            console.log(cfcCourses);

            //GET THE INDEX OF THE OLD COURSE IN THE LIST OF COURSES FOR THIS PERSON
            let thisCourseIndex = cfcCourses.findIndex(course => course.num === oldCourse);
            console.log(CFC[nameIndex]);
            console.log(newCourse, oldCourse, thisCourseIndex);

            //  let nextCourseIndex = parseInt(courseIndex) - 1;

            let draggerIndex = draggerID.split(".")[1];
            if (newCourse === oldCourse) {
                return;
            }

            if (newCourse === "holdingPen") {
                console.table("Initial Drop in holdingPen: ", CFC[nameIndex].currentCourses, CFC[nameIndex].index);
                console.log("Holding Pen", CFC[nameIndex].currentCourses, crses[oldIndex], "courseIndex: " + courseIndex);

                //CFC[nameIndex].currentCourses[thisCourseIndex].num = "holdingPen";

                console.log("Dragger Index: ", draggerIndex);
                if (draggerIndex) {
                    cfcCourses[thisCourseIndex].num = "";
                    cfcCourses[thisCourseIndex].days = "";
                    cfcCourses[thisCourseIndex].time = "";
                    cfcCourses[thisCourseIndex].method = "";

                }
                console.log("cfcCourses: ", cfcCourses);
                for (let i = 0; i < cfcCourses.length; i++) {
                    if (cfcCourses[i].num === "") {
                        cfcCourses.splice(i, 1);
                    }
                }

            };

            if (oldCourse !== "holdingPen" && newCourse !== "holdingPen") {
                var csIndex = crses.map(function(e) { return e.num }).indexOf(newCourse);
                var oldIndex = crses.map(function(e) { return e.num }).indexOf(oldCourse);

                console.log("New course, oldCourse: ", newCourse, oldCourse);
                console.log("csIndex, oldIndex: ", csIndex, oldIndex);
                console.log("crsrs meth: ", newCourse, crses[csIndex].meth);

                cfcCourses[thisCourseIndex].num = newCourse;
                cfcCourses[thisCourseIndex].days = "";
                cfcCourses[thisCourseIndex].time = "";
                cfcCourses[thisCourseIndex].method = crses[csIndex].meth;


            }
            if (oldCourse === "holdingPen") {

                csIndex = crses.map(function(e) { return e.num }).indexOf(newCourse);
                console.log("New course, oldCourse: ", newCourse, oldCourse);
                console.log("csIndex, oldIndex: ", csIndex, oldIndex);
                console.log("crsrs meth: ", newCourse, crses[csIndex].meth);

                if (!cfcCourses[draggerIndex]) {
                    let newEntry = {
                        "num": newCourse,
                        "days": "",
                        "time": "",
                        "method": crses[csIndex].meth


                    }
                    cfcCourses.push(newEntry);
                } else {
                    cfcCourses[draggerIndex].num = newCourse;
                    cfcCourses[draggerIndex].method = crses[csIndex].meth;
                }

                console.log(CFC[nameIndex]);

            };
            console.log(CFC[nameIndex]);
            console.log(cfcCourses);

            saveCFC(CFC);



        });
    });


};


function saveCFC(facCs) {
    console.log("Saving");
    localforage.setItem("faculty", facCs, function(err, facCourses) {
        //console.log(facCourses[nameIndex].TYCourses, facCourses[nameIndex].TYTimes);
        //////////cleanCFC(facCourses);
        updateDragTable();
    });

};
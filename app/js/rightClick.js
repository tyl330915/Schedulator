console.log("rightClick");

let selectedDiv;
let mouseMenu = document.getElementById('context-menu');


document.oncontextmenu = function() {
    return false;
}

function rightSelect(e) {
    if (e.button === 2) {
        let className = e.target.getAttribute('class');
        let idName = e.target.id;
        let secondMenuChoice = document.getElementById("wedThuSwitch");

        console.log('ID : ', idName, className, e.target, e.target.id);
        let mainDraggerID = idName.split("-sister")[0];
        let mainParent = document.getElementById(mainDraggerID).parentElement.id;


        let mainDay = mainParent.split(" ")[0];
        console.log(mainDraggerID, mainParent, mainDay);

        let eveningParent = document.getElementById(e.target.id).parentElement.id;
        //console.log(eveningParent);
        if (mainDay === "M" && (eveningParent.includes("W 5:30 PM") || eveningParent.includes("W 7:00 PM") || eveningParent.includes("TH 5:30 PM") || eveningParent.includes("TH 7:00 PM"))) {
            console.log("Evening!");

            secondMenuChoice.style.display = 'block';
        } else {
            secondMenuChoice.style.display = 'none';
        }


        if (idName.includes("sister")) {
            e.preventDefault();
            mouseMenu.style.left = e.pageX + 'px';
            mouseMenu.style.top = e.pageY + 'px';
            mouseMenu.style.display = 'block';
            mouseMenu.style.backgroundColor = 'lightblue';
            mouseMenu.targetId = e.target.id;
            mouseMenu.parentId = e.target.parentElement.id;
        }

        selectedDiv = e.target.id;
        console.log(selectedDiv);
    }
};



document.onclick = function(e) {
    if (mouseMenu) {
        mouseMenu.style.display = 'none';
    }
}

function switchSingleAndDoubleClasses(selectedDiv, parentId) {
    // console.log('Doing something with ' + selectedDiv + ' and its parent ' + parentId);
    console.log("selectedDiv: ", selectedDiv, parentId);
    currentStore.getItem("faculty", function(err, CFC) {
        //   console.log("selected: ", selectedDiv);

        //console.table(CFC);


        let sisterPW, newSisterPW, sisterTarget, newDays, newTime;
        let facName = document.getElementById('facultySelect').value;
        let facInCFCIndex = CFC.map(function(e) { return e.lastName + ", " + e.firstName; }).indexOf(facName);
        let selIndex = parseInt(selectedDiv.split(".")[1].split("-")[0]);
        // console.log("SelIndex: ", selIndex);
        let classesPerWeek = document.getElementById(selectedDiv).getAttribute("perWeek");

        console.log("facInCFCIndex: ", facInCFCIndex, "selIndex: ", selIndex, "facName: ", facName, "classesPerWeek: ", classesPerWeek);
        //console.log(CFC[facInCFCIndex]);
        //console.log(CFC[facInCFCIndex].currentCourses[selIndex]);

        let currCourse = CFC[facInCFCIndex].currentCourses[selIndex].num;
        let currTime = CFC[facInCFCIndex].currentCourses[selIndex].time;
        let currentDays = CFC[facInCFCIndex].currentCourses[selIndex].days;
        //let sisterPW = CFC[facInCFCIndex].currentCourses[selIndex].perWeek;

        if (currentDays.includes("/")) {
            sisterPW = 2;
        } else {
            sisterPW = 1;
        }

        console.log("CurrCourse: ", currCourse, "currTime: ", currTime, "CurrentDays: ", currentDays, "sisterPW: ", sisterPW);

        //let currClassLength = CFC[facInCFCIndex].[selIndex];
        let mainDragger = document.getElementById(selectedDiv.split("-sister")[0]);
        //let mainPW = mainDragger.getAttribute("pw");

        let sisterDragger = document.getElementById(selectedDiv);

        //console.log(currentDays, currTime, sisterPW);
        /*
                ///SOME ERROR CORRECTION
                if ((sisterPW === "2" || sisterPW === 2) && currTime.includes("&")) {
                    currentDays = currentDays.split("/")[0];
                    sisterPW = "1";
                    //console.log("Changed error: ", currentDays, sisterPW);
                    mainDragger.setAttribute("perWeek", "1");
                    sisterDragger.setAttribute("perWeek", "1");
                }
        */

        if (sisterPW === "1" || sisterPW === 1) {
            console.log("change to two classes");
            newSisterPW = "2";
            firstDay = currentDays;
            firstTime = currTime.split(": ")[1].split("-")[0];
            if (firstDay === "M" && firstTime !== "5:30 PM" && firstTime !== "7:00 PM") {
                newDays = "M" + "/" + "TH";
            }

            if (firstDay === "T" && firstTime !== "5:30 PM" && firstTime !== "7:00 PM") {
                newDays = "T" + "/" + "F";
            }
            /////DEFAULT FOR NIGHT CLASSES
            if (firstDay === "M" && firstTime === "5:30 PM" || firstTime === "7:00 PM") {
                newDays = "M" + "/" + "W";
            }

            if (firstDay === "T" && firstTime === "5:30 PM" || firstTime === "7:00 PM") {
                newDays = "T" + "/" + "TH";
            }

            //newTime = sisterParse(firstDay + " " + firstTime);

            //console.log(firstDay, firstTime);
            //SHIM TO CORRECT ERROR WHERE SINGLE DAY IS SAVED AS DOUBLE DAY
            if (firstDay.includes("/")) {
                firstDay = firstDay.split("/")[0];
            }
            newTime = classBlocks(firstDay, firstTime, "2");

            //console.log("New time: ", newTime);
            sisterTarget = document.getElementById(sisterParse(firstDay + " " + firstTime));
            if (sisterTarget === null) {
                // console.log("sisterTarget is null");
                alert("You will have to move this class to one of the white areas to make it twice a week.");
                return;
            }

            try {
                // console.log("sisterTarget: ", sisterTarget, "firstDay: ", firstDay, "firstTime: ", firstTime, "parsed: ", sisterParse(firstDay + " " + firstTime));
                sisterTarget.appendChild(sisterDragger);
                CFC[facInCFCIndex].currentCourses[selIndex].perWeek = "2";
                CFC[facInCFCIndex].currentCourses[selIndex].days = newDays;
                CFC[facInCFCIndex].currentCourses[selIndex].time = newTime;
                mainDragger.setAttribute("perWeek", "2");
                sisterDragger.setAttribute("perWeek", "2");
            } catch (error) {
                console.log(error);
            }

        } else {
            console.log("change to one class");
            newSisterPW = 1;
            firstDay = currentDays.split("/")[0];
            firstTime = currTime.split(": ")[1].split("-")[0];
            newDays = firstDay;
            //newTime = doubleClassParse(firstDay + " " + firstTime);

            //sisterTarget = document.getElementById(doubleClassParse(firstDay + " " + firstTime));
            //classBlocks(day, timePart, perWeek)
            //console.log("Double new time: ", classBlocks(firstDay, firstTime, "1"));
            newTime = classBlocks(firstDay, firstTime, "1");
            console.log("New time: ", newTime);
            sisterTarget = document.getElementById(doubleClassParse(firstDay + " " + firstTime));


            if (sisterTarget.hasChildNodes()) {
                console.log("sisterTarget is null");
                alert("The class time at " + doubleClassParse(firstDay + " " + firstTime) + " is already occupied.");
                return;
            }


            try {
                console.log("sisterTarget: ", sisterTarget, "firstDay: ", firstDay, "firstTime: ", firstTime, "Double parsed: ", doubleClassParse(firstDay + " " + firstTime));
                sisterTarget.appendChild(sisterDragger);
                CFC[facInCFCIndex].currentCourses[selIndex].perWeek = "1";
                CFC[facInCFCIndex].currentCourses[selIndex].days = newDays;
                CFC[facInCFCIndex].currentCourses[selIndex].time = newTime;
                mainDragger.setAttribute("perWeek", "1");
                sisterDragger.setAttribute("perWeek", "1");



            } catch (error) {
                //console.log(error);
                alert("There is no available time for this to be a double class. Please move the draggable element to a time which has an open following class.");
                return;
            }
        }

        //console.log("newDays: ", newDays, "newTime: ", newTime, "newSisterPW: ", newSisterPW, "sisterTarget: ", sisterTarget.id);

        let newPerWeek = facName + ": " + currCourse + " at " + currTime + " changed to " + newSisterPW + " classes per week at" + newDays + " " + newTime;
        console.log("newPerWeek: ", newPerWeek);

        ////////////////////////////saveToChangeLog(newPerWeek) //SAVE TO HISTORY

        currentStore.setItem('faculty', CFC, function(err, CF) {
            // console.log(CF);
            console.log(CF[facInCFCIndex].currentCourses);
            if (err) {
                console.log(err);
            }
            ///////////////////////////////checkForDuplicateTimes();
            displayFacPrefs(); ///recolors the table to get rid of red, if there. 

        });

    });
};

function switchDays(id, parentId) {
    currentStore.getItem('faculty', function(err, CFC) {
        console.log("switchDays");
        console.log('Doing another thing with ' + id + ' and its parent ' + parentId);
        let parentDay, parentTime, newDay, newDT, newCFCDay, newCFCTime;

        let sisterDragger = document.getElementById(id);
        let currProf = document.getElementById('facultySelect').value;
        let profInCFCIndex = CFC.map(function(e) { return e.lastName + ", " + e.firstName; }).indexOf(currProf);
        let selIndex = parseInt(selectedDiv.split(".")[1].split("-")[0]);
        //  console.log("SelIndex: ", selIndex);
        let hasMonday = CFC[profInCFCIndex].currentCourses[selIndex].days.includes("M");

        let classesPerWeek = CFC[profInCFCIndex].currentCourses[selIndex].perWeek;
        console.log("hasMonday: ", hasMonday, 'classesPerWeek: ', classesPerWeek);
        parentDay = parentId.split(" ")[0];
        parentTime = parentId.split(" ")[1] + " " + parentId.split(" ")[2];
        //console.log("parentDay: ", parentDay, "parentTime: ", parentTime, "hasMonday: ", hasMonday);

        if (hasMonday !== false && (parentTime === "5:30 PM" || parentTime === "7:00 PM")) {

            if (parentDay === "W") {
                newDay = "TH";
            } else if (parentDay === "TH") {
                newDay = "W";
            }


            //  console.log(newDay);
            newDT = newDay + " " + parentTime;
            newCFCDay = "M/" + newDay;
            newCFCTime = classBlocks(newDay, parentTime, "2");

            //console.log("New Time and Day: ", newDT);
            // console.log("New CFC Day: ", newCFCDay, "New CFC Time: ", newCFCTime);
            console.log("parentDay", parentDay, "parentTime", parentTime, "newDay", newDay, "newDT", newDT, "newCFCDay", newCFCDay, "newCFCTime", newCFCTime);

            try {
                let sisterTarget = document.getElementById(newDT);
                sisterTarget.appendChild(sisterDragger);
                CFC[profInCFCIndex].currentCourses[selIndex].days = newCFCDay;
                CFC[profInCFCIndex].currentCourses[selIndex].time = newCFCTime;

                currentStore.setItem('faculty', CFC, function(err, CF) {
                    console.log("change saved");
                    showThisSemesterCourses(CF[profInCFCIndex].currentCourses);
                })

            } catch (e) {
                console.log(e);
            }
            //Get the id of the clicked element
        } else {
            alert("Only Monday classes can switch Wednesday and Thursday classes");
            return;
        }



    });
};
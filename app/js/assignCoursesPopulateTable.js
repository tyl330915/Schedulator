//THIS ATTACHES THE NAMES BOXES TO THE CORRECT COURSE BOX
function fillCoursesFromHoldings(CFC) {
    console.log("fillCoursesFromHoldings");
    console.log(CFC);
    //console.table(courses);
    let courseBox, draggerID;

    for (var c = 0; c < CFC.length; c++) {
        var abName = CFC[c].lastName + ", " + CFC[c].firstName;
        let cfcCourses = CFC[c].currentCourses;

        if (cfcCourses) {
            for (var d = 0; d < cfcCourses.length; d++) {

                var cCourse = cfcCourses[d].num;
                var nameID = abName + "." + (d);
                var boxID = "box" + cCourse;
                //console.log("cCourse: ", cCourse, nameID, boxID);
                var thisBox = document.getElementById(boxID);
                var thisName = document.getElementById(nameID);
                //console.log(thisBox, thisName);

                if (thisName && thisBox) {
                    thisBox.appendChild(thisName);
                };

            }
        } else {
            ///ADD AN EMPTY ARRAY IF NO COURSES
            CFC[c].currentCourses = [];
        };

    };
    //console.log(CFC);
};


//THIS CHECKS HOW MANY PEOPLE ARE NEEDED FOR EACH COURSE
function updateDragTable() {

    console.log("updateDragTable");
    //currentstore.keys().then(function(keys) {
    //    console.log(keys);
    //});

    document.getElementById("alertDiv").innerHTML = "";
    currentStore.getItem("semesterData", function(err, semData) {
        //currentstore.getItem('courses', function(err, courses) {
        console.log(semData);
        let currTotalSectionCount = 0;

        let totalCoursesNeededCount = semData.currRequiredCoursesCount;
        let totalClasses = semData.currSections.length;
        //console.log(totalCoursesNeededCount, totalClasses, semData.currSections);

        for (var i = 0; i < totalClasses; i++) {
            let courseNum = semData.currSections[i].num;
            let boxID = "box" + courseNum;
            //var fubar = document.getElementById('box' + semData[i].currentSections.num).children;
            //console.log(boxID);

            var fubar = document.getElementById(boxID).children;

            var tempList = [];
            for (var j = 0; j < fubar.length; j++) {
                var tempName = fubar[j].id;
                var bareName = tempName.split('.')[0];

                //console.log(bareName);
                tempList.push(bareName);

            }
            //console.log(tempList);

            currTotalSectionCount += tempList.length;


            let targetCell = document.getElementById('cell0' + i);
            let currSectionsCovered = tempList.length;
            let sectionsNeeded = semData.currSections[i].sections;
            // console.log(semData.currSections[i].num, semData.currSections[i].sections);

            targetCell.innerHTML = '<b>' + courseNum + "</b> <br>" + currSectionsCovered + "/" + sectionsNeeded;

            if (currSectionsCovered < sectionsNeeded) {
                targetCell.style.backgroundColor = "#F3F781";
            };
            if (currSectionsCovered === sectionsNeeded) {
                targetCell.style.backgroundColor = "#A9F5A9";
            };
            if (currSectionsCovered > sectionsNeeded) {
                targetCell.style.backgroundColor = "#F6CECE";
            };


        };


        semData.currSectionCount = currTotalSectionCount;
        currentStore.setItem('semesterData', semData, function(err) {
            if (err) { console.log(err) };
            console.log("Course Count updated!");
        })
    });

};

/*
window.onscroll = function() { moveHoldingPen() };

// Get the header
var header = document.getElementById("holdingPen");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function moveHoldingPen() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}
*/
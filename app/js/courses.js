//const localforage = require("localforage");

document.addEventListener("DOMContentLoaded", function(event) {
    showAllCourses();
    localforage.keys().then(function(keys) {
        // An array of all the key names.
        console.log(keys);
    });
});

let currSemester, currDept, currSections, currSectionCount;
const tableHeaders = ['Div', 'Num', 'Title', 'Loc', 'Meth', 'Sem'];


function showAllCourses() {
    var allCourseArray = [];
    document.getElementById("courseTable").innerHTML = "";

    localforage.getItem('courses').then(function(cList) {

        if (cList === undefined || cList === null) {
            var dialog = document.getElementById("noCourseDialog");
            dialog.showModal();
            // alert("Could not find saved courses. You may need to enter them manually, or use the 'Load Spreadsheet' button.");
            return;
        }

        let courseList = cList;
        //console.table(courseList);
        //console.log(courseList[0]);

        var lastCrs = "";
        var cCount = 0;
        var arr = [];
        var allCourseArray = [];
        var tempArray = [];


        for (var index = 0; index < courseList.length; index++) {
            // console.log(courseList[index]);


            var cList = courseList[index];
            var div = courseList[index].div;
            var num = courseList[index].num;
            var title = courseList[index].title;
            //var pWeek = courseList[index].perWeek;
            //var classLength = courseList[index].classLen;
            var loc = courseList[index].loc;
            var meth = courseList[index].meth;
            var sem = courseList[index].sem;
            let sections = courseList[index].sections;
            if (!courseList[index].sections) { sections = 0 };
            //var LY = parseInt(courseList[index].ly);
            //var LY = 0;
            //console.log("Div: ", div, "Num: ", num, "Title: ", title, "Loc: ", loc, "Meth: ", meth, "Sem: ", sem);

            allCourseArray.push({ "div": div, "num": num, "title": title, "loc": loc, "meth": meth, "sem": sem, "sections": sections });

            ///"Per Week": pWeek, "Class Length": classLength, 
            ///Deleted 8/5/22

        }
        //console.table(allCourseArray);
        getCurrentTotalSections(allCourseArray);
        //drawSectionsTable(allCourseArray, objTable);
        generateTable(allCourseArray, tableHeaders, "courseTable");
        generateDeleteSelect(allCourseArray);

        /*
                localforage.getItem("currentSectionCount", function(err, csc) {
                    if (!csc) {
                        getVal();
                    };

                });  */
        });
    }




function getCurrentTotalSections(csData) {
    localforage.getItem("semesterData").then(function(semData) {
        console.log(semData);
        if (!semData) {
            console.log("No Semester Data!");
            let semData = [];
                localforage.setItem('semesterData', semData, function(err) {
                    // if err is non-null, we got an error
                    if (err) {
                        console.log(err);
                    }
                });
            } else {
                localforage.setItem('semesterData', semData).then(function() {
                    console.log("currentSectionCount Saved");
                    console.log(semData);
                }).catch(function(err) {
                    console.log(err);
                });
            }
            let currTotal = 0;
            for (var t = 0; t < csData.length; t++) {
                // console.log(csData[t].sections, parseInt(csData[t].sections));
                currTotal += parseInt(csData[t].sections);
                if (csData[t].sections > 0) {
                    console.log("Sections: ", csData[t].num, csData[t].sections);
                    let validCourse = csData[t];
                    //console.log(validCourse);
                    currentCourses.push(validCourse);
                }
            }
            console.log(currTotal);
            document.getElementById("currentSectionNum").innerText = currTotal;
            semData.currRequiredCoursesCount = currTotal;
    
            semData.currSections = currentCourses;
            console.log(semData);
    
            localforage.setItem('semesterData', semData, function(err) {
                // if err is non-null, we got an error. otherwise, value is the value
                if (err) {
                    console.log(err);
                } else {
                    console.log("currentSectionCount Saved");
                    console.log(semData);
                }
            });
        });
   

};
document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    try {
        console.log("Event listener");
        showAllCourses();
        currentStore.keys().then(function(keys) {
            // An array of all the key names.
            console.log(keys);
        });
    } catch (err) {
        alert('Error getting data. You can either load the courselist from a csv, or enter courses manually.');
        console.log(err);
    }
});


let currSemester, currDept, currSections, currSectionCount;
const tableHeaders = ['Div', 'Num', 'Title', 'Loc', 'Method', 'Sem'];


function showAllCourses() {
    var allCourseArray = [];
    document.getElementById("courseTable").innerHTML = "";

    currentStore.getItem('courses', function(err, cList) {

        if (err || cList === undefined || cList === null || cList.length == 0) {
            var dialog = document.getElementById("noCoursesDialog");
            dialog.showModal();
            //alert("Could not find saved courses. You may need to enter them manually, or use the 'Load Spreadsheet' button.");
            return;
        }

        let courseList = cList;
        console.table(courseList);
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
            var loc = courseList[index].loc;
            //var method = courseList[index].method;
            //SHIM TO ALLOW FOR OLDER CSVS
            //console.log("Method: ", courseList[index].method);
            //console.log("Meth: ", courseList[index].meth);
            var method = courseList[index].method ? courseList[index].method : courseList[index].meth;
            var sem = courseList[index].sem;
            let sections = courseList[index].sections;
            if (!courseList[index].sections) { sections = 0 };

            //console.log("Div: ", div, "Num: ", num, "Title: ", title, "Loc: ", loc, "method: ", method, "Sem: ", sem);

            allCourseArray.push({ "div": div, "num": num, "title": title, "loc": loc, "method": method, "sem": sem, "sections": sections });

            ///"Per Week": pWeek, "Class Length": classLength, 
            ///Deleted 8/5/22

        }
        //console.table(allCourseArray);
        getCurrentTotalSections(allCourseArray);
        //drawSectionsTable(allCourseArray, objTable);
        generateTable(allCourseArray, tableHeaders, "courseTable");
        generateDeleteSelect(allCourseArray);

    });

}

function getCurrentTotalSections(csData) {
    currentStore.getItem("semesterData", function(err, semData) {

        if (err) {
            console.log(err);
        }
        console.log(semData);

        if (!semData || semData.length < 1) {
            console.log("No Semester Data!");

            let semData = [
                { "currentRequiredCoursesCount": 0 },
                { "currentSections": [] }
            ];
            currentStore.setItem('semesterData', semData, function(err) {
                // if err is non-null, we got an error
                if (err) {
                    console.log(err);
                } else {
                    console.log("currentSectionCount Saved");
                    console.log(semData);
                }
            })
        }

        let currentCourses = [];
        let currTotal = 0;
        for (var t = 0; t < csData.length; t++) {
            // console.log(csData[t].sections, parseInt(csData[t].sections));
            currTotal += parseInt(csData[t].sections);
            if (csData[t].sections > 0) {
                //console.log("Sections: ", csData[t].num, csData[t].sections);
                let validCourse = csData[t];
                //console.log(validCourse);
                currentCourses.push(validCourse);
            }
        }
        //console.log(currTotal);
        document.getElementById("currentSectionNum").innerText = currTotal;
        let newSemData = {
            currRequiredCoursesCount: currTotal,
            currSections: currentCourses,
            currProf: semData.currProf,
            currSectionCount: semData.currSectionCount
        };
        console.log(newSemData);

        semData.currRequiredCoursesCount = currTotal;
        semData.currSections = currentCourses;

        currentStore.setItem('semesterData', newSemData, function(err) { //semData

            // if err is non-null, we got an error. otherwise, value is the value
            if (err) {
                console.log(err);
            } else {
                console.log("currentSectionCount Saved");
                console.log(semData);
                console.log(semData.currProf);
                // console.log(semData.keys());
            };
        });

    });
}
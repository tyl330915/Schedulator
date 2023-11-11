//const localforage = require("localforage");

localforage.getItem("faculty", function(err, facArray) {
    if (err) console.log(err);
    localforage.getItem("facultyPreferences", function(err, facPrefs) {
        if (err) console.log(err);
        localforage.getItem('semesterData', function(err, semData) {
            if (err) console.log(err);
            localforage.getItem('courses', function(err, courses) {
                if (err) console.log(err);
                //console.table(facArray);
                //console.log(courses);

                let missingSchedule = [];
                let noClassList = [];
                let missingCount = [];
                let noClassString = "";

                for (var a = 0; a < facArray.length; a++) {
                    let fullName, shortName, facEmail, facInPrefsEmail, facInPrefsName, prefsIndex, wanted, actual, normal, lastName;
                    let currCourses = facArray[a].currentCourses;
                    if (facArray[a].available === true || facArray[a].available === "true") {

                        fullName = facArray[a].lastName + ", " + facArray[a].firstName;
                        shortName = facArray[a].lastName + facArray[a].firstName[0];
                        lastName = facArray[a].lastName;
                        facEmail = facArray[a].email;
                        facStatus = facArray[a].status;
                        if (currCourses && currCourses.length > 0) {
                            actual = currCourses.length;
                        }

                        if (facStatus === "FT") {
                            normal = 4;
                        } else {
                            normal = 2;
                        }

                        //IF THERE IS A FACULTY PREFERENCES SURVEY:
                        if (facPrefs) {
                            facInPrefsEmail = facPrefs.findIndex(obj => obj.prefEmail === facEmail);
                            facInPrefsName = facPrefs.findIndex(obj => obj.name.split(', ')[0] + obj.name.split(", ")[1][0] === shortName);

                            if (facInPrefsEmail > -1) {
                                prefsIndex = facInPrefsEmail;
                            } else {
                                prefsIndex = facInPrefsName;
                            }

                            if (prefsIndex > -1) {

                                if (facPrefs[prefsIndex].FTThisYear > 0) {
                                    wanted = facPrefs[prefsIndex].FTThisYear;
                                } else {
                                    wanted = facPrefs[prefsIndex].PTThisYear;
                                }

                                //LIST THOSE FACULTY WHO HAVE MORE CLASSES SCHEDULED THAN THEY WANTED
                                if (wanted < actual && wanted !== "") {
                                    document.getElementById('moreThanWantedTitle').style.display = "block";
                                    document.getElementById('moreThanWanted').style.display = "block";
                                    document.getElementById("moreThanWanted").innerHTML += "<b>" + lastName + "</b>: Wanted:    " + wanted + "      Scheduled: " + actual + "  ";

                                };

                                //LIST THOSE FACULTY WHO FEWER CLASSES SCHEDULED THAN THEY WANTED
                                if (wanted > actual && wanted != "" && actual != 0) {
                                    document.getElementById('lessThanWantedTitle').style.display = "block";
                                    document.getElementById('lessThanWanted').style.display = "block";
                                    document.getElementById("lessThanWanted").innerHTML += "<b>" + lastName + "</b>: (Wanted: " + wanted + "  Scheduled: " + actual + ")   ";
                                };
                            }
                        } //END FACPREFS IF STATEMENT

                        //LIST THOSE FACULTY WHO HAVE MORE CLASSES SCHEDULED THAN THEY WOULD NORMALLY HAVE FOR THEIR STATUS (PT/FT)
                        if (normal > actual && actual !== 0) {
                            document.getElementById('lessThanNormalTitle').style.display = "block";
                            document.getElementById('lessThanNormal').style.display = "block";
                            document.getElementById("lessThanNormal").innerHTML += "<b> " + lastName + "</b>: (Normal: " + normal + "     Scheduled: " + actual + ")";
                        };

                        //LIST THOSE FACULTY WHO HAVE FEWER CLASSES SCHEDULED THAN THEY WOULD NORMALLY HAVE FOR THEIR STATUS (PT/FT)
                        if (normal < actual) {
                            var lessActual = "<b>" + lastName + "</b>: (Normal: " + normal + "     Actual: " + actual + ") ";
                            document.getElementById('moreThanNormalTitle').style.display = "block";
                            document.getElementById('moreThanNormal').style.display = "block";
                            document.getElementById("moreThanNormal").innerHTML += lessActual;
                        };

                        //GET THE LIST OF FACULTY WHO HAVE UNSCHEDULED CLASSES
                        if (currCourses && currCourses.length > 0) {
                            for (c = 0; c < currCourses.length; c++) {
                                //console.log(fullName, currCourses[c].method, currCourses[c].time, currCourses[c].num);

                                if (currCourses[c].method !== "ONL" && currCourses[c].method !== "FLD" && (currCourses[c].time === "" || currCourses[c].time === "TBD" || currCourses[c].time === "TBA" || currCourses[c].time === undefined || currCourses[c].time === null)) {
                                    //console.log(fullName, currCourses[c].method, currCourses[c].time, currCourses[c].num);
                                    //checkMissingTimes(currArray[b].Name, currArray[b].TYCourses[c]);
                                    let missPair = [fullName, currCourses[c].num];
                                    missingSchedule.push(missPair);
                                }
                            };
                        }
                    };
                    if ((!currCourses || currCourses === undefined || currCourses.length === 0 || currCourses === null) && facArray[a].available === true) { //COMPILES LIST OF PEOPLE WITHOUT CLASSES
                        console.log(lastName);
                        noClassList.push(lastName);
                    };
                };


                //SHOW THE LIST OF FACULTY WHO STILL HAVE UNSCHEDULED CLASSES
                if (missingSchedule.length > 0) {
                    //console.table(missingSchedule);
                    document.getElementById('missingBlurb').style.display = "block";
                    document.getElementById('missingTimes').style.display = "block";
                    //document.getElementById("noTimesTable").style.display = "block";

                    document.getElementById("missingBlurb").innerHTML = "These sections are still unscheduled:";
                    //console.log(missingSchedule);
                    for (let i = 0; i < missingSchedule.length; i++) {
                        document.getElementById("missingList").innerHTML += "<b>" + missingSchedule[i][0] + "</b>: " + missingSchedule[i][1] + "<br>";
                    };
                }

                //GET THE LIST OF FACULTY WHICH HAVE NO CLASSES ASSIGNED TO THEM
                if (noClassList.length > 0) {
                    document.getElementById('noClassesTitle').style.display = "block";
                    document.getElementById('noClasses').style.display = "block";

                    for (let i = 0; i < noClassList.length; i++) {
                        noClassString += noClassList[i] + ", ";
                    };
                    console.log(noClassString);
                    noClassString = noClassString.slice(0, -2);
                    document.getElementById("noClasses").innerHTML = noClassString; //SHOWS NOCLASS MEMBERS 
                };


                //GET THE LIST OF CLASSES WHICH STILL DO NOT HAVE ENOUGH FACULTY
                let ongoingCount = countClasses(facArray);
                let ongoingArray = Object.keys(ongoingCount).map(key => ({ class: key, count: ongoingCount[key] }));

                //console.table(ongoingArray);
                for (let i = 0; i < courses.length; i++) {
                    let course = courses[i];
                    let ongoingCourse = ongoingArray.find(item => item.class === course.num);

                    if (!ongoingCourse || ongoingCourse.count < course.sections) {
                        let diff = ongoingCourse ? course.sections - ongoingCourse.count : course.sections;
                        if (diff > 0) {
                            missingCount.push({ num: course.num, count: diff });
                        }
                    }
                }

                if (missingCount.length > 0) {
                    console.log(missingCount);
                    document.getElementById("missingClassTitle").style.display = "block";
                    document.getElementById("missingClass").style.display = "block";

                    for (let a = 0; a < missingCount.length; a++) {
                        console.log(missingCount[a].num, missingCount[a].count);
                        document.getElementById("missingClass").innerHTML += "<b>" + missingCount[a].num + "</b>: Missing " + "<b>" + missingCount[a].count + "</b> teachers. ";
                    }
                };
            });
        });
    });
});

function countClasses(array) {
    //console.log(array);
    let classCount = {};
    for (let i = 0; i < array.length; i++) {
        let classes = array[i].currentCourses;
        if (classes) {
            for (let j = 0; j < classes.length; j++) {
                let classNum = classes[j].num;
                if (classCount[classNum]) {
                    classCount[classNum]++;
                } else {
                    classCount[classNum] = 1;
                }
            }
        }

    };
    // console.log("classCount", classCount);
    return classCount;
};
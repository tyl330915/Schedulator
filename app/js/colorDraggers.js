function colorDraggers() {
    console.log("Color draggers");
    let chosenName, weekly, drags, sDrags, dragID, sDragID, labDrags, labSister, classList;
    const colorArray = ["mistyrose", "salmon", "lightblue", "cornsilk", "pink", "greenapple", "lightgreen", "wheat", "yellow", "lightlavender", "peachpuff"];

    currentStore.getItem('faculty', function(err, CFC) {
        //get the data for the current faculty memeber, and the array of drag elements

        chosenName = document.getElementById("facultySelect").value;
        nameIndex = CFC.findIndex(obj => obj.lastName + ", " + obj.firstName === chosenName);
        personData = CFC[nameIndex];
        //console.log(personData);
        drags = document.getElementsByClassName("dragger");
        sDrags = document.getElementsByClassName("sisterDragger");

        classList = personData.currentCourses;

        for (let i = 0; i < drags.length; i++) {
            let draggerColor;
            ///get the data for the current dragger
            dragID = drags[i].id;
            if (sDrags[i]) {
                //THIS MAKES SURE THAT THE SISTER DRAGGERS COLOR IS THE SAME AS THE MAIN DRAGGER
                sDragID = drags[i].id + "-sister";
            };

            draggerColor = getRandomColor();

            //get the information for whether the class is once or twice per week
            let listIndex = drags[i].id.split(".")[1];
            //console.log(listIndex);
            let days = classList[listIndex].days;
            if (days === "" || days === undefined || days.includes("/")) {
                weekly = 2;
            } else {
                weekly = 1;
            }

            if (classList[listIndex].method === "HYB") {
                weekly = 1;
            }

            if (classList[listIndex].method !== "ONLSY" && classList[listIndex].method !== "HYB") {
                //color the draggers & set the formatting
                console.log("weekly", weekly);
                if (weekly && (weekly === 1 || weekly === "1")) {
                    //console.log("Once a week");
                    document.getElementById(dragID).style.backgroundColor = draggerColor;
                    document.getElementById(dragID).style.border = "1px dashed black";
                    document.getElementById(dragID).style.borderRadius = "25px";
                    let currSDrag = document.getElementById(sDragID);
                    if (currSDrag) {
                        document.getElementById(sDragID).style.backgroundColor = draggerColor;
                        document.getElementById(sDragID).style.opacity = "0.5";
                        document.getElementById(sDragID).style.border = "1px dashed black";
                        document.getElementById(sDragID).style.borderRadius = "25px";
                    }

                }
                if (weekly && (weekly === 2 || weekly === "2")) {
                    // console.log("Twice a week");
                    document.getElementById(dragID).style.backgroundColor = draggerColor;
                    document.getElementById(dragID).style.border = "1px solid black";
                    document.getElementById(dragID).style.borderRadius = "25px";

                    if (document.getElementById(sDragID)) {
                        document.getElementById(sDragID).style.backgroundColor = draggerColor;
                        document.getElementById(sDragID).style.opacity = "0.5";
                        document.getElementById(sDragID).style.border = "1px solid black";
                        document.getElementById(sDragID).style.borderRadius = "25px";
                    }
                }
            }
        }

    });
};


function colorWeekDraggers(personData) {
    //console.log("Color draggers");
    //console.log(personData);
    let dragColor;
    let classList = personData.currentCourses;
    let weekly = '';
    // console.log(personData);

    dragColor = getRandomColor();

    if (classList) {
        for (let i = 0; i < classList.length; i++) {
            let courseNum = classList[i].num;
            let courseMethod = classList[i].method;

            if (courseMethod === "STN") {
                // console.log(personData.lastName + ", " + personData.firstName[0]);

                var dragName = personData.lastName + personData.firstName[0] + "#" + i + "/" + courseNum;
                weekly = classList[i].perWeek;

                let draggerID = dragName;
                // console.log("draggerID", draggerID);
                if (draggerID) {
                    document.getElementById(draggerID).style.backgroundColor = dragColor;
                }

                let sDraggerID = dragName + "-sister";
                //console.log("sDraggerID", document.getElementById(sDraggerID));
                if (document.getElementById(sDraggerID)) {
                    document.getElementById(sDraggerID).style.backgroundColor = dragColor;
                    document.getElementById(sDraggerID).style.opacity = "0.5";
                }

                // console.log("i", i, "weekly", weekly, "num", courseNum, "draggerID", draggerID);


                if (weekly === 1 || weekly === "1") {
                    // console.log("Once a week");
                    document.getElementById(draggerID).style.border = "1px dashed black";
                    document.getElementById(draggerID).style.borderRadius = "25px";
                    if (sDraggerID) {
                        document.getElementById(sDraggerID).style.border = "1px dashed black";
                        document.getElementById(sDraggerID).style.borderRadius = "25px";
                    }

                } else {
                    //   console.log("Twice a week");
                    document.getElementById(draggerID).style.border = "1px solid black";
                    document.getElementById(draggerID).style.borderRadius = "25px";
                    if (document.getElementById(sDraggerID)) {
                        document.getElementById(sDraggerID).style.border = "1px solid black";
                        document.getElementById(sDraggerID).style.borderRadius = "25px";
                    }
                }
            }
        };
    }
};

function getRandomColor() {
    var hue = Math.floor(Math.random() * 360);
    var pastel = 'hsl(' + hue + ', 100%, 80%)';
    return pastel;
}
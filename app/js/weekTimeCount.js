console.log("weekTimeCount");
//COUNTS THE NUMBER OF PRIMARY CLASSES IN EACH TIME, AND DISPLAYS COUNT IN TOP RIGHT CORNER OF CELL
//console.log(document.getElementsByClassName("tdNum"));
//console.log(document.getElementsByClassName("tdNum")[0]);
//console.log(document.getElementById("M8"));

function displayCurrTarget() {
    localforage.getItem('semesterData', function(err, semDat) {
        //console.log(semDat);
        var counter = document.getElementById("targNum");
        counter.value = semDat.registrarMaxPerTimePeriod;
        displayTimeCount(counter.value);
    });
};

function getTimeCount() {
    let tc = document.getElementById("targNum").value;
    //console.log(tc);
    localforage.getItem('semesterData', function(err, semData) {
        semData.registrarMaxPerTimePeriod = tc;

        localforage.setItem('semesterData', semData, function(err, sd) {
            displayTimeCount(tc)
        })
    });
};

function displayTimeCount(targCount) {
    targCount = parseInt(targCount);
    let tableCells = document.getElementsByClassName("dayCell");
    //console.log(tableCells[1].id);
    let cellID;

    for (var i = 0; i < tableCells.length; i++) {
        cellID = tableCells[i].id;
        let cellTime = cellID.split(" ")[0] + cellID.split(" ")[1].split(":")[0];
        //console.log(cellID, cellTime);

        let childrenLength = document.getElementById(cellID).childNodes.length;
        let primaryCount = 0;

        for (var j = 0; j < childrenLength; j++) {
            let drag = document.getElementById(cellID).childNodes[j];
            //console.log("Drags: ", drag);

            if (drag.id) {
                let thisClass = document.getElementById(drag.id).getAttribute("class");
                //THERE ARE TEXT NODES LURKING IN EACH DAY PART, SO SHOW DRAGGERS AND SISTERS ONLY
                if (thisClass === "dragger" || thisClass === "sisterDragger" || thisClass === "hybridDragger" || thisClass === "sisterDouble" || thisClass == "sisterSingle") {
                    primaryCount++;
                }
            }
        };

        //console.log("Celltime: ", cellTime, document.getElementById(cellTime));

        document.getElementById(cellTime).innerHTML = primaryCount;

        if (primaryCount === targCount) {
            document.getElementById(cellTime).style.color = "lightgreen";
            document.getElementById(cellTime).style.backgroundColor = "black";
            //console.log("equal: ", cellTime);
        };

        if (primaryCount > targCount) {
            document.getElementById(cellTime).style.color = "white";
            document.getElementById(cellTime).style.backgroundColor = "red";
            document.getElementById(cellTime).style.fontWeight = "bold";
        };
        if (primaryCount < targCount) {
            document.getElementById(cellTime).style.color = "yellow";
            document.getElementById(cellTime).style.backgroundColor = "black";
        };
    };
    checkForDuplicateTimes();
};
function resetDragnDropTableColors() {
    console.log("Called resetDragnDropTableColors");
    for (var c = 0; c < firstDayCells.length; c++) {
        //console.log(firstDayCells[c]);

        document.getElementById(firstDayCells[c]).style.backgroundColor = 'white';
    };
    for (var d = 0; d < secondaryCells.length; d++) {
        document.getElementById(secondaryCells[d]).style.backgroundColor = "#ffe6cc";
    };

};

function colorGoodAndBadTimes(shortName) {
    console.log("colorGoodAndBadTimes");
    // resetDragnDropTableColors();

    let goodTimes, badTimes;

    currentStore.getItem('facultyPreferences', function(err, fPrefs) {
        fPrefsIndex = fPrefs.findIndex(obj => obj.name.split(",")[0].toLowerCase() + obj.name.split(", ")[1][0].toLowerCase() === shortName.toLowerCase());

        if (fPrefs[fPrefsIndex]) {
            goodTimes = parseFullTime(fPrefs[fPrefsIndex].dream);
            badTimes = parseFullTime(fPrefs[fPrefsIndex].notAvail);

            for (let d = 0; d < goodTimes.length; d++) {
                document.getElementById(goodTimes[d]).style.backgroundColor = '#AFFFAC';
            }
            for (let f = 0; f < badTimes.length; f++) {
                document.getElementById(badTimes[f]).style.backgroundColor = '#CCDCFE';
            }
        }
        if (err) {
            console.log(err);
        }

    })

};

function checkForDuplicates(draggingName, parentID) {
    console.log("checkForDuplicates: ", draggingName, parentID);
    //var yellowArray = [];
    let dragName = draggingName.split("#")[0];
    let tableCells = document.getElementsByClassName("dayCell");
    //console.log(tableCells);
    for (var a = 0; a < tableCells.length; a++) {
        // console.log(tableCells[a].id);
        var family = document.getElementById(tableCells[a].id).children;
        for (var i = 0; i < family.length; i++) {
            var familyMember = family[i].id;
            var familyLastname = familyMember.split('#')[0];
            if (dragName === familyLastname) { // && family[i].id.indexOf('sister') < 0) { // && parentID !== firstDayCells[a]) {
                var yellowCell = document.getElementById(tableCells[a].id);
                //yellowArray.push(tableCells[a].id);
                yellowCell.style.backgroundColor = "yellow"; //yellow
            };
        };

    };

};
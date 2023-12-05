function surveyParse(preferenceSurvey) {
    console.log("survey parse");
    console.table(preferenceSurvey);
    if (preferenceSurvey.length === 0) {

        return [];
    }
    let fpData = findAndLogDuplicateEmails(preferenceSurvey);
    // console.log(fpData);
    let personPrefs = {};
    let facPrefs = [];
    let headings = fpData[0];
    //console.log(headings);

    let timestamp, email, first, last, reasons, b2b, ptft, ptly, ptty, ftty, ynot4, overLoad, notes, pastTaut, notAvail, wouldLikeToTeach, shouldNotTeach, columnTime, prefTimes, dream;

    for (let a = 0; a < headings.length; a++) {
        //console.log(headings[a]);
        if (headings[a].includes("Timestamp")) {
            timestamp = a;
        }
        if (headings[a].includes('Email')) {
            email = a;
        }
        if (headings[a].includes("First Name")) {
            first = a;
        }
        if (headings[a].includes("Last Name")) {
            last = a;
        }
        if (headings[a].includes("UNAVAILABLE")) {
            reasons = a;
        }
        if (headings[a].includes("back-to-back")) {
            //STUPID SHIM SINCE STUPID GOOGLE FORMS PUT IT IN TWICE
            if (b2b === undefined) {
                b2b = a;
            }
        }
        if (headings[a].includes("Part-Time") && headings[a].includes("last")) {

            ptft = "PT";
            ptly = parseInt(a);
        }
        if (headings[a].includes("Part-Time") && headings[a].includes("would you")) {
            ptty = parseInt(a);
        }
        if (headings[a].includes("Full-Time") && headings[a].includes("should you")) {
            ptft = "FT"
            ftty = parseInt(a);
        }
        if (headings[a].includes("less than 4")) {
            ynot4 = a;
        }
        if (headings[a].includes("overload")) {
            overLoad = a;
        }

        if (headings[a].includes("Anything else")) {
            notes = a;
        }
    };


    //GET TEACHER RESPONSES
    console.log(fpData);


    for (let i = 1; i < fpData.length; i++) {

        dream = "";
        notAvail = "";
        pastTaut = "";
        wouldLikeToTeach = "";
        shouldNotTeach = "";
        classesYesorNo = "";

        for (let b = 0; b < headings.length; b++) {

            if (headings[b].includes("Requests")) {
                let headingIndex = b;
                columnTime = fpData[0][headingIndex].split("[")[1].split("]")[0];
                if (fpData[i][headingIndex].includes("PREFER")) {
                    dream += columnTime + ";";
                }
                if (fpData[i][headingIndex].includes("CANNOT")) {
                    notAvail += columnTime + ";";
                }
            }
            if (headings[b].includes("experience") || headings[b].includes("goals")) {
                headingIndex = b;
                classesYesorNo = fpData[0][headingIndex].split("[")[1].split("]")[0];
                let justClassNumber = classesYesorNo.split(" --")[0];

                if (fpData[i][b].includes("past")) {
                    pastTaut += justClassNumber + ";";
                }
                if (fpData[i][b].includes("never")) {
                    wouldLikeToTeach += justClassNumber + ";";
                }
                if (fpData[i][b].includes("not teach")) {
                    shouldNotTeach += justClassNumber + ";";

                }
            }
        };


        personPrefs[i] = {

            "prefEmail": fpData[i][email],
            "name": capitalizeFirstLetter(fpData[i][last]).trim() + ", " + capitalizeFirstLetter(fpData[i][first].trim()),
            "factors": fpData[i][reasons],
            "numBackToBack": parseInt(fpData[i][b2b]),
            "PTLastYear": Number(fpData[i][ptly]),
            "PTThisYear": Number(fpData[i][ptty]),
            "FTThisYear": Number(fpData[i][ftty]),
            "whyNot4": fpData[i][ynot4],
            "overLoad": fpData[i][overLoad],
            "comments": fpData[i][notes],
            "dream": dream,
            "notAvail": notAvail,
            "past": pastTaut,
            "wouldLike": wouldLikeToTeach,
            "shouldNot": shouldNotTeach
        }

        console.log(personPrefs[i].name, personPrefs[i].dream);
        facPrefs.push(personPrefs[i]);

    };
    console.table(facPrefs);

    matchPrefsNametoFacultyName(facPrefs);
    sortAndDisplayPrefs(facPrefs);

};



function capitalizeFirstLetter(string) {
    let firstPart = string.charAt(0).toUpperCase();
    let secondPart = string.slice(1);
    return firstPart + secondPart;
};

function findAndLogDuplicateEmails(facPrefs) {

    const cleanedData = removeDuplicateEmailsAndKeepLatest(facPrefs);
    console.log("cleanedData: ");
    console.table(cleanedData);
    return cleanedData;

};

function removeDuplicateEmailsAndKeepLatest(array) {
    const emailMap = new Map();

    // Start iterating from the end to handle splicing
    for (let i = array.length - 1; i >= 1; i--) {
        const timestamp = array[i][0];
        const email = array[i][1];

        if (emailMap.has(email)) {
            const existingTimestamp = emailMap.get(email);
            if (new Date(timestamp) > new Date(existingTimestamp)) {
                // Delete the previous entry
                array.splice(emailMap.get(email), 1);
                // Update the map with the latest timestamp
                emailMap.set(email, i);
            } else {
                // Delete the current entry (not the latest)
                array.splice(i, 1);
            }
        } else {
            emailMap.set(email, i);
        }
    }
    //console.log(array);
    return array;

};


function matchPrefsNametoFacultyName(prefs) {
    try {
        currentstore.getItem('faculty', function(err, fac) {
            if (err) throw err;
            console.table(fac);
            let missingNames = [];
            if (fac) {
                for (let i = 0; i < fac.length; i++) {
                    if (fac[i].available = true) {
                        let prefIndex = prefs.map(function(e) { return e.prefEmail; }).indexOf(fac[i].email);
                        if (prefIndex < 0) {
                            console.log("Missing: ", fac[i].email, fac[i].lastName);
                            missingNames.push(fac[i].lastName);
                        }
                    }

                }
                console.log(missingNames);
                document.getElementById("missing").innerHTML = "";
                if (missingNames.length > 0) {
                    document.getElementById("missingDiv").style.display = "block";
                    for (let j = 0; j < missingNames.length - 1; j++) {
                        //GET ALL THE MISSING NAMES BUT THE LAST
                        document.getElementById("missing").innerHTML += missingNames[j] + ", ";
                    }
                    //THIS JUST ENSURE THAT THE FINAL COMMA IS DROPPED FROM THE LAST NAME
                    document.getElementById("missing").innerHTML += missingNames[missingNames.length - 1];
                    document.getElementById("numberMissing").innerHTML = missingNames.length;
                } else {
                    console.log("Could not find saved faculty names. You may need to enter them manually, or use the 'Load Spreadsheet' button.");
                }
            }
        });


    } catch (error) {
        console.log(error);
    }
};
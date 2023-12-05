const tableHeaders = ['First Name', 'Last Name', 'Status', 'Email', 'Available'];


// anotherScript.js
document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    // Now you can use currentStore

    try {
        currentStore.getItem('faculty', function(err, fac) {
            // if err is non-null, we got an error. otherwise, value is the value
            if (err || !fac || fac.length == 0) {
                alert("Could not find saved faculty names. You may need to enter them manually, or use the 'Load Spreadsheet' button.");
                return;
            } else {
                console.log(fac, fac.length);
                generateTable(fac, tableHeaders, "table-container");
                generateAvailableCount(fac);
                createDeleteSelect(fac);
            }
        });
    } catch (err) {
        alert('Error getting data. You can either load the faculty list from a csv, or enter names manually.');
        console.log(err);
    }
});

function sortFacList(facList) {
    const sortedFacList = sortDataByProperty(facList, 'lastName');
    console.table(sortedFacList);
};



function capitalizeFirstLetter(string) {
    console.log(string);
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function showLoadDiv() {
    //const loadOptions = document.getElementById('loadOptions');
    //loadOptions.style.display = 'block';

    let div = document.querySelector('#loadFacList');
    if (isDivVisible) {
        div.style.display = 'none';
    } else {
        div.style.display = 'block';
        //createDeleteSelect(facultyList);
    }
    isDivVisible = !isDivVisible;
};

function confirmLoad() {
    console.log("Fac., confirmLoad");
    const confirmation = window.confirm('This action will erase existing data. Continue?');
    const loadOptions = document.getElementById('loadOptions');
    if (confirmation) {
        const fileInput = document.getElementById('csv-file');
        const csvFile = fileInput.files[0];

        // check if the filename ends with .csv extension
        if (csvFile.name.endsWith(".csv")) {
            parseCSVFile(csvFile);

        } else {
            alert('Please select a CSV file.');
        }

        loadModal.close();
    }
};


function saveData(data) {
    let newData = [];
    //console.table(data);
    sortDataByProperty(data, 'lastName');
    // console.table(data[0]);
    let first, last, stat, email, avail;
    for (let i = 0; i < data.length; i++) {
        first = data[i].firstName;
        last = data[i].lastName;
        stat = data[i].status;
        email = data[i].email;
        if (data[i].available === true || data[i].available === "true" || data[i].available === "TRUE") {
            avail = true;
            currentCourses = data[i].currentCourses;
        } else {
            data[i].available = false;
            avail = false;
            currentCourses = [];
        }

        ///console.log("Name: " + first + " " + last, "Status: " + stat, "email: " + email, "Available: " + avail, "Current Courses: " + currentCourses);

        let currRecord = {
            firstName: first,
            lastName: last,
            status: stat,
            email: email,
            available: avail,
            currentCourses: currentCourses

        };
        newData.push(currRecord);
    }
    console.table(newData);
    // Regenerate the table

    currentStore.setItem('faculty', newData, function(err) {
        // if err is non-null, we got an error

        if (err) {
            console.log(err);
        } else {
            // console.log(data);
            ////////location.reload(); // Reload the page
            generateTable(newData, tableHeaders, 'table-container');
            //createDeleteSelect(data);

            createDeleteSelect(newData);

        }

    });

};



function makeAllAvailable() {
    try {
        currentStore.getItem('faculty', function(err, fac) {
            // if err is non-null, we got an error. otherwise, value is the value
            if (err || fac === null) {
                alert("Could not find saved faculty names. You may need to enter them manually, or use the 'Load Spreadsheet' button.");
                return;
            } else {
                for (let f = 0; f < fac.length; f++) {
                    fac[f].available = true;
                }
                //console.log(fac, fac.length);
                saveData(fac);
            }
        });

    } catch (err) {
        alert('An error occurred while setting availability.');
    }
};

function generateAvailableCount(fac) {
    //  console.table(fac);
    let total = fac.length;
    let available = 0;
    for (let i = 0; i < fac.length; i++) {
        if (fac[i].available === true || fac[i].available === "true") {
            available++;
        }
    }
    console.log(available, total);
    document.getElementById('totalAvailable').innerHTML = available + '/' + total;
};
//Backup and restore functions. 	

////////////////////////////////////////////////////////ARRAY FUNCTIONS
var csvModal = document.getElementById("uploadSSModal");
var csvModalButton = document.getElementById("loadCSVButton");
var houseKeepingModal = document.getElementById("houseKeepingModal");

var filesModal = document.getElementById("uploadFilesModal");
var filesButton = document.getElementById("loadFilesButton");
var loadFiles = document.getElementById("loadFiles");
var loadSS = document.getElementById("loadSSButton");



csvModalButton.onclick = function() {
    csvModal.style.display = "block";
}

filesButton.onclick = function() {
    filesModal.style.display = "block";
}

loadFiles.onclick = function() {
    loadJSONFilesAndSaveInCurrentStore('jsonFiles');
};

loadSS.onclick = function() {
    loadSpreadsheet();
}




function downloadObjectAsCSV(obj, filename) {
    var csv = Object.keys(obj[0]).join(',') + '\n'; // header
    csv += obj.map(row => Object.values(row).join(',')).join('\n'); // data
    // Create a downloadable link
    var link = document.createElement('a');
    link.download = filename;
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function flattenData(data) {
    var result = [];

    // Check if data is defined and is an array
    if (data && Array.isArray(data)) {
        data.forEach(function(datum) {

                result.push({
                    firstName: datum.firstName,
                    lastName: datum.lastName,
                    status: datum.status,
                    email: datum.email,
                    available: datum.available,
                });
            }
            // });
            // }
        );
        return result;

    };
};


function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function fac2CSV() {
    let flattenedData;
    currentStore.getItem("faculty", function(err, fac) {
        console.log(currStore);
        console.table(fac);
        flattenedData = flattenData(fac);

        if (flattenedData.length > 0) {
            var csv = Papa.unparse(flattenedData);
            downloadCSV(csv, `${currStore}` + ' faculty.csv');
        } else {
            console.log('No data to convert to CSV');
        }
    })

};


function courses2CSV() {
    currentStore.getItem("courses", function(err, crses) {
        downloadObjectAsCSV(crses, `${currStore}` + " courses.csv");
    })
};


async function downloadAllcurrentStoreToJSON() {
    const keys = await currentStore.keys();
    for (let key of keys) {
        let value = await currentStore.getItem(key);
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(value));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", key + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}


function areYouSure() {
    if (confirm("Are you absolutely sure? This will overwrite all your data. ")) {
        /////readMultipleFiles();
        getAndSaveFiles("multiInput");
    } else {
        return;
    }
};

function tableToCSV(tableName, name, filename) {
    currentStore.getItem('semesterData', function(err, semData) {
        console.log("semData: ", semData);
        //Get today's date
        let semTitle;
        let date = new Date();
        let formattedDate = (date.getMonth() + 1) + '.' + date.getDate() + '.' + date.getFullYear() + ' ' + date.getHours() + date.getMinutes();
        console.log(formattedDate);

        localforage.getItem('currentStore').then(function(savedStore, err) {
            console.log("value: " + savedStore);
            if (err) {
                console.log('Error: ' + err);
            }
            //let semTitle = semData.semYear.dept + " " + semData.semYear.year + " " + semData.semYear.semester + "-" + formattedDate;
            semTitle = savedStore.split(' ')[0] + " " + savedStore.split(' ')[1] + " " + savedStore.split(' ')[2] + " Schedule" + "-" + formattedDate;



            const table = document.getElementById(tableName);
            var data = [];
            var rows = table.rows;

            for (var i = 0; i < rows.length; i++) {
                var row = [],
                    cols = rows[i].cells;

                for (var j = 0; j < cols.length; j++)
                    row.push(cols[j].innerText);

                data.push(row);
            }

            // Create CSV string using Papa.unparse()
            var csv_string = Papa.unparse(data);

            // Create a downloadable link
            var link = document.createElement('a');
            link.download = semTitle + '.csv';
            link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log("Downloaded " + semTitle + ".csv");
        });
    });
}

function loadJSONFilesAndSaveInCurrentStore(inputElementId) {
    let inputElement = document.getElementById(inputElementId);
    let files = inputElement.files;
    if (confirm("Are you sure you want to load " + files.length + " files? This will overwrite all of your previous data.")) {
        filesModal.style.display = "none";
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();
            reader.onload = async function(e) {
                let content = e.target.result;
                let jsonContent = JSON.parse(content); // Parse the content into a JSON object

                // If currSections exists in the JSON content, parse each item into a JSON object
                if (jsonContent.currSections) {
                    jsonContent.currSections = jsonContent.currSections.map(item => JSON.parse(item));
                }
                //MAKE SURE IT SAVES THE FILES JUST AS "FACULTY" OR "COURSES"
                let fileNameWithoutSuffix = file.name;
                // Remove anything within parentheses
                fileNameWithoutSuffix = fileNameWithoutSuffix.replace(/ \(.*?\)/g, "");
                // Remove all extensions
                while (fileNameWithoutSuffix.includes('.')) {
                    fileNameWithoutSuffix = fileNameWithoutSuffix.substring(0, fileNameWithoutSuffix.lastIndexOf('.'));
                }
                await currentStore.setItem(fileNameWithoutSuffix, jsonContent);
            };
            reader.readAsText(file);
        }

        alert("Files saved.");
        window.location.href = "./courses.html";

    }
};


async function downloadAllFiles() {
    // Get the name of the object store from LocalForage
    let currStore = await localforage.getItem('currentStore');
    console.log("value: " + currStore);
    currentStore.getItem("semesterData", function(err, semData) {
        console.log("semData: ", semData);
    });

    if (currStore) {
        console.log("Saved Store Name exists: " + currStore);

        // Create a new instance for the current store

        let currentStore = localforage.createInstance({
            name: currStore
        });

        let keys = await currentStore.keys();
        console.log("saved store keys: " + keys);

        for (let key of keys) {
            let value = await currentStore.getItem(key);
            console.log(key + ": " + value);

            // If value is an object with a currSections property, stringify each object in the currSections array
            if (value && typeof value === 'object' && Array.isArray(value.currSections)) {
                value.currSections = value.currSections.map(section => JSON.stringify(section));
            }

            let dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(value, null, 2));
            let downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", key + ".txt");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    }
}


//function to get rid of out-of-date databases in the store
function houseKeeping() {
    console.log("housekeeping");
    let checkbox, label, container;
    const checkboxes = [];

    // Clear the databaseList div
    document.getElementById('databaseList').innerHTML = '';

    const promise = indexedDB.databases();
    promise.then((databases) => {
        console.log("IndexedDB Databases:  ")
        console.log(databases);

        // Sort the databases alphabetically by name
        databases.sort((a, b) => a.name.localeCompare(b.name));

        databases.forEach((database) => {
            if (database.name !== 'localforage') {
                // Create a new checkbox and label
                checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = database.name;
                label = document.createElement('label');
                label.htmlFor = database.name;
                label.appendChild(document.createTextNode(database.name));

                // Create a container div and append the checkbox and label to it
                container = document.createElement('div');
                container.appendChild(checkbox);
                container.appendChild(label);

                // Append the container to the databaseList div
                document.getElementById('databaseList').appendChild(container);

                // Add the checkbox to the array
                checkboxes.push({ checkbox: checkbox, name: database.name });
            }
        });

        // Add an event listener to the delete button
        document.getElementById('houseKeepingDeleteButton').addEventListener('click', function() {
            if (confirm('Are you sure you want to delete the selected databases?')) {
                checkboxes.forEach((item) => {
                    if (item.checkbox.checked) {
                        let deleteDB = indexedDB.deleteDatabase(item.name);
                        deleteDB.onsuccess = function() {
                            alert(`Deleted database: ${item.name}`);
                            houseKeepingModal.close();
                        };
                        deleteDB.onerror = function() {
                            console.log(`Error deleting database: ${item.name}`);
                        };
                    }
                });
            }
        });
    });
};

// Add an event listener to the housekeeping button
document.getElementById('houseKeepingButton').addEventListener('click', function() {
    houseKeeping();
    // If you're using a <dialog> element
    document.getElementById('houseKeepingModal').showModal();
});


//KILLS ALL OF THE STORES IN LOCALFORAGE
async function nuke() {
    let keys = await currentStore.keys();
    console.log("saved store keys: " + keys);
    if (confirm('Are you sure you want to delete all of your data? Really REALLY sure?')) {
        currentStore.clear().then(function() {
            alert('Database is now empty.');
        });
    } else {
        // Do nothing!
    }
};


// FUNCTION TO CLOSE ANY OF THE MODALS WHICH ARE OPENED
window.onclick = function(event) {

    if (event.target == csvModal || event.target == filesModal || event.target == houseKeepingModal) {
        csvModal.style.display = 'none';
        filesModal.style.display = 'none';
        houseKeepingModal.close();
    }
}
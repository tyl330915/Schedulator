//Backup and restore functions. 	
//var XLSX = require("xlsx");
//var localforage = require("localforage");

var keyList = [];

localforage.iterate(function(value, key, iterationNumber) {
    //console.log([key, value]);
    keyList.push(key);
}).then(function() {
    console.log('Iteration has completed');
    console.log(keyList);
}).catch(function(err) {
    console.log(err);
});

////////////////////////////////////////////////////////ARRAY FUNCTIONS
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
    localforage.getItem("faculty", function(err, fac) {
        console.table(fac);
        flattenedData = flattenData(fac);

        if (flattenedData.length > 0) {
            var csv = Papa.unparse(flattenedData);
            downloadCSV(csv, 'faculty.csv');
        } else {
            console.log('No data to convert to CSV');
        }
    })

};


function courses2CSV() {
    localforage.getItem("courses", function(err, crses) {
        downloadObjectAsCSV(crses, "courses.csv");
    })
};


async function downloadAllLocalForageToJSON() {
    const keys = await localforage.keys();
    for (let key of keys) {
        let value = await localforage.getItem(key);
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
    localforage.getItem('semesterData', function(err, semData) {
        console.log("semData: ", semData);
        let semTitle = semData.semYear.year + " " + semData.semYear.semester + " " + semData.semYear.dept;
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

}

function loadJSONFilesAndSaveInLocalForage(inputElementId) {
    let inputElement = document.getElementById(inputElementId);
    let files = inputElement.files;
    if (confirm("Are you sure you want to load " + files.length + " files? This will overwrite all of your previous data.")) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let reader = new FileReader();
            reader.onload = async function(e) {
                let content = e.target.result;
                let jsonContent = JSON.parse(content);
                let fileNameWithoutSuffix = file.name.replace(/\.[^/.]+$/, "");
                await localforage.setItem(fileNameWithoutSuffix, jsonContent);
            };
            reader.readAsText(file);
        }
    }
};



function nuke() {
    if (confirm('Are you sure you want to delete all of your data? Really REALLY sure?')) {
        localforage.clear().then(function() {
            alert('Database is now empty.');
        });
    } else {
        // Do nothing!
    }
};
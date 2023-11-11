//const localforage = require('localforage');

function openLF(filename) {
    let fileData;
    localforage.getItem(filename, function(err, fileData) {
        console.log("fileData: ", fileData);
        if (err) {
            alert('Error saving data.');
        }
        return fileData;
    });

    return fileData;
};

function saveLF() {
    localforage.setItem("dataName", "dataValue", function(err, result) {
        console.log(result);
        alert('Data saved successfully!');
        if (err) {
            alert('Error saving data.');
        }
        return (result);
    });
};
//const currentstore = require('currentstore');

function openLF(filename) {
    let fileData;
    currentStore.getItem(filename, function(err, fileData) {
        console.log("fileData: ", fileData);
        if (err) {
            alert('Error saving data.');
        }
        return fileData;
    });

    return fileData;
};

function saveLF() {
    currentStore.setItem("dataName", "dataValue", function(err, result) {
        console.log(result);
        alert('Data saved successfully!');
        if (err) {
            alert('Error saving data.');
        }
        return (result);
    });
};
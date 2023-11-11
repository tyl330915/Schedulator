function parseCSVFile(csvFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvContent = event.target.result;
        const parsedData = parseFacCSVContent(csvContent);
        dataList = parsedData;

        //console.table(dataList);
        for (let i = 0; i < dataList.length; i++) {
            //   console.log(dataList[i]);
            if (dataList[i].email.includes('<')) {
                let str = dataList[i].email;
                let cleanStr = str.replace(/<\/?[^>]+(>|$)/g, "");
                cleanStr = cleanStr.replace(/&nbsp;/g, "").trim();
                cleanStr = cleanStr.replace(/"/g, '');
                console.log(cleanStr); // Outputs: jsmith@some.edu

                dataList[i].email = cleanStr;
            }
        }
        console.log(dataList);
        saveData(dataList); // Save the updated data

    };
    reader.readAsText(csvFile);
}

function parseFacCSVContent(csvText) {
    // Implement actual CSV parsing logic here
    // Parse the CSV content and return the parsed data


    // ... (parsed CSV data)
    const lines = csvText.split('\n');
    //const headers = 
    console.log(lines[0].split(','));
    let oldHeaders = lines[0].split(',');
    console.log("oldHeaders: ", oldHeaders);
    const headers = ['lastName', 'firstName', 'status', 'email', 'available'];
    console.log("Headers: ", headers);

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim(); // Remove leading/trailing whitespace
        if (line === '') {
            continue; // Skip blank lines
        }


        const values = line.split(',');
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
            for (let k = 0; k < oldHeaders.length; k++) {
                //console.log("headers[j]: ", headers[j], "oldHeaders[k]: ", oldHeaders[k], "values[j]: ", values[j]);
                if (oldHeaders[k].includes(headers[j])) {
                    entry[headers[j]] = values[k];
                }
            }


            // entry[headers[j]] = values[j];
        }

        data.push(entry);
    }

    return data;
};

function readCourseCSVFile() {
    var files = document.querySelector('#csv-file').files;
    //const courseArray = [];

    if (files.length > 0) {

        // Selected file
        var file = files[0];

        // FileReader Object
        var reader = new FileReader();

        // Read file as string 
        reader.readAsText(file);

        // Load event
        reader.onload = function(event) {

            // Read file data
            var csvdata = event.target.result;

            console.table(csvdata);

            //THIS MAKES SURE THAT THE DATA IS GOOD, AND WILL FILTER OUT OLDER VERSIONS OF THE CSV COURSES FILE
            let lines = csvdata.split('\n');
            let keys = lines[0].split(',');

            let result = lines.slice(1).map(line => {
                // Skip blank lines
                if (line.trim() === '') return null;

                let obj = {};
                let values = line.split(',');

                keys.forEach((key, i) => {
                    if (['div', 'num', 'title', 'loc', 'meth', 'sem'].includes(key)) {
                        obj[key] = values[i];
                    }
                });

                return obj;
            }).filter(Boolean); // Remove null values from the result array

            console.log(result);

            saveData(result);
            generateTable(result, tableHeaders, 'courseTable');
        };
    }

};
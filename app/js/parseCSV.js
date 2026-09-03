function parseCSVFile(csvFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvContent = event.target.result;
        const parsedData = parseFacCSVContent(csvContent);
        dataList = parsedData;

        for (let i = 0; i < dataList.length; i++) {
            for (let key in dataList[i]) {
                if (typeof dataList[i][key] === 'string') {
                    dataList[i][key] = dataList[i][key].replace(/^"|"$/g, ''); // Remove leading/trailing quotes
                }
            }

            if (dataList[i].email.includes('<')) {
                let str = dataList[i].email;
                let cleanStr = str.replace(/<\/?[^>]+(>|$)/g, "");
                cleanStr = cleanStr.replace(/&nbsp;/g, "").trim();
                cleanStr = cleanStr.replace(/"/g, '');
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

    if (files.length > 0) {
        var file = files[0];

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: function(results) {
                var csvdata = results.data;
                console.table(csvdata);

                let keys = csvdata[0];
                console.log("Keys:", keys);

                // Header aliases so that either form of a header is recognized
                const headerAliases = {
                    'div': ['Div', 'Division'],
                    'num': ['Num', 'Section Name'],
                    'title': ['Title'],
                    'loc': ['Loc', 'Location'],
                    'method': ['Method', 'Instructional Method', 'Meth'],
                    'sem': ['Sem', 'Semester'],
                    'term': ['Term'],
                    'sections': ['Sections']
                };

                // Create a mapping of expected keys to their positions
                const keyMap = {};
                
                console.log("Creating key map from headers:", keys);
                Object.entries(headerAliases).forEach(([expectedKey, aliases]) => {
                    const index = keys.findIndex(key => aliases.some(alias => alias.toLowerCase() === key.toLowerCase()));
                    if (index !== -1) {
                        console.log(`Mapping ${expectedKey} to column ${index}`);
                        keyMap[expectedKey] = index;
                    } else {
                        console.warn(`Expected key ${expectedKey} not found in headers`);
                    }
                });
                console.log("Final key map:", keyMap);

                if (Object.keys(keyMap).length === 0) {
                    console.error("Key map is empty. No matching headers found.");
                    return;
                }

                let result = csvdata.slice(1).map(row => {
                    let obj = {};
                    Object.entries(keyMap).forEach(([key, index]) => {
                        if (row[index] !== undefined) {
                            obj[key] = row[index];
                        }
                    });

                    console.log("Object after assignment:", obj);

                    // Derive "sem" from the "term" column when possible
                    if (obj.term) {
                        let term = obj.term.toUpperCase().trim();
                        if (term.endsWith('FA')) {
                            obj.sem = 'FA';
                        } else if (term.endsWith('SP')) {
                            obj.sem = 'SP';
                        }
                    }
                    delete obj.term;

                    // Clean up semester value from "Sem" or "Semester" column
                    if (obj.sem) {
                        obj.sem = obj.sem.toUpperCase().trim();
                        // If sem contains a year prefix like "2026FA", extract just "FA"
                        if (obj.sem.match(/^\d+FA$/)) {
                            obj.sem = 'FA';
                        } else if (obj.sem.match(/^\d+SP$/)) {
                            obj.sem = 'SP';
                        } else if (obj.sem.match(/^\d+SU$/)) {
                            obj.sem = 'SU';
                        }
                        // If sem contains extra text like "Fall", extract last 2 characters
                        else if (obj.sem.match(/FA|SP|SU/)) {
                            let match = obj.sem.match(/FA|SP|SU/);
                            if (match) {
                                obj.sem = match[0];
                            }
                        }
                    }

                    return obj;
                }).filter(obj => Object.keys(obj).length > 0);

                console.log("Final Result:", result);

                const tableHeaders = ['div', 'num', 'title', 'loc', 'method', 'sem', 'sections'];
                console.log("Table Headers:", tableHeaders);

                saveData(result);
                generateTable(result, tableHeaders, 'courseTable');
            }
        });
    }
}


/*
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
                //GET THE DATA FROM THE SPREADSHEET AND PARSE IT. ALLOWS BOTH "METH" AND "METHOD" TO BE USED
                keys.forEach((key, i) => {
                    if (['div', 'num', 'title', 'loc', 'sem'].includes(key)) {
                        obj[key] = values[i];
                    }
                    if (key === 'method' || key === 'meth') {
                        obj['method'] = values[i];
                    }
                });

                return obj;
            }).filter(Boolean);

            console.log(result);

            saveData(result);
            generateTable(result, tableHeaders, 'courseTable');
        };
    }

};
*/

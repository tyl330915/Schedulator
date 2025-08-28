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
    const lines = csvText.split('\n');
    let oldHeaders = lines[0].split(',');
    const headers = ['lastName', 'firstName', 'status', 'email', 'available'];

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') {
            continue;
        }

        const values = line.split(',').map(value => value.replace(/^"|"$/g, '').trim());
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
            for (let k = 0; k < oldHeaders.length; k++) {
                if (oldHeaders[k].includes(headers[j])) {
                    entry[headers[j]] = values[k];
                }
            }
        }

        data.push(entry);
    }

    return data;
};

function readCourseCSVFile() {
    var files = document.querySelector('#csv-file').files;

    if (files.length > 0) {
        var file = files[0];
        var reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function(event) {
            var csvdata = event.target.result;

            console.table(csvdata);

            let lines = csvdata.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            console.log("Lines:", lines);

            let keys = lines[0].split(',').map(key => key.replace(/^"|"$/g, '').trim().toLowerCase());
            console.log("Keys:", keys);

            // Create a mapping of expected keys to their positions
            const expectedKeys = ['div', 'num', 'title', 'loc', 'meth', 'sem', 'sections'];
            const keyMap = {};
            
            console.log("Creating key map from headers:", keys);
            expectedKeys.forEach(expectedKey => {
                const index = keys.indexOf(expectedKey);
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

            let result = lines.slice(1).map(line => {
                let values = line.split(',').map(value => value.replace(/^"|"$/g, '').trim());
                console.log("Values:", values);

                let obj = {};
                Object.entries(keyMap).forEach(([key, index]) => {
                    console.log(`Checking key: ${key} at index: ${index}`);
                    if (index < values.length) {
                        console.log(`Assigning value: ${values[index]} to key: ${key}`);
                        obj[key] = values[index];
                    } else {
                        console.warn(`Index ${index} out of bounds for values array`);
                    }
                });

                console.log("Object after assignment:", obj);
                return obj;
            }).filter(obj => Object.keys(obj).length > 0);

            console.log("Final Result:", result);

            const tableHeaders = ['div', 'num', 'title', 'loc', 'meth', 'sem', 'sections'];
            console.log("Table Headers:", tableHeaders);

            saveData(result);
            generateTable(result, tableHeaders, 'courseTable');
        };
    }
};

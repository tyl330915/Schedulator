//const localforage = require("localforage");

function generateTable(dataList, headers, containerId) {

    console.log("generateTable");
    console.log(dataList, headers, containerId);

    const tableContainer = document.getElementById(containerId);
    //const existingTable = document.getElementById('courseTable');

    tableContainer.innerHTML = '';

    const table = document.createElement('table');
    table.id = 'course-table'; // Add an ID to the table for later reference

    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });


    const sectionNumberHeader = document.createElement('th');
    sectionNumberHeader.textContent = 'Sections';
    headerRow.appendChild(sectionNumberHeader);

    // Add an extra header cell for the "Actions" header
    // const actionsHeader = document.createElement('th');
    // actionsHeader.textContent = 'Edit/Delete';
    // headerRow.appendChild(actionsHeader);

    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    dataList.forEach((data, index) => {
        //console.log(data);
        const row = document.createElement('tr');


        headers.forEach(column => {
            const cell = document.createElement('td');
            const sanitizedColumn = column.toLowerCase().replace(/[\/\s]/g, ''); // Remove spaces and "/"
            const dataKey = Object.keys(data).find(key => sanitizedColumn === key.toLowerCase());
            if (dataKey) {
                cell.textContent = data[dataKey];
            }
            row.appendChild(cell);
        });

        const sectionsCell = row.insertCell();
        const sectionsSelect = document.createElement('select');
        sectionsSelect.id = 'sectionsCount';


        for (let i = 0; i <= 40; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            sectionsSelect.appendChild(option);
        }

        sectionsSelect.addEventListener('change', () => {
            //dataList.sections = sectionsSelect.value;

            dataList[index].sections = parseInt(sectionsSelect.value);
            //console.log(dataList[index].sections);
            //sectionsSelect.value = data[index].sections;
            //console.log(dataList[index]);
            saveData(dataList); // Save the updated data
            getCurrentTotalSections(dataList);

        })


        sectionsCell.appendChild(sectionsSelect);
        //console.log(dataList[index].sections);
        sectionsSelect.value = dataList[index].sections;
        //saveData(dataList); // Save the updated data


        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    tableContainer.appendChild(table);
    setupEditing(table, dataList);
};



///THIS IS THE SECTION WHICH MAKES THE COURSE NUMBER AND THE COURSE TITLE EDITABLE

function setupEditing(table, dataList) {

    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 3) {
            cells[1].addEventListener('click', function() {
                var cellIndex = getCellIndex(this);
                console.log('Row Index:', cellIndex.row);
                console.log('Column Index:', cellIndex.column);
                makeEditable(this, dataList, cellIndex.row, cellIndex.column);
            });
            cells[1].classList.add('editable');

            cells[2].addEventListener('click', function() {
                var cellIndex = getCellIndex(this);
                console.log('Row Index:', cellIndex.row);
                console.log('Column Index:', cellIndex.column);
                makeEditable(this, dataList, cellIndex.row, cellIndex.column);
            });
            cells[2].classList.add('editable');
        }
    }
    createSelects(table, dataList);
}


function getCellIndex(cell) {
    var row = cell.parentNode.rowIndex; // Get the row index of the cell
    var column = cell.cellIndex; // Get the column index of the cell

    return {
        row: row,
        column: column
    };
}



function makeEditable(td, courseData, entryIndex, cellIndex) {
    // Store the original content of the cell
    var originalContent = td.innerHTML;
    let actualIndex = entryIndex - 1;

    // Create an input element
    var input = document.createElement('input');
    input.type = 'text';
    input.value = originalContent;

    // Replace the cell's content with the input element
    td.innerHTML = '';
    td.appendChild(input);
    input.focus();

    // Add an event listener to save the data when the input element loses focus
    input.addEventListener('blur', function() {

        // Get the new content of the cell
        var newContent = input.value;

        // Restore the original content if the new content is empty
        if (newContent.trim() === '') {
            td.innerHTML = originalContent;
        } else {
            td.innerHTML = newContent;
        }
        //console.log(courseData)
        console.log(courseData[actualIndex]);
        console.log("Save here ", td.innerHTML);

        let entryField = "";
        if (cellIndex == 1) {
            entryField = "num";
        } else if (cellIndex == 2) {
            entryField = "title";
        }

        let newEntry = td.innerHTML.trim();


        courseData[actualIndex][entryField] = newEntry;

        console.log(courseData[actualIndex]);
        saveData(courseData);

    });
};
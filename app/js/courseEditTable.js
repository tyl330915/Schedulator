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
        sectionsSelect.className = 'sectionsTotal';


        for (let i = 0; i <= 40; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            sectionsSelect.appendChild(option);
        }

        sectionsSelect.addEventListener('change', () => {
            //get index of changed element
            console.log("Change", index);
            let courseNum = dataList[index].num;
            let courseSectionCount = sectionsSelect.value;
            console.log(dataList[index].num, sectionsSelect.value);
            dataList[index].sections = parseInt(sectionsSelect.value);
            ///if the sectionsSelect.value === 0, find matching datalist[index.num in faculty currentCourses
            if (parseInt(courseSectionCount) === 0) {
                console.log("zEROED!");
                killZeroSections(courseNum);
            }

            saveData(dataList); // Save the updated data
            getCurrentTotalSections(dataList);

        })


        sectionsCell.appendChild(sectionsSelect);
        //console.log(sectionsSelect.value);
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
            setupCell(cells[1], dataList);
            setupCell(cells[2], dataList);
        }
    }
    createSelects(table, dataList);
}

function setupCell(cell, dataList) {
    cell.addEventListener('click', function() {
        var cellIndex = getCellIndex(this);
        console.log('Row Index:', cellIndex.row);
        console.log('Column Index:', cellIndex.column);
        makeEditable(this, dataList, cellIndex.row, cellIndex.column);
    });
    cell.classList.add('editable');
}

function getCellIndex(cell) {
    return {
        row: cell.parentNode.rowIndex,
        column: cell.cellIndex
    };
}

function makeEditable(td, courseData, entryIndex, cellIndex) {
    if (td.querySelector('input')) {
        return; // If the cell already contains an input element, do nothing
    }

    var originalContent = td.textContent;
    let actualIndex = entryIndex - 1;

    var input = document.createElement('input');
    input.type = 'text';
    input.value = originalContent;

    td.innerHTML = '';
    td.appendChild(input);
    input.focus();

    input.addEventListener('blur', function() {
        var newContent = input.value.trim();
        td.textContent = newContent === '' ? originalContent : newContent;

        console.log("Save here ", td.textContent);

        let entryField = cellIndex == 1 ? "num" : "title";
        courseData[actualIndex][entryField] = td.textContent;

        console.log(courseData[actualIndex]);
        saveData(courseData);
    });
}
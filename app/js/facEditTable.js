function generateTable(dataList, headers, containerId) {

    // console.log(dataList, headers, containerId);

    const tableContainer = document.getElementById(containerId);
    const existingTable = document.getElementById('employee-table');
    if (existingTable) {
        tableContainer.removeChild(existingTable); // Remove existing table if it exists
    }

    const table = document.createElement('table');
    table.id = 'employee-table'; // Add an ID to the table for later reference

    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    /*
    // Add an extra header cell for the "Actions" header
    const actionsHeader = document.createElement('th');
    actionsHeader.textContent = 'Edit/Delete';
    headerRow.appendChild(actionsHeader);
*/
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    dataList.forEach((data, index) => {

        const row = document.createElement('tr');

        headers.forEach(column => {
            const cell = document.createElement('td');
            if (column === 'Available') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';

                // use the strict equality operator (===) to compare the value and the type of data.available
                if (data.available === true || data.available === 'true') {
                    checkbox.checked = true;
                }

                checkbox.addEventListener('change', () => {
                    data.available = checkbox.checked;
                    saveData(dataList); // Save the updated data
                    generateAvailableCount(dataList)
                });
                cell.appendChild(checkbox);
            } else {
                const sanitizedColumn = column.toLowerCase().replace(/[\/\s]/g, ''); // Remove spaces and "/"
                const dataKey = Object.keys(data).find(key => sanitizedColumn === key.toLowerCase());
                if (dataKey) {
                    cell.textContent = data[dataKey];
                    //cell.setAttribute('contenteditable', true);
                    //for (var i = 0; i < 4; i++) {
                    //  var cell = table.getElementsByTagName("td")[i];
                    // if (cell) {

                }
                //  }
                //}
            }
            row.appendChild(cell);
        });

        tableBody.appendChild(row);

    });

    table.appendChild(tableBody);
    console.log(tableContainer);
    tableContainer.appendChild(table);
    setEditableCells(table, dataList);
    /////checkCFC();   TOOK OUT TO CHANGE COURSES TO FACULTY ARRAY
};

setEditableCells = function(table, facData) {
    if (!table) {
        console.log("Can't find the table....");
        return;
    }

    var rows = table.getElementsByTagName('tr');



    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 5) {

            cells[0].addEventListener('click', function() {
                var cellIndex = getCellIndex(this);
                //console.log('Row Index:', cellIndex.row);
                //console.log('Column Index:', cellIndex.column);
                makeEditable(this, cellIndex, facData); //, facData, cellIndex.row, cellIndex.column);
            });
            cells[0].classList.add('editable');

            cells[1].addEventListener('click', function() {
                var cellIndex = getCellIndex(this);
                //console.log('Row Index:', cellIndex.row);
                //console.log('Column Index:', cellIndex.column);
                console.log('Row Index:', cellIndex.row);
                makeEditable(this, cellIndex, facData); //, facData, cellIndex.row, cellIndex.column);
            });
            cells[1].classList.add('editable');

            cells[2].addEventListener('click', function() {
                var cellIndex = getCellIndex(this);
                console.log(cellIndex);

                // Check if a select element already exists in the cell
                if (this.getElementsByTagName('select').length === 0) {
                    const ptftSelect = document.createElement('select');
                    ptftSelect.innerHTML = `<option value="PT">PT</option><option value="FT">FT</option>`;

                    ptftSelect.value = "FT"; // set default value to "FT"
                    console.log(ptftSelect.value);

                    // Save the current cell value and clear the cell
                    let oldValue = this.innerHTML;
                    this.innerHTML = '';

                    // Append the dropdown to the cell
                    this.appendChild(ptftSelect);

                    // When the dropdown loses focus, update the cell content with the selected value
                    ptftSelect.addEventListener('blur', function() {
                        let newValue = this.value;
                        this.parentElement.innerHTML = newValue;

                        // If necessary, you can update your data here
                        if (newValue !== oldValue) {
                            facData[cellIndex.row - 1].status = newValue;
                            saveData(facData);
                        }
                    });
                }
            })


            cells[3].addEventListener('click', function() {
                var cellIndex = getCellIndex(this);
                console.log('Row Index:', cellIndex.row);
                console.log('Column Index:', cellIndex.column);
                makeEditable(this, cellIndex, facData); //, facData, cellIndex.row, cellIndex.column);
            });
            cells[3].classList.add('editable');
        }
    }
}



function getCellIndex(cell) {
    var row = cell.parentNode.rowIndex; // Get the row index of the cell
    var column = cell.cellIndex; // Get the column index of the cell

    return {
        row: row,
        column: column
    };

}

function makeEditable(cell, index, facData) { //(td, courseData, entryIndex, cellIndex) {
    console.log(); //
    cell.contentEditable = 'true';
    cell.addEventListener('blur', function() {
        // Get the new content of the cell
        var newContent = cell.innerHTML.trim();
        let cellIndex = getCellIndex(cell);
        // Restore the original content if the new content is empty
        if (newContent.trim() === '') {
            //cell.innerHTML = courseData[entryIndex - 1][cellIndex];
        }

        console.log(index.row, index.column, newContent);
        let editIndex = cellIndex.row - 1;
        //courseData[editIndex][cellIndex.column] = newContent;
        console.log(facData[editIndex]);

        if (cellIndex.column == 0) {
            facData[editIndex].firstName = newContent;
        } else if (cellIndex.column == 1) {
            facData[editIndex].lastName = newContent;
        } else if (cellIndex.column == 3) {
            facData[editIndex].email = newContent;
        }
        console.log(facData[editIndex]);
        saveData(facData);
    });


};


// Simulated editData and deleteData functions for testing
function editData(index, data) {
    // Get the table element and the row to edit

    const table = document.getElementById('employee-table');
    const row = table.getElementsByTagName('tbody')[0].rows[index];

    // Create input fields for "First Name", "Last Name", and "PT/FT"
    const firstNameCell = row.cells[0];
    const lastNameCell = row.cells[1];
    const ptftCell = row.cells[2];
    const emailCell = row.cells[3];

    const firstNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    firstNameInput.value = data[index].firstName;
    firstNameCell.innerHTML = '';
    firstNameCell.setAttribute("contentEditable", "true");
    firstNameCell.appendChild(firstNameInput);

    const lastNameInput = document.createElement('input');
    lastNameInput.type = 'text';
    lastNameInput.value = data[index].lastName;
    lastNameCell.innerHTML = '';
    lastNameCell.setAttribute("contentEditable", "true");
    lastNameCell.appendChild(lastNameInput);

    const ptftSelect = document.createElement('select');
    ptftSelect.innerHTML = `<option value="PT">PT</option><option value="FT">FT</option>`;
    ptftSelect.value = data[index].ptft;
    ptftCell.innerHTML = '';
    ptftCell.appendChild(ptftSelect);

    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.value = data[index].email;
    emailCell.innerHTML = '';
    emailCell.appendChild(emailInput);

    console.log(index);
    console.log(data[index]);

    // Add event listeners to capture changes
    /*
        firstNameInput.addEventListener('change', () => {
            data.firstName = data[index].firstName;
            data[index].firstName = firstNameInput.value;
            saveData(data); // Save the updated data

        });

        lastNameInput.addEventListener('change', () => {
            data.lastName = data[index].lastName;
            data[index].lastName = lastNameInput.value;
            saveData(data); // Save the updated data
        });
    */
    emailInput.addEventListener('change', () => {
        data.email = data[index].email;
        data[index].email = emailInput.value;
        emailInput.setAttribute("contentEditable", "true");
        saveData(data); // Save the updated data
    });

    ptftSelect.addEventListener('change', () => {
        data.ptft = ptftSelect.value;
        saveData(); // Save the updated data
        //generateTable(employees, tableHeaders, 'table-container'); // Redraw the table
    });

    const availableCheckbox = row.cells[4].querySelector('input[type="checkbox"]');
    if (availableCheckbox) {
        availableCheckbox.addEventListener('change', () => {
            console.log("Available changed: ", availableCheckbox);
            data.available = availableCheckbox.checked;
            saveData(); // Save the updated data
        });
    }
}
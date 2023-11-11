function makeEditable(td) {
    // Store the original content of the cell
    var originalContent = td.innerHTML;

    // Create an input element
    var input = document.createElement('input');
    input.type = 'text';
    input.value = originalContent;

    // Replace the cell's content with the input element
    td.innerHTML = '';
    td.appendChild(input);
    input.focus();

    // Add an event listener to save the data when the input element loses focus
    input.addEventListener("click", function(event) {
        event.preventDefault();
        // Get the new content of the cell
        var newContent = input.value;

        // Restore the original content if the new content is empty
        if (newContent.trim() === '') {
            td.innerHTML = originalContent;
        } else {
            td.innerHTML = newContent;
        }
        console.log("Save here ", td.innerHTML);
    });
}

// Attach the makeEditable function to each table cell
var cells = document.getElementsByTagName('td');
for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function(event) {
        event.preventDefault();
        makeEditable(this);
    });
}


function getCellIndex(cell) {
    var row = cell.parentNode.rowIndex; // Get the row index of the cell
    var column = cell.cellIndex; // Get the column index of the cell

    return {
        row: row,
        column: column
    };
}

var table = document.getElementById('myTable');
var cells = table.getElementsByTagName('td');
for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function(event) {
        event.preventDefault();
        var cellIndex = getCellIndex(this);
        console.log('Row Index:', cellIndex.row);
        console.log('Column Index:', cellIndex.column);
    });
}
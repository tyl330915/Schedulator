//  If data has keys:     drawTable(obj1, "table3");
//  If data does not have keys, add an array of headers:     drawTableAddHeaders(array1, heads, "table4");

// Or put them in the call:       drawTableAddHeaders(obj1, ["A", "Set", "Of", "Headers"], "table5");
//       drawTableAddHeaders(array1, ["A", "Set", "Of", "Headers"], "table6"); 
console.log("TableMaker");

function drawTable(obj, target) {

    console.log(obj);
    document.getElementById(target).innerHTML = '';

    var tbody = document.getElementById(target);
    tbody.innerHTML = '';
    tbody.border = "1";
    tbody.padding = "3";

    //console.log(obj);

    var headerNames = Object.getOwnPropertyNames(obj[0]);
    var columnCount = headerNames.length;
    var row = tbody.insertRow(-1);

    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = headerNames[i];
        row.appendChild(headerCell);
    }


    // loop through data source
    for (var i = 0; i < obj.length; i++) {
        var tr = document.createElement("tr");
        for (var colName in obj[i]) {
            var td = document.createElement("td");
            td.innerHTML = obj[i][colName];

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }
}

function drawTableAddHeaders(obj, headers, target) {

    document.getElementById(target).innerHTML = '';

    var tbody = document.getElementById(target);
    //set some basic styling -- but better done in CSS
    tbody.innerHTML = '';
    // tbody.border = "1";
    tbody.padding = "1";
    var columnCount = headers.length;
    var row = tbody.insertRow(-1);
    //set the headers
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = headers[i];
        row.appendChild(headerCell);
    }
    // loop through data source
    for (var i = 0; i < obj.length; i++) {
        var tr = document.createElement("tr");
        for (var colName in obj[i]) {
            var td = document.createElement("td");
            td.innerHTML = obj[i][colName];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

};

function drawEditableTableAddHeaders(obj, headers, target) {

    document.getElementById(target).innerHTML = '';

    var tbody = document.getElementById(target);
    //set some basic styling -- but better done in CSS
    tbody.innerHTML = '';
    //tbody.border = "1";
    tbody.padding = "1";
    var columnCount = headers.length;
    var row = tbody.insertRow(-1);
    //set the headers
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = headers[i];
        row.appendChild(headerCell);
    }
    // loop through data source
    for (var i = 0; i < obj.length; i++) {
        var tr = document.createElement("tr");
        for (var colName in obj[i]) {
            var td = document.createElement("td");
            td.innerHTML = obj[i][colName];
            td.setAttribute("contentEditable", "true");
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
};

function drawTableAddHeadersAndTDID(obj, headers, target, tdIDName) {

    document.getElementById(target).innerHTML = '';

    var tbody = document.getElementById(target);
    tbody.innerHTML = '';
    tbody.border = "1";
    tbody.padding = "1";

    //var headerNames = Object.getOwnPropertyNames(obj[0]);
    var columnCount = headers.length;
    var row = tbody.insertRow(-1);
    var colCount = 0;
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = headers[i];
        row.appendChild(headerCell);
    }

    //var rowCount = 0;
    // loop through data source
    for (var i = 0; i < obj.length; i++) {
        var tr = document.createElement("tr");
        var rowCount = i;
        for (var j = 0; j < columnCount; j++) {
            var td = document.createElement("td");
            td.setAttribute('id', tdIDName + rowCount + '-' + colCount);
            console.log("TDID: " + td.id);
            if (colCount === columnCount - 1) { colCount = 0 } else { colCount += 1 };
            td.innerHTML = obj[i][j];
            tr.appendChild(td);
        }
        rowCount += 1;
        tbody.appendChild(tr);
    }
}
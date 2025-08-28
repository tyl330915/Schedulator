function createSelects(table, data) {

    //var rows = table.getElementsByTagName('tr');

    const divCells = table.querySelectorAll("tr td:nth-child(1)");
    const locCells = table.querySelectorAll("tr td:nth-child(4)");
    const methCells = table.querySelectorAll("tr td:nth-child(5)");
    const semCells = table.querySelectorAll("tr td:nth-child(6)");

    ////DIVISION DROPDOWN
    divCells.forEach(divCell => {
        divCell.addEventListener("click", function(event) {
            event.preventDefault()
            let dataRow = getCellIndex(divCell).row - 1;

            const divInput = document.createElement('select');
            divInput.innerHTML =
                `<option value = "AAO">AAO</option>
                <option value="BUS">BUS</option>
    <option value="CCM">CCM</option>  
    <option value="COR">COR</option>
    <option value="BUS">EHS</option>
    <option value="ITS">ITS</option>`;

            divCell.innerHTML = "";
            divCell.appendChild(divInput);

            divInput.focus();

            divInput.addEventListener("click", function(event) {
                event.preventDefault()
                console.log("Datarow ", dataRow);

                divCell.textContent = divInput.value;
                data[dataRow].div = divInput.value;
                // console.log("Save here 1");
                saveData(data);
            });

            divInput.addEventListener("click", function(event) {
                event.preventDefault()
                console.log("dataRow: ", dataRow);
                divCell.textContent = divInput.value;
                data[dataRow].div = divInput.value;
                //console.log("Save here 2");
                saveData(data);
            });
        });
    });

    ////LOCATION DROPDOWN
    locCells.forEach(locCell => {
        locCell.addEventListener("click", function(event) {
            event.preventDefault()
            let dataRow = getCellIndex(locCell).row - 1;

            const locInput = document.createElement('select');
            locInput.innerHTML =
                `<option value="General Classroom">General Classroom</option><option value="DBL">DBL</option><option value="FLD">FLD</option><option value="MONT">MONT</option><option value="OFF">OFF</option><option value="OL">OL</option><option value="HYBRD">HYBRD</option>`;

            locCell.innerHTML = "";
            locCell.appendChild(locInput);

            locInput.focus();

            locInput.addEventListener("click", function(event) {
                event.preventDefault()
                console.log("Datarow ", dataRow);

                locCell.textContent = locInput.value;
                data[dataRow].loc = locInput.value;
                // console.log("Save here 1");
                saveData(data);
            });

            locInput.addEventListener("click", function(event) {
                event.preventDefault()
                console.log("dataRow: ", dataRow);
                locCell.textContent = locInput.value;
                data[dataRow].loc = locInput.value;
                //console.log("Save here 2");
                saveData(data);
            });
        });
    });

    ////METHOD DROPDOWN

    methCells.forEach(methCell => {
        methCell.addEventListener("click", function(event) {
            event.preventDefault();
            let dataRow = getCellIndex(methCell).row - 1;

            const methInput = document.createElement('select');
            methInput.innerHTML =
                `<option value="STN">STN</option>
            <option value="IND">IND</option>
            <option value="LAB">LAB</option>
            <option value="FLD">FLD</option>
            <option value="STU">STU</option>
            <option value="ONL">ONL</option>
            <option value="ONLSY">ONLSY</option>
            <option value="HYB">HYB</option>`;

            methCell.innerHTML = "";
            methCell.appendChild(methInput);

            methInput.focus();

            methInput.addEventListener("click", function(event) {
                event.preventDefault();
                console.log("Datarow ", dataRow);

                methCell.textContent = methInput.value;
                data[dataRow].method = methInput.value;
                //console.log("Save here 1");
                saveData(data);
            });

            methInput.addEventListener("click", function(event) {
                event.preventDefault();
                //console.log("dataRow: ", dataRow);
                methCell.textContent = methInput.value;
                data[dataRow].method = methInput.value;
                //console.log("Save here 2");
                saveData(data);
            });
        });
    });

    ////SEMESTER DROPDOWN

    semCells.forEach(semCell => {
        semCell.addEventListener("click", function(event) {
            event.preventDefault();
            let dataRow = getCellIndex(semCell).row - 1;

            const semInput = document.createElement('select');
            semInput.innerHTML =
                `<option value="FA">FA</option>
          <option value="SP">SP</option>
          <option value="SU">SU</option>`;

            semCell.innerHTML = "";
            semCell.appendChild(semInput);

            semInput.focus();

            semInput.addEventListener("click", function(event) {
                event.preventDefault();
                console.log("Datarow ", dataRow);

                semCell.textContent = semInput.value;
                data[dataRow].sem = semInput.value;
                //console.log("Save here 1");
                saveData(data);
            });

            semInput.addEventListener("click", function(event) {
                event.preventDefault();
                console.log("dataRow: ", dataRow);
                semCell.textContent = semInput.value;
                data[dataRow].sem = semInput.value;
                // console.log("Save here 2");
                saveData(data);
            });
        });
    });

};

function generateDeleteSelect(csData) {
    console.log("deleteSelect");

    let delSel = document.getElementById("deleteSelect");
    delSel.innerHTML = "";

    // Create the first "Choose a course" option
    let firstOpt = document.createElement("option");
    firstOpt.value = ""; // Empty value so it won't be selected by default
    firstOpt.textContent = "Choose a course";
    delSel.appendChild(firstOpt);

    for (var i = 0; i < csData.length; i++) {
        let opt = document.createElement("option");
        opt.value = i; // Or csData[i].num, depending on your needs
        opt.textContent = csData[i].num + ": " + csData[i].title;
        delSel.appendChild(opt);
    }
}
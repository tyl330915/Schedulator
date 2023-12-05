function getAvailableFaculty() {
    let availableList = [];
    console.log("getAvailableFaculty");
    try {
        currentStore.getItem('faculty', function(err, fac) {

            if (err) {
                alert("Could not find saved faculty names. You may need to enter them manually, or use the 'Load Spreadsheet' button.");
                return;
            } else if (fac === null) {
                alert("Could not find saved faculty names. You may need to enter them manually, or use the 'Load Spreadsheet' button.");
                return;
            }

            for (let i = 0; i < fac.length; i++) {
                if (fac[i].available == true) {
                    availableList.push(fac[i]);
                }
                //return availableList;

            }
            console.log(availableList);
        });
    } catch (err) {
        ///dataContainer.innerHTML = '<p>Error reading data.</p>';
        console.log(err)
    };

};
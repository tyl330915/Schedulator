    localforage.getItem('faculty', function(err, facultyList) {
        createDeleteSelect(facultyList);
    });


    // Close the modal when clicking outside of it
    window.addEventListener('click', function(event) {
        var modals = document.getElementsByClassName('modal');
        for (var i = 0; i < modals.length; i++) {
            var modal = modals[i];
            if (event.target == modal) {
                modal.close();
            }
        }
    });

    let dialog = document.getElementsByClassName('modal');
    var addModal = document.getElementById('addModal');
    var addBtn = document.getElementById('showFacAddButton');
    var deleteDialog = document.getElementById('deleteModal');
    var deleteBtn = document.getElementById('showFacDeleteButton');
    var loadDialog = document.getElementById('loadModal');
    var loadBtn = document.getElementById('loadButton');
    var closeBtn = document.getElementById('closeBtn');
    let missingModal = document.getElementById('missingModal');
    let emailModal = document.getElementById('emailModal');
    let confirmModal = document.getElementById('confirmModal');

    console.log(confirmModal);

    // Open the modal when the "Open Modal" button is clicked
    addBtn.addEventListener('click', function() {
        addModal.showModal();
    });

    deleteBtn.addEventListener('click', function() {
        deleteDialog.showModal();
    });

    loadBtn.addEventListener('click', function() {
        loadDialog.showModal();
    });

    document.getElementById('saveButton').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        var firstName = document.getElementById('first-name').value;
        var lastName = document.getElementById('last-name').value;
        var status = document.getElementById('status').value;
        var email = document.getElementById('addEmail').value;

        if (firstName === "" || lastName === "" || email === "") {
            console.log('Please fill out all fields.');
            missingModal.showModal();
            return;
        } else if (!isValidEmail(email)) {
            console.log('Please enter a valid email address.');
            emailModal.showModal();
            //document.getElementById('add-form').reset();
            //addModal.closeModal();
            return;
        }


        // Create an object with the form values
        var formData = {
            firstName: firstName,
            lastName: lastName,
            status: status,
            email: email
        };
        console.log(formData);

        // Pass the object to a function
        addFaculty(formData);

        // Clear the form data
        // document.getElementById('add-form').reset();

        // Close the dialog
        ///////document.getElementById('addModal').close();
    });

    function addFaculty(newPerson) {

        console.log(newPerson);

        try {
            localforage.getItem('faculty', function(err, facList) {

                // Capitalize the first letters of first name and last name
                const capitalizedFirstName = capitalizeFirstLetter(newPerson.firstName);
                const capitalizedLastName = capitalizeFirstLetter(newPerson.lastName);

                // Create a new faculty member object
                const newFaculty = {
                    firstName: capitalizedFirstName,
                    lastName: capitalizedLastName,
                    status: newPerson.status,
                    email: newPerson.email,
                    available: true,
                    currentCourses: []
                };
                console.log(newFaculty);
                facList.push(newFaculty);

                console.table(facList);

                ///SORT THE FACLIST BY LASTNAME
                ///THEN SAVE IT TO LOCALFORAGE
                // Sort the facList by lastName
                facList.sort(function(a, b) {
                    if (a.lastName < b.lastName) {
                        return -1;
                    }
                    if (a.lastName > b.lastName) {
                        return 1;
                    }
                    return 0;
                });

                console.table(facList);

                // Save it to localforage
                localforage.setItem('faculty', facList, function(err) {
                    console.log(facList);
                    generateTable(facList, tableHeaders, "table-container");
                    generateAvailableCount(facList);
                    createDeleteSelect(facList);
                    document.getElementById('add-form').reset();
                    addModal.close();
                    if (err) console.error(err);
                });
            });
        } catch (err) {
            console.log('An error occurred while adding a new faculty member.');
        }
    };



    function createDeleteSelect(facultyList) {
        console.log("deleteSelect");

        //document.querySelector('#deleteSelectDiv').style.display = 'block';
        let facDel = document.getElementById("facDeleteSelect");
        facDel.innerHTML = "";

        // Create the first "Choose a course" option
        let firstOpt = document.createElement("option");
        firstOpt.value = ""; // Empty value so it won't be selected by default
        firstOpt.textContent = "Delete a name";
        facDel.appendChild(firstOpt);

        for (var i = 0; i < facultyList.length; i++) {
            let fullName = facultyList[i].lastName + ", " + facultyList[i].firstName;
            let opt = document.createElement("option");
            opt.value = fullName; // Or csData[i].num, depending on your needs
            opt.textContent = fullName;
            facDel.appendChild(opt);
        };
        facDel.onchange = function() {
            let delIindex = facDel.selectedIndex;
            let selectedName = facDel.value;
            let adjustedIndex = delIindex - 1;

            ///var confirmation = confirm('Are you sure you want to delete ' + selectedName + '?');

            confirmModal.showModal();
            var confirmBtn = document.getElementById("confirmBtn");
            let cancel = document.getElementById("cancelBtn");

            //THIS CODE IS NECESSARY BECAUSE ELECTRON HATES ALERTS AND CONFIRMATION MODALS
            confirmBtn.onclick = function() {
                facultyList.splice(adjustedIndex, 1);
                facDel.options[0].selected = true;
                //createDeleteSelect(facultyList);
                deleteDialog.close();
                confirmModal.close();
                saveData(facultyList);
            }
            cancel.onclick = function() {
                facDel.options[0].selected = true;
                deleteDialog.close();
                confirmModal.close();
            }
        }
    }

    /*
        function deleteData(index, ddata) {
            console.log(index, ddata);
            if (index >= 0 && index < ddata.length) {
                ddata.splice(index, 1); // Remove the entry at the specified index
                console.log(ddata);
                saveData(ddata); // Save the updated data
                //generateTable(employees, tableHeaders, 'table-container'); // Regenerate the table
            }
        }
    */
    function isValidEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
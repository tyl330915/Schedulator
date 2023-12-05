let currStore, currentStore;
let oldStore;
let oldDepartment;
let department, semester, year;
let deptSelect = document.getElementById('department');
let semSelect = document.getElementById('semester');
let yearSelect = document.getElementById('year');
let messages = ["Changing semester....", "Collating files...", "Copying files...", "Changing page....", ""];
let counter = 0;
let loadingModal = document.getElementById('loadingModal');
let modalMessage = document.getElementById('modalMessage');

//window.addEventListener('load', function() {
document.addEventListener('DOMContentLoaded', function() {
    getCurrentStore();
    localforage.keys().then(function(keys) {
        // An array of all the key names.
        console.log("Local forage keys: " + keys);
        // localforage.getItem('currentStore', function(err, currStore) {
        //     console.log("Current Store: " + currStore);
    })

    const promise = indexedDB.databases();
    promise.then((databases) => {
        console.log("IndexedDB Databases: ")
            //console.log each database
        databases.forEach((database) => {
                console.log(database.name);
            })
            //console.log(databases);
    });

});

function getCurrentStore() {
    localforage.getItem('currentStore').then(function(savedStore, err) {

        console.log("Current database: " + savedStore);
        if (err) {
            console.log('Error: ' + err);
        }
        ///if storeName exists
        if (savedStore) {
            console.log("Saved Store Name exists: " + savedStore);
            currentStore = localforage.createInstance({
                name: savedStore
            });
            currentStore.keys().then(function(keys) {
                // An array of all the key names.
                console.log("saved store keys: " + keys);
            });
            ///storeName = savedStore;

            //set the dropdowns
            department = savedStore.split(" ")[0];
            semester = savedStore.split(" ")[1];
            year = savedStore.split(" ")[2];

            deptSelect.value = department;
            semSelect.value = semester;
            yearSelect.value = year;

            oldDepartment = department;
            oldStore = savedStore;
            console.log(oldStore);
            document.getElementById('currentSemester').innerHTML = "Current semester: " + savedStore;


        } else {
            document.getElementById('currentSemester').innerHTML = "No current semester. Set a department, semester and year below."
        }
    })

};

async function storeData() {
    var newStore = deptSelect.value + ' ' + semSelect.value + ' ' + yearSelect.value;
    console.log(newStore, oldStore);
    console.log(oldDepartment, deptSelect.value);

    if (deptSelect.value === "" || semSelect.value === "" || yearSelect.value === "") {
        alert("Set a department, semester and year in the dropdown menus.")
        return;
    }

    if (newStore === oldStore) {
        console.log("Old store is the same as the new store: Going to other page");
        window.location.href = "./app/html/weekGrid.html";
    }

    if (newStore !== oldStore) {
        await setNewStore(newStore, oldStore);
    } else if (!oldStore) {
        await setNewStore(newStore, oldStore);
    }
};

async function setNewStore(newStore, oldStoreName) {
    // let oldStoreName = await localforage.getItem('currentStore');
    console.log(oldStoreName);
    if (!oldStoreName) {
        console.log("Old store name does not exist");
        await localforage.setItem('currentStore', newStore);
        console.log("New store created: " + newStore);
        localforage.getItem('currentStore').then(function(savedStore, err) {
            console.log("value: " + savedStore);
        });
        changeDisplay();
        return;
    }

    let newDepartment = deptSelect.value;
    let userConfirmation;
    let oldStoreInstance, currentStore;
    if (newDepartment !== oldDepartment) {
        userConfirmation = confirm("The department is going to be changed. Would you like to proceed? (Old data will still be available to you.)");
    } else {
        userConfirmation = confirm("Would you like to go to a new semester? (Old data will still be available to you.)");
    }
    if (userConfirmation) {
        console.log("confirmed")
        currentStore = localforage.createInstance({
            name: newStore
        });

        let keys = await currentStore.keys();
        console.log("New store keys: " + keys);
        if (keys.length > 0) {
            console.log("Store Name exists: " + newStore, keys);
            changeDisplay();
        } else if (oldDepartment === newDepartment) {
            console.log("Store does not exist or has no data, copying 'faculty' and 'courses' from old store if they don't exist in the new store");
            changeDisplay();
            oldStoreInstance = localforage.createInstance({
                name: oldStoreName
            });

            if (!keys.includes('faculty')) {
                let facultyData;
                if (oldStoreInstance) { // Check if oldStoreInstance is defined
                    facultyData = await oldStoreInstance.getItem('faculty');
                    if (facultyData) {
                        for (let i = 0; i < facultyData.length; i++) {
                            facultyData[i].currentCourses = [];
                            facultyData[i].available = true;
                            facultyData[i].notes = "";
                        };
                    } else {
                        console.log("No 'faculty' data found in old store");
                        facultyData = [];
                    }
                } else {
                    console.log("Old store does not exist");
                    facultyData = []; // Default value if old store does not exist

                }
                await currentStore.setItem('faculty', facultyData);
            }
        }
        if (!keys.includes('courses')) {
            let coursesData;
            if (oldStoreInstance) { // Check if oldStoreInstance is defined
                coursesData = await oldStoreInstance.getItem('courses');
                if (coursesData) {
                    for (let j = 0; j < coursesData.length; j++) {
                        coursesData[j].sections = 0;
                    };
                } else {
                    console.log("No 'courses' data found in old store");
                    coursesData = [];
                }
            } else {
                console.log("Old store does not exist");
                coursesData = []; // Default value if old store does not exist
                changeDisplay();
            }
            await currentStore.setItem('courses', coursesData);
        }
        // Save the new store name to localforage after the files have been copied
        await localforage.setItem('currentStore', newStore);
        oldStore = newStore;
        oldDepartment = newDepartment;

    } else {
        console.log("not confirmed")
        return;
    }
};

function changeDisplay() {
    loadingModal.showModal();
    console.log("Changing display modal");
    modalMessage.textContent = messages[counter];
    console.log("message: " + messages[counter]);
    // Increment the counter
    counter++;

    if (counter >= messages.length) {
        loadingModal.close();
        console.log("Changing to faculty.html");
        window.location.href = "./app/html/faculty.html";
    } else {
        // Otherwise, set a timeout to change the display again in 2 seconds
        setTimeout(changeDisplay, 1500);
    }
};

function returnKeyData() {
    var keyName = document.getElementById("key").value;
    var data = document.getElementById("data").value;
    document.getElementById("result").innerHTML = "Key: " + keyName + ", Data: " + data;
    setData(keyName, data);
};

function createRectangle() {
    var rect = document.createElement('div');
    rect.classList.add('rectangle');

    // Set random color
    var color = 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ', 0)';
    rect.style.backgroundColor = color;

    // Set random size
    var size = Math.floor(Math.random() * 150) + 10;
    rect.style.width = size + 'px';
    rect.style.height = size / 3 + 'px';

    // Set random position
    rect.style.left = Math.floor(Math.random() * window.innerWidth) + 'px';

    document.body.appendChild(rect);

    // Animate the rectangle
    var pos = -size;

    // Set random speed
    var speed = Math.random() * 30 + 1;

    // Set random rotation speed
    var rotationSpeed = Math.random();

    var id = setInterval(frame, speed);

    function frame() {
        if (pos >= window.innerHeight) {
            clearInterval(id);
            document.body.removeChild(rect);
        } else {
            pos++;
            rect.style.top = pos + 'px';

            // Rotate the rectangle as it falls
            rect.style.transform = 'rotate(' + pos * rotationSpeed + 'deg)';

            // Increase the opacity as the rectangle falls
            var opacity = Math.min(0.2, pos / window.innerHeight);
            rect.style.backgroundColor = rect.style.backgroundColor.replace(/[^,]+(?=\))/, opacity);
        }
    }
}

// Create a new rectangle at a random interval between 0.5 and 1.5 seconds
function createRectangleAtRandomInterval() {
    createRectangle();
    setTimeout(createRectangleAtRandomInterval, Math.random() * 1000 + 500);
}

createRectangleAtRandomInterval();
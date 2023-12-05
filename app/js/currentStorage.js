let currentStore;
let currStore;

async function setCurrentStore() {
    currStore = await localforage.getItem('currentStore');
    console.log("value: " + currStore);

    if (currStore) {
        console.log("Saved Store Name exists: " + currStore);
        currentStore = localforage.createInstance({
            name: currStore
        });
        let keys = await currentStore.keys();
        console.log("saved store keys: " + keys);
        // for (key of keys) {
        //     let value = await currentStore.getItem(key);
        //     console.log(key + ": " + JSON.stringify(value, null, 2) + " type: " + typeof value);
        // }
        //show the semester in the menu bar
        document.getElementById('currentSemester').innerHTML = currStore;
    }
}

setCurrentStore();
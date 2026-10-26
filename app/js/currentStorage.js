let currentStore;
let currStore;

function openSemesterStore(name) {
    return localforage.createInstance({ name: name });
}

async function openCurrentStore(name) {
    currStore = name;
    currentStore = openSemesterStore(name);

    let semesterEl = document.getElementById('currentSemester');
    if (semesterEl) {
        semesterEl.textContent = name || "";
    }

    document.dispatchEvent(new CustomEvent("storeReady", { detail: { name: name } }));
    return currentStore;
}

async function setCurrentStore() {
    currStore = await localforage.getItem('currentStore');
    console.log("value: " + currStore);

    if (currStore) {
        console.log("Saved Store Name exists: " + currStore);
        let store = await openCurrentStore(currStore);
        let keys = await store.keys();
        console.log("saved store keys: " + keys);
        return store;
    }

    currentStore = undefined;
    let semesterEl = document.getElementById('currentSemester');
    if (semesterEl) {
        semesterEl.textContent = "";
    }
    return undefined;
}

async function switchCurrentStore(name) {
    await localforage.setItem('currentStore', name);
    return openCurrentStore(name);
}

setCurrentStore();
async function sortDataByProperty(dataArray, propertyName) {
    // console.log(propertyName);
    //  console.table(dataArray);
    dataArray.sort((a, b) => {
        const propertyA = a[propertyName].toLowerCase();
        const propertyB = b[propertyName].toLowerCase();
        return propertyA.localeCompare(propertyB);
    });
}
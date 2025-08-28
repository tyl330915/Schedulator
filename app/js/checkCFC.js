function compareCFC(cfcData) {
    console.log("compareCFC");
    currentStore.getItem('faculty', function(err, fac) {
        //console.log(fac);
        console.log(cfcData);
        try {
            let personObj;
            let indexes = getEmailIndexes(fac, cfcData);
            // console.log(indexes);
            for (let i = 0; i < fac.length; i++) {

                //console.log(fac[i].lastName, indexes[i]);
                if (indexes[i] < 0 && fac[i].available === true) {
                    personObj = {};
                    console.log(fac[i].lastName);
                    personObj = {
                        "name": fac[i].lastName + ', ' + fac[i].firstName,
                        "email": fac[i].email,
                        "status": fac[i].status,
                        "currentCourses": []
                    };
                    console.log(personObj);
                    cfcData.push(personObj);
                }
                ///if a person is removed from availability, this removes them from the cfc
                if (fac[i].available === false) {

                    var unavailIndex = cfcData.findIndex(obj => obj.email === fac[i].email);
                    //console.log(fac[i].email, unavailIndex);
                    if (unavailIndex > -1) {
                        cfcData.splice(unavailIndex, 1);
                        console.log(fac[i].lastName + " is removed from CFC");
                    }
                }
            }


            let alfaCFC = cfcData.sort((a, b) => a.name.localeCompare(b.name));
            //console.table(alfaCFC);

            //REMOVE THE PEOPLE FROM THE CFC WHO ARE LISTED AS UNAVAILABLE IN FAC
            let cfcIndexes = getEmailIndexes(fac, alfaCFC);
            console.log(cfcIndexes);


            for (let j = 0; j < alfaCFC.length; j++) {
                if (cfcIndexes[j] > -1 && fac[j].available === false) {
                    console.log(j, alfaCFC[j].name + " is unavailable");
                    alfaCFC.splice(j, 1);

                }

            }
            console.log(alfaCFC);
            saveCFC(alfaCFC);


        } catch (err) {
            console.log(err);
        }



    });
};

function getEmailIndexes(a, b) {
    return a.map(objA => b.findIndex(objB => objB.email === objA.email));
}

function compareEmails(a, b) {

    // Add objects from a to b if their email addresses are not already in b
    for (let objA of a) {
        if (!b.some(objB => objB.email === objA.email)) {
            b.push(objA);
        }
    }

    // Remove objects from b if their email addresses are not in a
    b = b.filter(objB => a.some(objA => objA.email === objB.email));


    console.log(b);
};
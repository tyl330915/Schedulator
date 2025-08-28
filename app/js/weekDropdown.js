document.addEventListener('DOMContentLoaded', async function() {
    await setCurrentStore();
    // Now you can use currentStore
    console.log(currentStore);

    const dropDown = document.getElementById("distribution");

    currentStore.getItem('semesterData', function(err, currData) {
        console.log("currData: ", currData);
        let currCourses = currData.currSections;

        // Create and append the options
        //var options = ["All Classes", "101", "102", "103"];
        var first = document.createElement("option");
        first.value = "All Courses";
        first.text = "All courses";


        // Add the new option at the beginning of the select
        dropDown.add(first);
        for (var i = 0; i < currCourses.length; i++) {
            let course = currCourses[i].num;
            var option = document.createElement("option");
            option.value = course;
            option.text = course;
            dropDown.appendChild(option);
        }

        // Add an event listener for the change event

        dropDown.addEventListener("change", function() {
            console.log("The selected value is: " + this.value);
            showCourse(this.value);
        });
    });
});


function showCourse(course) {
    var cells = document.getElementsByClassName("dayCell");

    // Loop over each cell
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];

        // Loop over each child element in the cell
        for (var j = 0; j < cell.children.length; j++) {
            var child = cell.children[j];

            // If "All Courses" is selected, make all children visible
            if (course === 'All Courses') {
                child.style.display = "block";
            }
            // Otherwise, check if the id of the child includes the course
            else if (child.id.includes(course)) {
                // If it does, set the display to "block"
                child.style.display = "block";
            } else {
                // If it doesn't, set the display to "none"
                child.style.display = "none";
            }
        }
    }
}
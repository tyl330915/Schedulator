document.addEventListener('DOMContentLoaded', () => {
    // Your existing code...

    // Get a reference to the "New Semester" button

    const newSemesterButton = document.getElementById('newSemesterButton');
    const continueButton = document.getElementById('continueButton');
    const localforage = require('localforage');

    // Add a click event listener to the button
    newSemesterButton.addEventListener('click', () => {
        // Open the "newSemester.html" page
        window.location.href = '../html/newSemester.html';
    });

});
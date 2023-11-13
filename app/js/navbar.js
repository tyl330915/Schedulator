const menu = `
<div class="navbar">
<img src="../css/schedyellow.png" alt="logo" class="logo" id = "zoomButton"></img>
<a href="../../index.html">Home</a>
<div class="dropdown">
    <button class="dropbtn">Faculty & Courses
    <i class="fa fa-caret-down"></i>
  </button>
    <div class="dropdown-content">
        <a href="faculty.html">Faculty</a>
        <a href="courses.html">Courses</a>
        <a href="survey.html">Faculty Survey</a>
    </div>
</div>
<div class="dropdown">
    <button class="dropbtn">Scheduling
    <i class="fa fa-caret-down"></i>
  </button>
    <div class="dropdown-content">
        <a href="assignCourses.html">Assign Classes</a>
        <a href="scheduleIndividuals.html">Individual Schedules</a>
        <a href="weekGrid.html">Weekly Overview</a>
    </div>
</div>
<a href="report.html">Report</a>
<a href="spreadsheet.html">Spreadsheet</a>

<a href="backup.html">Backup</a>

</div>
`


document.getElementById('navMenu').innerHTML = menu;
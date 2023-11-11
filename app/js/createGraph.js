//import "chart.js/auto";

function createGraph(CFC) {
    console.log("createGraph");
    //

    let eights = 0;
    let tens = 0;
    let elevens = 0;
    let ones = 0;
    let twos = 0;
    let fours = 0;
    let fives = 0;
    let sevens = 0;
    let W9 = 0;
    let W12 = 0;
    let W5 = 0;
    let timeArray = [];

    for (var i = 0; i < CFC.length; i++) {
        //console.log(CFC[i]);
        let currentFacCourses = CFC[i].currentCourses;
        if (currentFacCourses) {


            for (var j = 0; j < currentFacCourses.length; j++) {

                let currentTimes = currentFacCourses[j].time;
                let blockTime = currentTimes.split(":")[0];
                // console.log("Block Time: ", blockTime);

                switch (blockTime) {
                    case "Block 1":
                        eights = eights + 2;
                        break;
                    case "Block 2":
                        tens = tens + 2;
                        break;
                    case "Block 3":
                        elevens = elevens + 2;
                        break;
                    case "Block 4":
                        ones = ones + 2;
                        break;
                    case "Block 5":
                        twos = twos + 2;
                        break;
                    case "Block 6":
                        fours = fours + 2;
                        break;
                    case "Block 7":
                        fives = fives + 2;
                        break;
                    case "Block 8":
                        sevens = sevens + 2;
                        break;

                    case "* Wed Block A":
                        W9 = W9 + 1;
                        break;
                    case "* Wed Block B":
                        W12 = W12 + 1;
                        break;
                    case "* Wed Block 9":
                        W5 = W5 + 1;
                        break;
                    case "Block 1&2":
                        eights = eights + 1;
                        tens = tens + 1;
                        break;
                    case "Block 2&3":
                        tens = tens + 1;
                        elevens = elevens + 1;
                        break;
                    case "Block 3&4":
                        elevens = elevens + 1;
                        ones = ones + 1;
                        break;
                    case "Block 4&5":
                        ones = ones + 1;
                        twos = twos + 1;
                        break;
                    case "Block 5&6":
                        twos = twos + 1;
                        fours = fours + 1;
                        break;
                    case "Block 6&7":
                        fours = fours + 1;
                        fives = fives + 1;
                        break;
                    case "Block 7&8":
                        fives = fives + 1;
                        sevens = sevens + 1;
                        break;
                    default:
                        console.log("Error: Check time");




                }
            }
        }
    }

    // console.log("eights: ", eights, "tens: ", tens, "elevens: ", elevens, "ones: ", ones, "twos: ", twos, "fours: ", fours, "fives: ", fives, "sevens: ", sevens, "W9: ", W9, "W12: ", W12, "W5: ", W5);
    timeArray = [eights, tens, elevens, ones, twos, fours, fives, sevens, W9, W12, W5];

    // Assuming you have a canvas with id 'myChart'
    var ctx = document.getElementById('chartContainer').getContext('2d');

    // Check if the chart instance exists
    if (window.myBarChart != undefined) { window.myBarChart.destroy(); }; // Destroy the chart instance
    Chart.register(ChartDataLabels);

    // Create a new chart instance
    window.myBarChart = new Chart(ctx, {

        type: 'bar',
        data: {
            labels: ['8:30', '10:00', '11:30', '1:00', '2:30', '4:00', '5:00', '7:00', 'W9', 'W12', 'W5'],
            datasets: [{
                data: timeArray,
                backgroundColor: [
                    'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'black', 'teal', 'pink', 'goldenrod', 'magenta'
                ],
                borderColor: [
                    'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black'
                ],
                borderWidth: 1
            }]
        },
        options: {
            layout: {
                padding: {
                    top: 20
                }
            },
            title: {
                display: true,
                text: ' '
            },
            plugins: {
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: '#000',
                    offset: 1,
                    formatter: function(value, context) {
                        return value;
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });



};
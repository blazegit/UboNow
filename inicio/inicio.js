
  document.addEventListener('DOMContentLoaded', function() {

  // Get the current day as a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  var currentDay = new Date().getDay();
  
  console.log("Current day number:", currentDay);

  // Map the day number to the corresponding day name in Spanish
  var dayNamesSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Ensure that currentDay is within the valid range for the array
  if (currentDay >= 0 && currentDay < dayNamesSpanish.length) {
    // Update the 'dia' header with the current day name in Spanish
    document.getElementById('dia').textContent = dayNamesSpanish[currentDay];

    
  } else {
    console.error("Invalid current day:", currentDay);
  }
    
    
    
    
    
    
    // Get the current day
  var currentDate = new Date();
  var currentDay = currentDate.getDay(); // 0 is Sunday, 1 is Monday, and so on

  // Define a mapping of days to letters
  var dayToLetter = {
    1: 'L', // Monday
    2: 'M', // Tuesday
    3: 'X', // Wednesday
    4: 'J', // Thursday
    5: 'V'  // Friday
    // Add more days if needed
  };

  // Function to append a letter based on the current day
  function appendLetterToIds() {
    // Iterate through the elements and update their ids
    for (var i = 1; i <= 18; i++) {
      var currentId = i; 
      var newId = currentId + dayToLetter[currentDay];

      // Update the id of the current element
      var tdElement = document.getElementById(currentId.toString());
      if (tdElement) {
        tdElement.id = newId;
      }
    }
  }

  // Call the function to append a letter to the ids
  appendLetterToIds();
    
    
    
function updateSelectedEvents() {      
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log(response);
        retrievedEvents = response.selectedEvents.flatMap(function(event) {
          // Check if event.Horas is a string or an array
          if (typeof event.Horas === 'string') {
            return [event.Horas]; // Return as an array
          } else {
            return event.Horas; // Return as it is
          }
        });
        displaySelectedEvents(response.selectedEvents);
      } else {
        console.error('Error: ' + xhr.status);
      }
    }
  };

  xhr.open('GET', '/horario/getSelectedEvents.php', true);
  xhr.send();
}

function displaySelectedEvents(selectedEvents) {
  var tableCells = document.querySelectorAll('table td');
  tableCells.forEach(function(cell) {
    var eventId = cell.getAttribute('id');
    if (retrievedEvents.includes(eventId)) {
      cell.classList.add('assigned');
      var eventInfo = selectedEvents.find(function(event) {
         var parsedHoras = event.Horas;
        if (typeof event.Horas === 'string') {
          parsedHoras = [event.Horas];
        }
        return parsedHoras.includes(eventId);
      });
      if (eventInfo) {
        var cellContent = document.createElement('div');
        cellContent.classList.add('cell-content');
        cellContent.innerHTML = `
          <p class="asignatura"><span class="small-text">Asignatura:</span> ${eventInfo.Asignatura}</p>
          <p class="sala"><span class="small-text">Sala:</span> ${eventInfo.Sala}</p>
          <p class="profesor"><span class="small-text">Profesor:</span> ${eventInfo.Profesor}</p>
        `;
        cell.appendChild(cellContent);
      }
    } else {
      cell.classList.remove('assigned');
      var cellContent = cell.querySelector('.cell-content');
      if (cellContent) {
        cell.removeChild(cellContent);
      }
    }
  });
}


updateSelectedEvents();

const startTimes = [
        "08:30", "09:15", "10:00", "10:10", "10:55", "11:40", "11:45",
        "12:30", "13:15", "13:30", "14:15", "15:00", "15:10", "15:55",
        "16:45", "17:30", "18:15", "18:30", "19:10", "19:50", "20:30",
        "21:10", "21:50"
    ];
    
    var durations = [45, 45, 10, 45, 45, 5, 45, 45, 15, 45, 45, 10, 45, 45, 45, 45, 15, 40, 40, 40, 40, 40, 40];
    
    function calculateRowIndex(time) {
        // Convert the input time to minutes
        const [hour, minute] = time.split(':').map(Number);
        const inputMinutes = hour * 60 + minute;
    
        // Find the closest time slot before or equal to the input time
        let closestTimeIndex = 0;
    
        for (let i = 1; i < startTimes.length; i++) {
            const currentTimeMinutes = timeToMinutes(startTimes[i]);
    
            if (currentTimeMinutes <= inputMinutes) {
                closestTimeIndex = i;
            } else {
                break; // Exit the loop when the current time is after the input time
            }
        }
    
        return closestTimeIndex;
    }
    
    
    function timeToMinutes(time) {
        const [hour, minute] = time.split(':').map(Number);
        return hour * 60 + minute;
    }
    function addTask(startTime, endTime, taskName, dayIndex, className) {
    // Parse start and end times
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    // Find the corresponding table cell for the start time
    const rowIndex = calculateRowIndex(startTime) + 1;
    const endRowIndex = calculateRowIndex(endTime) + 1;
    const columnIndex = dayIndex;

    // Calculate task position and height
    var totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);

    // Check if there is any content between rowIndex and endRowIndex
    let hasContentBetween = false;
    for (let i = rowIndex; i < endRowIndex; i++) {
        if (document.getElementById('scheduleTable').rows[i].cells[dayIndex].querySelector('.ventana') || document.getElementById('scheduleTable').rows[i].cells[dayIndex].querySelector('.reserva') || document.getElementById('scheduleTable').rows[i].cells[dayIndex].querySelector('.cell-content')) {
            hasContentBetween = true;
            break;
        }
        
    }

    // Create a new task element
    const taskElement = document.createElement('div');
    taskElement.innerHTML = taskName;
    taskElement.classList.add(className);

    // Append the task to the appropriate cell
    const table = document.getElementById('scheduleTable');
    const rows = table.getElementsByTagName('tr');

    if (rowIndex < rows.length) {
        const cells = rows[rowIndex].getElementsByTagName('td');
        if (columnIndex < cells.length) {
            const cell = cells[columnIndex];

            // Calculate task position within the cell
            const cellDuration = getCellDuration(rowIndex);
            const startPercentage = calculatePercentagePassed(rowIndex - 1, startTime);
            const finishPercentage = calculatePercentagePassed(endRowIndex - 1, endTime);

            let taskPercentage = 0; // Initialize taskPercentage to 0

            for (let i = rowIndex; i < endRowIndex; i++) {
                if (totalMinutes > durations[i]) {
                    taskPercentage += 100;
                    totalMinutes = totalMinutes - durations[i];
                    continue;
                } else {
                    taskPercentage += (totalMinutes / durations[i]) * 100;
                    break; // Exit the loop since the task has been accommodated in the current cell
                }
            }

            // Set the position and height of the task element
            taskElement.style.top = `${startPercentage}%`;
            taskElement.style.height = `${taskPercentage}%`;

            // Add margin-left if there is content between rowIndex and endRowIndex
            if (hasContentBetween) {
                taskElement.style.marginLeft = '50%';
            }

            // Append the task to the cell
            cell.appendChild(taskElement);
        }
    }
}

    
    function calculatePercentagePassed(rowIndex, currentTime) {
        // Validate the rowIndex
        if (rowIndex < 0 || rowIndex >= startTimes.length) {
            console.error("Invalid rowIndex");
            return;
        }
    
        // Get startTime and endTime based on the rowIndex
        const startTime = startTimes[rowIndex];
        const endTime = startTimes[rowIndex + 1] || "22:30"; // Assuming the last endTime as 22:00 for simplicity
    
        // Convert time strings to Date objects
        const startDate = new Date(`2000-01-01 ${startTime}`);
        const endDate = new Date(`2000-01-01 ${endTime}`);
        const currentDate = new Date(`2000-01-01 ${currentTime}`);
    
        // Calculate total time difference in minutes
        const totalTimeDiff = endDate - startDate;
    
        // Calculate time passed in minutes
        const timePassed = currentDate - startDate;
    
        // Calculate percentage passed
        const percentagePassed = (timePassed / totalTimeDiff) * 100;
    
        return percentagePassed;
    }
    
    function getCellDuration(rowIndex) {
        // Define the duration of each cell in minutes
        const durations = [45, 45, 10, 45, 45, 5, 45, 45, 15, 45, 45, 10, 45, 45, 45, 45, 15, 40, 40, 40, 40, 40, 40];
        return durations[rowIndex];
    }
        
    function retrieveVentanaData() {
        // Make an AJAX call to retrieve information from the PHP file
        $.ajax({
            type: 'POST',
            url: '/../horario/retrieveVentana.php', // Update with the correct path to your PHP file
            success: function (phpResponse) {
                try {
                    // Parse the JSON-encoded response
                    var responseData = JSON.parse(phpResponse);
    
                    // Check if responseData is an array
                    if (Array.isArray(responseData)) {
                        // Iterate through the array and handle each object
                        responseData.forEach(function (data) {
                            var startTime = data.startTime;
                            var finishTime = data.finishTime;
                            var day = data.day;
    
                            
    
                            // Example usage
                            var daysOfWeek = ["", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    
                            var diaNumero = daysOfWeek.indexOf(day);
                            
                            var className = "ventana";
                            setTimeout(function() {
                                if(currentDay==diaNumero){
                                    diaNumero = 1;
                                    addTask(startTime, finishTime, 'Ventana almuerzo <br />' + startTime + ' - ' + finishTime, diaNumero, className);
                                    document.getElementById("recordatorioAlmuerzo").innerText = startTime;
                                }
                            }, 1000);
                        });
                    } else {
                        console.error('Invalid response format. Expected an array.');
                    }
                } catch (error) {
                    console.error('Error parsing JSON: ' + error);
                }
            },
            error: function (phpError) {
                // Handle any errors that occur during the PHP request
                console.error('Error retrieving data from PHP: ' + phpError.responseText);
            }
        });
    }


    retrieveVentanaData();
    
    
  function retrieveReserva() {
    // Make an AJAX call to retrieve information from the PHP file
    $.ajax({
        type: 'POST',
        url: '/../horario/retrieveReserva.php',
        success: function (phpResponse) {
            try {
                // Parse the JSON-encoded response
                var responseData = JSON.parse(phpResponse);

                // Initialize the soonestTime variable
                var startingTimes = [];

                // Check if responseData is an array
                if (Array.isArray(responseData)) {
                    // Iterate through the array and handle each object
                    responseData.forEach(function (data) {
                        var startTime = data.startTime;
                        var day = data.day;
                        var nombreEspacio = data.nombreEspacio;

                        console.log(startTime);
                        console.log(day);
                        console.log(nombreEspacio);

                        var date = new Date(day);
                        var dayOfWeek = date.getDay() + 1;

                        // Remove seconds from the time string
                        startTime = startTime.slice(0, 5);
                        // Assuming startingTimes is an array
                        
                        // Add startTime to the array
                        startingTimes.push(startTime);
                       
                        // Convert the time string to a Date object
                        var startDate = new Date("2000-01-01 " + startTime);

                        // Add one hour to the time
                        startDate.setHours(startDate.getHours() + 1);

                        // Format the finish time as HH:mm
                        var finishTime =
                            ("0" + startDate.getHours()).slice(-2) + ":" + ("0" + startDate.getMinutes()).slice(-2);
                        var className = "reserva";

                        setTimeout(function () {
                            if (currentDay == dayOfWeek) {
                                dayOfWeek = 1;
                                // Assuming addTask is a function that adds a task, replace it with your actual implementation
                                addTask(
                                    startTime,
                                    finishTime,
                                    '<b>Reserva en: </b>' + nombreEspacio + '<br />' + startTime + ' - ' + finishTime + '<br />' + day,
                                    dayOfWeek,
                                    className
                                );
                            }
                        }, 1000);
                    });
                    
                    function getSoonestNotPassedTime(startingTimes) {
                      // Get the current time
                      var now = new Date();
                    
                      // Convert each string time to a Date object
                      var times = startingTimes.map(function(time) {
                        var parts = time.split(":");
                        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(parts[0]), parseInt(parts[1]), 0, 0);
                      });
                    
                      // Filter out times that have already passed
                      var futureTimes = times.filter(function(time) {
                        return time > now;
                      });
                    
                      // Sort the remaining times in ascending order
                      futureTimes.sort(function(a, b) {
                        return a - b;
                      });
                    
                      // Return the soonest time that has not yet passed
                      return futureTimes.length > 0 ? futureTimes[0] : null;
                    }
                    
                    // Example usage with your startingTimes array
                   
                    var soonestNotPassedTime = getSoonestNotPassedTime(startingTimes);
                     console.log("startingtimes: ", startingTimes);
                    console.log("function get soonestnoppassed timeL: ",getSoonestNotPassedTime(startingTimes));
                    
                    if (soonestNotPassedTime !== null) {
                      // Define options for formatting
                      const options = { hour: '2-digit', minute: '2-digit', hour12: false };
                      console.log("The soonest time that has not yet passed is: " + soonestNotPassedTime.toLocaleTimeString(undefined, options));
                      // Get the element by its id
                        const recordatorioReservaElement = document.getElementById("recordatorioReserva");
                        
                        // Set the text content
                        recordatorioReservaElement.innerText = soonestNotPassedTime.toLocaleTimeString(undefined, options);
                    } else {
                      console.log("All specified times have already passed.");
                    }
                    

                }
            } catch (error) {
                console.error('Error parsing JSON: ' + error);
            }
        },
        error: function (phpError) {
            // Handle any errors that occur during the PHP request
            console.error('Error retrieving data from PHP: ' + phpError.responseText);
        },
    });
}



    retrieveReserva();

function fetchSoonestClass() {
    // AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/../inicio/getSoonestClass.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Event listener for when the AJAX request is completed
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Update the content of <p> with the result
            document.getElementById("proximaClase").innerHTML = xhr.responseText;
        }
    };

    // Send the AJAX request
    xhr.send();
}


 fetchSoonestClass();

  });
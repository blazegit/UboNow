function toggleModal() {
    $('#myModal').modal('toggle');
}


function submitForm() {
    var selectedDays = [];
    var schedules = [];

    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            selectedDays.push(checkbox.id);
        }
    });

    // Show the spinner when the AJAX request starts
    $('#loadingSpinner').removeClass('d-none');

    fetch('conseguirhorarios.php')
        .then(response => response.json())
        .then(data => {
            schedules = data;

            $.ajax({
                type: 'POST',
                url: 'https://blazechick257.pythonanywhere.com/',
                contentType: 'application/json;charset=UTF-8',
                data: JSON.stringify({
                    schedules: schedules,
                    selected_days: selectedDays,
                    individual_student: userId
                }),
                success: function (data) {
                    if (data.error) {
                        alert('Error: ' + data.error);
                    } else {
                        var responseData = data.result;

                        $.ajax({
                            type: 'POST',
                            url: 'insertVentanas.php',
                            data: { responseData: responseData },
                            success: function (phpResponse) {
                                console.log(phpResponse);
                            },
                            error: function (phpError) {
                                console.error('Error sending data to PHP: ' + phpError.responseText);
                            }
                        });

                        $('#result').empty();
                        $.each(responseData, function (dia, ventana) {
                            console.log(ventana);
                        });
                    }
                },
                error: function (error) {
                    alert('Error: ' + error.responseText);
                },
                complete: function () {
                    // Hide the spinner when the request is complete
                    $('#loadingSpinner').addClass('d-none');
                    // Close the modal
                    $('#myModal').modal('toggle');
                    setTimeout(function() {
                        location.reload();
                    }, 1500); 
                }
            });

            console.log("Selected days:", selectedDays);
        })
        .catch(error => {
            console.error('Error fetching schedules:', error);
            $('#loadingSpinner').addClass('d-none');
        });
}

function submitAsignaturas() {
    var form = document.getElementById('asignaturasForm');
    var formData = new FormData(form);

    fetch('Agendar_horas.php', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Check the status in the response
        if (data.status === 'success') {
            // Handle success
            console.log('Data inserted successfully');
            setTimeout(function() {
                        location.reload();
                    }, 300); // 2000 milliseconds = 2 seconds
        } else {
            // Handle error
            console.error('Error:', data.message);
        }
    })
    .catch(error => {
        // Handle fetch errors
        console.error('Fetch error:', error);
    });
}


    
  document.addEventListener('DOMContentLoaded', function() {
    // Check if there is a success parameter in the URL
    var urlParams = new URLSearchParams(window.location.search);
    var successParam = urlParams.get('success');

        
    
    

    // Function to handle cell click events
    function handleCellClick(event) {
    var cell = event.target;
    if (cell.tagName === 'TD') {
        var eventId = cell.getAttribute('id');
        var rowIndex = cell.parentNode.rowIndex;
        var columnIndex = cell.cellIndex;

        // Exclude assigning class for specific cells
        if ([0, 3, 6, 9, 12, 17].includes(rowIndex) || columnIndex === 0) {
            return;
        }

        // Toggle the selection and update the confirmation box display
        if (cell.classList.contains('event')) {
            cell.classList.remove('event');
            selectedEvents = selectedEvents.filter(function (event) {
                return event !== eventId;
            });
        } else {
            cell.classList.add('event');
            // Convert event format and then push to selectedEvents
            
            selectedEvents.push(eventId);
            //console.log(selectedEvents);
        }

        // Update confirmation box display after the toggle
        checkAndDisplayConfirmation();
        }
    }


    // Function to check and display confirmation
    function checkAndDisplayConfirmation() {
      var confirmationBox = document.getElementById('confirmation-box');
      var tableCells = document.querySelectorAll('table td.event');
      selectedEvents = Array.from(tableCells, function(cell) {
        return cell.getAttribute('id');
      });

      if (selectedEvents.length > 0) {
        confirmationBox.style.display = 'block';
        confirmationBox.classList.add('show');
      } else {
        confirmationBox.style.display = 'none';
        confirmationBox.classList.remove('show');
      }

      document.getElementById('selected-events').value = JSON.stringify(selectedEvents);
    }
    
    
    
function updateSelectedEvents() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        //console.log(response);
        retrievedEvents = response.selectedEvents.flatMap(function(event) {
          // Check if event.Horas is a string or an array
          if (typeof event.Horas === 'string') {
            return [event.Horas]; // Return as an array
          } else {
            return event.Horas; // Return as it is
          }
        });
        displaySelectedEvents(response.selectedEvents);
        //console.log(response.selectedEvents);
      } else {
        console.error('Error: ' + xhr.status);
      }
    }
  };

  xhr.open('GET', 'getSelectedEvents.php', true);
  xhr.send();
}






function displaySelectedEvents(selectedEvents) {
  var tableCells = document.querySelectorAll('table td');
  tableCells.forEach(function(cell) {
    var eventId = cell.getAttribute('id');
    if (retrievedEvents.includes(eventId)) {
      cell.classList.add('assigned');
      var eventInfo = selectedEvents.find(function(event) {
        // Verify if the event.Horas is in a valid JSON format
        var parsedHoras = event.Horas;
        if (typeof event.Horas === 'string') {
          parsedHoras = [event.Horas];
        }
        return parsedHoras.includes(eventId);
      });
      if (eventInfo) {
          console.log("eventInfo: ",eventInfo)
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






    var selectedEvents = []; // Variable to store selected event IDs
    var retrievedEvents = []; // Variable to store events retrieved from getSelectedEvents.php
    
    let isEventListenerEnabled = false;
    
    // Event listener for table cell clicks
    document.querySelector('table').addEventListener('click', handleCellClick);
    
    function toggleEventListener() {
        const table = document.querySelector('table');
        const formGroup = document.querySelector('.form-group.botones');
        const editButton = document.getElementById('agregarAsignaturas');
        
        if (isEventListenerEnabled) {
          table.removeEventListener('click', handleCellClick);
          removeAlert();
          editButton.textContent = 'Agregar asignaturas';
          editButton.classList.remove('btn-danger');
          console.log("Event listener disabled");
        } else {
          table.addEventListener('click', handleCellClick);
          addAlert(formGroup);
          editButton.textContent = 'Terminar';
          editButton.classList.add('btn-danger');
          console.log("Event listener enabled");
        }
    
        // Toggle the state
        isEventListenerEnabled = !isEventListenerEnabled;
      }
    
      function addAlert(parentElement) {
        const alertDiv = document.createElement('div');
        alertDiv.classList.add('alert', 'alert-primary', 'mb-3');
        alertDiv.setAttribute('role', 'alert');
        alertDiv.textContent = 'Estas agregando asignaturas, presiona en un bloque para añadir las horas. Cuando las añadas haz click en confirmar.';
        parentElement.parentNode.insertBefore(alertDiv, parentElement.nextSibling);
      }
    
      function removeAlert() {
        const alertDiv = document.querySelector('.alert.alert-primary');
        if (alertDiv) {
          alertDiv.remove();
        }
      }
      
      
      
      
      
      
    // Update selected events on page load
    updateSelectedEvents();

    // Handle success overlay and redirection
    if (successParam) {
      var successOverlay = document.getElementById('success-overlay');
      successOverlay.style.display = 'block';
      setTimeout(function() {
        successOverlay.style.display = 'none';
      }, 3000);
    }

    var confirmButton = document.getElementById('confirm-button');
    var overlay = document.getElementById('overlay');
    var closeIcon = document.querySelector('.close-icon');

    confirmButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent form submission
      overlay.style.display = 'block';
    });

    closeIcon.addEventListener('click', function() {
      overlay.style.display = 'none';
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
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
            url: 'retrieveVentana.php', // Update with the correct path to your PHP file
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
                                addTask(startTime, finishTime, 'Ventana almuerzo <br />' + startTime + ' - ' + finishTime, diaNumero, className);
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
            url: 'retrieveReserva.php', // Update with the correct path to your PHP file
            success: function (phpResponse) {
                try {
                    // Parse the JSON-encoded response
                    var responseData = JSON.parse(phpResponse);
    
                    // Check if responseData is an array
                    if (Array.isArray(responseData)) {
                        // Iterate through the array and handle each object
                        responseData.forEach(function (data) {
                            var startTime = data.startTime;
                            var day = data.day;
                            var nombreEspacio = data.nombreEspacio;
    
                            console.log( startTime);
                            console.log(day);
                            console.log(nombreEspacio);
                            
                            var date = new Date(day);
                            var dayOfWeek = date.getDay()+1;
                            
                            
                            // Remove seconds from the time string
                            startTime = startTime.slice(0, 5);
                            
                            // Convert the time string to a Date object
                            var startDate = new Date("2000-01-01 " + startTime);
                            
                            // Add one hour to the time
                            startDate.setHours(startDate.getHours() + 1);
                            
                            // Format the finish time as HH:mm
                            var finishTime = ("0" + startDate.getHours()).slice(-2) + ":" + ("0" + startDate.getMinutes()).slice(-2);

                            var className = "reserva";
                            
                            setTimeout(function() {
                                addTask(startTime, finishTime, '<b>Reserva en: </b>' +nombreEspacio+'<br />' + startTime + ' - ' + finishTime + '<br />'+day, dayOfWeek, className);
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


    retrieveReserva();
    
    
    
    window.toggleEventListener = toggleEventListener;
   
    
  });
  
  
   function eliminarAsignaturas() {
    // Mostrar una alerta de confirmaci���n
     var confirmacion = confirm("Estas seguro de que deseas eliminar las asignaturas?");

    // Verificar si el usuario confirm���
    if (confirmacion) {
        // Crear un objeto XMLHttpRequest (AJAX)
        var xmlhttp = new XMLHttpRequest();

        // Especificar el m���todo y la URL del archivo PHP
        xmlhttp.open("GET", "eliminar_asignaturas.php", true);

        // Definir la funci���n de retorno de llamada (callback) cuando la solicitud AJAX se complete
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // La solicitud AJAX se complet��� correctamente
                // Puedes realizar acciones adicionales aqu��� si es necesario
                  location.reload();
                  
            }
        };

        // Enviar la solicitud AJAX
        xmlhttp.send();
    } 
}
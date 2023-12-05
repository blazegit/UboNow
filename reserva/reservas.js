var $j = jQuery.noConflict();
$(document).ready(function() {
    
    
    // Call the PHP file to get all reservations
    fetchReservations('getReservations.php')
        .then(reservations => {
            console.log('All reservations:', reservations);

            // Update 'tablaSalas' (EspacioIDs: 6, 7, 8, 9)
            const salasReservations = reservations.filter(reservation => ['6', '7', '8', '9'].includes(reservation.EspacioID));
            console.log('Filtered salas reservations:', salasReservations);
            updateTable('tablaSalas', salasReservations, 'sala');
            updateReservationCount('salaHeader', salasReservations);

            // Update 'tablaGYM' (EspacioIDs: 4, 5)
            const gymReservations = reservations.filter(reservation => ['4', '5'].includes(reservation.EspacioID));
            console.log('Filtered gym reservations:', gymReservations);
            updateTable('tablaGYM', gymReservations, 'gym');
            updateReservationCount('gymHeader', gymReservations);
        })
        .catch(error => console.error('Error fetching reservations:', error));

    addCancelListeners('tablaSalas');
    addCancelListeners('tablaGYM');

    function fetchReservations(phpFile) {
        return fetch(phpFile)
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching reservations:', error);
                throw error; // Propagate the error to the next catch block
            });
    }
    
   function updateTable(tableId, reservations, espacioType) {
    var table = document.getElementById(tableId);
    var tbody = table.getElementsByTagName('tbody')[0];

    // Clear existing rows
    tbody.innerHTML = '';

    // Map EspacioID to corresponding names for sala and gym
    const espacioNames = {
        '6': 'sala 1',
        '7': 'sala 2',
        '8': 'sala 3',
        '9': 'sala 4',
        '4': 'gym_viel',
        '5': 'gym_rondizzoni',
    };

    // Populate the table with the fetched reservations
    reservations.forEach(reservation => {
        var row = document.createElement('tr');
        var dayCell = document.createElement('td');
        dayCell.innerText = reservation.FechaReserva; // Assuming 'FechaReserva' contains day information
        var timeCell = document.createElement('td');
        timeCell.innerText = reservation.HoraReserva;
        var espacioCell = document.createElement('td');
        espacioCell.innerText = espacioNames[reservation.EspacioID] || ''; // Get the corresponding name or leave it empty
        var actionCell = document.createElement('td');
        actionCell.innerHTML = '<button class="btn btn-danger" data-toggle="modal" data-target="#myModal" >Cancelar</button>';

        row.appendChild(dayCell);
        row.appendChild(timeCell);
        row.appendChild(espacioCell);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });

    console.log('Table updated:', tableId, 'with reservations:', reservations);
}


function updateReservationCount(headerId, reservations) {
    var header = document.getElementById(headerId);
    if (header) {
        var countText = reservations.length + '/' + 3; // Assuming the total is always 3
        header.innerText = 'Reservas Sala de estudio ' + countText;
    }
}



function addCancelListeners(tableId) {
    var table = document.getElementById(tableId);
    if (!table) {
        console.error('Table not found:', tableId);
        return;
    }

    table.addEventListener('click', function (event) {
        var cancelButton = event.target.closest('.btn-danger');
        if (cancelButton) {
            console.log('Cancel button clicked');

            // Show the custom confirmation modal
           

            var reservationData = getReservationData(cancelButton);
            console.log('Reservation data:', reservationData);

            document.getElementById('confirmCancel').onclick = function () {
                console.log('Confirm cancel button clicked');
                cancelReservation(reservationData);
                // Close the modal
                $('#myModal').modal('hide');
            };
        }
    });
}

function getReservationData(button) {
    var row = button.closest('tr');
    var day = row.cells[0].innerText;
    var time = row.cells[1].innerText;
    var espacio = row.cells[2].innerText;

    return {
        day: day,
        time: time,
        espacio: espacio,
    };
}

function getTableId(espacio) {
    switch (espacio) {
        case 'sala 1':
        case 'sala 2':
        case 'sala 3':
        case 'sala 4':
            return 'tablaSalas';
        case 'gym_viel':
        case 'gym_rondizzoni':
            return 'tablaGYM';
        default:
            console.error('Unknown espacio:', espacio);
            return null;
    }
}

function removeTableRow(reservationData) {
    // Find the corresponding table and row
    var tableId = getTableId(reservationData.espacio);
    var table = document.getElementById(tableId);
    if (!table) {
        console.error('Table not found:', tableId);
        return;
    }

    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        if (
            cells[0].innerText === reservationData.day &&
            cells[1].innerText === reservationData.time &&
            cells[2].innerText === reservationData.espacio
        ) {
            // Remove the row
            rows[i].parentNode.removeChild(rows[i]);
            console.log('Reservation removed from the table.');
            break;
        }
    }
}




function getEspacioID(espacio) {
    switch (espacio) {
        case 'sala 1':
            return 6;
        case 'sala 2':
            return 7;
        case 'sala 3':
            return 8;
        case 'sala 4':
            return 9;
        case 'gym_viel':
            return 4;
        case 'gym_rondizzoni':
            return 5;
        default:
            console.error('Unknown espacio:', espacio);
            return null;
    }
}

function cancelReservation(reservationData) {
    console.log('Canceling reservation:', reservationData);

    var reservationDataToSend = Object.assign({}, reservationData);

    // Transform the espacio name to EspacioID
    reservationDataToSend.espacio = getEspacioID(reservationDataToSend.espacio);

    // Make an AJAX call to delete the reservation
    $.ajax({
        url: 'deleteReservation.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(reservationDataToSend),
        success: function (response) {
            if (response.success) {
                console.log('Reservation successfully canceled.');
                // Remove the row from the table
                console.log("resevationdata", reservationData);
                console.log("reservationDataToSend", reservationDataToSend);
                removeTableRow(reservationData);
            } else {
                console.error('Failed to cancel reservation:', response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('AJAX error:', error);
        }
    });
}

    
    
    
    
    
    
    
    
    
    
    
    
    // Get the current weekday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = new Date().getDay();
    console.log(currentDay);
    // Array of weekday names
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const spanishWeekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    // Declare selectedDay and selectedRoom globally
    var selectedDay;
    var selectedRoom;
    var selectedHour;

    // Generate buttons for weekdays starting from the current day
    let counter = 0;
    const buttons = document.querySelectorAll('input[name="day"]');
    for (let i = 0; counter < 10; i++) {
        const dayIndex = (currentDay + i) % 7;
        if (dayIndex !== 0 && dayIndex !== 6) {
            buttons[counter].value = weekdays[dayIndex];
            buttons[counter].parentElement.innerHTML = `
                <input type="radio" name="day" value="${weekdays[dayIndex]}"> ${spanishWeekdays[dayIndex]}
            `;
            counter++;
        }
    }

    function getSelectedRooms() {
        if (selectedDay && selectedRoom) {
            $.ajax({
                type: "POST",
                url: "getAvailableHours.php",
                data: { day: selectedDay, room: selectedRoom },
                dataType: "json",
                success: function(response) {
                    console.log(response); // Log the response to the console
                    if (Array.isArray(response)) {
                        var occupiedHours = response;
                        $("input[name='hour']").each(function() {
                            var hourValue = $(this).val();
                            if (occupiedHours.includes(hourValue)) {
                                $(this).prop('disabled', true).parent().removeClass('active').removeClass('btn-primary').addClass('btn-secondary');
                            } else {
                                $(this).prop('disabled', false).parent().removeClass('disabled').removeClass('btn-secondary').addClass('btn-primary');
                            }
                        });
                    } else {
                        console.error("Invalid or missing response data structure.");
                    }
                },
                error: function(error) {
                    console.error("Error fetching hours: ", error);
                }
            });
        }
    }

    $("input[name='day']").click(function() {
        $("input[name='day']").parent().removeClass('active');
        $(this).parent().addClass('active');
        $("input[name='room']").prop('checked', false).prop('disabled', true).parent().addClass('disabled').removeClass('btn-primary').addClass('btn-secondary');
        $("input[name='hour']").prop('checked', false).prop('disabled', true).parent().addClass('disabled').removeClass('btn-primary').addClass('btn-secondary');
        selectedDay = $("input[name='day']:checked").val();
        if (selectedDay && selectedRoom) {
            getSelectedRooms();
        }
    });

    $("input[name='room']").click(function() {
        selectedDay = $("input[name='day']:checked").val();
        selectedRoom = $("input[name='room']:checked").val();
        console.log(selectedDay);
        if (selectedDay && selectedRoom) {
            getSelectedRooms();
        }
    });

    $("input[name='hour']").click(function() {
        selectedHour = $("input[name='hour']:checked").val();
    });

    $(".btn-group .btn").click(function() {
        var parentName = $(this).parent().attr('name');
        if (parentName === 'day') {
            $(this).addClass('active').siblings().removeClass('active');
            $("input[name='room']").prop('disabled', false).parent().removeClass('disabled').removeClass('btn-secondary').addClass('btn-primary');
        }
    });

    
    $("form").submit(function(e) {
        // Log the selected values (optional)
        console.log(selectedDay);
        console.log(selectedRoom);
        console.log(selectedHour);
    
        e.preventDefault();
        // Submit the form using AJAX
        $.ajax({
            type: "POST",
            url: "reservation.php",
            data: {
                day: selectedDay,
                room: selectedRoom,
                hour: selectedHour
            },
            dataType: 'json', // Expect JSON response
            success: function(response) {
                if (response.success) {
                    // Handle the success response
                    $('#successModal').modal('show');
        
                    setTimeout(function() {
                        location.reload();
                    }, 1000); // 2000 milliseconds = 2 seconds
                } else {
                    // Handle the error response
                    alert(response.message);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                // Handle the AJAX error
                console.error("Ocurrió un error en el ingreso de la hora.");
            }
        });


    });

    $("input[name='room']").prop('disabled', true).parent().addClass('disabled').addClass('btn-secondary');
    $("input[name='hour']").prop('disabled', true).parent().addClass('disabled').addClass('btn-secondary');
});

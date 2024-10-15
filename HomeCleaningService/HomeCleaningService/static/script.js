function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();

function showPopup() {
    // Show the Make Bookings popup and overlay
    document.getElementById('booking-popup').style.display = 'block';
    document.getElementById('make-bookings-overlay').style.display = 'block'; // Show overlay
    document.getElementById('manage-bookings-popup').style.display = 'none'; // Hide Manage Bookings
}

function hidePopup() {
    // Hide the Make Bookings popup and overlay
    document.getElementById('booking-popup').style.display = 'none';
    document.getElementById('make-bookings-overlay').style.display = 'none'; // Hide overlay
}

function showManageBookingsPopup() {
    document.getElementById('manage-bookings-overlay').style.display = 'block';
    document.getElementById('manage-bookings-popup').style.display = 'block';
    document.getElementById('booking-popup').style.display = 'none'; // Hide Make Booking popup
}

function hideManageBookingsPopup() {
    document.getElementById('manage-bookings-popup').style.display = 'none';
    document.getElementById('manage-bookings-overlay').style.display = 'none';
}

function hideEditBookingPopup() {
    document.getElementById('edit-booking-popup').style.display = 'none';
    document.getElementById('edit-booking-overlay').style.display = 'none';
}

function makeBooking() {
    const date = document.getElementById('booking-date').value;
    const plan = document.getElementById('booking-plan').value;

    if (date && plan) {
        const bookingRow = `
            <tr>
                <td>${date}</td>
                <td>$${plan}</td>
            </tr>
        `;

        // Update My Bookings table
        const myBookingsTbody = document.querySelector('.section table tbody');
        const noBookingsRow = document.querySelector('.no-bookings');
        if (noBookingsRow) {
            noBookingsRow.remove();
        }
        myBookingsTbody.innerHTML += bookingRow;

        // Also update the Manage Bookings table
        const manageBookingsTbody = document.querySelector('#manage-bookings-popup table tbody');
        manageBookingsTbody.innerHTML += `
            <tr>
                <td>${date}</td>
                <td>$${plan}</td>
                <td>
                    <button onclick="editBooking(this)">Edit</button>
                    <button onclick="deleteBooking(this)">Delete</button>
                </td>
            </tr>
        `;

        hidePopup();
        alert('Booking made successfully!');
    } else {
        alert('Please fill in both fields.');
    }
}

function deleteBooking(btn) {
    // Get the row to delete in the Manage Bookings table
    const row = btn.closest('tr');
    const dateToDelete = row.cells[0].textContent; // Get the date of the booking to delete
    const planToDelete = row.cells[1].textContent; // Get the plan of the booking to delete

    // Remove the row from the Manage Bookings table
    row.remove();

    // Now remove the corresponding row from the My Bookings table
    const myBookingsTbody = document.querySelector('.section table tbody');
    const myBookingsRows = myBookingsTbody.querySelectorAll('tr');
    
    myBookingsRows.forEach(function(myRow) {
        if (myRow.cells[0].textContent === dateToDelete && myRow.cells[1].textContent === planToDelete) {
            myRow.remove();
        }
    });

    // Show a message after deletion
    alert('Booking has been deleted.');
}

function editBooking(btn) {
    // Get the row that is being edited
    const row = btn.closest('tr');
    const originalDate = row.cells[0].textContent; // Get current date
    const originalPlan = row.cells[1].textContent.replace('$', ''); // Get current plan without $

    // Open the edit booking popup and populate the fields with current data
    document.getElementById('edit-booking-date').value = originalDate;
    document.getElementById('edit-booking-plan').value = originalPlan;
    document.getElementById('edit-booking-popup').style.display = 'block';
    document.getElementById('edit-booking-overlay').style.display = 'block'; // Show the overlay

    // Save changes when the "Save Booking" button is clicked
    document.getElementById('save-booking-btn').onclick = function() {
        const newDate = document.getElementById('edit-booking-date').value;
        const newPlan = document.getElementById('edit-booking-plan').value;

        // Update the Manage Bookings table row with the new values
        row.cells[0].textContent = newDate;
        row.cells[1].textContent = `$${newPlan}`;

        // Now find and update the corresponding row in the My Bookings table
        const myBookingsTbody = document.querySelector('.section table tbody');
        const myBookingsRows = myBookingsTbody.querySelectorAll('tr');

        myBookingsRows.forEach(function(myRow) {
            if (myRow.cells[0].textContent === originalDate && myRow.cells[1].textContent === `$${originalPlan}`) {
                myRow.cells[0].textContent = newDate; // Update Date
                myRow.cells[1].textContent = `$${newPlan}`; // Update Plan
            }
        });

        // Hide the edit popup and show confirmation
        document.getElementById('edit-booking-popup').style.display = 'none';
        document.getElementById('edit-booking-overlay').style.display = 'none';
        alert('Booking has been saved.');

        // Optionally, show the Manage Bookings popup again after saving
        document.getElementById('manage-bookings-popup').style.display = 'block';
        document.getElementById('manage-bookings-overlay').style.display = 'block';
    };

        // Cross button to close the Edit Booking popup and return to Manage Bookings popup
        document.querySelector('#edit-booking-popup .popup-close').onclick = function() {
        document.getElementById('edit-booking-popup').style.display = 'none';
        document.getElementById('edit-booking-overlay').style.display = 'none';

        // Show Manage Bookings popup again
        document.getElementById('manage-bookings-popup').style.display = 'block';
        document.getElementById('manage-bookings-overlay').style.display = 'block';
    };
}

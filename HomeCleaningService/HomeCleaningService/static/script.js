function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

setInterval(updateClock, 1000);
updateClock();

function showPopup() {
    document.getElementById('booking-popup').style.display = 'block';
    document.getElementById('manage-bookings-popup').style.display = 'none'; // Ensure this popup is hidden when opening another
}

function hidePopup() {
    document.getElementById('booking-popup').style.display = 'none';
}

function showManageBookingsPopup() {
    document.getElementById('manage-bookings-popup').style.display = 'block';
    document.getElementById('booking-popup').style.display = 'none'; // Ensure this popup is hidden when opening another
}

function hideManageBookingsPopup() {
    document.getElementById('manage-bookings-popup').style.display = 'none';
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
        const tbody = document.querySelector('.section table tbody');
        const noBookingsRow = document.querySelector('.no-bookings');
        if (noBookingsRow) {
            noBookingsRow.remove();
        }
        tbody.innerHTML += bookingRow;
        hidePopup();
        alert('Booking made successfully!');
    } else {
        alert('Please fill in both fields.');
    }
}

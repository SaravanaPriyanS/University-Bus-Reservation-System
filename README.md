# University-Bus-Reservation-System
A responsive University Bus Reservation system built with Vanilla JS and Tailwind CSS. Features interactive seat selection, PDF/CSV export, and local storage.
🚌 University Bus Reservation System
A single-page, fully responsive web application for booking university bus seats. This project is built with pure Vanilla JavaScript and Tailwind CSS, focusing on a clean UI and practical features like dynamic scheduling and ticket exporting.

The application is self-contained in a single index.html file, making it extremely portable and easy to use.

✨ Features
Interactive Seat Selection: A visual, clickable grid to select available seats. Booked seats are locked, and the user's selection is highlighted.

Dynamic Timings: Bus timings automatically update based on the user's selected department.

Responsive Design: A mobile-first design that looks great on all devices, complete with a collapsible mobile menu.

Booking Management: View all current bookings in a clean, organized table.

Data Export:

Download CSV: Export a list of all bookings as a .csv file.

Download PDF: Generate a PDF summary of all bookings or individual tickets using jsPDF.

Persistent Data: Bookings are saved to the browser's Local Storage, so data isn't lost on refresh.

Modern Alerts: Uses SweetAlert2 for clean, user-friendly notifications (e.g., success, error, confirmation).

🚀 How to Use
No build step or server is required.

Clone this repository:

Bash

git clone https://github.com/your-username/unibus-reserve.git
Navigate to the directory:

Bash

cd unibus-reserve
Open the UBR.html (or index.html) file directly in your web browser.

That's it! You can start booking seats immediately.

🛠️ Technologies Used
HTML5: Semantic markup for the application structure.

Tailwind CSS (via CDN): A utility-first CSS framework for rapid UI development.

Vanilla JavaScript (ES6+): Handles all logic, including:

DOM manipulation

Event handling

Seat grid generation

Form validation

Local Storage management

Libraries (via CDN):

Font Awesome: For all icons.

SweetAlert2: For beautiful, responsive alerts.

jsPDF: For client-side PDF generation.

Credits
Developed by Saravana Priyan as a project to demonstrate modern frontend development using minimal dependencies.

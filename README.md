# ubonow

**An integrated university scheduling system streamlining study room and gym reservations, coupled with AI-driven recommendations for the least crowded lunch hours, enhancing overall campus efficiency.**

## Features

### Login/Register

- **Registration Process:**
  - Registration includes client and server-side verification.
  - Javascript deactivation doesn't hinder the verification process.
  - Limited registration to university domains to ensure only students can register.
  - Password complexity check is enforced during registration.

- **Security Measures:**
  - Passwords are securely encrypted using `password_hash($password, PASSWORD_DEFAULT)` before being stored in the database.
  - Upon registration, a confirmation token is generated and sent to the user's email for account verification.

- **User Authentication:**
  - Verified users can log in to access the system.

- **Session Management:**
  - PHP sessions are employed on all pages to enhance security.
  - Users not logged in will be redirected to the login page, ensuring access control across the application.

![Ubonow Login](/assets/Github/login.png)
![Ubonow Register](/assets/Github/register.png)

### Dashboard (Inicio/Home)

- **Personalized Overview:**
  - Dashboard presents a tailored overview, showcasing essential information:
    - Upcoming class details.
    - Optimal lunch window based on least crowded times.
    - Displays a graphical representation of the day's calendar, featuring reservations, lunch windows, and class schedules.
  
        
  ![Ubonow Dashboard](/assets/Github/dashboard.png)
  
### Schedule (Horario)

- **Class Management:**
  - View, add, or remove classes in a centralized schedule page.
  - Option to request a lunch window time directly from the schedule page.
  - The class time block structure is inspired by [a previous personal project](previous_personal_project_link).

  - **Task Management:**
    - Integrates a versatile task management system with the function `addTask(startTime, endTime, taskName, dayIndex, className)`.
    - Ensures readability by handling task collisions gracefully—colliding tasks automatically adjust for optimal visibility.

  - **Lunch Time Optimization:**
    - Users can request the optimal lunchtime by clicking the "Almuerzo" button, initiating a modal.
    - The system intelligently considers:
      - Student schedules to prevent lunch windows during class hours.
      - User-defined preferences for specific days of the week.
    - You can find the AI pyhton file on the "AI" folder, it was being hosted on a external flusk server.

![Ubonow Schedule](/assets/Github/schedule.png)

### Reservation (Reserva)

- **Reservation Options:**
  - Two reservation options available: study room or gym hour.
  - Displays current reservations with the ability to cancel them.

- **Straightforward Reservation Process:**
  - Making a reservation is user-friendly—simply click on the desired reservation type (study room or gym), choose the location, day, and hour.

<p align="center">
  <img src="/assets/Github/reservation.gif" alt="reservation">
</p>

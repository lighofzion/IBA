document.addEventListener("DOMContentLoaded", function () {
  const calendarDays = document.getElementById("calendarDays");
  const currentMonthElement = document.getElementById("currentMonth");
  const prevMonthBtn = document.getElementById("prevMonth");
  const nextMonthBtn = document.getElementById("nextMonth");
  const eventList = document.getElementById("eventList");

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  // Event data
  const events = [
    { date: new Date(2025, 2, 6), title: "Revelation Seminar" },
    { date: new Date(2025, 2, 20), title: "International Bible Seminar" },
    { date: new Date(2025, 2, 26), title: "Revelation Seminar" },
    { date: new Date(2025, 2, 28), title: "Revelation Seminar" },
    { date: new Date(2025, 3, 3), title: "Bible Study Workshop" },
    { date: new Date(2025, 3, 10), title: "Prayer Meeting" },
    { date: new Date(2025, 3, 17), title: "Pastoral Leadership Training" },
  ];

  // Generate calendar
  function generateCalendar(month, year) {
    // Clear previous calendar
    calendarDays.innerHTML = "";

    // Set the current month and year display
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week the first day falls on (0 = Sunday, 1 = Monday, etc.)
    // Convert Sunday (0) to position 7, and shift all other days down by 1
    let firstDayIndex = firstDay.getDay();
    firstDayIndex = firstDayIndex === 0 ? 7 : firstDayIndex;
    firstDayIndex -= 1; // Make Monday (1) into position 0

    // Calculate days from previous month
    const prevMonthDays = firstDayIndex;
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Calculate days from next month
    const daysInMonth = lastDay.getDate();
    const totalCells = Math.ceil((daysInMonth + prevMonthDays) / 7) * 7;
    const nextMonthDays = totalCells - (daysInMonth + prevMonthDays);

    // Add days from previous month
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const dayElement = document.createElement("div");
      dayElement.className = "day other-month";
      dayElement.textContent = dayNum;
      calendarDays.appendChild(dayElement);
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = i;

      // Check if the date is today
      const today = new Date();
      if (
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dayElement.classList.add("current-day");
      }

      // Check if the date has an event
      const dateStr = `${year}-${month + 1}-${i}`;
      const hasEvent = events.some((event) => {
        return (
          event.date.getDate() === i &&
          event.date.getMonth() === month &&
          event.date.getFullYear() === year
        );
      });

      if (hasEvent) {
        dayElement.classList.add("event");

        // Add click event to show event details
        dayElement.addEventListener("click", function () {
          // Remove selected class from all days
          document.querySelectorAll(".day").forEach((day) => {
            day.classList.remove("selected");
          });

          // Add selected class to clicked day
          this.classList.add("selected");

          // Filter events for this day
          const dayEvents = events.filter((event) => {
            return (
              event.date.getDate() === i &&
              event.date.getMonth() === month &&
              event.date.getFullYear() === year
            );
          });

          // Update event list
          updateEventList(dayEvents);
        });
      }

      calendarDays.appendChild(dayElement);
    }

    // Add days from next month
    for (let i = 1; i <= nextMonthDays; i++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day other-month";
      dayElement.textContent = i;
      calendarDays.appendChild(dayElement);
    }

    // Update upcoming events list
    updateUpcomingEvents();
  }

  // Update upcoming events list
  function updateUpcomingEvents() {
    // Clear previous events
    eventList.innerHTML = "";

    // Get all events for current and future months
    const upcomingEvents = events
      .filter((event) => {
        return event.date >= new Date(currentYear, currentMonth, 1);
      })
      .sort((a, b) => a.date - b.date);

    // Show the next 5 events
    const eventsToShow = upcomingEvents.slice(0, 5);

    // Create event items
    eventsToShow.forEach((event) => {
      const eventItem = document.createElement("div");
      eventItem.className = "event-item";

      const formattedDate = `${String(event.date.getDate()).padStart(2, "0")} ${
        [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][event.date.getMonth()]
      } '${String(event.date.getFullYear()).slice(-2)}`;

      eventItem.innerHTML = `
          <div class="event-date">${formattedDate}</div>
          <div class="event-title">${event.title}</div>
        `;

      eventList.appendChild(eventItem);
    });

    // If no events, show message
    if (eventsToShow.length === 0) {
      const noEvents = document.createElement("div");
      noEvents.className = "event-item";
      noEvents.innerHTML = '<div class="event-title">No upcoming events</div>';
      eventList.appendChild(noEvents);
    }
  }

  // Update event list for selected day
  function updateEventList(dayEvents) {
    // Clear previous events
    eventList.innerHTML = "";

    if (dayEvents.length > 0) {
      // Create event items
      dayEvents.forEach((event) => {
        const eventItem = document.createElement("div");
        eventItem.className = "event-item";

        const formattedDate = `${String(event.date.getDate()).padStart(
          2,
          "0"
        )} ${
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][event.date.getMonth()]
        } '${String(event.date.getFullYear()).slice(-2)}`;

        eventItem.innerHTML = `
            <div class="event-date">${formattedDate}</div>
            <div class="event-title">${event.title}</div>
          `;

        eventList.appendChild(eventItem);
      });
    } else {
      updateUpcomingEvents();
    }
  }

  // Previous month button
  prevMonthBtn.addEventListener("click", function () {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
  });

  // Next month button
  nextMonthBtn.addEventListener("click", function () {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
  });

  // Initialize calendar
  generateCalendar(currentMonth, currentYear);
});

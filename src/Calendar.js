  import React, { useState, useEffect } from 'react';
  import './Calendar.css'; 
  import EventDetailsModal from './EventDetailsModal';
  import axios from 'axios'

  function Calendar({ calendarKey }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const goToPreviousMonth = () => {
      setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
      setCurrentMonth(prevMonth => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1));
    };

    const getRowAndColumn = (day) => {
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
      const row = Math.floor((day + firstDayOfMonth - 1) / 7); // Calculate the row
      const column = (day + firstDayOfMonth - 1) % 7; // Calculate the column
      return { row: row, col: column };
    };

    const calculateTopPosition = (startDate) => {
      const date = new Date(startDate);
      return 176 + getRowAndColumn(date.getDate()).row * 112
    };

    const calculateLeftPosition = (startDate) => {
      const date = new Date(startDate);
      return 367 + getRowAndColumn(date.getDate()).col * 162
    };

    const handleEventClick = (event) => {
      setSelectedEvent(event);
    };

    useEffect(() => {
      const fetchEvents = async (month, year) => {
        try {
          const response = await axios.get('http://localhost:8080/calendar/getEvents', {
            params: {
              month: month + 1,
              year: year
            }
          });
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      };
      fetchEvents(currentMonth.getMonth(), currentMonth.getFullYear())
    }, [calendarKey, currentMonth])

    const monthOptions = { month: 'long', year: 'numeric' };
    const formattedMonth = currentMonth.toLocaleDateString(undefined, monthOptions);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const gridData = [];
    let currentDay = 1 - firstDayOfMonth; // Adjust the starting day of the grid
    
    for (let i = 0; i < 6; i++) { // Extend the loop to cover up to 6 weeks
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (currentDay <= 0 || currentDay > daysInMonth) {
          week.push({
            day: '',
            class: 'other-month' // Mark days from previous and next months as 'other-month'
          });
        } else {
          week.push({
            day: currentDay,
            class: ''
          });
        }
        currentDay++;
      }
      gridData.push(week);
    }
    
    return (
      <div className="calendar">
        <div className="month-nav">
          <button className="nav-btn" onClick={goToPreviousMonth}>&lt;</button>
          <span className="month-name">{formattedMonth}</span>
          <button className="nav-btn" onClick={goToNextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {daysOfWeek.map(day => (
            <div key={day} className={`grid-cell day-heading`}>{day}</div>
          ))}
          {gridData.map((week, index) => (
            week.map((day, idx) => (
              <div key={idx} className={`grid-cell ${day.class}`}>{day.day}</div>
            ))
          ))}
        </div>
        {events.map(event => (
        <div
          key={event.id}
          className="event-bar"
          onClick={() => handleEventClick(event)}
          style={{
            top: `${calculateTopPosition(event.startTime)}px`,
            left: `${calculateLeftPosition(event.startTime)}px`
          }}
          >
          {event.title}
        </div>
      ))}
      {selectedEvent && (
            <EventDetailsModal event={selectedEvent} onClose={() => {
              setSelectedEvent(null)
            }} />
          )}
      </div>
    );
  }

  export default Calendar;

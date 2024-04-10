import React, { useState, useEffect } from 'react';
import './EventDetailsModal.css';
import axios from 'axios';

function EventDetailsModal({ event, onClose }) {
  const handleClose = () => {
    onClose();
  };

  const [attendees, setAttendees] = useState([])
  const { title, startTime, endTime, location, description } = event;

  const formattedStartTime = new Date(startTime).toLocaleString();
  const formattedEndTime = new Date(endTime).toLocaleString();  

  useEffect(() => {
    const fetchAttendees = async (event) => {
      try {
        const response = await axios.get('http://localhost:8080/calendar/getEventAttendees', {
          params: {
            eventId: event.id
          }
        });
        setAttendees(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchAttendees(event);
  }, [event]);
  
  console.log(attendees);

  return (
    <div className="modal-overlay">
      <div className="event-details-modal">
        <div className="event-details-header">
          <h2>Event Details</h2>
          <span className="close-btn" onClick={handleClose}>&times;</span>
        </div>
        <div className="event-details-content">
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Start Time:</strong> {formattedStartTime}</p>
          <p><strong>End Time:</strong> {formattedEndTime}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Attendees:</strong></p>
          <ul style={{ marginTop: '0' }}>
            {attendees.map((attendee) => (
              <li key={attendee.id} style={{ marginLeft: '20px' }}>
                {attendee.firstName} {attendee.lastName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}  
export default EventDetailsModal;

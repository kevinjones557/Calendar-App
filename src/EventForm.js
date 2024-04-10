import React, { useEffect, useState } from 'react';
import './EventForm.css';
import axios from 'axios';

function EventForm({ onClose, onSave }) {
  // Hardcoded list of users
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [errors, setErrors] = useState({
    title: false,
    startTime: false,
    endTime: false,
    location: false,
    description: false
  });

  useEffect(() => {
    async function fetchData() {
      await axios.get('http://localhost:8080/calendar/allUsers')
      .then(response => {
        setUsers(response.data);
      })
    }
    fetchData()
  }, []);

  const handleSave = () => {
    if (title.trim() === '' || startTime.trim() === '' || endTime.trim() === '' || location.trim() === '') {
      setErrors({
        title: title.trim() === '',
        startTime: startTime.trim() === '',
        endTime: endTime.trim() === '',
        location: location.trim() === '',
      });
    } else {
      onSave(title, startTime, endTime, location, description, selectedUsers);
      onClose();
    } 
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prevUsers => {
      if (prevUsers.includes(userId)) {
        return prevUsers.filter(id => id !== userId);
      } else {
        return [...prevUsers, userId];
      }
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Event Form</h2>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={errors.title ? 'error' : ''} />
        <input type="datetime-local" placeholder="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={errors.startTime ? 'error' : ''} />
        <input type="datetime-local" placeholder="End Time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={errors.endTime ? 'error' : ''} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className={errors.location ? 'error' : ''} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className={errors.description ? 'error' : ''}></textarea>
        <div>
          <h3>Attendees</h3>
          <div className="user-list-container">
          {users.map(user => (
            <div key={user.id} className="user-listing">
              <label>
                <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleUserToggle(user.id)} />
                <span>{user.firstName} {user.lastName}</span>
              </label>
            </div>
          ))}
        </div>
        </div>
        <div className="button-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EventForm;

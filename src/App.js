import React, { useState } from 'react';
import './App.css';
import Calendar from './Calendar';
import NameForm from './NameForm'; // Import the NameForm component
import EventForm from './EventForm'; // Import the EventForm component
import EditForm from './EditForm'; // Import the EventForm component

import axios from 'axios';

function App() {
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [calendarKey, setCalendarKey] = useState(0);

  const handleOpenEvent = () => {
    setIsEventOpen(true);
  };

  const handleCloseEvent = () => {
    setIsEventOpen(false);
  };

  const handleSaveEvent = async (title, startTime, endTime, location, description, attendees) => {
    try {
      const dataToSend = {
          title: title,
          startTime: startTime,
          endTime: endTime,
          location: location,
          description: description,
          attendees: attendees
      };
      await axios.post('http://localhost:8080/calendar/event/add', dataToSend);
      setCalendarKey(prevKey => prevKey + 1);
    } catch (error) {
      console.error('Error saving event:', error);
      console.log('Request Headers:', error.request.headers);
    }
    handleCloseEvent();
  };

  const handleOpenName = () => {
    setIsNameOpen(true);
  };

  const handleCloseName = () => {
    setIsNameOpen(false);
  };

  const handleSaveName = async (fN, lN, uN) => {
    const user ={
      firstName: fN,
      lastName: lN,
      username: uN,
    }
    try {
      await axios.post('http://localhost:8080/calendar/user/add', user);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.includes('Username is already taken')) {
        alert('Username is already taken');
      } else {
        console.error('Error saving user:', error);
      }
    }
    handleCloseName(); 
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.post(`http://localhost:8080/calendar/users`, usernameInput);
        const user_temp = await response.data;
        if (!user_temp) {
          alert("User does not exist");
          setUser(null)
        }
        else {
          console.log(user_temp)
          setUser(user_temp);
        }
        setUsernameInput('');
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    }
  };

  const handleEditDelete = async () => {
    try {
      // Send the delete request to the server
      const response = await axios.delete(`http://localhost:8080/calendar/deleteuser/${user.id}`);
      
      // Check if the request was successful (status code 200)
      if (response.status === 200) {
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  }

  const handleEditSave = async (uN, fN, lN) => {
    const updatedUserData = {
      username: uN,
      firstName: fN,
      lastName: lN,
    };
    
    axios.put(`http://localhost:8080/calendar/updateuser/${user.id}`, updatedUserData)
      .then(response => {
          console.log("User updated successfully");
      })
      .catch(error => {
          if (error.response && error.response.status === 400) {
              // Username already exists, display alert
              alert(error.response.data);
          } else {
              console.error("Error updating user:", error);
          }
      });
  }

  return (
    <div className="app">
      <div className="sidebar">
        <button className="sidebar-button" onClick={handleOpenName}>Add User</button>
        {isNameOpen && (
          <NameForm onClose={handleCloseName} onSave={handleSaveName} />
        )}
        <button className="sidebar-button" onClick={handleOpenEvent}>Add Event</button>
        {isEventOpen && (
          <EventForm onClose={handleCloseEvent} onSave={handleSaveEvent} />
        )}
        {user && (
          <EditForm 
            currentUsername={user.username} 
            currentFirstName={user.firstName} 
            currentLastName={user.lastName} 
            onSave={handleEditSave} 
            onDelete={handleEditDelete} 
            onClose={() => setUser(null)} 
          />
        )}
        <input
          type="text"a
          placeholder="Enter username to edit or delete"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="main-content">
        <Calendar calendarKey={calendarKey} />
      </div>
    </div>
  );
}  

export default App;

// NameForm.js
import React, { useState } from 'react';
import './NameForm.css';

function NameForm({ onClose, onSave }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    username: false
  });

  const handleSave = () => {
    if (firstName.trim() === '' || lastName.trim() === '' || username.trim() === '') {
      setErrors({
        firstName: firstName.trim() === '',
        lastName: lastName.trim() === '',
        username: username.trim() === ''
      });
    } else {
      onSave(firstName, lastName, username);
      setFirstName('');
      setLastName('');
      setUsername('');
      onClose();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Enter Name</h2>        
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className={errors.username ? 'error' : ''} />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={errors.firstName ? 'error' : ''} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={errors.lastName ? 'error' : ''} />
        <div className="button-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default NameForm;

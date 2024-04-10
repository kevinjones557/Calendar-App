import React, { useState } from 'react';
import './NameForm.css';

function EditForm({ currentUsername, currentFirstName, currentLastName, onClose, onSave, onDelete }) {
  const [firstName, setFirstName] = useState(currentFirstName || '');
  const [lastName, setLastName] = useState(currentLastName || '');
  const [username, setUsername] = useState(currentUsername || '');
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
      onSave(username, firstName, lastName);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(currentUsername);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit User</h2>        
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className={errors.username ? 'error' : ''} />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={errors.firstName ? 'error' : ''} />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className={errors.lastName ? 'error' : ''} />
        <div className="button-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditForm;

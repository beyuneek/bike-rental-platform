import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import "../styles/CreateTicket.scss";


const CreateTicket = () => {
  const userId = useSelector(state => state.user._id);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/support/${userId}/createticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          description,
        }),
      });
      if (response.ok) {
        alert('Ticket created successfully');
        navigate("/"); // Navigate to homepage after successful creation
      } else {
        const data = await response.json();
        alert(`Failed to create ticket: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-ticket-container">
        <div className="card">
          <h1>Create New Support Ticket</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <button type="submit">Submit Ticket</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTicket;

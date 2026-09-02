import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../styles/ViewTicket.scss";

const ViewTicket = () => {
  const { ticketId } = useParams();
  const userId = useSelector(state => state.user._id);
  const [user, setUser] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:3001/support/tickets/${ticketId}`);
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/profile`, {
          method: 'GET'
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchTicket(), fetchUserProfile()]);
      setLoading(false);
    };

    fetchData();
  }, [ticketId]);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/support/tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          response: responseText,
        }),
      });
      if (response.ok) {
        alert('Response submitted successfully');
        window.location.reload(); // Reload the page after successful submission
      } else {
        const data = await response.json();
        alert(`Failed to submit response: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again later.');
    }
  };


  const handleCloseTicket = async () => {
    try {
      const response = await fetch(`http://localhost:3001/support/tickets/${ticketId}/close`, {
        method: 'PATCH',
      });
      if (response.ok) {
        alert('Ticket closed successfully');
        window.location.reload(); // Reload the page after successful closure
      } else {
        const data = await response.json();
        alert(`Failed to close ticket: ${data.message}`);
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
      alert('Failed to close ticket. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="view-ticket-container">
        <h1>View Ticket</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Subject: {ticket.subject}</p>
            <p>Description: {ticket.description}</p>
            <div className="status-wrapper">
              <p>Status: </p>
              <button className={`status-button status-${ticket.status.toLowerCase()}`} disabled>{ticket.status.toUpperCase()}</button>
            </div>
            <p>Responses:</p>
            <ul>
              {ticket.responses.map(response => (
                <li key={response._id}>
                  <p>Response: {response.response}</p>
                  <p>Support Agent: {response.supportAgent}</p>
                  <p>Created At: {new Date(response.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            {user.isSupportStaff && ticket.status !== 'resolved' && (
              <div>
                <form onSubmit={handleSubmitResponse}>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your response"
                    required
                  />
                  <button type="submit">Submit Response</button>
                </form>
                <button onClick={handleCloseTicket}>Close Ticket</button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewTicket;

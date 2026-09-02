import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import "../styles/MyTickets.scss";

const MyTickets = () => {
  const userId = useSelector(state => state.user._id);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:3001/support/${userId}/tickets?page=${currentPage}`);
        const data = await response.json();
        setTickets(data.docs);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId, currentPage]);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <>
      <Navbar />
      <div className="my-tickets-container">
        <div className="card">
          <h1>My Tickets</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {tickets && tickets.length > 0 ? ( // Check if tickets array is not undefined and not empty
                <>
                  <ul>
                    {tickets.map(ticket => (
                      <li key={ticket._id}>
                        <p>Subject: {ticket.subject}</p>
                        <p>Description: {ticket.description}</p>
                        <div className="status-wrapper">
                          <p>Status: </p>
                          <button className={`status-button status-${ticket.status.toLowerCase()}`} disabled>{ticket.status}</button>
                        </div>
                        <Link to={`/${ticket._id}/viewticket`}>
                          <button className="view-ticket-button">View Ticket</button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                    <span>{currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                  </div>
                </>
              ) : (
                <p>No tickets found.</p> // Render message when tickets array is empty or undefined
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyTickets;

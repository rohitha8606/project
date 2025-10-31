import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Demo002() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const bills = [
    { _id: 'b1', amount: 850, dueDate: new Date(), status: 'unpaid' },
    { _id: 'b2', amount: 720, dueDate: new Date(Date.now() - 86400000 * 30), status: 'paid' },
  ];

  const payments = [
    { _id: 'p1', amount: 720, date: new Date(Date.now() - 86400000 * 15), status: 'success' },
    { _id: 'p2', amount: 690, date: new Date(Date.now() - 86400000 * 45), status: 'success' },
  ];

  return (
    <div>
      <header>
        <div className="header-left">
          <button onClick={toggleSidebar} className="menu-button">☰</button>
          <h1>APCPDCL - Demo Customer Portal</h1>
        </div>
        <nav>
          <ul>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
        </nav>
      </header>

      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <button onClick={toggleSidebar} className="close-button">×</button>
          </div>
          <div className="sidebar-content">
            <button onClick={() => navigate('/complaint-registration')}>Register Complaint</button>
            <button onClick={() => navigate('/service-request')}>Service Request</button>
            <button onClick={() => navigate('/news-announcements')}>News & Announcements</button>
            <button onClick={() => navigate('/contact-us')}>Contact Us</button>
            <button onClick={() => navigate('/faq')}>FAQ</button>
          </div>
        </div>
      )}

      <div className="container">
        <h1>Customer Dashboard (Demo)</h1>

        <h2>Your Bills</h2>
        <ul>
          {bills.map(bill => (
            <li key={bill._id}>
              <strong>Amount:</strong> ₹{bill.amount}<br />
              <strong>Due Date:</strong> {new Date(bill.dueDate).toLocaleDateString()}<br />
              <strong>Status:</strong> {bill.status}
              {bill.status === 'unpaid' && (
                <button onClick={() => navigate(`/pay-bill/${bill._id}`)} className="pay-now-button">Pay Now</button>
              )}
            </li>
          ))}
        </ul>

        <h2>Payment History</h2>
        <ul>
          {payments.map(payment => (
            <li key={payment._id}>
              <strong>Amount:</strong> ₹{payment.amount}<br />
              <strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}<br />
              <strong>Status:</strong> {payment.status}
            </li>
          ))}
        </ul>

        <h2>Actions</h2>
        <button onClick={() => navigate('/pay-bill/1')} className="pay-bill-button">Pay Bill</button>
      </div>
    </div>
  );
}

export default Demo002;

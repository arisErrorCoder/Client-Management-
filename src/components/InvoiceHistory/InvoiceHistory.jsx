import React, { useState } from 'react';
import './InvoiceHistory.css';

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2023-1058',
      client: 'Acme Corp',
      date: '2023-05-15',
      dueDate: '2023-05-22',
      amount: 3200.00,
      status: 'paid',
      items: [
        { description: 'Website Redesign', quantity: 1, rate: 2500 },
        { description: 'Hosting Setup', quantity: 1, rate: 700 }
      ]
    },
    {
      id: 'INV-2023-1057',
      client: 'Globex Corporation',
      date: '2023-05-10',
      dueDate: '2023-05-17',
      amount: 5750.00,
      status: 'pending',
      items: [
        { description: 'Enterprise Solution', quantity: 1, rate: 5000 },
        { description: 'Consulting', quantity: 5, rate: 150 }
      ]
    },
    {
      id: 'INV-2023-1056',
      client: 'Initech',
      date: '2023-05-05',
      dueDate: '2023-05-12',
      amount: 1495.00,
      status: 'overdue',
      items: [
        { description: 'Software License', quantity: 5, rate: 299 }
      ]
    }
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || invoice.status === filter;
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseDetails = () => {
    setSelectedInvoice(null);
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
    ));
  };

  const handleDeleteInvoice = (invoiceId) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice(null);
    }
  };

  return (
    <div className="invoice-history-container">
      <div className="invoice-history-header">
        <h2 className="invoice-history-title">Invoice History</h2>
        <div className="invoice-history-controls">
          <div className="invoice-history-search">
            <input
              type="text"
              placeholder="Search clients or invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <select 
            className="invoice-history-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="invoice-history-list">
        <table className="invoice-history-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} className={`invoice-history-row status-${invoice.status}`}>
                <td>{invoice.id}</td>
                <td>{invoice.client}</td>
                <td>{new Date(invoice.date).toLocaleDateString()}</td>
                <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td>${invoice.amount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge status-${invoice.status}`}>
                    {invoice.status}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleViewDetails(invoice)}
                    className="invoice-history-btn view-btn"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDeleteInvoice(invoice.id)}
                    className="invoice-history-btn delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="invoice-history-empty">
            No invoices found matching your criteria
          </div>
        )}
      </div>

      {selectedInvoice && (
        <div className="invoice-history-details-overlay">
          <div className="invoice-history-details">
            <button 
              onClick={handleCloseDetails}
              className="close-details-btn"
            >
              ×
            </button>
            
            <h3 className="details-title">Invoice Details</h3>
            
            <div className="details-header">
              <div className="details-client">
                <h4>{selectedInvoice.client}</h4>
                <p>Invoice #: {selectedInvoice.id}</p>
              </div>
              <div className="details-meta">
                <p>Date: {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                <p>Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                <div className="details-status">
                  <span>Status:</span>
                  <select
                    value={selectedInvoice.status}
                    onChange={(e) => handleStatusChange(selectedInvoice.id, e.target.value)}
                    className={`status-select status-${selectedInvoice.status}`}
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="details-items">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>${item.rate.toFixed(2)}</td>
                      <td>${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="details-totals">
              <div className="totals-grid">
                <span>Subtotal:</span>
                <span>${(selectedInvoice.amount / 1.1).toFixed(2)}</span>
                <span>Tax (10%):</span>
                <span>${(selectedInvoice.amount * 0.1).toFixed(2)}</span>
                <span className="total-label">Total:</span>
                <span className="total-amount">${selectedInvoice.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="details-actions">
              <button className="invoice-history-btn print-btn">Print Invoice</button>
              <button className="invoice-history-btn email-btn">Resend Email</button>
              <button className="invoice-history-btn duplicate-btn">Duplicate Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;
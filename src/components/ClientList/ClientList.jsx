import React, { useState } from 'react';
import { 
  FiSearch, FiFilter, FiUser, FiPhone, FiMail, 
  FiMapPin, FiBriefcase, FiStar, FiEdit2, FiTrash2 
} from 'react-icons/fi';
import './ClientList.css';

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, New York, NY',
      company: 'Johnson & Co',
      type: 'premium',
      lastContact: '2023-05-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Boston, MA',
      company: 'Tech Solutions Inc',
      type: 'regular',
      lastContact: '2023-05-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '(555) 456-7890',
      address: '789 Pine Rd, Chicago, IL',
      company: 'Creative Designs LLC',
      type: 'premium',
      lastContact: '2023-04-28',
      status: 'inactive'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '(555) 789-0123',
      address: '321 Elm Blvd, San Francisco, CA',
      company: 'Wilson Enterprises',
      type: 'regular',
      lastContact: '2023-05-18',
      status: 'active'
    },
    {
      id: 5,
      name: 'Jessica Kim',
      email: 'jessica@example.com',
      phone: '(555) 234-5678',
      address: '654 Cedar Ln, Seattle, WA',
      company: 'Northwest Consulting',
      type: 'vip',
      lastContact: '2023-05-20',
      status: 'active'
    },
    {
      id: 6,
      name: 'Robert Taylor',
      email: 'robert@example.com',
      phone: '(555) 876-5432',
      address: '987 Birch Dr, Austin, TX',
      company: 'Taylor & Sons',
      type: 'regular',
      lastContact: '2023-03-15',
      status: 'inactive'
    }
  ]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && client.status === 'active') || 
                         (filter === 'inactive' && client.status === 'inactive') ||
                         (filter === 'premium' && client.type === 'premium') ||
                         (filter === 'vip' && client.type === 'vip');
    return matchesSearch && matchesFilter;
  });

  const toggleClientStatus = (id) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, status: client.status === 'active' ? 'inactive' : 'active' } : client
    ));
  };

  const deleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  return (
    <div className="client-list-container">
      <div className="client-list-header">
        <h1 className="client-list-title">Client Directory</h1>
        <p className="client-list-subtitle">Manage your client relationships</p>
      </div>

      <div className="client-list-controls">
        <div className="client-list-search">
          <FiSearch className="client-list-search-icon" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="client-list-search-input"
          />
        </div>

        <div className="client-list-filter">
          <FiFilter className="client-list-filter-icon" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="client-list-filter-select"
          >
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      <div className="client-list-grid">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div 
              key={client.id} 
              className={`client-list-card ${client.type} ${client.status}`}
            >
              <div className="client-list-card-inner">
                <div className="client-list-card-front">
                  <div className="client-list-card-header">
                    <div className="client-list-card-avatar">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="client-list-card-name">
                      <h3>{client.name}</h3>
                      <span className={`client-list-card-badge ${client.type}`}>
                        {client.type === 'vip' ? 'VIP' : client.type === 'premium' ? 'Premium' : 'Standard'}
                      </span>
                    </div>
                  </div>

                  <div className="client-list-card-details">
                    <div className="client-list-card-detail">
                      <FiBriefcase className="client-list-card-icon" />
                      <span>{client.company}</span>
                    </div>
                    <div className="client-list-card-detail">
                      <FiMail className="client-list-card-icon" />
                      <span>{client.email}</span>
                    </div>
                    <div className="client-list-card-detail">
                      <FiPhone className="client-list-card-icon" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="client-list-card-detail">
                      <FiMapPin className="client-list-card-icon" />
                      <span>{client.address}</span>
                    </div>
                  </div>

                  <div className="client-list-card-footer">
                    <span className="client-list-card-date">
                      Last contact: {new Date(client.lastContact).toLocaleDateString()}
                    </span>
                    <span className={`client-list-card-status ${client.status}`}>
                      {client.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="client-list-card-back">
                  <div className="client-list-card-actions">
                    <button className="client-list-card-btn edit">
                      <FiEdit2 /> Edit
                    </button>
                    <button 
                      className={`client-list-card-btn ${client.status === 'active' ? 'deactivate' : 'activate'}`}
                      onClick={() => toggleClientStatus(client.id)}
                    >
                      {client.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      className="client-list-card-btn delete"
                      onClick={() => deleteClient(client.id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                  <div className="client-list-card-notes">
                    <h4>Quick Notes</h4>
                    <p>Add important notes about this client for quick reference.</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="client-list-empty">
            <FiUser className="client-list-empty-icon" />
            <p>No clients found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
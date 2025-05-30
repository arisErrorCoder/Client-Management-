import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLock, faUnlock, faPlus, faSearch, faTimes, faCopy, 
  faChevronDown, faChevronUp, faGlobe, faServer, faDatabase, faKey,
  faBell, faCalendarAlt, faEnvelope, faCog, faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { 
  faInstagram, faFacebook, faTwitter, faLinkedin, faGoogle 
} from '@fortawesome/free-brands-svg-icons';
import './CredentialManager.css';

const CredentialManager = () => {
  // Sample initial data
  const initialClients = [
    {
      id: 1,
      name: 'Acme Corp',
      logo: 'AC',
      color: '#4e79a7',
      credentials: [
        {
          id: 101,
          type: 'instagram',
          username: 'acme_official',
          password: 'acme@1234',
          domain: 'instagram.com/acme_official',
          notes: 'Marketing account',
          createdAt: '2023-01-15'
        },
        {
          id: 102,
          type: 'domain',
          username: 'admin@acme.com',
          password: 'admin#secure',
          domain: 'acme.com',
          renewalDate: '2023-12-31',
          notes: 'Primary domain - renew annually',
          notificationEnabled: true,
          notifyDaysBefore: 30,
          createdAt: '2023-01-10'
        },
        {
          id: 103,
          type: 'server',
          username: 'root',
          password: 'server$2023',
          domain: 'server.acme.com',
          renewalDate: '2023-06-30',
          notes: 'AWS EC2 instance',
          notificationEnabled: true,
          notifyDaysBefore: 15,
          createdAt: '2023-01-05'
        }
      ]
    },
    {
      id: 2,
      name: 'TechStart',
      logo: 'TS',
      color: '#f28e2b',
      credentials: [
        {
          id: 201,
          type: 'facebook',
          username: 'techstart.social',
          password: 'tech$1234',
          domain: 'facebook.com/techstart',
          notes: 'Social media account',
          createdAt: '2023-02-20'
        }
      ]
    }
  ];

  // State management
  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [newCredential, setNewCredential] = useState({
    type: 'instagram',
    username: '',
    password: '',
    domain: '',
    renewalDate: '',
    notes: '',
    notificationEnabled: false,
    notifyDaysBefore: 30
  });
  const [isLocked, setIsLocked] = useState(true);
  const [accessCode, setAccessCode] = useState('1234');
  const [inputCode, setInputCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedItem, setCopiedItem] = useState(null);
  const [newClientName, setNewClientName] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    email: 'admin@example.com',
    enabled: true,
    daysBefore: 30
  });
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [editingCredential, setEditingCredential] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    const storedClients = JSON.parse(localStorage.getItem('credentialClients')) || initialClients;
    const storedCode = localStorage.getItem('accessCode') || '1234';
    const storedSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {
      email: 'admin@example.com',
      enabled: true,
      daysBefore: 30
    };
    
    setClients(storedClients);
    setAccessCode(storedCode);
    setNotificationSettings(storedSettings);
    
    // Auto-select first client if available
    if (storedClients.length > 0) {
      setSelectedClient(storedClients[0]);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('credentialClients', JSON.stringify(clients));
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [clients, notificationSettings]);

  // Check for upcoming renewals
  useEffect(() => {
    const checkRenewals = () => {
      const today = new Date();
      const renewals = [];
      
      clients.forEach(client => {
        client.credentials.forEach(cred => {
          if (cred.renewalDate) {
            const renewalDate = new Date(cred.renewalDate);
            const diffTime = renewalDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= (cred.notifyDaysBefore || notificationSettings.daysBefore)) {
              renewals.push({
                client: client.name,
                type: cred.type,
                domain: cred.domain,
                renewalDate: cred.renewalDate,
                daysLeft: diffDays,
                credential: cred
              });
            }
          }
        });
      });
      
      setUpcomingRenewals(renewals);
      
      // Send email notifications if enabled and email is set
      if (notificationSettings.enabled && notificationSettings.email && renewals.length > 0) {
        sendEmailNotifications(renewals);
      }
    };
    
    checkRenewals();
    const interval = setInterval(checkRenewals, 24 * 60 * 60 * 1000); // Check daily
    
    return () => clearInterval(interval);
  }, [clients, notificationSettings]);

  const sendEmailNotifications = (renewals) => {
    // In a real app, this would connect to your email service
    console.log('Sending email notifications for renewals:', renewals);
    // Example implementation:
    const subject = `Upcoming renewals (${renewals.length})`;
    const body = `The following items are due for renewal:\n\n${
      renewals.map(item => 
        `- ${item.type.toUpperCase()}: ${item.domain} (Renews in ${item.daysLeft} days on ${item.renewalDate})`
      ).join('\n')
    }\n\nPlease take appropriate action.`;
    
    console.log(`Email to: ${notificationSettings.email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  };

  const handleAddCredential = () => {
    if (!selectedClient) return;
    
    const credentialToAdd = {
      id: Date.now(),
      ...newCredential,
      createdAt: new Date().toISOString()
    };
    
    // Only add renewal fields for domain/server types
    if (!['domain', 'server'].includes(newCredential.type)) {
      delete credentialToAdd.renewalDate;
      delete credentialToAdd.notificationEnabled;
      delete credentialToAdd.notifyDaysBefore;
    }
    
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          credentials: [...client.credentials, credentialToAdd]
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    resetCredentialForm();
    setIsAdding(false);
  };

  const handleUpdateCredential = () => {
    if (!selectedClient || !editingCredential) return;
    
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          credentials: client.credentials.map(cred => 
            cred.id === editingCredential.id ? editingCredential : cred
          )
        };
      }
      return client;
    });
    
    setClients(updatedClients);
    resetCredentialForm();
    setEditingCredential(null);
    setIsAdding(false);
  };

  const handleDeleteCredential = (credentialId) => {
    if (!selectedClient) return;
    
    const updatedClients = clients.map(client => {
      if (client.id === selectedClient.id) {
        return {
          ...client,
          credentials: client.credentials.filter(cred => cred.id !== credentialId)
        };
      }
      return client;
    });
    
    setClients(updatedClients);
  };

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    
    const newClient = {
      id: Date.now(),
      name: newClientName.trim(),
      logo: newClientName.trim().substring(0, 2).toUpperCase(),
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      credentials: []
    };
    
    setClients([...clients, newClient]);
    setNewClientName('');
    setSelectedClient(newClient);
    setIsClientDropdownOpen(false);
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (inputCode === accessCode) {
      setIsLocked(false);
      // Auto-select first client if none selected
      if (clients.length > 0 && !selectedClient) {
        setSelectedClient(clients[0]);
      }
    } else {
      alert('Incorrect access code');
    }
    setInputCode('');
  };

  const copyToClipboard = (text, field, id) => {
    navigator.clipboard.writeText(text);
    setCopiedItem({id, field});
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'instagram': return faInstagram;
      case 'facebook': return faFacebook;
      case 'twitter': return faTwitter;
      case 'linkedin': return faLinkedin;
      case 'google': return faGoogle;
      case 'email': return faEnvelope;
      case 'domain': return faGlobe;
      case 'server': return faServer;
      case 'database': return faDatabase;
      default: return faKey;
    }
  };

  const getRenewalStatus = (renewalDate) => {
    if (!renewalDate) return null;
    
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'expired';
    if (diffDays <= 7) return 'urgent';
    if (diffDays <= 30) return 'warning';
    return 'ok';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'expired': return '#ff6b6b';
      case 'urgent': return '#ffa502';
      case 'warning': return '#ffeaa7';
      default: return '#55efc4';
    }
  };

  const resetCredentialForm = () => {
    setNewCredential({
      type: 'instagram',
      username: '',
      password: '',
      domain: '',
      renewalDate: '',
      notes: '',
      notificationEnabled: false,
      notifyDaysBefore: 30
    });
  };

  const startEditCredential = (credential) => {
    setEditingCredential(credential);
    setNewCredential({
      type: credential.type,
      username: credential.username,
      password: credential.password,
      domain: credential.domain,
      renewalDate: credential.renewalDate || '',
      notes: credential.notes || '',
      notificationEnabled: credential.notificationEnabled || false,
      notifyDaysBefore: credential.notifyDaysBefore || 30
    });
    setIsAdding(true);
  };

  const filteredCredentials = selectedClient 
    ? selectedClient.credentials.filter(cred => 
        cred.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cred.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cred.domain && cred.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cred.notes && cred.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (isLocked) {
    return (
      <div className="credential-manager-lock-screen">
        <div className="credential-lock-container">
          <div className="credential-lock-icon">
            <FontAwesomeIcon icon={faLock} size="3x" />
          </div>
          <h2 className="credential-lock-title">Credential Vault</h2>
          <p className="credential-lock-subtitle">Enter 4-digit code to access</p>
          <form onSubmit={handleUnlock} className="credential-code-form">
            <input
              type="password"
              maxLength="4"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="credential-code-input"
              pattern="\d{4}"
              required
              autoFocus
            />
            <button type="submit" className="credential-unlock-button">
              <FontAwesomeIcon icon={faUnlock} /> Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="credential-manager-container">
      <header className="credential-manager-header">
        <h1 className="credential-manager-title">
          <FontAwesomeIcon icon={faKey} /> Credential Vault
        </h1>
        <div className="header-actions">
          <button 
            className="notification-button"
            onClick={() => setShowNotificationSettings(!showNotificationSettings)}
            title="Notification Settings"
          >
            <FontAwesomeIcon icon={faBell} />
            {upcomingRenewals.length > 0 && (
              <span className="notification-badge">{upcomingRenewals.length}</span>
            )}
          </button>
          <button 
            className="credential-manager-lock-button"
            onClick={() => setIsLocked(true)}
            title="Lock Vault"
          >
            <FontAwesomeIcon icon={faLock} /> Lock
          </button>
        </div>
      </header>

      {showNotificationSettings && (
        <div className="notification-settings-panel">
          <div className="panel-header">
            <h3>Notification Settings</h3>
            <button 
              className="panel-close-button"
              onClick={() => setShowNotificationSettings(false)}
              title="Close"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="settings-form">
            <div className="form-group">
              <label>Email Notifications</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  checked={notificationSettings.enabled}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    enabled: e.target.checked
                  })}
                />
                <label htmlFor="notificationsEnabled" className="toggle-label"></label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Notification Email</label>
              <input
                type="email"
                value={notificationSettings.email}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  email: e.target.value
                })}
                placeholder="your@email.com"
              />
            </div>
            
            <div className="form-group">
              <label>Default Days Before Renewal</label>
              <select
                value={notificationSettings.daysBefore}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  daysBefore: parseInt(e.target.value)
                })}
              >
                <option value="7">7 days</option>
                <option value="15">15 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            
            {upcomingRenewals.length > 0 && (
              <div className="upcoming-renewals">
                <h4>Upcoming Renewals ({upcomingRenewals.length})</h4>
                <ul>
                  {upcomingRenewals.map((item, index) => (
                    <li key={index}>
                      <span className="renewal-client">{item.client}</span>
                      <span className="renewal-type">{item.type}</span>
                      <span className="renewal-domain">{item.domain}</span>
                      <span className={`renewal-date ${item.daysLeft <= 0 ? 'expired' : ''}`}>
                        {item.daysLeft <= 0 ? 'EXPIRED' : `Due in ${item.daysLeft} days`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="credential-client-selector">
        <div className="credential-client-dropdown">
          <button 
            className="credential-client-dropdown-toggle"
            onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
          >
            <div className="client-avatar" style={{ backgroundColor: selectedClient?.color }}>
              {selectedClient ? selectedClient.logo : '?'}
            </div>
            <span className="client-name">
              {selectedClient ? selectedClient.name : 'Select Client'}
            </span>
            <FontAwesomeIcon 
              icon={isClientDropdownOpen ? faChevronUp : faChevronDown} 
              className="dropdown-chevron"
            />
          </button>
          
          {isClientDropdownOpen && (
            <div className="credential-client-dropdown-menu">
              <div className="add-client-input">
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="New client name"
                  className="client-name-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddClient()}
                />
                <button 
                  onClick={handleAddClient}
                  className="add-client-button"
                  title="Add Client"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              
              {clients.map(client => (
                <div 
                  key={client.id}
                  className={`client-dropdown-item ${selectedClient?.id === client.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsClientDropdownOpen(false);
                  }}
                >
                  <div className="client-avatar" style={{ backgroundColor: client.color }}>
                    {client.logo}
                  </div>
                  <span className="client-name">{client.name}</span>
                  <span className="credential-count">{client.credentials.length}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="credential-search-container">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="credential-search-input"
              disabled={!selectedClient}
            />
          </div>
          <button 
            className="credential-add-button"
            onClick={() => {
              setEditingCredential(null);
              resetCredentialForm();
              setIsAdding(true);
            }}
            disabled={!selectedClient}
            title="Add Credential"
          >
            <FontAwesomeIcon icon={faPlus} /> Add Credential
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="credential-add-modal">
          <div className="credential-add-form-container">
            <div className="modal-header">
              <h3 className="credential-add-title">
                {editingCredential ? 'Edit Credential' : 'Add Credential to'} {selectedClient?.name}
              </h3>
              <button 
                className="modal-close-button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingCredential(null);
                }}
                title="Close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <div className="credential-form-group">
              <label className="credential-form-label">Type</label>
              <select
                value={newCredential.type}
                onChange={(e) => setNewCredential({
                  ...newCredential,
                  type: e.target.value
                })}
                className="credential-form-select"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email">Email</option>
                <option value="domain">Domain</option>
                <option value="server">Server</option>
                <option value="database">Database</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="credential-form-group">
              <label className="credential-form-label">Username/ID</label>
              <input
                type="text"
                value={newCredential.username}
                onChange={(e) => setNewCredential({
                  ...newCredential,
                  username: e.target.value
                })}
                className="credential-form-input"
                placeholder="username@example.com"
                required
              />
            </div>
            
            <div className="credential-form-group">
              <label className="credential-form-label">Password</label>
              <input
                type="password"
                value={newCredential.password}
                onChange={(e) => setNewCredential({
                  ...newCredential,
                  password: e.target.value
                })}
                className="credential-form-input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="credential-form-group">
              <label className="credential-form-label">Domain/URL</label>
              <input
                type="text"
                value={newCredential.domain}
                onChange={(e) => setNewCredential({
                  ...newCredential,
                  domain: e.target.value
                })}
                className="credential-form-input"
                placeholder="https://example.com"
              />
            </div>
            
            {['domain', 'server'].includes(newCredential.type) && (
              <>
                <div className="credential-form-group">
                  <label className="credential-form-label">Renewal Date</label>
                  <input
                    type="date"
                    value={newCredential.renewalDate}
                    onChange={(e) => setNewCredential({
                      ...newCredential,
                      renewalDate: e.target.value
                    })}
                    className="credential-form-input"
                  />
                </div>
                
                <div className="credential-form-group">
                  <label className="credential-form-label checkbox-label">
                    <input
                      type="checkbox"
                      checked={newCredential.notificationEnabled}
                      onChange={(e) => setNewCredential({
                        ...newCredential,
                        notificationEnabled: e.target.checked
                      })}
                    />
                    <span>Enable Renewal Notifications</span>
                  </label>
                </div>
                
                {newCredential.notificationEnabled && (
                  <div className="credential-form-group">
                    <label className="credential-form-label">Notify Days Before</label>
                    <select
                      value={newCredential.notifyDaysBefore}
                      onChange={(e) => setNewCredential({
                        ...newCredential,
                        notifyDaysBefore: parseInt(e.target.value)
                      })}
                      className="credential-form-select"
                    >
                      <option value="7">7 days</option>
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                    </select>
                  </div>
                )}
              </>
            )}
            
            <div className="credential-form-group">
              <label className="credential-form-label">Notes</label>
              <textarea
                value={newCredential.notes}
                onChange={(e) => setNewCredential({
                  ...newCredential,
                  notes: e.target.value
                })}
                className="credential-form-textarea"
                placeholder="Additional notes..."
              />
            </div>
            
            <div className="credential-form-actions">
              <button
                type="button"
                className="credential-form-cancel"
                onClick={() => {
                  setIsAdding(false);
                  setEditingCredential(null);
                }}
              >
                Cancel
              </button>
              {editingCredential ? (
                <button
                  type="button"
                  className="credential-form-submit"
                  onClick={handleUpdateCredential}
                >
                  Update Credential
                </button>
              ) : (
                <button
                  type="button"
                  className="credential-form-submit"
                  onClick={handleAddCredential}
                >
                  Save Credential
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="credential-content-area">
        {!selectedClient ? (
          <div className="credential-empty-state">
            <div className="empty-state-icon">
              <FontAwesomeIcon icon={faKey} size="3x" />
            </div>
            <h3>No Client Selected</h3>
            <p>Select a client from the dropdown or create a new one to view credentials</p>
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="credential-empty-state">
            <div className="empty-state-icon">
              <FontAwesomeIcon icon={faFolderOpen} size="3x" />
            </div>
            <h3>No Credentials Found</h3>
            <p>{searchTerm ? 'No matching credentials found' : 'This client has no credentials yet'}</p>
            <button 
              className="add-first-credential-button"
              onClick={() => {
                setEditingCredential(null);
                resetCredentialForm();
                setIsAdding(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add First Credential
            </button>
          </div>
        ) : (
          <div className="credential-grid">
            {filteredCredentials.map((cred) => {
              const renewalStatus = getRenewalStatus(cred.renewalDate);
              
              return (
                <div key={cred.id} className="credential-card">
                  <div className="credential-card-header">
                    <div className="credential-type-icon">
                      <FontAwesomeIcon icon={getTypeIcon(cred.type)} />
                    </div>
                    <h3 className="credential-card-title">
                      {cred.type.charAt(0).toUpperCase() + cred.type.slice(1)}
                    </h3>
                    {renewalStatus && (
                      <div 
                        className="renewal-status-badge"
                        style={{ backgroundColor: getStatusColor(renewalStatus) }}
                        title={`Renewal: ${cred.renewalDate}`}
                      >
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    )}
                    <span className="credential-card-client">
                      {selectedClient.name}
                    </span>
                  </div>
                  
                  <div className="credential-card-body">
                    <div className="credential-field">
                      <label>Username:</label>
                      <div className="credential-field-value">
                        <span>{cred.username}</span>
                        <button 
                          onClick={() => copyToClipboard(cred.username, 'username', cred.id)}
                          className={`credential-copy-button ${copiedItem?.id === cred.id && copiedItem?.field === 'username' ? 'copied' : ''}`}
                          title="Copy username"
                        >
                          <FontAwesomeIcon icon={faCopy} />
                          {copiedItem?.id === cred.id && copiedItem?.field === 'username' ? ' Copied!' : ' Copy'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="credential-field">
                      <label>Password:</label>
                      <div className="credential-field-value">
                        <span>••••••••</span>
                        <button 
                          onClick={() => copyToClipboard(cred.password, 'password', cred.id)}
                          className={`credential-copy-button ${copiedItem?.id === cred.id && copiedItem?.field === 'password' ? 'copied' : ''}`}
                          title="Copy password"
                        >
                          <FontAwesomeIcon icon={faCopy} />
                          {copiedItem?.id === cred.id && copiedItem?.field === 'password' ? ' Copied!' : ' Copy'}
                        </button>
                      </div>
                    </div>
                    
                    {cred.domain && (
                      <div className="credential-field">
                        <label>Domain:</label>
                        <div className="credential-field-value">
                          <a 
                            href={cred.domain.startsWith('http') ? cred.domain : `https://${cred.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="credential-domain-link"
                          >
                            {cred.domain.replace(/^https?:\/\//, '')}
                          </a>
                          <button 
                            onClick={() => copyToClipboard(cred.domain, 'domain', cred.id)}
                            className={`credential-copy-button ${copiedItem?.id === cred.id && copiedItem?.field === 'domain' ? 'copied' : ''}`}
                            title="Copy domain"
                          >
                            <FontAwesomeIcon icon={faCopy} />
                            {copiedItem?.id === cred.id && copiedItem?.field === 'domain' ? ' Copied!' : ' Copy'}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {cred.renewalDate && (
                      <div className="credential-field">
                        <label>Renewal Date:</label>
                        <div className="credential-field-value">
                          <span>{cred.renewalDate}</span>
                          {renewalStatus === 'expired' && (
                            <span className="renewal-alert">EXPIRED!</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {cred.notes && (
                      <div className="credential-field">
                        <label>Notes:</label>
                        <p className="credential-notes">{cred.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="credential-card-footer">
                    <div className="credential-actions">
                      <button 
                        className="credential-edit-button"
                        onClick={() => startEditCredential(cred)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button 
                        className="credential-delete-button"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this credential?')) {
                            handleDeleteCredential(cred.id);
                          }
                        }}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                    <span className="credential-date">
                      Added: {new Date(cred.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialManager;
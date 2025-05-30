import React, { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
  FiCreditCard, FiBriefcase, FiPlus, FiX, FiCheck, FiAlertCircle 
} from 'react-icons/fi';
import './AddClient.css';

const AddClient = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    company: '',
    clientSince: new Date().toISOString().split('T')[0],
    clientType: 'individual',
    paymentMethod: 'credit',
    notes: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [touchedFields, setTouchedFields] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate phone number format
  const validatePhone = (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone).toLowerCase());
  };

  // Handle field blur (mark as touched)
  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  // Handle form changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add tag with validation
  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!validateEmail(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      return 'Phone number is required';
    }
    if (!validatePhone(formData.phone)) {
      return 'Please enter a valid phone number';
    }
    return null;
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setFormStatus({ type: 'error', message: validationError });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add client');
      }

      const data = await response.json();
      setFormStatus({ type: 'success', message: 'Client added successfully!' });
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          company: '',
          clientSince: new Date().toISOString().split('T')[0],
          clientType: 'individual',
          paymentMethod: 'credit',
          notes: '',
          tags: []
        });
        setTouchedFields({});
        setFormStatus({ type: '', message: '' });
      }, 2000);
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field error state
  const getFieldError = (field) => {
    if (!touchedFields[field]) return null;
    if (!formData[field]?.toString().trim()) return 'This field is required';
    if (field === 'email' && !validateEmail(formData.email)) return 'Invalid email format';
    if (field === 'phone' && !validatePhone(formData.phone)) return 'Invalid phone number';
    return null;
  };

  return (
    <div className="client-form-container">
      <div className="client-form-header">
        <h1 className="client-form-title">Add New Client</h1>
        <p className="client-form-subtitle">Fill in the details below to add a new client to your system</p>
      </div>

      {formStatus.message && (
        <div className={`client-form-status client-form-status-${formStatus.type}`}>
          {formStatus.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
          {formStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="client-form">
        <div className={`client-form-grid ${isMobile ? 'client-form-mobile' : ''}`}>
          {/* Personal Information Section */}
          <div className="client-form-section">
            <h2 className="client-section-title">
              <FiUser className="client-section-icon" />
              Personal Information
            </h2>
            
            <div className={`client-form-group ${getFieldError('firstName') ? 'client-form-group-error' : ''}`}>
              <label htmlFor="firstName" className="client-form-label">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur('firstName')}
                className="client-form-input"
                required
              />
              {getFieldError('firstName') && (
                <span className="client-form-error">{getFieldError('firstName')}</span>
              )}
            </div>

            <div className={`client-form-group ${getFieldError('lastName') ? 'client-form-group-error' : ''}`}>
              <label htmlFor="lastName" className="client-form-label">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur('lastName')}
                className="client-form-input"
                required
              />
              {getFieldError('lastName') && (
                <span className="client-form-error">{getFieldError('lastName')}</span>
              )}
            </div>

            <div className={`client-form-group ${getFieldError('email') ? 'client-form-group-error' : ''}`}>
              <label htmlFor="email" className="client-form-label">
                <FiMail className="client-input-icon" />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className="client-form-input"
                required
              />
              {getFieldError('email') && (
                <span className="client-form-error">{getFieldError('email')}</span>
              )}
            </div>

            <div className={`client-form-group ${getFieldError('phone') ? 'client-form-group-error' : ''}`}>
              <label htmlFor="phone" className="client-form-label">
                <FiPhone className="client-input-icon" />
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                className="client-form-input"
                required
              />
              {getFieldError('phone') && (
                <span className="client-form-error">{getFieldError('phone')}</span>
              )}
            </div>
          </div>

          {/* Address Information Section */}
          <div className="client-form-section">
            <h2 className="client-section-title">
              <FiMapPin className="client-section-icon" />
              Address Information
            </h2>

            <div className="client-form-group">
              <label htmlFor="address" className="client-form-label">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="client-form-input"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="city" className="client-form-label">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="client-form-input"
              />
            </div>

            <div className="client-form-row">
              <div className="client-form-group client-form-group-half">
                <label htmlFor="state" className="client-form-label">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="client-form-input"
                />
              </div>

              <div className="client-form-group client-form-group-half">
                <label htmlFor="zipCode" className="client-form-label">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="client-form-input"
                />
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="client-form-section">
            <h2 className="client-section-title">
              <FiBriefcase className="client-section-icon" />
              Business Information
            </h2>

            <div className="client-form-group">
              <label htmlFor="company" className="client-form-label">Company Name</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="client-form-input"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="clientSince" className="client-form-label">
                <FiCalendar className="client-input-icon" />
                Client Since
              </label>
              <input
                type="date"
                id="clientSince"
                name="clientSince"
                value={formData.clientSince}
                onChange={handleChange}
                className="client-form-input"
              />
            </div>

            <div className="client-form-group">
              <label className="client-form-label">Client Type</label>
              <div className="client-radio-group">
                <label className="client-radio-label">
                  <input
                    type="radio"
                    name="clientType"
                    value="individual"
                    checked={formData.clientType === 'individual'}
                    onChange={handleChange}
                    className="client-radio"
                  />
                  <span className="client-radio-custom"></span>
                  Individual
                </label>
                <label className="client-radio-label">
                  <input
                    type="radio"
                    name="clientType"
                    value="business"
                    checked={formData.clientType === 'business'}
                    onChange={handleChange}
                    className="client-radio"
                  />
                  <span className="client-radio-custom"></span>
                  Business
                </label>
              </div>
            </div>
          </div>

          {/* Payment & Additional Info Section */}
          <div className="client-form-section">
            <h2 className="client-section-title">
              <FiCreditCard className="client-section-icon" />
              Payment & Additional Info
            </h2>

            <div className="client-form-group">
              <label className="client-form-label">Preferred Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="client-form-select"
              >
                <option value="credit">Credit Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="digital">Digital Wallet</option>
              </select>
            </div>

            <div className="client-form-group">
              <label htmlFor="notes" className="client-form-label">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="client-form-textarea"
                rows="4"
              />
            </div>

            <div className="client-form-group">
              <label htmlFor="tags" className="client-form-label">Tags</label>
              <div className="client-tags-container">
                {formData.tags.map(tag => (
                  <span key={tag} className="client-tag">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleTagRemove(tag)}
                      className="client-tag-remove"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
                <div className="client-tag-input">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add tag..."
                    className="client-tag-input-field"
                  />
                  <button 
                    type="button" 
                    onClick={handleTagAdd}
                    className="client-tag-add"
                    disabled={!newTag.trim()}
                    aria-label="Add tag"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="client-form-actions">
          <button 
            type="submit" 
            className="client-form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="client-form-spinner"></span>
                Adding Client...
              </>
            ) : 'Add Client'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
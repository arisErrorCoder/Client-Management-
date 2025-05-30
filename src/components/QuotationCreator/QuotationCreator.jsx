import React, { useState, useRef } from 'react';
import { 
  FiFileText, FiPrinter, FiMail, FiPlus, FiTrash2,
  FiChevronDown, FiChevronUp, FiDownload, FiUser,
  FiDollarSign, FiSave, FiEye
} from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';
import './QuotationCreator.css';

const QuotationCreator = () => {
  const [quotation, setQuotation] = useState({
    number: `QT-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    client: '',
    clientEmail: '',
    clientAddress: '',
    clientPhone: '',
    companyName: 'Your Company Name',
    companyAddress: '123 Business Street\nCity, State 10001',
    companyPhone: '(123) 456-7890',
    companyEmail: 'contact@yourcompany.com',
    companyGST: '22AAAAA0000A1Z5',
    items: [
      { id: 1, description: '', quantity: 1, rate: 0, amount: 0, hsnCode: '' }
    ],
    notes: '',
    terms: '1. Payment due within 15 days\n2. 50% advance required for work commencement\n3. Goods once sold will not be taken back',
    taxRate: 18,
    discount: 0,
    discountType: 'percentage', // 'percentage' or 'fixed'
    currency: 'INR',
    status: 'draft'
  });

  const [activeSection, setActiveSection] = useState('client');
  const [isSaving, setIsSaving] = useState(false);
  const quotationRef = useRef();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotation(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setQuotation(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              [field]: field === 'quantity' || field === 'rate' 
                ? parseFloat(value) || 0 
                : value,
              amount: field === 'quantity' || field === 'rate'
                ? (field === 'quantity' 
                    ? (parseFloat(value) || 0) * item.rate 
                    : item.quantity * (parseFloat(value) || 0))
                : item.amount
            } 
          : item
      )
    }));
  };

  const addItem = () => {
    setQuotation(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0, hsnCode: '' }
      ]
    }));
  };

  const removeItem = (id) => {
    if (quotation.items.length > 1) {
      setQuotation(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const calculateSubtotal = () => {
    return quotation.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * quotation.taxRate) / 100;
  };

  const calculateDiscount = () => {
    if (quotation.discountType === 'percentage') {
      return (calculateSubtotal() * quotation.discount) / 100;
    }
    return quotation.discount;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const handlePrint = useReactToPrint({
    content: () => quotationRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; }
        .quotation-print-actions { display: none !important; }
      }
    `,
    onAfterPrint: () => {
      setQuotation(prev => ({ ...prev, status: 'sent' }));
    }
  });

  const handleDownloadPDF = () => {
    handlePrint();
  };

  const handleEmailQuotation = () => {
    alert(`Quotation would be emailed to ${quotation.clientEmail}`);
    setQuotation(prev => ({ ...prev, status: 'sent' }));
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Draft saved successfully!');
    }, 1000);
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="quotation-creator">
      <div className="quotation-form-container">
        <h1 className="quotation-title">
          <FiFileText className="quotation-title-icon" />
          Create New Quotation (INR)
        </h1>

        <div className="quotation-form-sections">
          {/* Client Section */}
          <div className={`quotation-section ${activeSection === 'client' ? 'active' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('client')}>
              <h2 className="section-title">
                <FiUser className="section-icon" />
                Client Information
              </h2>
              {activeSection === 'client' ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {activeSection === 'client' && (
              <div className="section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Client Name*</label>
                    <input
                      type="text"
                      name="client"
                      value={quotation.client}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Email*</label>
                    <input
                      type="email"
                      name="clientEmail"
                      value={quotation.clientEmail}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Client Phone</label>
                    <input
                      type="tel"
                      name="clientPhone"
                      value={quotation.clientPhone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client GSTIN</label>
                    <input
                      type="text"
                      name="clientGST"
                      value={quotation.clientGST}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Client Address</label>
                  <textarea
                    name="clientAddress"
                    value={quotation.clientAddress}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Full address with state and PIN code"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Company Section */}
          <div className={`quotation-section ${activeSection === 'company' ? 'active' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('company')}>
              <h2 className="section-title">Company Information</h2>
              {activeSection === 'company' ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {activeSection === 'company' && (
              <div className="section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={quotation.companyName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company GSTIN</label>
                    <input
                      type="text"
                      name="companyGST"
                      value={quotation.companyGST}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Company Address</label>
                  <textarea
                    name="companyAddress"
                    value={quotation.companyAddress}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Company Phone</label>
                    <input
                      type="tel"
                      name="companyPhone"
                      value={quotation.companyPhone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Email</label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={quotation.companyEmail}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div className={`quotation-section ${activeSection === 'items' ? 'active' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('items')}>
              <h2 className="section-title">Quotation Items</h2>
              {activeSection === 'items' ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {activeSection === 'items' && (
              <div className="section-content">
                <div className="items-table">
                  <div className="items-header">
                    <div className="item-col description">Description</div>
                    <div className="item-col hsn">HSN</div>
                    <div className="item-col quantity">Qty</div>
                    <div className="item-col rate">Rate (₹)</div>
                    <div className="item-col amount">Amount (₹)</div>
                    <div className="item-col actions"></div>
                  </div>
                  {quotation.items.map(item => (
                    <div key={item.id} className="item-row">
                      <div className="item-col description">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="item-input"
                          placeholder="Item description"
                        />
                      </div>
                      <div className="item-col hsn">
                        <input
                          type="text"
                          value={item.hsnCode}
                          onChange={(e) => handleItemChange(item.id, 'hsnCode', e.target.value)}
                          className="item-input"
                          placeholder="HSN Code"
                        />
                      </div>
                      <div className="item-col quantity">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          className="item-input"
                        />
                      </div>
                      <div className="item-col rate">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                          className="item-input"
                        />
                      </div>
                      <div className="item-col amount">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="item-col actions">
                        <button 
                          className="item-remove-btn"
                          onClick={() => removeItem(item.id)}
                          disabled={quotation.items.length <= 1}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="add-item-btn" onClick={addItem}>
                  <FiPlus /> Add Item
                </button>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div className={`quotation-section ${activeSection === 'summary' ? 'active' : ''}`}>
            <div className="section-header" onClick={() => toggleSection('summary')}>
              <h2 className="section-title">Summary & Terms</h2>
              {activeSection === 'summary' ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {activeSection === 'summary' && (
              <div className="section-content">
                <div className="summary-grid">
                  <div className="form-group">
                    <label className="form-label">GST Rate (%)</label>
                    <input
                      type="number"
                      name="taxRate"
                      min="0"
                      max="100"
                      value={quotation.taxRate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Type</label>
                    <select
                      name="discountType"
                      value={quotation.discountType}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      {quotation.discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)'}
                    </label>
                    <input
                      type="number"
                      name="discount"
                      min="0"
                      step={quotation.discountType === 'percentage' ? "1" : "0.01"}
                      value={quotation.discount}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="summary-totals">
                  <div className="total-row">
                    <span className="total-label">Subtotal:</span>
                    <span className="total-value">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="total-row">
                    <span className="total-label">GST ({quotation.taxRate}%):</span>
                    <span className="total-value">{formatCurrency(calculateTax())}</span>
                  </div>
                  {quotation.discount > 0 && (
                    <div className="total-row">
                      <span className="total-label">Discount:</span>
                      <span className="total-value">-{formatCurrency(calculateDiscount())}</span>
                    </div>
                  )}
                  <div className="total-row grand-total">
                    <span className="total-label">Total:</span>
                    <span className="total-value">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    value={quotation.notes}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Any additional notes for the client"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Terms & Conditions</label>
                  <textarea
                    name="terms"
                    value={quotation.terms}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="5"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="quotation-actions">
          <button 
            className="action-btn save" 
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (
              <>
                <FiSave /> Save Draft
              </>
            )}
          </button>
          <button className="action-btn preview">
            <FiEye /> Preview
          </button>
          <button 
            className="action-btn email" 
            onClick={handleEmailQuotation}
            disabled={!quotation.clientEmail}
          >
            <FiMail /> Email Quotation
          </button>
          <button 
            className="action-btn download" 
            onClick={handleDownloadPDF}
          >
            <FiDownload /> Download PDF
          </button>
        </div>
      </div>

      {/* Printable Quotation */}
      <div className="quotation-preview-container" ref={quotationRef}>
        <div className="quotation-print">
          <header className="quotation-header">
            <div className="quotation-title">
              <h1>TAX INVOICE</h1>
              <div className="quotation-meta">
                <div className="meta-row">
                  <span className="meta-label">Invoice #:</span>
                  <span className="meta-value">{quotation.number}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Date:</span>
                  <span className="meta-value">
                    {new Date(quotation.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Status:</span>
                  <span className="meta-value status">{quotation.status}</span>
                </div>
              </div>
            </div>
            <div className="company-info">
              <h2>{quotation.companyName}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{quotation.companyAddress}</p>
              <p>Phone: {quotation.companyPhone}</p>
              <p>Email: {quotation.companyEmail}</p>
              {quotation.companyGST && <p>GSTIN: {quotation.companyGST}</p>}
            </div>
          </header>

          <div className="quotation-client">
            <div className="client-info">
              <h3>Bill To:</h3>
              <p>{quotation.client}</p>
              {quotation.clientAddress && (
                <p style={{ whiteSpace: 'pre-line' }}>{quotation.clientAddress}</p>
              )}
              {quotation.clientPhone && <p>Phone: {quotation.clientPhone}</p>}
              {quotation.clientEmail && <p>Email: {quotation.clientEmail}</p>}
              {quotation.clientGST && <p>GSTIN: {quotation.clientGST}</p>}
            </div>
          </div>

          <div className="quotation-items">
            <table className="items-table">
              <thead>
                <tr>
                  <th className="item-no">#</th>
                  <th className="item-desc">Description</th>
                  <th className="item-hsn">HSN Code</th>
                  <th className="item-qty">Qty</th>
                  <th className="item-rate">Rate (₹)</th>
                  <th className="item-amount">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="item-no">{index + 1}</td>
                    <td className="item-desc">{item.description || `Item ${index + 1}`}</td>
                    <td className="item-hsn">{item.hsnCode || '-'}</td>
                    <td className="item-qty">{item.quantity}</td>
                    <td className="item-rate">{formatCurrency(item.rate)}</td>
                    <td className="item-amount">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quotation-totals">
            <div className="totals-grid">
              <div className="total-row">
                <span className="total-label">Subtotal:</span>
                <span className="total-value">{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="total-row">
                <span className="total-label">GST ({quotation.taxRate}%):</span>
                <span className="total-value">{formatCurrency(calculateTax())}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="total-row">
                  <span className="total-label">Discount:</span>
                  <span className="total-value">-{formatCurrency(calculateDiscount())}</span>
                </div>
              )}
              <div className="total-row grand-total">
                <span className="total-label">Total:</span>
                <span className="total-value">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          <div className="quotation-amount-in-words">
            <p><strong>Amount in words:</strong> {numberToWords(calculateTotal())} rupees only</p>
          </div>

          <div className="quotation-notes">
            {quotation.notes && (
              <div className="notes-section">
                <h4>Notes</h4>
                <p>{quotation.notes}</p>
              </div>
            )}
            <div className="terms-section">
              <h4>Terms & Conditions</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{quotation.terms}</p>
            </div>
          </div>

          <footer className="quotation-footer">
            <div className="bank-details">
              <h4>Bank Details</h4>
              <p>Account Name: {quotation.companyName}</p>
              <p>Bank Name: Example Bank</p>
              <p>Account Number: 1234567890</p>
              <p>IFSC Code: EXMP0123456</p>
            </div>
            <div className="signature">
              <div className="signature-line"></div>
              <p>Authorized Signatory</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert numbers to words (simplified version)
const numberToWords = (num) => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

  function convertLessThanOneHundred(num) {
    if (num < 10) return ones[num];
    if (num >= 10 && num < 20) return teens[num - 10];
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  }

  function convertLessThanOneThousand(num) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    let res = '';
    if (hundred > 0) {
      res += ones[hundred] + ' hundred';
    }
    if (remainder > 0) {
      res += (res ? ' and ' : '') + convertLessThanOneHundred(remainder);
    }
    return res;
  }

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let res = '';
  if (crore > 0) {
    res += convertLessThanOneHundred(crore) + ' crore';
  }
  if (lakh > 0) {
    res += (res ? ' ' : '') + convertLessThanOneHundred(lakh) + ' lakh';
  }
  if (thousand > 0) {
    res += (res ? ' ' : '') + convertLessThanOneHundred(thousand) + ' thousand';
  }
  if (remainder > 0) {
    res += (res ? ' ' : '') + convertLessThanOneThousand(remainder);
  }
  return res || 'zero';
};

export default QuotationCreator;
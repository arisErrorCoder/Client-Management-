import React, { useState, useRef } from 'react';
import './CreativeInvoice.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CreativeInvoice = () => {
  const [editable, setEditable] = useState(true);
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: "Acme Corp", 
      address: "123 Business Rd, Cityville", 
      phone: "(555) 123-4567", 
      email: "contact@acme.com",
      defaultItems: [
        { description: "Standard Website Package", quantity: 1, rate: 2500 },
        { description: "SEO Setup", quantity: 1, rate: 500 }
      ]
    },
    { 
      id: 2, 
      name: "Globex Corporation", 
      address: "456 Industry Ave, Metropolis", 
      phone: "(555) 987-6543", 
      email: "billing@globex.com",
      defaultItems: [
        { description: "Enterprise Solution", quantity: 1, rate: 5000 },
        { description: "Annual Maintenance", quantity: 1, rate: 1200 }
      ]
    },
    { 
      id: 3, 
      name: "Initech", 
      address: "789 Office Park, Silicon Valley", 
      phone: "(555) 456-7890", 
      email: "accounts@initech.com",
      defaultItems: [
        { description: "Software License", quantity: 5, rate: 299 },
        { description: "Implementation", quantity: 10, rate: 150 }
      ]
    }
  ]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: 'Thank you for your business!',
  });
  const invoiceRef = useRef();

  function generateInvoiceNumber() {
    return `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
  }

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c.id === Number(clientId));
    setSelectedClient(client ? {...client} : null);
    if (client) {
      setInvoiceDetails(prev => ({ ...prev, invoiceNumber: generateInvoiceNumber() }));
      setItems(client.defaultItems.map(item => ({...item})));
    } else {
      setItems([]);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'quantity' || field === 'rate' ? Number(value) : value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleDownloadPDF = () => {
    if (!selectedClient) {
      alert("Please select a client first");
      return;
    }
    html2canvas(invoiceRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoiceDetails.invoiceNumber}.pdf`);
    });
  };

  return (
    <div className="creative-invoice-container">
      <div className="invoice-controls">
        <select onChange={(e) => handleClientChange(e.target.value)} value={selectedClient?.id || ''}>
          <option value="">-- Select Client --</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
        <button onClick={() => setEditable(!editable)}>{editable ? 'Lock' : 'Edit'}</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      <div ref={invoiceRef} className="invoice-body">
        <div className="invoice-header">
          <img src="/logo-placeholder.png" alt="Logo" className="invoice-logo" />
          <div>
            <h1>INVOICE</h1>
            <p><strong>Invoice #:</strong> {invoiceDetails.invoiceNumber}</p>
            <p><strong>Date:</strong> {invoiceDetails.date}</p>
            <p><strong>Due Date:</strong> {invoiceDetails.dueDate}</p>
          </div>
        </div>
        <div className="invoice-info">
          <div>
            <h3>From</h3>
            <p>Your Company Name</p>
            <p>123 Business Rd</p>
            <p>Cityville</p>
            <p>billing@yourcompany.com</p>
          </div>
          <div>
            <h3>To</h3>
            {selectedClient ? (
              <>
                <p>{selectedClient.name}</p>
                <p>{selectedClient.address}</p>
                <p>{selectedClient.phone}</p>
                <p>{selectedClient.email}</p>
              </>
            ) : <p>No client selected</p>}
          </div>
        </div>
        <table className="invoice-items">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Amount</th>
              {editable && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{editable ? <input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} /> : item.description}</td>
                <td>{editable ? <input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} /> : item.quantity}</td>
                <td>{editable ? <input type="number" value={item.rate} onChange={e => handleItemChange(index, 'rate', e.target.value)} /> : item.rate}</td>
                <td>{item.quantity * item.rate}</td>
                {editable && <td><button onClick={() => handleRemoveItem(index)}>Remove</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {editable && <button onClick={handleAddItem}>Add Item</button>}
        <div className="invoice-totals">
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>Tax (10%):</strong> ${tax.toFixed(2)}</p>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        </div>
        <p className="invoice-notes">{invoiceDetails.notes}</p>
      </div>
    </div>
  );
};

export default CreativeInvoice;

import React, { useState, useEffect } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiUsers, 
  FiTool, 
  FiFileText, 
  FiDollarSign, 
  FiPieChart,
  FiChevronDown,
  FiChevronRight,
  FiSearch
} from 'react-icons/fi';
import './Sidebar.css';
import AddClient from '../AddClient/AddClient';
import ClientList from '../ClientList/ClientList';
import WorkOrders from '../WorkOrders/WorkOrders';
import CreativeInvoice from '../CreativeInvoice/CreativeInvoice';
import Dashboard from '../Dashboard/Dashboard';
import InvoiceHistory from '../InvoiceHistory/InvoiceHistory';
import QuotationCreator from '../QuotationCreator/QuotationCreator';
import CredentialManager from '../CredentialManager/CredentialManager';



const ClientGroups = () => (
  <div className="content-box">
    <h2>Client Groups</h2>
    <p>Manage client groups here.</p>
  </div>
);



const InvoicesContent = () => (
  <div className="content-box">
    <h2>Invoices</h2>
    <p>Create, send, and track invoices.</p>
  </div>
);

const QuotationsContent = () => (
  <div className="content-box">
    <h2>Quotations</h2>
    <p>Generate and manage client quotations.</p>
  </div>
);

const ReportsContent = () => (
  <div className="content-box">
    <h2>Reports</h2>
    <p>View business analytics and performance metrics.</p>
  </div>
);

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [activeContent, setActiveContent] = useState('dashboard');
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <FiHome size={20} />,
    },
    { 
      id: 'clients', 
      label: 'Clients', 
      icon: <FiUsers size={20} />,
      submenu: [
        { id: 'new-client', label: 'Add New Client', content: <AddClient /> },
        { id: 'client-list', label: 'Client List', content: <ClientList /> },
        { id: 'client-credicial', label: 'Client-credicial', content: <CredentialManager /> }
      ]
    },
    { 
      id: 'work', 
      label: 'Work Orders', 
      icon: <FiTool size={20} />,
    },
    { 
      id: 'invoices', 
      label: 'Invoices', 
      icon: <FiFileText size={20} />,
      submenu: [
        { id: 'create-invoice', label: 'Create Invoice', content: <CreativeInvoice 
  clientData={{
    name: "Acme Corp",
    address: "123 Business Rd, Cityville",
    phone: "(555) 123-4567",
    email: "contact@acme.com"
  }}
  initialItems={[
    { description: "Website Design", quantity: 1, rate: 1200 },
    { description: "Hosting Setup", quantity: 3, rate: 50 }
  ]}
/> },
        { id: 'invoice-history', label: 'Invoice History', content: <InvoiceHistory /> },
        { id: 'recurring', label: 'Recurring Invoices', content: <InvoicesContent /> }
      ]
    },
    { 
      id: 'quotations', 
      label: 'Quotations', 
      icon: <FiDollarSign size={20} />,
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: <FiPieChart size={20} />,
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSubmenu = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  const renderContent = () => {
    const flatSubmenus = menuItems.flatMap(item =>
      item.submenu ? item.submenu.map(sub => ({ ...sub, parentId: item.id })) : []
    );
    const subContent = flatSubmenus.find(sub => sub.id === activeContent);
    if (subContent) return subContent.content;

    switch (activeContent) {
      case 'dashboard': return <Dashboard />;
      case 'work': return <WorkOrders />;
      case 'quotations': return <QuotationCreator />;
      case 'reports': return <ReportsContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </div>
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Client Manager</h2>
          <div className="sidebar-search">
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
                <li 
                  className={`${activeContent === item.id ? 'active' : ''} ${item.submenu ? 'has-submenu' : ''}`}
                  onClick={() => {
                    if (!item.submenu) {
                      setActiveContent(item.id);
                      if (isMobile) setSidebarOpen(false);
                    } else {
                      toggleSubmenu(item.id);
                    }
                  }}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  {item.submenu && (
                    <span className="submenu-toggle">
                      {activeSubmenu === item.id ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  )}
                </li>
                {item.submenu && activeSubmenu === item.id && (
                  <div className="submenu">
                    {item.submenu.map(subItem => (
                      <li 
                        key={subItem.id}
                        className={`submenu-item ${activeContent === subItem.id ? 'active' : ''}`}
                        onClick={() => {
                          setActiveContent(subItem.id);
                          if (isMobile) setSidebarOpen(false);
                        }}
                      >
                        {subItem.label}
                      </li>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JS</div>
            <div className="user-info">
              <span className="username">John Smith</span>
              <span className="user-role">Admin</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-header">
          <h1>
            {
              (() => {
                const subItem = menuItems.flatMap(item => item.submenu || []).find(sub => sub.id === activeContent);
                if (subItem) return subItem.label;
                return menuItems.find(item => item.id === activeContent)?.label || 'Dashboard';
              })()
            }
          </h1>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';
import './WorkOrders.css';

const WorkOrders = () => {
  // State for form inputs
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceInput, setServiceInput] = useState('');
  const [quotedAmount, setQuotedAmount] = useState('');
  const [workOrders, setWorkOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [historyView, setHistoryView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  
  // Task update state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskRevisions, setTaskRevisions] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('not_started');

  // Mock clients data
  const clients = [
    { id: 1, name: 'Acme Corp', contact: 'Rajesh Kumar', email: 'rajesh@acme.com', phone: '9876543210' },
    { id: 2, name: 'Globex Inc', contact: 'Priya Sharma', email: 'priya@globex.com', phone: '8765432109' },
    { id: 3, name: 'Soylent Corp', contact: 'Amit Patel', email: 'amit@soylent.com', phone: '7654321098' },
    { id: 4, name: 'Initech', contact: 'Neha Gupta', email: 'neha@initech.com', phone: '6543210987' },
    { id: 5, name: 'Umbrella Corp', contact: 'Vikram Singh', email: 'vikram@umbrella.com', phone: '9432109876' },
  ];

  // Available services
  const allServices = ['Logo Design', 'Website Development', 'Poster Design', 'Video Production', 'Social Media', 'Branding'];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  // Status options
  const statusOptions = [
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'completed', label: 'Completed' }
  ];

  // Add service to selected services
  const handleAddService = () => {
    if (serviceInput && !selectedServices.includes(serviceInput)) {
      setSelectedServices([...selectedServices, serviceInput]);
      setServiceInput('');
    }
  };

  // Remove service from selected services
  const handleRemoveService = (service) => {
    setSelectedServices(selectedServices.filter(s => s !== service));
  };

  // Create new work order
  const handleCreateWorkOrder = () => {
    if (selectedClient && selectedServices.length > 0 && quotedAmount) {
      const clientData = clients.find(c => c.name === selectedClient);
      
      const newOrder = {
        id: Date.now(),
        client: selectedClient,
        clientData: clientData,
        services: selectedServices,
        amount: quotedAmount,
        date: new Date().toISOString(),
        tasks: [],
        history: [{
          type: 'order_created',
          date: new Date().toISOString(),
          user: 'Current User' // In a real app, this would be the logged-in user
        }],
        status: 'active',
        paymentStatus: 'unpaid'
      };
      
      setWorkOrders([...workOrders, newOrder]);
      setSelectedClient('');
      setSelectedServices([]);
      setQuotedAmount('');
      setActiveOrder(newOrder);
    }
  };

  // Add task to work order
  const handleAddTask = () => {
    if (activeOrder && taskTitle && selectedCategory) {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        category: selectedCategory,
        notes: taskNotes,
        revisions: taskRevisions,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate,
        completed: taskStatus === 'completed',
        date: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      const updatedOrders = workOrders.map(order => {
        if (order.id === activeOrder.id) {
          return {
            ...order,
            tasks: [...order.tasks, newTask],
            history: [...order.history, {
              type: 'task_added',
              data: newTask,
              date: new Date().toISOString(),
              user: 'Current User'
            }]
          };
        }
        return order;
      });
      
      setWorkOrders(updatedOrders);
      setActiveOrder(updatedOrders.find(o => o.id === activeOrder.id));
      resetTaskForm();
    }
  };

  // Reset task form
  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskNotes('');
    setTaskRevisions(0);
    setTaskCompleted(false);
    setSelectedCategory('');
    setTaskPriority('medium');
    setTaskDueDate('');
    setTaskStatus('not_started');
  };

  // Update task status
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    const updatedOrders = workOrders.map(order => {
      if (order.id === activeOrder.id) {
        const updatedTasks = order.tasks.map(task => {
          if (task.id === taskId) {
            return { 
              ...task, 
              status: newStatus,
              completed: newStatus === 'completed',
              lastUpdated: new Date().toISOString()
            };
          }
          return task;
        });
        
        return {
          ...order,
          tasks: updatedTasks,
          history: [...order.history, {
            type: 'task_updated',
            taskId,
            status: newStatus,
            date: new Date().toISOString(),
            user: 'Current User'
          }]
        };
      }
      return order;
    });
    
    setWorkOrders(updatedOrders);
    setActiveOrder(updatedOrders.find(o => o.id === activeOrder.id));
  };

  // Filter work orders based on search term
  const filteredOrders = workOrders.filter(order => 
    order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.services.some(service => 
      service.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate task statistics
  const calculateTaskStats = (tasks) => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      pendingReview: tasks.filter(t => t.status === 'pending_review').length,
      notStarted: tasks.filter(t => t.status === 'not_started').length
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="workorders-container">
      {/* Header Section */}
      <header className="workorders-header">
        <h1 className="workorders-title">Work Order Management</h1>
        <div className="workorders-search">
          <input
            type="text"
            placeholder="Search clients or services..."
            className="workorders-searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="workorders-searchBtn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </header>

      <div className="workorders-main">
        {/* Left Panel - Create Work Order */}
        <div className="workorders-createPanel">
          <h2 className="workorders-panelTitle">Create New Work Order</h2>
          
          <div className="workorders-formGroup">
            <label className="workorders-formLabel">Select Client</label>
            <select
              className="workorders-formSelect"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <option value="">Choose a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.name}>{client.name}</option>
              ))}
            </select>
          </div>
          
          <div className="workorders-formGroup">
            <label className="workorders-formLabel">Services</label>
            <div className="workorders-serviceInputContainer">
              <input
                type="text"
                className="workorders-formInput"
                placeholder="Add service"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                list="servicesList"
              />
              <datalist id="servicesList">
                {allServices.map(service => (
                  <option key={service} value={service} />
                ))}
              </datalist>
              <button 
                className="workorders-addServiceBtn"
                onClick={handleAddService}
              >
                Add
              </button>
            </div>
            
            <div className="workorders-serviceTags">
              {selectedServices.map(service => (
                <span key={service} className="workorders-serviceTag">
                  {service}
                  <button 
                    className="workorders-removeTagBtn"
                    onClick={() => handleRemoveService(service)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="workorders-formGroup">
            <label className="workorders-formLabel">Quoted Amount (₹)</label>
            <input
              type="number"
              className="workorders-formInput"
              placeholder="Enter amount"
              value={quotedAmount}
              onChange={(e) => setQuotedAmount(e.target.value)}
            />
          </div>
          
          <button 
            className="workorders-createBtn"
            onClick={handleCreateWorkOrder}
            disabled={!selectedClient || selectedServices.length === 0 || !quotedAmount}
          >
            Create Work Order
          </button>
        </div>

        {/* Middle Panel - Work Orders List */}
        <div className="workorders-listPanel">
          <div className="workorders-listHeader">
            <h2 className="workorders-panelTitle">Active Work Orders</h2>
            <button 
              className={`workorders-viewToggle ${historyView ? 'active' : ''}`}
              onClick={() => setHistoryView(!historyView)}
            >
              {historyView ? 'View Current' : 'View History'}
            </button>
          </div>
          
          <div className="workorders-cardsContainer">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className={`workorders-card ${activeOrder?.id === order.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveOrder(order);
                    setHistoryView(false);
                    setActiveTab('tasks');
                  }}
                >
                  <div className="workorders-cardHeader">
                    <h3 className="workorders-cardClient">{order.client}</h3>
                    <span className="workorders-cardDate">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  
                  <div className="workorders-cardServices">
                    {order.services.map(service => (
                      <span key={service} className="workorders-cardServiceTag">{service}</span>
                    ))}
                  </div>
                  
                  <div className="workorders-cardAmount">
                    ₹{order.amount}
                  </div>
                  
                  {order.tasks.length > 0 && (
                    <div className="workorders-progressBar">
                      <div 
                        className="workorders-progressFill"
                        style={{ width: `${(calculateTaskStats(order.tasks).completed / order.tasks.length) * 100}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="workorders-cardStats">
                    <span className="workorders-cardStat">
                      <i className="fas fa-tasks"></i> {order.tasks.length} tasks
                    </span>
                    <span className="workorders-cardStat">
                      <i className="fas fa-check-circle"></i> {calculateTaskStats(order.tasks).completed} completed
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="workorders-emptyState">
                <i className="fas fa-folder-open workorders-emptyIcon"></i>
                <p>No work orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Task Management */}
        {activeOrder && (
          <div className="workorders-detailPanel">
            <div className="workorders-detailHeader">
              <div>
                <h2 className="workorders-panelTitle">{activeOrder.client}</h2>
                <div className="workorders-clientInfo">
                  <span><i className="fas fa-user"></i> {activeOrder.clientData?.contact}</span>
                  <span><i className="fas fa-envelope"></i> {activeOrder.clientData?.email}</span>
                  <span><i className="fas fa-phone"></i> {activeOrder.clientData?.phone}</span>
                </div>
              </div>
              <button 
                className="workorders-closeDetail"
                onClick={() => setActiveOrder(null)}
              >
                ×
              </button>
            </div>
            
            <div className="workorders-tabs">
              <button 
                className={`workorders-tab ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                Tasks
              </button>
              <button 
                className={`workorders-tab ${activeTab === 'client' ? 'active' : ''}`}
                onClick={() => setActiveTab('client')}
              >
                Client Info
              </button>
              <button 
                className={`workorders-tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
              <button 
                className={`workorders-tab ${activeTab === 'stats' ? 'active' : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                Statistics
              </button>
            </div>
            
            <div className="workorders-tabContent">
              {activeTab === 'tasks' && (
                <>
                  <div className="workorders-taskForm">
                    <h3 className="workorders-sectionTitle">Add New Task</h3>
                    
                    <div className="workorders-formRow">
                      <div className="workorders-formGroup">
                        <label className="workorders-formLabel">Category</label>
                        <select
                          className="workorders-formSelect"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="">Select category</option>
                          {activeOrder.services.map(service => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="workorders-formGroup">
                        <label className="workorders-formLabel">Priority</label>
                        <select
                          className="workorders-formSelect"
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="workorders-formGroup">
                      <label className="workorders-formLabel">Task Title</label>
                      <input
                        type="text"
                        className="workorders-formInput"
                        placeholder="Enter task title"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="workorders-formGroup">
                      <label className="workorders-formLabel">Notes</label>
                      <textarea
                        className="workorders-formTextarea"
                        placeholder="Add notes..."
                        value={taskNotes}
                        onChange={(e) => setTaskNotes(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="workorders-formRow">
                      <div className="workorders-formGroup">
                        <label className="workorders-formLabel">Status</label>
                        <select
                          className="workorders-formSelect"
                          value={taskStatus}
                          onChange={(e) => setTaskStatus(e.target.value)}
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="workorders-formGroup">
                        <label className="workorders-formLabel">Due Date</label>
                        <input
                          type="date"
                          className="workorders-formInput"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                        />
                      </div>
                      
                      <div className="workorders-formGroup">
                        <label className="workorders-formLabel">Revisions</label>
                        <input
                          type="number"
                          className="workorders-formInput"
                          value={taskRevisions}
                          onChange={(e) => setTaskRevisions(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <button 
                      className="workorders-addTaskBtn"
                      onClick={handleAddTask}
                      disabled={!taskTitle || !selectedCategory}
                    >
                      Add Task
                    </button>
                  </div>
                  
                  <div className="workorders-taskList">
                    <h3 className="workorders-sectionTitle">Current Tasks</h3>
                    
                    {activeOrder.tasks.length > 0 ? (
                      <ul className="workorders-taskItems">
                        {activeOrder.tasks.map(task => (
                          <li key={task.id} className={`workorders-taskItem ${task.priority}`}>
                            <div className="workorders-taskHeader">
                              <h4 className="workorders-taskTitle">{task.title}</h4>
                              <div className="workorders-taskMeta">
                                <span className={`workorders-taskCategory ${task.category.replace(/\s+/g, '-').toLowerCase()}`}>
                                  {task.category}
                                </span>
                                <span className={`workorders-taskPriority ${task.priority}`}>
                                  {priorityOptions.find(p => p.value === task.priority)?.label}
                                </span>
                              </div>
                            </div>
                            
                            <div className="workorders-taskDetails">
                              <span className="workorders-taskDate">
                                Created: {formatDate(task.date)}
                              </span>
                              {task.dueDate && (
                                <span className={`workorders-taskDueDate ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'overdue' : ''}`}>
                                  Due: {formatDate(task.dueDate)}
                                </span>
                              )}
                              <span className="workorders-taskRevisions">
                                Revisions: {task.revisions}
                              </span>
                            </div>
                            
                            {task.notes && (
                              <div className="workorders-taskNotes">
                                <p>{task.notes}</p>
                              </div>
                            )}
                            
                            <div className="workorders-taskActions">
                              <select
                                className={`workorders-statusSelect ${task.status}`}
                                value={task.status}
                                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                              >
                                {statusOptions.map(option => (
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                              
                              <button className="workorders-taskEditBtn">
                                <i className="fas fa-edit"></i>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="workorders-emptyState">
                        <i className="fas fa-clipboard-list workorders-emptyIcon"></i>
                        <p>No tasks added yet</p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {activeTab === 'client' && (
                <div className="workorders-clientPanel">
                  <h3 className="workorders-sectionTitle">Client Information</h3>
                  
                  <div className="workorders-clientDetails">
                    <div className="workorders-clientDetail">
                      <span className="workorders-clientLabel">Company:</span>
                      <span className="workorders-clientValue">{activeOrder.client}</span>
                    </div>
                    
                    <div className="workorders-clientDetail">
                      <span className="workorders-clientLabel">Contact Person:</span>
                      <span className="workorders-clientValue">{activeOrder.clientData?.contact}</span>
                    </div>
                    
                    <div className="workorders-clientDetail">
                      <span className="workorders-clientLabel">Email:</span>
                      <span className="workorders-clientValue">{activeOrder.clientData?.email}</span>
                    </div>
                    
                    <div className="workorders-clientDetail">
                      <span className="workorders-clientLabel">Phone:</span>
                      <span className="workorders-clientValue">{activeOrder.clientData?.phone}</span>
                    </div>
                    
                    <div className="workorders-clientDetail">
                      <span className="workorders-clientLabel">Services:</span>
                      <div className="workorders-clientServices">
                        {activeOrder.services.map(service => (
                          <span key={service} className="workorders-clientService">{service}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="workorders-clientDetail">
                      <span className="workorders-clientLabel">Quoted Amount:</span>
                      <span className="workorders-clientValue">₹{activeOrder.amount}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="workorders-historyPanel">
                  <h3 className="workorders-sectionTitle">Work Order History</h3>
                  
                  {activeOrder.history.length > 0 ? (
                    <ul className="workorders-historyItems">
                      {activeOrder.history.map((item, index) => (
                        <li key={index} className="workorders-historyItem">
                          <div className="workorders-historyHeader">
                            <span className="workorders-historyDate">
                              {new Date(item.date).toLocaleString('en-IN')}
                            </span>
                            <span className="workorders-historyType">
                              {item.type === 'order_created' ? 'Order Created' : 
                               item.type === 'task_added' ? 'Task Added' : 
                               'Task Updated'}
                            </span>
                          </div>
                          
                          {item.type === 'task_added' && (
                            <div className="workorders-historyDetails">
                              <p><strong>Task:</strong> {item.data.title}</p>
                              <p><strong>Category:</strong> {item.data.category}</p>
                              <p><strong>Status:</strong> {statusOptions.find(s => s.value === item.data.status)?.label}</p>
                            </div>
                          )}
                          
                          {item.type === 'task_updated' && (
                            <div className="workorders-historyDetails">
                              <p>Task status was changed to: <strong>{statusOptions.find(s => s.value === item.status)?.label}</strong></p>
                            </div>
                          )}
                          
                          {item.type === 'order_created' && (
                            <div className="workorders-historyDetails">
                              <p>Work order was created</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="workorders-emptyState">
                      <i className="fas fa-history workorders-emptyIcon"></i>
                      <p>No history recorded yet</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'stats' && (
                <div className="workorders-statsPanel">
                  <h3 className="workorders-sectionTitle">Work Order Statistics</h3>
                  
                  <div className="workorders-statsGrid">
                    <div className="workorders-statCard">
                      <div className="workorders-statValue">{activeOrder.tasks.length}</div>
                      <div className="workorders-statLabel">Total Tasks</div>
                    </div>
                    
                    <div className="workorders-statCard">
                      <div className="workorders-statValue">{calculateTaskStats(activeOrder.tasks).completed}</div>
                      <div className="workorders-statLabel">Completed</div>
                    </div>
                    
                    <div className="workorders-statCard">
                      <div className="workorders-statValue">{calculateTaskStats(activeOrder.tasks).inProgress}</div>
                      <div className="workorders-statLabel">In Progress</div>
                    </div>
                    
                    <div className="workorders-statCard">
                      <div className="workorders-statValue">{calculateTaskStats(activeOrder.tasks).pendingReview}</div>
                      <div className="workorders-statLabel">Pending Review</div>
                    </div>
                    
                    <div className="workorders-statCard">
                      <div className="workorders-statValue">{calculateTaskStats(activeOrder.tasks).notStarted}</div>
                      <div className="workorders-statLabel">Not Started</div>
                    </div>
                    
                    <div className="workorders-statCard">
                      <div className="workorders-statValue">₹{activeOrder.amount}</div>
                      <div className="workorders-statLabel">Quoted Amount</div>
                    </div>
                  </div>
                  
                  <div className="workorders-priorityStats">
                    <h4>Tasks by Priority</h4>
                    <div className="workorders-priorityBars">
                      {priorityOptions.map(priority => (
                        <div key={priority.value} className="workorders-priorityBar">
                          <span className="workorders-priorityLabel">{priority.label}</span>
                          <div className="workorders-priorityBarContainer">
                            <div 
                              className={`workorders-priorityBarFill ${priority.value}`}
                              style={{
                                width: `${(activeOrder.tasks.filter(t => t.priority === priority.value).length / activeOrder.tasks.length) * 100}%`
                              }}
                            ></div>
                            <span className="workorders-priorityCount">
                              {activeOrder.tasks.filter(t => t.priority === priority.value).length}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrders;
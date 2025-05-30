import React from 'react';
import { 
  FiUsers, FiDollarSign, FiCalendar, FiActivity,
  FiTrendingUp, FiTrendingDown, FiClock, FiCheckCircle
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  // Sample data
  const stats = [
    { id: 1, title: "Total Clients", value: "248", change: "+12%", trend: "up", icon: <FiUsers /> },
    { id: 2, title: "Revenue", value: "$24,850", change: "+8.5%", trend: "up", icon: <FiDollarSign /> },
    { id: 3, title: "Active Projects", value: "18", change: "-2", trend: "down", icon: <FiActivity /> },
    { id: 4, title: "Upcoming", value: "7", change: "+3", trend: "up", icon: <FiCalendar /> }
  ];

  const recentActivities = [
    { id: 1, client: "Sarah Johnson", action: "Invoice Paid", amount: "$450", time: "2 hours ago", status: "completed" },
    { id: 2, client: "Michael Chen", action: "Service Completed", amount: "$220", time: "5 hours ago", status: "completed" },
    { id: 3, client: "Emily Rodriguez", action: "New Work Order", amount: "$680", time: "1 day ago", status: "pending" },
    { id: 4, client: "David Wilson", action: "Payment Received", amount: "$320", time: "2 days ago", status: "completed" }
  ];

  const projects = [
    { id: 1, name: "HVAC System Repair", client: "Sarah Johnson", progress: 100, status: "completed", due: "Jun 20" },
    { id: 2, name: "Plumbing Leak Fix", client: "Michael Chen", progress: 75, status: "in-progress", due: "Jun 18" },
    { id: 3, name: "Electrical Wiring", client: "Emily Rodriguez", progress: 30, status: "pending", due: "Jun 25" },
    { id: 4, name: "Appliance Install", client: "David Wilson", progress: 10, status: "pending", due: "Jun 22" }
  ];

  return (
    <div className="mono-dashboard">
      <header className="mono-header">
        <h1 className="mono-title">Dashboard</h1>
        <p className="mono-subtitle">Overview of your business performance</p>
      </header>

      <div className="mono-stats-grid">
        {stats.map(stat => (
          <div key={stat.id} className="mono-stat-card">
            <div className="mono-stat-icon">{stat.icon}</div>
            <div className="mono-stat-content">
              <h3 className="mono-stat-title">{stat.title}</h3>
              <p className="mono-stat-value">{stat.value}</p>
              <div className={`mono-stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mono-main-grid">
        <section className="mono-activity-card">
          <h2 className="mono-card-title">Recent Activity</h2>
          <div className="mono-activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="mono-activity-item">
                <div className="mono-activity-icon">
                  {activity.status === 'completed' ? <FiCheckCircle /> : <FiClock />}
                </div>
                <div className="mono-activity-details">
                  <h3 className="mono-activity-client">{activity.client}</h3>
                  <p className="mono-activity-action">{activity.action}</p>
                </div>
                <div className="mono-activity-meta">
                  <span className="mono-activity-amount">{activity.amount}</span>
                  <span className="mono-activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mono-projects-card">
          <h2 className="mono-card-title">Active Projects</h2>
          <div className="mono-projects-list">
            {projects.map(project => (
              <div key={project.id} className="mono-project-item">
                <div className="mono-project-info">
                  <h3 className="mono-project-name">{project.name}</h3>
                  <p className="mono-project-client">{project.client}</p>
                </div>
                <div className="mono-project-progress">
                  <div className="mono-progress-bar">
                    <div 
                      className={`mono-progress-fill ${project.status}`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="mono-project-meta">
                    <span className={`mono-project-status ${project.status}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                    <span className="mono-project-due">Due: {project.due}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mono-cta-section">
        <div className="mono-cta-content">
          <h2 className="mono-cta-title">Need more insights?</h2>
          <p className="mono-cta-text">Generate detailed reports to analyze your business performance</p>
        </div>
        <button className="mono-cta-button">View Reports</button>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/tasks?limit=5');
      const tasks = response.data.data.tasks;
      
      setRecentTasks(tasks);
      
      // Calculate stats
      const statsData = {
        total: response.data.data.pagination.totalTasks,
        pending: tasks.filter(task => task.status === 'pending').length,
        inProgress: tasks.filter(task => task.status === 'in-progress').length,
        completed: tasks.filter(task => task.status === 'completed').length
      };
      
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Welcome back, {user.name}!</h1>
      <p>Role: {user.role}</p>
      
      <div className="dashboard">
        <div className="stat-card">
          <h3>{stats.total}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pending}</h3>
          <p>Pending Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.inProgress}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completed}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="task-list">
        <div className="task-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="btn btn-primary">View All Tasks</Link>
        </div>
        
        {recentTasks.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No tasks found. <Link to="/tasks/new">Create your first task</Link></p>
          </div>
        ) : (
          recentTasks.map(task => (
            <div key={task._id} className="task-item">
              <div className="task-info">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span className={`status-badge status-${task.status}`}>
                    {task.status}
                  </span>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
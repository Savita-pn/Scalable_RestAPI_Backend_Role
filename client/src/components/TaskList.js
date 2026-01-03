import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/tasks?${params.toString()}`);
      setTasks(response.data.data.tasks);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1 // Reset to first page when filtering
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks(); // Refresh the list
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary">Create New Task</Link>
      </div>

      <div className="task-filters">
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select name="priority" value={filters.priority} onChange={handleFilterChange}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select name="limit" value={filters.limit} onChange={handleFilterChange}>
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>No tasks found. <Link to="/tasks/new">Create your first task</Link></p>
          </div>
        ) : (
          tasks.map(task => (
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
                  <span>Created by: {task.createdBy?.name || 'Unknown'}</span>
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                  {task.dueDate && (
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                  {task.assignedTo && (
                    <span>Assigned to: {task.assignedTo.name}</span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <Link to={`/tasks/edit/${task._id}`} className="btn btn-primary">
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(task._id)} 
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.total > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
          >
            Previous
          </button>
          
          {Array.from({ length: pagination.total }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={pagination.current === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.total}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
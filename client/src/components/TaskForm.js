import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchTask();
    }
    // Note: In a real app, you'd fetch users for assignment
    // For this demo, we'll skip the user assignment feature
  }, [id, isEditing]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      const task = response.data.data.task;
      
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo?._id || ''
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Error loading task');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = { ...formData };
      
      // Remove empty fields
      if (!submitData.dueDate) delete submitData.dueDate;
      if (!submitData.assignedTo) delete submitData.assignedTo;

      if (isEditing) {
        await api.put(`/tasks/${id}`, submitData);
      } else {
        await api.post('/tasks', submitData);
      }

      navigate('/tasks');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength="500"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date (Optional)</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/tasks')}
            className="btn"
            style={{ flex: 1, background: '#6c757d', color: 'white' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
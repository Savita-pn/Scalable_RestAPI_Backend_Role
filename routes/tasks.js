const express = require('express');
const Task = require('../models/Task');
const { auth, authorize } = require('../middleware/auth');
const { validate, taskSchema, updateTaskSchema } = require('../utils/validation');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *         description:
 *           type: string
 *           description: Task description
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         assignedTo:
 *           type: string
 *           description: User ID to assign task to
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    if (req.user.role === 'user') {
      query = { $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }] };
    }

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: tasks.length,
          totalTasks: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks'
    });
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
router.get('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Users can only see their own tasks or assigned tasks
    if (req.user.role === 'user') {
      query.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }

    const task = await Task.findOne(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving task'
    });
  }
});

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', auth, validate(taskSchema), async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user._id
    };

    const task = await Task.create(taskData);
    await task.populate('createdBy', 'name email');
    if (task.assignedTo) {
      await task.populate('assignedTo', 'name email');
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task'
    });
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put('/:id', auth, validate(updateTaskSchema), async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Users can only update their own tasks
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }

    const task = await Task.findOneAndUpdate(
      query,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task'
    });
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Users can only delete their own tasks
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    }

    const task = await Task.findOneAndDelete(query);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task'
    });
  }
});

module.exports = router;
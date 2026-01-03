const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(500).required(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').default('pending'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  dueDate: Joi.date().greater('now').optional(),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100).optional(),
  description: Joi.string().min(1).max(500).optional(),
  status: Joi.string().valid('pending', 'in-progress', 'completed').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().greater('now').optional(),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  taskSchema,
  updateTaskSchema
};
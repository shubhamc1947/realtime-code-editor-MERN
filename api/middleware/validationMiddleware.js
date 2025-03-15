const { loginSchema, registerSchema, roomSchema } = require('../validation/schemas');

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errors = error.inner.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({ 
        success: false, 
        msg: 'Validation failed', 
        errors 
      });
    }
  };
};

const validateLogin = validateRequest(loginSchema);
const validateRegister = validateRequest(registerSchema);
const validateRoom = validateRequest(roomSchema);

module.exports = {
  validateLogin,
  validateRegister,
  validateRoom
};
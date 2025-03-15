const yup = require('yup');

const usernameSchema = yup
  .string()
  .email('Username must be a valid email address')
  .required('Username is required');

const passwordSchema = yup
  .string()
  .min(8, 'Password must be at least 8 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
  )
  .required('Password is required');

const loginSchema = yup.object({
  username: usernameSchema,
  password: yup.string().required('Password is required')
});

const registerSchema = yup.object({
  username: usernameSchema,
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required')
});

const roomSchema = yup.object({
  roomId: yup
    .string()
    .matches(/^[a-zA-Z0-9-]+$/, 'Room ID can only contain letters, numbers, and hyphens')
    .required('Room ID is required')
});

module.exports = {
  loginSchema,
  registerSchema,
  roomSchema
};
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Register.scss';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const registerSchema = yup.object({
  username: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const Register = () => {
  const { registerHandler } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validateForm = async () => {
    try {
      await registerSchema.validate(credentials, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      registerHandler(credentials);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h2>Register ...</h2>
        <div className="form-group">
          <input
            type="email"
            name="username"
            placeholder="Email"
            value={credentials.username}
            onChange={handleChange}
            className={errors.username ? 'error' : ''}
            autoComplete="username"
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            autoComplete="new-password"
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={credentials.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
        
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;
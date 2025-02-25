import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  const handleSubmit = (formData) => {
    console.log(formData);
  };

  return <RegisterForm onSubmit={handleSubmit} />;
};

export default Register; 
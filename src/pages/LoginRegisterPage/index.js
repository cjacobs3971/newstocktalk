import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import './style.css';

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

function LoginRegisterPage() {
  const [loginValues, setLoginValues] = useState({
    username: '',
    password: ''
  });

  const [registerValues, setRegisterValues] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      window.location.href = "/dashboard"; // Redirect to Dashboard
    }
  });

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      window.location.href = "/dashboard"; // Redirect to Dashboard
    }
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: loginValues });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    registerUser({ variables: registerValues });
  };

  return (
    <div className="loginRegister">
      <div className="formContainer login">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input type="text" placeholder="Username or Email" onChange={(e) => setLoginValues({ ...loginValues, username: e.target.value })} />
          <input type="password" placeholder="Password" onChange={(e) => setLoginValues({ ...loginValues, password: e.target.value })} />
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="formContainer register">
        <h2>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input type="text" placeholder="Username" onChange={(e) => setRegisterValues({ ...registerValues, username: e.target.value })} />
          <input type="email" placeholder="Email" onChange={(e) => setRegisterValues({ ...registerValues, email: e.target.value })} />
          <input type="password" placeholder="Password" onChange={(e) => setRegisterValues({ ...registerValues, password: e.target.value })} />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default LoginRegisterPage;

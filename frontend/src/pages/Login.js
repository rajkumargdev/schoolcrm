import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login() {
  const [role, setRole] = useState('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = role === 'teacher'
        ? '/auth/teacher/login'
        : '/auth/student/login';

      const body = role === 'teacher'
        ? { username, password }
        : { roll_no: username, password };

      const res = await api.post(endpoint, body);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);

      if (res.data.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Class 7 Marks Tracker</h2>

        <div style={styles.roleSwitch}>
          <button
            style={role === 'teacher' ? styles.activeBtn : styles.btn}
            onClick={() => setRole('teacher')}
          >Teacher</button>
          <button
            style={role === 'student' ? styles.activeBtn : styles.btn}
            onClick={() => setRole('student')}
          >Student</button>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label>{role === 'teacher' ? 'Username' : 'Roll No'}</label>
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'teacher' ? 'rajkumar' : '7001'}
            />
          </div>
          <div style={styles.field}>
            <label>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitBtn}>Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', width: '360px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#333' },
  roleSwitch: { display: 'flex', marginBottom: '1.5rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid #ddd' },
  btn: { flex: 1, padding: '0.5rem', border: 'none', background: '#fff', cursor: 'pointer', fontSize: '14px' },
  activeBtn: { flex: 1, padding: '0.5rem', border: 'none', background: '#1890ff', color: '#fff', cursor: 'pointer', fontSize: '14px' },
  field: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  error: { color: 'red', fontSize: '13px' },
  submitBtn: { width: '100%', padding: '0.6rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', cursor: 'pointer' },
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function AddTest() {
  const [name, setName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/tests', { name, test_date: testDate });
      setMessage(`Test "${name}" added successfully!`);
      setName('');
      setTestDate('');
    } catch (err) {
      setError('Failed to add test.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>Add Test</h2>
          <button style={styles.backBtn} onClick={() => navigate('/teacher')}>← Back</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Test Name</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Unit Test 1"
              required
            />
          </div>
          <div style={styles.field}>
            <label>Test Date</label>
            <input
              style={styles.input}
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              required
            />
          </div>
          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitBtn}>Add Test</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', width: '400px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  backBtn: { padding: '0.4rem 0.8rem', background: '#f0f2f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  field: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' },
  success: { color: 'green', fontSize: '13px' },
  error: { color: 'red', fontSize: '13px' },
  submitBtn: { width: '100%', padding: '0.6rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', cursor: 'pointer' },
};

export default AddTest;

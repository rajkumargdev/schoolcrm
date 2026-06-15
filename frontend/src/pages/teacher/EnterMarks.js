import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';

const SUBJECTS = [
  { id: 1, name: 'Telugu' },
  { id: 2, name: 'Hindi' },
  { id: 3, name: 'English' },
  { id: 4, name: 'Mathematics' },
  { id: 5, name: 'Science' },
  { id: 6, name: 'Social Studies' },
];

function EnterMarks() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, test } = location.state;

  const [scores, setScores] = useState(
    SUBJECTS.reduce((acc, s) => ({ ...acc, [s.id]: '' }), {})
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (subjectId, value) => {
    setScores(prev => ({ ...prev, [subjectId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      for (const subject of SUBJECTS) {
        await api.post('/marks', {
          student_id: student.id,
          test_id: test.id,
          subject_id: subject.id,
          score: parseFloat(scores[subject.id]),
          max_score: 100,
        });
      }
      setMessage('All marks saved successfully!');
    } catch (err) {
      setError('Failed to save marks. Marks may already exist for this test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2>Enter Marks</h2>
            <p style={styles.subtitle}>
              {student.name} ({student.roll_no}) — {test.name}
            </p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/teacher')}>← Back</button>
        </div>

        <form onSubmit={handleSubmit}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Score (out of 100)</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map(s => (
                <tr key={s.id}>
                  <td style={styles.td}>{s.name}</td>
                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      type="number"
                      min="0"
                      max="100"
                      value={scores[s.id]}
                      onChange={(e) => handleChange(s.id, e.target.value)}
                      placeholder="0-100"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save All Marks'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', width: '480px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  subtitle: { color: '#666', margin: '0.25rem 0 0', fontSize: '14px' },
  backBtn: { padding: '0.4rem 0.8rem', background: '#f0f2f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' },
  th: { background: '#f0f2f5', padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' },
  td: { padding: '0.5rem 0.75rem', border: '1px solid #ddd' },
  input: { width: '100px', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  success: { color: 'green', fontSize: '13px' },
  error: { color: 'red', fontSize: '13px' },
  submitBtn: { width: '100%', padding: '0.6rem', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '15px', cursor: 'pointer', marginTop: '0.5rem' },
};

export default EnterMarks;

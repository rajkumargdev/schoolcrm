import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';

function StudentDashboard() {
  const [marks, setMarks] = useState([]);
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const studentId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).id;

  useEffect(() => {
    api.get(`/marks/student/${studentId}`).then(res => setMarks(res.data));
  }, [studentId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const chartData = () => {
    const subjects = [...new Set(marks.map(m => m.subject_name))];
    return subjects.map(subject => {
      const entry = { subject };
      marks
        .filter(m => m.subject_name === subject)
        .forEach(m => {
          entry[m.test_name] = parseFloat(m.score);
        });
      return entry;
    });
  };

  const testNames = [...new Set(marks.map(m => m.test_name))];
  const colors = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {name}</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <h3>My Marks — Class 7</h3>

      {marks.length === 0 ? (
        <p>No marks available yet.</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Subject</th>
                {testNames.map(t => (
                  <th key={t} style={styles.th}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...new Set(marks.map(m => m.subject_name))].map(subject => (
                <tr key={subject}>
                  <td style={styles.td}>{subject}</td>
                  {testNames.map(testName => {
                    const mark = marks.find(
                      m => m.subject_name === subject && m.test_name === testName
                    );
                    return (
                      <td key={testName} style={styles.td}>
                        {mark ? `${mark.score} / ${mark.max_score}` : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: '2rem' }}>Progress Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData()} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {testNames.map((t, i) => (
                <Bar key={t} dataKey={t} fill={colors[i % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  logoutBtn: { padding: '0.5rem 1rem', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f0f2f5', padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' },
  td: { padding: '0.75rem', border: '1px solid #ddd' },
};

export default StudentDashboard;

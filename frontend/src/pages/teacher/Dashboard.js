import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const name = localStorage.getItem('name');

  const fetchData = () => {
    api.get('/students').then(res => setStudents(res.data));
    api.get('/tests').then(res => setTests(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const deleteStudent = async (id) => {
    if (!window.confirm('Delete this student and all their marks?')) return;
    await api.delete(`/students/${id}`);
    fetchData();
  };

  const deleteTest = async (id) => {
    if (!window.confirm('Delete this test and all its marks?')) return;
    await api.delete(`/tests/${id}`);
    fetchData();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {name}</h2>
        <div style={styles.headerBtns}>
          <button style={styles.btn} onClick={() => navigate('/teacher/add-student')}>+ Add Student</button>
          <button style={styles.btn} onClick={() => navigate('/teacher/add-test')}>+ Add Test</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <h3>Students — Class 7</h3>
      {students.length === 0 ? (
        <p>No students yet. Add one!</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Roll No</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Enter Marks</th>
              <th style={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td style={styles.td}>{s.roll_no}</td>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>
                  {tests.map(t => (
                    <button
                      key={t.id}
                      style={styles.markBtn}
                      onClick={() => navigate(`/teacher/marks/${s.id}`, { state: { student: s, test: t } })}
                    >
                      {t.name}
                    </button>
                  ))}
                </td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => deleteStudent(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: '2rem' }}>Tests</h3>
      {tests.length === 0 ? (
        <p>No tests yet. Add one!</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Test Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(t => (
              <tr key={t.id}>
                <td style={styles.td}>{t.name}</td>
                <td style={styles.td}>{t.test_date}</td>
                <td style={styles.td}>
                  <button style={styles.deleteBtn} onClick={() => deleteTest(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  headerBtns: { display: 'flex', gap: '0.5rem' },
  btn: { padding: '0.5rem 1rem', background: '#1890ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  logoutBtn: { padding: '0.5rem 1rem', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f0f2f5', padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' },
  td: { padding: '0.75rem', border: '1px solid #ddd' },
  markBtn: { marginRight: '0.5rem', padding: '0.25rem 0.5rem', background: '#52c41a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '0.25rem 0.75rem', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default Dashboard;

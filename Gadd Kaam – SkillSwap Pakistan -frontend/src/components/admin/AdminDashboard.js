// src/components/admin/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin.css';

const StatsCard = ({ title, value, change }) => (
  <div className="stat-card">
    <div className="stat-title">{title}</div>
    <div className="stat-value">{value}</div>
    {typeof change !== 'undefined' && (
        <div className={`stat-change ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? `+${change}` : change}% this month
        </div>
    )}
  </div>
);

const SimpleBarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="simple-bar-chart">
      {data.map((d) => (
        <div key={d.label} className="chart-row">
          <div className="chart-label">{d.label}</div>
          <div className="chart-bar-wrap">
            <div className="chart-bar" style={{ width: `${(d.value / max) * 100}%` }}>
              <span className="chart-bar-value">{d.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, skills: 0, reports: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const base = process.env.REACT_APP_API_URL || '';
        const resStats = await axios.get(`${base}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(resStats.data || { users: 0, skills: 0, reports: 0 });

        const [usersRes, skillsRes] = await Promise.all([
          axios.get(`${base}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${base}/api/admin/skills`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const userActivity = (usersRes.data || []).slice(0, 5).map(u => ({
          type: 'user',
          label: `${u.firstName} ${u.lastName} joined`,
          when: u.registrationDate || u.createdAt || null
        }));
        const skillActivity = (skillsRes.data || []).slice(0, 5).map(s => ({
          type: 'skill',
          label: `New Skill: ${s.skills ? s.skills.join(', ') : 'Untitled'}`,
          when: s.date || s.createdAt || null
        }));

        const merged = [...userActivity, ...skillActivity]
          .sort((a, b) => (new Date(b.when || 0) - new Date(a.when || 0)))
          .slice(0, 8);

        setRecentActivity(merged);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { label: 'Users', value: stats.users },
    { label: 'Skills', value: stats.skills },
    { label: 'Reports', value: stats.reports },
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="admin-page-title">Overview</h2>

      {loading ? <div className="spinner-small">Loading dashboard...</div> : (
        <>
          <div className="stats-grid">
            <StatsCard title="Total Users" value={stats.users} change={5} />
            <StatsCard title="Total Skills" value={stats.skills} change={2} />
            <StatsCard title="Open Reports" value={stats.reports} change={-1} />
          </div>

          <div className="dashboard-panels">
            <div className="panel">
              <h3>Platform Growth</h3>
              <SimpleBarChart data={chartData} />
            </div>

            <div className="panel">
              <h3>Recent Activity</h3>
              <ul className="recent-activity">
                {recentActivity.length === 0 && <li>No recent activity available</li>}
                {recentActivity.map((a, idx) => (
                  <li key={idx}>
                    <strong>{a.label}</strong>
                    {a.when && <span className="muted"> · {new Date(a.when).toLocaleDateString()}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
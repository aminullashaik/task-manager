import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { ListTodo, CheckCircle, AlertTriangle, LayoutDashboard, CheckCircle2, Eye } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, projectsRes] = await Promise.all([
        API.get("/tasks/dashboard"),
        API.get("/projects")
      ]);
      setStats(statsRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>{title}</span>
        <div style={{ 
          backgroundColor: `${color}15`, 
          color: color, 
          padding: '0.75rem', 
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 20px ${color}10`
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-1px' }}>{value}</div>
    </div>
  );

  if (user?.role === 'client') {
    return (
      <div className="animate-fade-in">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Eye color="var(--accent-color)" /> Client Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user.name}. You have viewer access to all projects.</p>
        </div>

        <div className="dashboard-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)' }}>
              <LayoutDashboard />
            </div>
            <div className="stat-content">
              <p>Total Projects</p>
              <h3>{projects.length}</h3>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
              <CheckCircle2 />
            </div>
            <div className="stat-content">
              <p>Completed Tasks</p>
              <h3>{stats.completed}</h3>
            </div>
          </div>
        </div>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Active Projects</h2>
        <div className="dashboard-grid">
          {projects.map(p => (
            <div key={p._id} className="glass-card">
              <h3>{p.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status: In Progress</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '0.875rem', textDecoration: 'none', fontWeight: '500' }}>
        ← Home
      </Link>
      
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back. Here is what's happening today.</p>
      </div>
      
      <div className="dashboard-grid" style={{ marginBottom: '4rem' }}>
        <StatCard title="Total Tasks" value={stats.total} icon={<ListTodo size={24} />} color="var(--accent-color)" />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle size={24} />} color="var(--success)" />
        <StatCard title="Overdue" value={stats.overdue} icon={<AlertTriangle size={24} />} color="var(--danger)" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Active Projects</h2>
        <Link to="/projects" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>View All Projects →</Link>
      </div>

      <div className="dashboard-grid">
        {projects.slice(0, 3).map((p) => (
          <div key={p._id} className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.03)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>{p.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.members?.length || 0} Team members</p>
          </div>
        ))}
      </div>
      
      <div className="glass-card">
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recent Activity</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to your JBS dashboard! Navigate to Tasks to view and manage your daily assignments.</p>
      </div>
    </div>
  );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Main navigation sidebar component

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar" style={{ backgroundColor: '#000000', borderRight: '1px solid #1f2937' }}>
      <Link to="/dashboard" className="sidebar-logo" style={{ marginBottom: '3rem', fontSize: '1.75rem', fontWeight: '800', textDecoration: 'none' }}>
        JBS
      </Link>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} style={{ padding: '0.875rem 1rem' }}>
          <LayoutDashboard size={22} color={location.pathname === '/dashboard' ? 'var(--accent-color)' : 'var(--text-secondary)'} />
          <span style={{ fontWeight: '500' }}>Dashboard</span>
        </Link>
        <Link to="/projects" className={`nav-link ${location.pathname === '/projects' ? 'active' : ''}`} style={{ padding: '0.875rem 1rem' }}>
          <FolderKanban size={22} color={location.pathname === '/projects' ? 'var(--accent-color)' : 'var(--text-secondary)'} />
          <span style={{ fontWeight: '500' }}>Projects</span>
        </Link>
        <Link to="/tasks" className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`} style={{ padding: '0.875rem 1rem' }}>
          <CheckSquare size={22} color={location.pathname === '/tasks' ? 'var(--accent-color)' : 'var(--text-secondary)'} />
          <span style={{ fontWeight: '500' }}>Tasks</span>
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="#fff" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', padding: '0.5rem' }}>
          <LogOut size={16} style={{ marginRight: '0.5rem' }} />
          Logout
        </button>
      </div>
    </div>
  );
}

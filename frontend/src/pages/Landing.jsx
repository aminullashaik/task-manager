import { Link } from "react-router-dom";
import { CheckSquare, ArrowRight, Shield, Zap, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="animate-fade-in" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000',
      backgroundImage: 'radial-gradient(circle at 50% -20%, #1e293b 0%, #000000 80%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Link to="/" className="sidebar-logo" style={{ fontSize: '2rem', textDecoration: 'none', color: 'var(--accent-color)', fontWeight: '800', letterSpacing: '2px' }}>
          JBS
        </Link>
      </div>
      
      <h1 style={{ fontSize: '5rem', fontWeight: '900', marginBottom: '1rem', color: '#ffffff', letterSpacing: '-2px', lineHeight: '1' }}>
        The Future of <br/><span style={{ color: 'var(--accent-color)' }}>Task Management</span>
      </h1>
      
      <p style={{ color: '#94a3b8', fontSize: '1.5rem', maxWidth: '800px', marginBottom: '3.5rem', fontWeight: '400' }}>
        Streamline your team's workflow with the industry's most advanced task tracking platform.
      </p>
      
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
        <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
          Get Started <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
        </Link>
        <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
          Sign In
        </Link>
      </div>
      
      <div className="dashboard-grid" style={{ maxWidth: '1000px', width: '100%' }}>
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <Zap color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
          <h3>Fast & Fluid</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Lightning fast task updates and real-time dashboard analytics.</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <Users color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h3>Team Sync</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Assign tasks to team members and track progress effortlessly.</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'left' }}>
          <Shield color="var(--warning)" style={{ marginBottom: '1rem' }} />
          <h3>Role Based</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Granular access control for admins and team members.</p>
        </div>
      </div>
    </div>
  );
}

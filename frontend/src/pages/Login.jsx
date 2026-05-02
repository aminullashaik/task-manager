import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { CheckSquare } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalEmail = email;
      if (!finalEmail.includes("@")) {
        finalEmail = `${finalEmail}@gmail.com`;
      }
      const res = await API.post("/auth/login", { email: finalEmail, password });
      if (res.data.token) {
        login(res.data);
        addToast("Welcome back to JBS!", "success");
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Login failed");
        addToast(res.data.message || "Login failed", "error");
      }
    } catch (err) {
      setError("An error occurred during login.");
      addToast("Connection error. Please try again.", "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-box animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '0.5rem' }}>JBS</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Enterprise Task Management</p>
        </div>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', marginBottom: '2rem', fontSize: '0.875rem', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Overview
        </Link>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/signup" style={{ fontWeight: '500' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "An error occurred during login.";
      addToast(errorMsg, "error");
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
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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

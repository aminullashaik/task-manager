import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { FolderKanban, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", { name, createdBy: user.id });
      setName("");
      setShowModal(false);
      addToast("Project created successfully", "success");
      fetchProjects();
    } catch (err) {
      addToast("Failed to create project", "error");
    }
  };

  return (
    <div className="animate-fade-in">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}>
        ← Back to Home
      </Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create Project
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        {projects.map((p) => (
          <div key={p._id} className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)' }}>
                <FolderKanban />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>{p.name}</h3>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Members: {p.members?.length || 0}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '5rem 2rem', 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.02)', 
            borderRadius: 'var(--radius-lg)',
            border: '2px dashed #374151',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <FolderKanban size={64} color="#4b5563" />
            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>No projects yet</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Get started by creating your first project workspace.</p>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                <Plus size={20} style={{ marginRight: '0.5rem' }} /> Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Create New Project</h2>
            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
          </div>
            <form onSubmit={handleCreate} style={{ width: '100%' }}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { Plus, ListTodo } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // Needed to assign to members
  const [showModal, setShowModal] = useState(false);
  
  const [newTask, setNewTask] = useState({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "" });
  
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
        API.get("/auth/users")
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", newTask);
      setNewTask({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "" });
      setShowModal(false);
      addToast("Task created successfully", "success");
      fetchData();
    } catch (err) {
      addToast("Failed to create task", "error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}`, { status });
      addToast(`Status updated to ${status}`, "info");
      fetchData();
    } catch (err) {
      addToast("Failed to update status", "error");
    }
  };

  const getStatusBadge = (status, dueDate) => {
    if (status === 'done') return <span className="badge badge-done">Done</span>;
    if (new Date(dueDate) < new Date() && status !== 'done') return <span className="badge badge-overdue">Overdue</span>;
    return <span className="badge badge-pending">Pending</span>;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem', textDecoration: 'none', fontWeight: '500' }}>
            ← Home
          </Link>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1' }}>Project Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Centralized control for your team's deliverables.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '1rem' }}>
            <Plus size={22} style={{ marginRight: '0.5rem' }} /> New Task
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tasks.map((t) => (
          <div key={t._id} className="glass-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', alignItems: 'center', gap: '3rem', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{t.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{t.description}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>ASSIGNED TO</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.6rem', fontWeight: '900' }}>
                  {t.assignedTo ? users.find(u => u._id === t.assignedTo)?.name?.charAt(0).toUpperCase() : '?'}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{t.assignedTo ? users.find(u => u._id === t.assignedTo)?.name : 'Unassigned'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>STATUS</span>
              {getStatusBadge(t.status, t.dueDate)}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <select 
                className="form-input" 
                style={{ width: '130px', padding: '0.5rem', fontSize: '0.85rem' }}
                value={t.status}
                onChange={(e) => updateStatus(t._id, e.target.value)}
                disabled={user?.role !== 'admin' && user?.id !== t.assignedTo}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => handleDelete(t._id)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', padding: '0.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div style={{ 
            padding: '10rem 2rem', 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.01)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed #1f2937',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <ListTodo size={80} color="#1f2937" />
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>No tasks found</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your workspace is clear. Ready to start something new?</p>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', fontWeight: '700' }}>
                <Plus size={24} style={{ marginRight: '0.5rem' }} /> Create First Task
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Create New Task</h2>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
              >
                CLOSE
              </button>
            </div>
            
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left Side: Title & Description */}
                <div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Task name"
                      value={newTask.title} 
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-input" 
                      placeholder="Details..."
                      rows="5"
                      value={newTask.description} 
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                {/* Right Side: Options */}
                <div>
                  <div className="form-group">
                    <label className="form-label">Project</label>
                    <select 
                      className="form-input" 
                      value={newTask.projectId} 
                      onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <select 
                      className="form-input" 
                      value={newTask.assignedTo} 
                      onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                      required
                    >
                      <option value="">Select User</option>
                      {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={newTask.dueDate} 
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
                      required 
                    />
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Create Task</button>
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

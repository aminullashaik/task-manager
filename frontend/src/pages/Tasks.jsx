import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { Plus, ListTodo, Lock, Unlock, CheckCircle, Calendar, Clock, User, ClipboardList, Shield } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("my"); // "my" or "all"
  
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    projectId: "", 
    assignedTo: [], // Array for multiple users
    dueDate: "" 
  });
  
  // Work entry input states per task
  const [workEntryForm, setWorkEntryForm] = useState({});
  // Log visibility states per task
  const [showLogs, setShowLogs] = useState({});

  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  useEffect(() => {
    // If client or admin, default to "all". If member, default to "my".
    if (user?.role === 'admin' || user?.role === 'client') {
      setActiveTab("all");
    } else {
      setActiveTab("my");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      // Determine task endpoint based on active tab
      const tasksEndpoint = activeTab === "my" ? "/tasks/my-tasks" : "/tasks";
      
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        API.get(tasksEndpoint),
        API.get("/projects"),
        API.get("/auth/users")
      ]);
      
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch data", "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", newTask);
      setNewTask({ title: "", description: "", projectId: "", assignedTo: [], dueDate: "" });
      setShowModal(false);
      addToast("Task created successfully", "success");
      fetchData();
    } catch (err) {
      addToast("Failed to create task", "error");
    }
  };

  // Lock task API call
  const handleLock = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/lock`);
      addToast("Task locked successfully", "success");
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to lock task", "error");
    }
  };

  // Unlock task API call
  const handleUnlock = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/unlock`);
      addToast("Task unlocked successfully", "success");
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to unlock task", "error");
    }
  };

  // Add work entry API call
  const handleAddWorkEntry = async (e, taskId) => {
    e.preventDefault();
    const entry = workEntryForm[taskId];
    if (!entry?.date || !entry?.time) {
      addToast("Please fill in both Date and Time", "warning");
      return;
    }
    try {
      await API.post(`/tasks/${taskId}/work-entry`, entry);
      setWorkEntryForm({
        ...workEntryForm,
        [taskId]: { date: "", time: "" }
      });
      addToast("Work entry added successfully", "success");
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to add work entry", "error");
    }
  };

  // Complete task API call
  const handleComplete = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/complete`);
      addToast("Task marked as completed", "success");
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to complete task", "error");
    }
  };

  const handleWorkEntryChange = (taskId, field, value) => {
    setWorkEntryForm({
      ...workEntryForm,
      [taskId]: {
        ...workEntryForm[taskId],
        [field]: value
      }
    });
  };

  const toggleLogs = (taskId) => {
    setShowLogs({
      ...showLogs,
      [taskId]: !showLogs[taskId]
    });
  };

  const getStatusBadge = (t) => {
    if (t.status === 'done') return <span className="badge badge-done" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>Completed</span>;
    if (t.isLocked) return <span className="badge badge-working" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>Working (Locked)</span>;
    if (t.dueDate && new Date(t.dueDate) < new Date()) return <span className="badge badge-overdue" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>Overdue</span>;
    return <span className="badge badge-pending" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-color)' }}>Pending</span>;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem', textDecoration: 'none', fontWeight: '500' }}>
            ← Home
          </Link>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1' }}>Project Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Manage assignments, track work progress, and log entries.</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: 'var(--radius-md)', fontWeight: '700', fontSize: '1rem' }}>
            <Plus size={22} style={{ marginRight: '0.5rem' }} /> New Task
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab("my")}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'my' ? 'var(--accent-color)' : 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            paddingBottom: '0.5rem',
            borderBottom: activeTab === 'my' ? '2px solid var(--accent-color)' : 'none'
          }}
        >
          My Tasks
        </button>
        <button 
          onClick={() => setActiveTab("all")}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'all' ? 'var(--accent-color)' : 'var(--text-secondary)',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            paddingBottom: '0.5rem',
            borderBottom: activeTab === 'all' ? '2px solid var(--accent-color)' : 'none'
          }}
        >
          All Tasks
        </button>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {tasks.map((t) => {
          // Check if current user is assigned to this task
          const isAssigned = t.assignedTo?.some(assignee => assignee._id === user?.id);
          const isLockedByMe = t.isLocked && t.lockedBy?._id === user?.id;

          return (
            <div key={t._id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
              
              {/* Primary Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', alignItems: 'start', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{t.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{t.description}</p>
                  
                  {/* Due Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    <span>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No date'}</span>
                  </div>
                </div>
                
                {/* Assigned To Avatar Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>ASSIGNED TO</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {t.assignedTo && t.assignedTo.length > 0 ? (
                        t.assignedTo.map((assignee, idx) => (
                          <div 
                            key={assignee._id}
                            title={assignee.name}
                            style={{ 
                              width: '28px', 
                              height: '28px', 
                              borderRadius: '50%', 
                              background: `hsl(${(idx * 137) % 360}, 60%, 40%)`, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '0.75rem', 
                              fontWeight: '800',
                              border: '2px solid #0b0f19',
                              marginLeft: idx > 0 ? '-10px' : '0px',
                              zIndex: 10 - idx,
                              color: '#fff'
                            }}
                          >
                            {assignee.name?.charAt(0).toUpperCase()}
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Unassigned</span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                      {t.assignedTo && t.assignedTo.length > 0 
                        ? `${t.assignedTo.length} assignee${t.assignedTo.length > 1 ? 's' : ''}` 
                        : ''}
                    </span>
                  </div>
                </div>

                {/* Status Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>STATUS</span>
                  <div>{getStatusBadge(t)}</div>
                </div>

                {/* Lock Action / Completion Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  {t.status !== 'done' && (
                    <>
                      {/* If unlocked, show Lock button */}
                      {!t.isLocked && (isAssigned || user?.role === 'admin') && (
                        <button 
                          onClick={() => handleLock(t._id)}
                          className="btn btn-outline"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          <Lock size={14} /> Lock Task
                        </button>
                      )}

                      {/* Locked by someone else */}
                      {t.isLocked && !isLockedByMe && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: '600' }}>
                          <Lock size={14} /> Locked by {t.lockedBy?.name || 'User'}
                        </div>
                      )}

                      {/* Locked by current user */}
                      {isLockedByMe && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleUnlock(t._id)}
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--warning)', color: 'var(--warning)' }}
                          >
                            <Unlock size={14} /> Unlock
                          </button>
                          <button 
                            onClick={() => handleComplete(t._id)}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--success)' }}
                          >
                            <CheckCircle size={14} /> Complete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {t.status === 'done' && (
                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: '700' }}>
                      Completed ✅
                    </span>
                  )}
                </div>
              </div>

              {/* Working Screen Form (Visible only if locked by current user) */}
              {isLockedByMe && t.status !== 'done' && (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginTop: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ClipboardList size={18} color="var(--accent-color)" /> Log Work Entry
                  </h4>
                  <form onSubmit={(e) => handleAddWorkEntry(e, t._id)} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 0 }}>Date</label>
                      <input 
                        type="date"
                        className="form-input"
                        style={{ padding: '0.5rem' }}
                        value={workEntryForm[t._id]?.date || ""}
                        onChange={(e) => handleWorkEntryChange(t._id, "date", e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 0 }}>Time spent / Hour</label>
                      <input 
                        type="text"
                        className="form-input"
                        placeholder="e.g. 2 hours or 10:30"
                        style={{ padding: '0.5rem' }}
                        value={workEntryForm[t._id]?.time || ""}
                        onChange={(e) => handleWorkEntryChange(t._id, "time", e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}>
                      Add Work Log
                    </button>
                  </form>
                </div>
              )}

              {/* Work Logs Collapsible Section */}
              {t.workEntries && t.workEntries.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                  <button 
                    onClick={() => toggleLogs(t._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.85rem', padding: 0, fontWeight: '700' }}
                  >
                    {showLogs[t._id] ? "Hide Work logs ▲" : `Show Work Logs (${t.workEntries.length}) ▼`}
                  </button>
                  {showLogs[t._id] && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {t.workEntries.map((entry, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(255,255,255,0.01)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={14} color="var(--text-secondary)" /> {entry.userName}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={14} color="var(--text-secondary)" /> {entry.date}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} color="var(--text-secondary)" /> {entry.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
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
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                {activeTab === 'my' ? "No tasks assigned directly to you." : "Your workspace has no tasks."}
              </p>
            </div>
            {user?.role === 'admin' && (
              <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', fontWeight: '700' }}>
                <Plus size={24} style={{ marginRight: '0.5rem' }} /> Create First Task
              </button>
            )}
          </div>
        )}
      </div>

      {/* Creation Modal (Admin only) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>Create New Task</h2>
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

                {/* Right Side: Project, Assignees, Due Date */}
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
                  
                  {/* Multi-Select Assignees */}
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Shield size={14} color="var(--accent-color)" /> Assignees (Select one or more)
                    </label>
                    <div style={{ 
                      maxHeight: '120px', 
                      overflowY: 'auto', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {users.map(u => {
                        const isChecked = newTask.assignedTo.includes(u._id);
                        return (
                          <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const updatedAssigned = isChecked 
                                  ? newTask.assignedTo.filter(id => id !== u._id)
                                  : [...newTask.assignedTo, u._id];
                                setNewTask({ ...newTask, assignedTo: updatedAssigned });
                              }}
                            />
                            {u.name} <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>({u.role})</span>
                          </label>
                        );
                      })}
                    </div>
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

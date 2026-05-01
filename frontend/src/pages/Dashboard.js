import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => { fetchProjects(); }, []);
  useEffect(() => { if (activeProject) fetchTasks(); }, [activeProject]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data);
      if (res.data.length > 0) setActiveProject(res.data[0]);
    } catch (err) { console.log(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/api/tasks?projectId=${activeProject._id}`);
      setTasks(res.data);
    } catch (err) { console.log(err); }
  };

  const createProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/projects', projectForm);
      setProjects([...projects, res.data]);
      setActiveProject(res.data);
      setProjectForm({ name: '', description: '' });
      setShowProjectForm(false);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const createTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/tasks', { ...taskForm, project: activeProject._id });
      setTasks([...tasks, res.data]);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowTaskForm(false);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const res = await api.put(`/api/tasks/${taskId}`, { status });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) { console.log(err); }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) { console.log(err); }
  };

  const priorityColor = (p) => ({ high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-green-500' }[p]);
  const statusColor = (s) => ({ todo: 'bg-gray-500', 'in-progress': 'bg-blue-500', completed: 'bg-green-500' }[s]);

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <span className="text-white font-bold text-xl">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">👋 {user?.name}</span>
          <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full text-xs">{user?.role}</span>
          <button onClick={logout} className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-4 py-2 rounded-lg text-sm transition">Logout</button>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <div className="w-72 bg-white/5 border-r border-white/10 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-semibold">Projects</h2>
            <button onClick={() => setShowProjectForm(!showProjectForm)} className="bg-purple-600 hover:bg-purple-700 text-white w-8 h-8 rounded-full text-lg flex items-center justify-center">+</button>
          </div>

          {showProjectForm && (
            <form onSubmit={createProject} className="bg-white/10 rounded-xl p-4 mb-4 space-y-3">
              <input
                type="text"
                placeholder="Project name"
                value={projectForm.name}
                onChange={e => setProjectForm({...projectForm, name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={projectForm.description}
                onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400"
              />
              <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm">Create</button>
            </form>
          )}

          <div className="space-y-2">
            {projects.map(p => (
              <div
                key={p._id}
                onClick={() => setActiveProject(p)}
                className={`p-3 rounded-xl cursor-pointer transition ${activeProject?._id === p._id ? 'bg-purple-600/40 border border-purple-500/50' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
              >
                <p className="text-white font-medium text-sm">{p.name}</p>
                <p className="text-gray-400 text-xs mt-1">{p.description}</p>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No projects yet</p>}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeProject ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">{activeProject.name}</h1>
                  <p className="text-gray-400 text-sm">{activeProject.description}</p>
                </div>
                <button onClick={() => setShowTaskForm(!showTaskForm)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                  + Add Task
                </button>
              </div>

              {showTaskForm && (
                <form onSubmit={createTask} className="bg-white/10 backdrop-blur rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={taskForm.title}
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={taskForm.description}
                    onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400"
                  />
                  <select
                    value={taskForm.priority}
                    onChange={e => setTaskForm({...taskForm, priority: e.target.value})}
                    className="bg-slate-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  />
                  <button type="submit" disabled={loading} className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm">Create Task</button>
                </form>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[{ label: 'Todo', count: todoTasks.length, color: 'from-gray-600 to-gray-700' },
                  { label: 'In Progress', count: inProgressTasks.length, color: 'from-blue-600 to-blue-700' },
                  { label: 'Completed', count: completedTasks.length, color: 'from-green-600 to-green-700' }
                ].map(s => (
                  <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 text-white`}>
                    <p className="text-3xl font-bold">{s.count}</p>
                    <p className="text-sm opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Kanban */}
              <div className="grid grid-cols-3 gap-4">
                {[{ title: 'Todo', tasks: todoTasks, status: 'todo' },
                  { title: 'In Progress', tasks: inProgressTasks, status: 'in-progress' },
                  { title: 'Completed', tasks: completedTasks, status: 'completed' }
                ].map(col => (
                  <div key={col.status} className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusColor(col.status)}`}></span>
                      {col.title}
                      <span className="bg-white/10 text-gray-400 text-xs px-2 py-0.5 rounded-full ml-auto">{col.tasks.length}</span>
                    </h3>
                    <div className="space-y-3">
                      {col.tasks.map(task => (
                        <div key={task._id} className="bg-white/10 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-white text-sm font-medium">{task.title}</p>
                            <button onClick={() => deleteTask(task._id)} className="text-red-400 hover:text-red-300 text-xs ml-2">✕</button>
                          </div>
                          {task.description && <p className="text-gray-400 text-xs mb-3">{task.description}</p>}
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`${priorityColor(task.priority)} text-white text-xs px-2 py-0.5 rounded-full`}>{task.priority}</span>
                            {task.dueDate && <span className="text-gray-400 text-xs">📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                          </div>
                          <select
                            value={task.status}
                            onChange={e => updateTaskStatus(task._id, e.target.value)}
                            className="w-full bg-slate-800 border border-white/20 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                          >
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      ))}
                      {col.tasks.length === 0 && <p className="text-gray-600 text-xs text-center py-4">No tasks</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-6xl mb-4">📋</p>
                <p className="text-white text-xl font-semibold">No project selected</p>
                <p className="text-gray-400 mt-2">Create a project to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


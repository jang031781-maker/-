import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, ArrowRight, ChevronRight, Plus, Trash2, Edit2, 
  LayoutGrid, User, BookOpen, FileText, Calendar, Mail, Lock,
  ExternalLink, ArrowUpRight
} from 'lucide-react';
import { Project, Section } from './types';

// --- Components ---

const Navbar = ({ activeSection, setActiveSection }: { activeSection: Section, setActiveSection: (s: Section) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems: { label: string, value: Section }[] = [
    { label: 'HOME', value: 'home' },
    { label: 'PROFILE', value: 'profile' },
    { label: 'PROJECTS', value: 'projects' },
    { label: 'ARCHIVE', value: 'archive' },
    { label: 'CONTACT', value: 'contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
      <button 
        onClick={() => setActiveSection('home')}
        className="text-xl font-bold tracking-tight hover:opacity-70 transition-opacity"
      >
        Dahyeon Jang
      </button>

      <div className="hidden md:flex gap-8">
        {navItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setActiveSection(item.value)}
            className={`text-[11px] font-semibold tracking-[0.2em] uppercase transition-all hover:opacity-100 ${
              activeSection === item.value ? 'opacity-100' : 'opacity-50'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button 
          onClick={() => setActiveSection('admin')}
          className="opacity-30 hover:opacity-100 transition-opacity"
        >
          <Lock size={14} />
        </button>
      </div>

      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-ink p-8 flex flex-col gap-6 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setActiveSection(item.value);
                  setIsOpen(false);
                }}
                className="text-lg font-medium tracking-widest uppercase text-left"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onExplore }: { onExplore: () => void }) => (
  <section className="min-h-screen flex flex-col justify-center px-6 md:px-24 bg-bg">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-5xl"
    >
      <span className="text-[11px] font-bold tracking-[0.3em] uppercase opacity-50 mb-6 block">
        Spatial Strategist & Planner
      </span>
      <h1 className="text-6xl md:text-[120px] font-bold leading-[0.9] tracking-tighter mb-12">
        Planning <br />
        <span className="opacity-50">Beyond Space</span>
      </h1>
      <p className="text-xl md:text-2xl font-light text-ink/70 max-w-2xl mb-12 leading-relaxed">
        공간은 도구이고, 기획은 본질입니다. <br />
        단순한 설계를 넘어, 문제를 정의하고 경험을 설계합니다.
      </p>
      
      <div className="flex flex-wrap gap-12 border-t border-ink/10 pt-12">
        {['Strategy', 'Experience', 'Execution'].map((word) => (
          <div key={word} className="flex flex-col">
            <span className="text-[10px] font-mono uppercase opacity-40 mb-2">Core Value</span>
            <span className="text-lg font-bold tracking-wider">{word}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ x: 10 }}
        onClick={onExplore}
        className="mt-16 flex items-center gap-4 group"
      >
        <div className="w-12 h-12 rounded-full border border-ink flex items-center justify-center group-hover:bg-ink group-hover:text-bg transition-all">
          <ArrowRight size={20} />
        </div>
        <span className="text-sm font-bold tracking-widest uppercase">Explore Projects</span>
      </motion.button>
    </motion.div>
  </section>
);

const ProjectGrid = ({ projects, onSelect }: { projects: Project[], onSelect: (p: Project) => void }) => {
  const mainProjects = projects.filter(p => p.type === 'main');
  const supportingProjects = projects.filter(p => p.type === 'supporting');

  return (
    <section className="py-32 px-6 md:px-24 bg-white">
      <div className="mb-24">
        <h2 className="text-4xl font-bold mb-4">Planning Projects</h2>
        <p className="text-ink/50 uppercase tracking-widest text-xs">MAIN Projects (주도적 기획)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        {mainProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
            onClick={() => onSelect(project)}
          >
            <div className="aspect-[4/5] overflow-hidden mb-8 bg-neutral-100">
              <img 
                src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/1000'} 
                alt={project.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase opacity-40 mb-2 block">{project.category}</span>
                <h3 className="text-2xl font-bold group-hover:opacity-70 transition-all">{project.title}</h3>
              </div>
              <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      {supportingProjects.length > 0 && (
        <div className="mt-48">
          <div className="mb-16 border-b border-ink/10 pb-8">
            <h2 className="text-2xl font-bold mb-2">Strategy & Operations</h2>
            <p className="text-ink/50 uppercase tracking-widest text-[10px]">Supporting Projects (기획 스펙트럼)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {supportingProjects.map((project) => (
              <div 
                key={project.id}
                className="p-8 border border-ink/5 hover:border-ink/20 transition-all cursor-pointer"
                onClick={() => onSelect(project)}
              >
                <span className="text-[9px] font-mono uppercase opacity-40 mb-4 block">{project.category}</span>
                <h3 className="text-xl font-bold mb-4">{project.title}</h3>
                <p className="text-sm text-ink/60 line-clamp-2 mb-6">{project.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
                  View Strategy <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const ProjectDetail = ({ project, onClose }: { project: Project, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-bg overflow-y-auto"
  >
    <div className="max-w-5xl mx-auto px-6 py-24">
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-bg transition-all z-[110]"
      >
        <X size={20} />
      </button>

      <div className="mb-24">
        <span className="text-xs font-mono uppercase opacity-40 mb-4 block">{project.category}</span>
        <h2 className="text-5xl md:text-7xl font-bold mb-12">{project.title}</h2>
        
        <div className="space-y-8 mb-24">
          {project.images.map((img, i) => (
            <div key={i} className="aspect-video w-full overflow-hidden rounded-2xl">
              <img 
                src={img} 
                alt={`${project.title} ${i + 1}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-24">
            <section>
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mb-8">01. Problem Definition</h4>
              <p className="text-2xl font-light leading-relaxed text-balance">{project.problem}</p>
            </section>
            
            <section>
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mb-8">02. Strategy</h4>
              <p className="text-xl font-light leading-relaxed text-ink/80 whitespace-pre-line">{project.strategy}</p>
            </section>

            <section>
              <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mb-8">03. Result</h4>
              <p className="text-xl font-light leading-relaxed text-ink/80">{project.result}</p>
            </section>
          </div>

          <div className="bg-neutral-50 p-12 rounded-2xl h-fit sticky top-24">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={20} className="text-accent" />
              <h4 className="text-sm font-bold tracking-widest uppercase">Planning Insight</h4>
            </div>
            <p className="text-lg font-medium leading-relaxed text-ink/70">
              "{project.insight}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const AdminPanel = ({ projects, settings, onRefresh }: { projects: Project[], settings: any, onRefresh: () => void }) => {
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingSettings, setEditingSettings] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (settings) setEditingSettings(settings);
  }, [settings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2005') setIsAuthed(true);
    else alert('Wrong password');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isProfile = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (isProfile) {
        setEditingSettings({ ...editingSettings, profileImageUrl: data.urls[0] });
      } else if (editingProject) {
        setEditingProject({ 
          ...editingProject, 
          images: [...(editingProject.images || []), ...data.urls] 
        });
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProject?.id ? 'PUT' : 'POST';
    const url = editingProject?.id ? `/api/projects/${editingProject.id}` : '/api/projects';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editingProject, password })
    });
    
    setEditingProject(null);
    onRefresh();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editingSettings, password })
    });
    alert('Settings saved');
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    onRefresh();
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <form onSubmit={handleLogin} className="p-12 glass rounded-3xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-8">Admin Access</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full p-4 bg-white/50 border border-ink/10 rounded-xl mb-6 focus:outline-none focus:border-ink"
          />
          <button className="w-full py-4 bg-ink text-bg rounded-xl font-bold tracking-widest uppercase">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-6 md:p-24 space-y-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Profile Settings</h2>
          <button 
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-ink text-bg rounded-full font-bold text-xs tracking-widest uppercase"
          >
            Save Profile
          </button>
        </div>
        
        {editingSettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 glass p-12 rounded-3xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase opacity-40">Profile Image</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 overflow-hidden border border-ink/10">
                    {editingSettings.profileImageUrl && (
                      <img src={editingSettings.profileImageUrl} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <input type="file" onChange={(e) => handleFileUpload(e, true)} className="text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase opacity-40">Bio</label>
                <textarea 
                  rows={4} 
                  value={editingSettings.bio} 
                  onChange={e => setEditingSettings({...editingSettings, bio: e.target.value})}
                  className="w-full p-4 border border-ink/10 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase opacity-40">Resume Data (JSON)</label>
              <textarea 
                rows={10} 
                value={editingSettings.resumeData} 
                onChange={e => setEditingSettings({...editingSettings, resumeData: e.target.value})}
                className="w-full p-4 border border-ink/10 rounded-xl font-mono text-xs"
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Project Management</h2>
          <button 
            onClick={() => setEditingProject({ type: 'main', order_index: 0, images: [] })}
            className="flex items-center gap-2 px-6 py-3 bg-ink text-bg rounded-full font-bold text-xs tracking-widest uppercase"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        <div className="grid gap-6">
          {projects.map(p => (
            <div key={p.id} className="p-6 glass rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono uppercase opacity-40 mb-1 block">{p.type} | {p.category}</span>
                <h3 className="text-xl font-bold">{p.title}</h3>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setEditingProject(p)} className="p-3 hover:bg-ink/5 rounded-full"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-3 hover:bg-red-50 text-red-500 rounded-full"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingProject && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ink/20 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto"
          >
            <motion.form 
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              onSubmit={handleSaveProject}
              className="bg-white p-12 rounded-3xl w-full max-w-3xl space-y-6 my-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{editingProject.id ? 'Edit' : 'New'} Project</h3>
                <button type="button" onClick={() => setEditingProject(null)}><X /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase opacity-40">Title</label>
                  <input required value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full p-3 border border-ink/10 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase opacity-40">Category</label>
                  <input required value={editingProject.category || ''} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full p-3 border border-ink/10 rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase opacity-40">Type</label>
                  <select value={editingProject.type} onChange={e => setEditingProject({...editingProject, type: e.target.value as any})} className="w-full p-3 border border-ink/10 rounded-lg">
                    <option value="main">MAIN</option>
                    <option value="supporting">Supporting</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase opacity-40">Order Index</label>
                  <input type="number" value={editingProject.order_index || 0} onChange={e => setEditingProject({...editingProject, order_index: parseInt(e.target.value)})} className="w-full p-3 border border-ink/10 rounded-lg" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase opacity-40">Images</label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {editingProject.images?.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-ink/10">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setEditingProject({...editingProject, images: editingProject.images?.filter((_, idx) => idx !== i)})}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <input type="file" multiple onChange={handleFileUpload} disabled={uploading} />
                  {uploading && <span className="text-xs animate-pulse">Uploading...</span>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase opacity-40">Description</label>
                <textarea rows={2} value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full p-3 border border-ink/10 rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase opacity-40">Problem Definition</label>
                <textarea rows={3} value={editingProject.problem || ''} onChange={e => setEditingProject({...editingProject, problem: e.target.value})} className="w-full p-3 border border-ink/10 rounded-lg" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase opacity-40">Strategy</label>
                <textarea rows={4} value={editingProject.strategy || ''} onChange={e => setEditingProject({...editingProject, strategy: e.target.value})} className="w-full p-3 border border-ink/10 rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase opacity-40">Result</label>
                  <textarea rows={3} value={editingProject.result || ''} onChange={e => setEditingProject({...editingProject, result: e.target.value})} className="w-full p-3 border border-ink/10 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase opacity-40">Planning Insight</label>
                  <textarea rows={3} value={editingProject.insight || ''} onChange={e => setEditingProject({...editingProject, insight: e.target.value})} className="w-full p-3 border border-ink/10 rounded-lg" />
                </div>
              </div>

              <button className="w-full py-4 bg-ink text-bg rounded-xl font-bold tracking-widest uppercase">Save Project</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [projRes, setRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/settings')
      ]);
      const projData = await projRes.json();
      const setData = await setRes.json();
      setProjects(projData);
      setSettings(setData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resume = settings ? JSON.parse(settings.resumeData || '{}') : {};

  return (
    <div className="relative">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main>
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero onExplore={() => setActiveSection('projects')} />
            </motion.div>
          )}

          {activeSection === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProjectGrid projects={projects} onSelect={setSelectedProject} />
            </motion.div>
          )}

          {activeSection === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-48 px-6 md:px-24">
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24 mb-32">
                  <div className="md:col-span-1">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-ink/5 sticky top-48">
                      {settings?.profileImageUrl ? (
                        <img src={settings.profileImageUrl} alt="Dahyeon Jang" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink/20 uppercase font-bold tracking-widest">Photo</div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-6xl font-bold mb-12">Profile</h2>
                    <p className="text-3xl font-light leading-relaxed mb-12 whitespace-pre-line">
                      {settings?.bio || '공간 기반 문제 해결 기획자 장다현입니다.'}
                    </p>
                    
                    <div className="space-y-24 mt-32">
                      <section>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-8">Education</h4>
                        <div className="space-y-8">
                          {resume.education?.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between items-start">
                              <div>
                                <h3 className="text-2xl font-bold">{edu.school}</h3>
                                <p className="text-ink/60">{edu.degree}</p>
                              </div>
                              <span className="text-sm font-mono opacity-40">{edu.period}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-8">Experience</h4>
                        <div className="space-y-12">
                          {resume.experience?.map((exp: any, i: number) => (
                            <div key={i}>
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-bold">{exp.title}</h3>
                                <span className="text-sm font-mono opacity-40">{exp.period}</span>
                              </div>
                              <p className="text-ink/70">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-8">Skills</h4>
                        <div className="flex flex-wrap gap-4">
                          {resume.skills?.map((skill: string) => (
                            <span key={skill} className="px-6 py-2 bg-neutral-100 rounded-full text-sm font-medium">{skill}</span>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'archive' && (
            <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-48 px-6 md:px-24">
              <div className="max-w-4xl">
                <h2 className="text-6xl font-bold mb-12">Strategy Archive</h2>
                <p className="text-xl text-ink/60 mb-16">기획의 과정과 생각의 파편들을 기록합니다.</p>
                
                <div className="grid gap-8">
                  {[
                    { date: '2024.02', title: '공간의 본질에 대하여: 왜 기획이 우선인가', tag: 'Thought' },
                    { date: '2024.01', title: '사용자 행태 분석 방법론 연구', tag: 'Methodology' },
                    { date: '2023.12', title: '브랜드 경험 설계의 5단계 프로세스', tag: 'Process' },
                  ].map((post, i) => (
                    <div key={i} className="group flex justify-between items-center py-8 border-b border-ink/5 cursor-pointer hover:px-4 transition-all">
                      <div className="flex items-center gap-12">
                        <span className="text-xs font-mono opacity-30">{post.date}</span>
                        <h3 className="text-xl font-bold group-hover:opacity-70">{post.title}</h3>
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-40 px-3 py-1 border border-ink/10 rounded-full">{post.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-48 px-6 md:px-24">
              <div className="max-w-4xl">
                <h2 className="text-6xl font-bold mb-12">Contact</h2>
                <p className="text-2xl font-light mb-16">새로운 기획과 문제 해결의 여정을 함께하고 싶습니다.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2">Email</h4>
                      <a href="mailto:planner@example.com" className="text-2xl hover:opacity-70 transition-all">planner@example.com</a>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2">Social</h4>
                      <div className="flex gap-6 text-lg">
                        <a href="#" className="hover:opacity-70">LinkedIn</a>
                        <a href="#" className="hover:opacity-70">Instagram</a>
                        <a href="#" className="hover:opacity-70">Behance</a>
                      </div>
                    </div>
                  </div>
                  
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" placeholder="Name" className="w-full p-4 bg-transparent border-b border-ink/10 focus:border-ink outline-none transition-all" />
                    <input type="email" placeholder="Email" className="w-full p-4 bg-transparent border-b border-ink/10 focus:border-ink outline-none transition-all" />
                    <textarea placeholder="Message" rows={4} className="w-full p-4 bg-transparent border-b border-ink/10 focus:border-ink outline-none transition-all" />
                    <button className="flex items-center gap-4 group pt-4">
                      <div className="w-10 h-10 rounded-full border border-ink flex items-center justify-center group-hover:bg-ink group-hover:text-bg transition-all">
                        <ArrowRight size={16} />
                      </div>
                      <span className="text-xs font-bold tracking-widest uppercase">Send Message</span>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminPanel projects={projects} settings={settings} onRefresh={fetchData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      <footer className="py-12 px-6 md:px-24 border-t border-ink/5 bg-white text-ink/40 text-[10px] tracking-[0.2em] uppercase flex justify-between">
        <span>© 2026 Dahyeon Jang</span>
        <div className="flex gap-8">
          <a href="#" className="hover:text-ink transition-colors">Instagram</a>
          <a href="#" className="hover:text-ink transition-colors">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}

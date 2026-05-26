import { useState, useEffect, useRef } from "react";
import ResumeUpload from "./components/ResumeUpload";
import JobMatch from "./components/JobMatch";
import Auth from "./components/Auth";
import DailyTasks from "./components/DailyTasks";
import Progress from "./components/Progress";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import ResumeTips from "./components/ResumeTips";
import LearningResources from "./components/LearningResources";
import RejectionAnalyzer from "./components/RejectionAnalyzer";
import InterviewSimulator from "./components/InterviewSimulator";
import Profile from "./components/Profile";
import posthog from "posthog-js";
import ProjectRecommendations from "./components/ProjectRecommendations";
import CareerRoadmap from "./components/CareerRoadmap";

function App() {
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem("resumeData");
    return saved ? JSON.parse(saved) : null;
  });
  const [showJobs, setShowJobs] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      setShowLanding(false);
      posthog.identify(u.id, {
        email: u.email,
        name: u.name
      });
    }
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) setIsAdmin(true);
    if (window.location.hash === "#admin") {
      setShowAdminLogin(true);
    }
  }, []);

  const handleLogout = () => {
    posthog.capture("user_logout");
    posthog.reset();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resumeData");
    setUser(null);
    setResumeData(null);
    setShowJobs(false);
    setActiveTab("dashboard");
    setShowLanding(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    setShowAdminLogin(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    posthog.capture("tab_changed", { tab });
  };

  if (showLanding && !user && !isAdmin) {
    return <Landing onGetStarted={() => setShowLanding(false)} />;
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  if (showAdminLogin) {
    return <AdminLogin onAdminLogin={() => setIsAdmin(true)} />;
  }

  if (!user) {
    return (
      <Auth
        onAuthSuccess={(u) => {
          setUser(u);
          setShowLanding(false);
          posthog.identify(u.id, {
            email: u.email,
            name: u.name
          });
          posthog.capture("user_login");
        }}
        onAdminClick={() => setShowAdminLogin(true)}
        onBack={() => setShowLanding(true)}
      />
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "roadmap", label: "Roadmap", icon: "🗺️" },
    { id: "resume", label: "Resume", icon: "📄" },
    { id: "tips", label: "Resume Tips", icon: "💡" },
    { id: "learning", label: "Learn", icon: "📚" },
    { id: "tasks", label: "Daily Tasks", icon: "📋" },
    { id: "rejection", label: "Rejection", icon: "💔" },
    { id: "interview", label: "Interview", icon: "🎤" },
    { id: "progress", label: "Progress", icon: "📊" },
    { id: "projects", label: "Projects", icon: "💻" },
  ];

  return (
    <div className="min-h-screen animated-bg text-white flex">

      {/* Sidebar Trigger Zone */}
      <div
        ref={triggerRef}
        className="fixed left-0 top-0 w-3 h-full z-50"
        onMouseEnter={() => setSidebarOpen(true)}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
        style={{
          background: "rgba(10, 15, 30, 0.97)",
          backdropFilter: "blur(20px)",
          borderRight: sidebarOpen ? "1px solid rgba(99, 102, 241, 0.2)" : "none",
          boxShadow: sidebarOpen ? "4px 0 30px rgba(0,0,0,0.5)" : "none"
        }}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-800/50 flex-shrink-0">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleTabChange("dashboard")}
          >
            <span className="text-2xl">🚀</span>
            <div>
              <h1 className="text-lg font-black gradient-text">CareerOS</h1>
              <p className="text-gray-500 text-xs">Your Job Co-Pilot</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div
          className="p-4 border-b border-gray-800/50 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all flex-shrink-0"
          onClick={() => handleTabChange("profile")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">{user.name}</p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider px-2 mb-2">
            Navigation
          </p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-1 text-left ${
                activeTab === tab.id
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-700/50"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-900/20 transition-all"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar Peek Indicator */}
      {!sidebarOpen && (
        <div
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1 pl-1 cursor-pointer"
          onMouseEnter={() => setSidebarOpen(true)}
        >
          <div className="w-1 h-8 bg-indigo-500/40 rounded-full hover:bg-indigo-400/70 transition-all" />
          <div className="w-1 h-5 bg-indigo-500/30 rounded-full" />
          <div className="w-1 h-3 bg-indigo-500/20 rounded-full" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top Header */}
        <div className="glass sticky top-0 z-20 px-6 py-4 flex justify-between items-center border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="glass p-2 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex flex-col gap-1">
                <div className={`w-4 h-0.5 bg-gray-400 rounded transition-all ${sidebarOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                <div className={`w-4 h-0.5 bg-gray-400 rounded transition-all ${sidebarOpen ? "opacity-0" : ""}`} />
                <div className={`w-4 h-0.5 bg-gray-400 rounded transition-all ${sidebarOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
              </div>
            </button>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleTabChange("dashboard")}
            >
              <span className="text-lg">🚀</span>
              <div>
                <h1 className="text-lg font-black gradient-text">CareerOS</h1>
                <p className="text-gray-500 text-xs hidden sm:block">Your Daily Job Co-Pilot</p>
              </div>
            </div>
          </div>

          <div className="glass px-3 py-1.5 rounded-xl">
            <p className="text-gray-300 text-sm font-bold">
              {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label || "Profile"}
            </p>
          </div>

          <button
            onClick={() => handleTabChange("profile")}
            className="glass px-3 py-1.5 rounded-xl hover:border-indigo-500/50 border border-transparent transition-all"
          >
            <p className="text-gray-300 text-sm font-medium">
              👤 {user.name}
            </p>
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 flex flex-col items-center px-4 py-10">

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <Dashboard user={user} onNavigate={handleTabChange} />
          )}

          {/* Resume Tab */}
          {activeTab === "resume" && (
            <>
              {!resumeData && (
                <ResumeUpload onUploadSuccess={(data) => {
                  setResumeData(data);
                  localStorage.setItem("resumeData", JSON.stringify(data));
                  posthog.capture("resume_uploaded", {
                    skills_count: data.total_skills
                  });
                }} />
              )}

              {resumeData && !showJobs && (
                <div className="w-full max-w-2xl animate-slide-up">
                  <div className="glass rounded-3xl p-8 mb-6 text-center border border-green-700/30">
                    <div className="text-6xl mb-4 animate-float">🎉</div>
                    <h2 className="text-3xl font-black text-white mb-2">Resume Analyzed!</h2>
                    <p className="text-gray-400 text-sm">
                      {resumeData.filename} • {resumeData.word_count} words scanned
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="glass rounded-2xl p-6 text-center card-hover border border-indigo-700/20">
                      <p className="text-4xl font-black text-indigo-400 mb-1">{resumeData.total_skills}</p>
                      <p className="text-gray-400 text-sm">Skills Detected</p>
                    </div>
                    <div className="glass rounded-2xl p-6 text-center card-hover border border-green-700/20">
                      <p className="text-4xl font-black text-green-400 mb-1">{resumeData.word_count}</p>
                      <p className="text-gray-400 text-sm">Words Scanned</p>
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6 mb-6 border border-indigo-700/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-black text-lg">🧠 Skills Found</h3>
                      <span className="bg-indigo-600/30 border border-indigo-700/50 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                        {resumeData.total_skills} skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills_found && resumeData.skills_found.map((skill, index) => (
                        <span key={index} className="bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs px-3 py-1.5 rounded-full font-medium hover:bg-indigo-700/50 transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setShowJobs(true);
                        posthog.capture("find_jobs_clicked");
                      }}
                      className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 btn-glow text-lg active:scale-95 transition-all"
                    >
                      Find Matching Jobs 🎯
                    </button>
                    <button onClick={() => handleTabChange("tips")} className="w-full py-4 rounded-2xl font-black text-white bg-purple-700/80 hover:bg-purple-600 transition-all text-lg active:scale-95">
                      Analyze Resume 💡
                    </button>
                    <button onClick={() => handleTabChange("learning")} className="w-full py-4 rounded-2xl font-black text-white bg-blue-700/80 hover:bg-blue-600 transition-all text-lg active:scale-95">
                      Learning Resources 📚
                    </button>
                    <button onClick={() => handleTabChange("tasks")} className="w-full py-4 rounded-2xl font-black text-white bg-green-700/80 hover:bg-green-600 transition-all text-lg active:scale-95">
                      View Daily Tasks 📋
                    </button>
                    <button onClick={() => handleTabChange("rejection")} className="w-full py-4 rounded-2xl font-black text-white bg-red-700/80 hover:bg-red-600 transition-all text-lg active:scale-95">
                      Rejection Analyzer 💔
                    </button>
                    <button onClick={() => handleTabChange("interview")} className="w-full py-4 rounded-2xl font-black text-white bg-yellow-700/80 hover:bg-yellow-600 transition-all text-lg active:scale-95">
                      Interview Simulator 🎤
                    </button>
                    <button onClick={() => setResumeData(null)} className="w-full py-3 rounded-2xl font-bold text-gray-400 glass hover:text-white transition-all text-sm">
                      Upload Different Resume
                    </button>
                  </div>
                </div>
              )}

              {resumeData && showJobs && (
                <div className="w-full max-w-4xl">
                  <button onClick={() => setShowJobs(false)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all group">
                    <span className="group-hover:-translate-x-1 transition-all">←</span>
                    Back to Skills
                  </button>
                  <JobMatch skills={resumeData.skills_found || []} resumeId={resumeData.resume_id} user={user} />
                </div>
              )}
            </>
          )}
                    {/* Roadmap Tab */}
          {activeTab === "roadmap" && (
            <CareerRoadmap resumeData={resumeData} />
          )}
                  {/* Projects Tab */}
        {activeTab === "projects" && (
          <>
            {!resumeData ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="text-7xl mb-6 animate-float">💻</div>
                <h3 className="text-2xl font-black text-white mb-3">
                  Upload Resume First
                </h3>
                <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
                  We need your resume to recommend the right projects
                </p>
                <button
                  onClick={() => handleTabChange("resume")}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 btn-glow transition-all"
                >
                  Upload Resume 📄
                </button>
              </div>
            ) : (
              <ProjectRecommendations resumeData={resumeData} />
            )}
          </>
        )}

          {/* Resume Tips */}
          {activeTab === "tips" && (
            <>
              {!resumeData ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="text-7xl mb-6 animate-float">💡</div>
                  <h3 className="text-2xl font-black text-white mb-3">Upload Resume First</h3>
                  <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">We need your resume to analyze and give improvement tips</p>
                  <button onClick={() => handleTabChange("resume")} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 btn-glow transition-all">
                    Upload Resume 📄
                  </button>
                </div>
              ) : (
                <ResumeTips resumeData={resumeData} />
              )}
            </>
          )}

          {/* Learning */}
          {activeTab === "learning" && (
            <>
              {!resumeData ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="text-7xl mb-6 animate-float">📚</div>
                  <h3 className="text-2xl font-black text-white mb-3">Upload Resume First</h3>
                  <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">We need your resume to find the right learning resources</p>
                  <button onClick={() => handleTabChange("resume")} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 btn-glow transition-all">
                    Upload Resume 📄
                  </button>
                </div>
              ) : (
                <LearningResources resumeData={resumeData} />
              )}
            </>
          )}

          {/* Daily Tasks */}
          {activeTab === "tasks" && (
            <>
              {!resumeData ? (
                <div className="text-center py-20 animate-fade-in">
                  <div className="text-7xl mb-6 animate-float">📄</div>
                  <h3 className="text-2xl font-black text-white mb-3">Upload Resume First</h3>
                  <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">We need your resume to generate personalized daily tasks</p>
                  <button onClick={() => handleTabChange("resume")} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 btn-glow transition-all">
                    Upload Resume 📄
                  </button>
                </div>
              ) : (
                <DailyTasks user={user} missingSkills={resumeData.missing_skills || []} />
              )}
            </>
          )}

          {/* Rejection */}
          {activeTab === "rejection" && <RejectionAnalyzer />}

          {/* Interview */}
          {activeTab === "interview" && <InterviewSimulator />}

          {/* Progress */}
          {activeTab === "progress" && <Progress user={user} />}

          {/* Profile */}
          {activeTab === "profile" && <Profile user={user} onLogout={handleLogout} />}

        </div>
      </div>
    </div>
  );
}

export default App;
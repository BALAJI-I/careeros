import { useState, useEffect } from "react";
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

function App() {
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [showJobs, setShowJobs] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowLanding(false);
    }
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) setIsAdmin(true);
    if (window.location.hash === "#admin") {
      setShowAdminLogin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        }}
        onAdminClick={() => setShowAdminLogin(true)}
        onBack={() => setShowLanding(true)}
      />
    );
  }

  return (
    <div className="min-h-screen animated-bg text-white">

      {/* Header */}
      <div className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <div>
            <h1 className="text-xl font-black gradient-text">CareerOS</h1>
            <p className="text-gray-500 text-xs">Your Daily Job Co-Pilot</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-3 py-1.5 rounded-xl">
            <p className="text-gray-300 text-sm font-medium">
              👋 {user.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition-all font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass border-b border-gray-800/50 px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {[
            { id: "dashboard", label: "🏠 Dashboard" },
            { id: "resume", label: "📄 Resume" },
            { id: "tips", label: "💡 Resume Tips" },
            { id: "tasks", label: "📋 Daily Tasks" },
            { id: "progress", label: "📊 Progress" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center px-4 py-10 min-h-screen">

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <Dashboard user={user} onNavigate={setActiveTab} />
        )}

        {/* Resume Tab */}
        {activeTab === "resume" && (
          <>
            {!resumeData && (
              <ResumeUpload onUploadSuccess={setResumeData} />
            )}

            {resumeData && !showJobs && (
              <div className="w-full max-w-2xl animate-slide-up">

                <div className="glass rounded-3xl p-8 mb-6 text-center border border-green-700/30">
                  <div className="text-6xl mb-4 animate-float">🎉</div>
                  <h2 className="text-3xl font-black text-white mb-2">
                    Resume Analyzed!
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {resumeData.filename} • {resumeData.word_count} words scanned
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-2xl p-6 text-center card-hover border border-indigo-700/20">
                    <p className="text-4xl font-black text-indigo-400 mb-1">
                      {resumeData.total_skills}
                    </p>
                    <p className="text-gray-400 text-sm">Skills Detected</p>
                  </div>
                  <div className="glass rounded-2xl p-6 text-center card-hover border border-green-700/20">
                    <p className="text-4xl font-black text-green-400 mb-1">
                      {resumeData.word_count}
                    </p>
                    <p className="text-gray-400 text-sm">Words Scanned</p>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 mb-6 border border-indigo-700/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-black text-lg">
                      🧠 Skills Found
                    </h3>
                    <span className="bg-indigo-600/30 border border-indigo-700/50 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                      {resumeData.total_skills} skills
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills_found &&
                      resumeData.skills_found.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs px-3 py-1.5 rounded-full font-medium hover:bg-indigo-700/50 transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowJobs(true)}
                    className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 btn-glow text-lg active:scale-95 transition-all"
                  >
                    Find Matching Jobs 🎯
                  </button>
                  <button
                    onClick={() => setActiveTab("tips")}
                    className="w-full py-4 rounded-2xl font-black text-white bg-purple-700/80 hover:bg-purple-600 transition-all text-lg active:scale-95"
                  >
                    Analyze Resume 💡
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className="w-full py-4 rounded-2xl font-black text-white bg-green-700/80 hover:bg-green-600 transition-all text-lg active:scale-95"
                  >
                    View Daily Tasks 📋
                  </button>
                  <button
                    onClick={() => setResumeData(null)}
                    className="w-full py-3 rounded-2xl font-bold text-gray-400 glass hover:text-white transition-all text-sm"
                  >
                    Upload Different Resume
                  </button>
                </div>

              </div>
            )}

            {resumeData && showJobs && (
              <div className="w-full max-w-4xl">
                <button
                  onClick={() => setShowJobs(false)}
                  className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-all group"
                >
                  <span className="group-hover:-translate-x-1 transition-all">←</span>
                  Back to Skills
                </button>
                <JobMatch
                  skills={resumeData.skills_found || []}
                  resumeId={resumeData.resume_id}
                  user={user}
                />
              </div>
            )}
          </>
        )}

        {/* Resume Tips Tab */}
        {activeTab === "tips" && (
          <>
            {!resumeData ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="text-7xl mb-6 animate-float">💡</div>
                <h3 className="text-2xl font-black text-white mb-3">
                  Upload Resume First
                </h3>
                <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
                  We need your resume to analyze and give you improvement tips
                </p>
                <button
                  onClick={() => setActiveTab("resume")}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 btn-glow transition-all"
                >
                  Upload Resume 📄
                </button>
              </div>
            ) : (
              <ResumeTips resumeData={resumeData} />
            )}
          </>
        )}

        {/* Daily Tasks Tab */}
        {activeTab === "tasks" && (
          <>
            {!resumeData ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="text-7xl mb-6 animate-float">📄</div>
                <h3 className="text-2xl font-black text-white mb-3">
                  Upload Resume First
                </h3>
                <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
                  We need your resume to generate personalized daily tasks
                </p>
                <button
                  onClick={() => setActiveTab("resume")}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-500 btn-glow transition-all"
                >
                  Upload Resume 📄
                </button>
              </div>
            ) : (
              <DailyTasks
                user={user}
                missingSkills={resumeData.missing_skills || []}
              />
            )}
          </>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <Progress user={user} />
        )}

      </div>
    </div>
  );
}

export default App;
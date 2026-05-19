import { useState, useEffect } from "react";
import ResumeUpload from "./components/ResumeUpload";
import JobMatch from "./components/JobMatch";
import Auth from "./components/Auth";
import DailyTasks from "./components/DailyTasks";
import Progress from "./components/Progress";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Landing from "./components/Landing";

function App() {
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [showJobs, setShowJobs] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) setIsAdmin(true);

    // Check if URL has /admin
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
    setActiveTab("resume");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    setShowAdminLogin(false);
  };
  // Landing Page
  if (showLanding && !user && !isAdmin) {
    return <Landing onGetStarted={() => setShowLanding(false)} />;
  }

  // Admin Dashboard
  if (isAdmin) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // Admin Login
  if (showAdminLogin) {
    return <AdminLogin onAdminLogin={() => setIsAdmin(true)} />;
  }

  // User Auth
  if (!user) {
    return (
      <Auth
        onAuthSuccess={setUser}
        onAdminClick={() => setShowAdminLogin(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">CareerOS 🚀</h1>
          <p className="text-gray-400 text-xs">Your Daily Job Co-Pilot</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-400 text-sm">👋 {user.name}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-400 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="flex gap-1">
          {[
            { id: "resume", label: "📄 Resume" },
            { id: "tasks", label: "📋 Daily Tasks" },
            { id: "progress", label: "📊 Progress" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 -mt-24">

        {/* Resume Tab */}
        {activeTab === "resume" && (
          <>
            {!resumeData && (
              <ResumeUpload onUploadSuccess={setResumeData} />
            )}

            {resumeData && !showJobs && (
              <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-4xl">✅</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Resume Analyzed!
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {resumeData.filename} • {resumeData.word_count} words
                    </p>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-4 mb-6">
                  <h3 className="text-gray-400 text-xs font-bold mb-3 uppercase">
                    Skills Found ({resumeData.total_skills})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills_found &&
                      resumeData.skills_found.map((skill, index) => (
                        <span key={index}
                          className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-indigo-400">
                      {resumeData.total_skills}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Skills Found</p>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {resumeData.word_count}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Words Scanned</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowJobs(true)}
                  className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all mb-3"
                >
                  Find Matching Jobs 🎯
                </button>

                <button
                  onClick={() => setActiveTab("tasks")}
                  className="w-full py-3 rounded-xl font-bold text-white bg-green-700 hover:bg-green-600 transition-all mb-3"
                >
                  View Daily Tasks 📋
                </button>

                <button
                  onClick={() => setResumeData(null)}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all"
                >
                  Upload Another Resume
                </button>
              </div>
            )}

            {resumeData && showJobs && (
              <div className="w-full max-w-3xl">
                <button
                  onClick={() => setShowJobs(false)}
                  className="mb-6 text-gray-400 hover:text-white text-sm"
                >
                  ← Back to Skills
                </button>
                <JobMatch
                  skills={resumeData.skills_found || []}
                  resumeId={resumeData.resume_id}
                />
              </div>
            )}
          </>
        )}

        {/* Daily Tasks Tab */}
        {activeTab === "tasks" && (
          <>
            {!resumeData ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-4">📄</p>
                <p className="text-gray-400 text-lg font-bold mb-2">
                  Upload your resume first
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  We need your resume to generate personalized tasks
                </p>
                <button
                  onClick={() => setActiveTab("resume")}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500"
                >
                  Go to Resume Upload
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
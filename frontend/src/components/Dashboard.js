import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard({ user, onNavigate }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await axios.get(
        `https://careeros-0w27.onrender.com/progress/${user.id}`
      );
      setProgress(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: "resume",
      icon: "📄",
      title: "Resume Upload",
      desc: "Upload your PDF resume and extract 50+ skills automatically using AI",
      color: "border-indigo-700/30 hover:border-indigo-500/50",
      badge: "Core Feature",
      badgeColor: "bg-indigo-900/50 text-indigo-300 border-indigo-700/50"
    },
    {
      id: "resume",
      icon: "🎯",
      title: "Job Matching",
      desc: "Match your skills with 20+ real companies + live jobs from LinkedIn & Naukri",
      color: "border-green-700/30 hover:border-green-500/50",
      badge: "Apply Now",
      badgeColor: "bg-green-900/50 text-green-300 border-green-700/50"
    },
    {
      id: "tips",
      icon: "💡",
      title: "Resume Tips",
      desc: "Get your resume scored out of 10 with specific improvement suggestions",
      color: "border-purple-700/30 hover:border-purple-500/50",
      badge: "Score Your CV",
      badgeColor: "bg-purple-900/50 text-purple-300 border-purple-700/50"
    },
    {
      id: "learning",
      icon: "📚",
      title: "Learning Resources",
      desc: "Free courses and tutorials for every skill gap in your resume",
      color: "border-blue-700/30 hover:border-blue-500/50",
      badge: "100% Free",
      badgeColor: "bg-blue-900/50 text-blue-300 border-blue-700/50"
    },
    {
      id: "tasks",
      icon: "📋",
      title: "Daily Tasks",
      desc: "Get 3 personalized tasks every morning based on your skill gaps",
      color: "border-yellow-700/30 hover:border-yellow-500/50",
      badge: "Build Habit",
      badgeColor: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50"
    },
    {
      id: "interview",
      icon: "🎤",
      title: "Interview Simulator",
      desc: "Practice real interview questions with instant AI feedback and scoring",
      color: "border-orange-700/30 hover:border-orange-500/50",
      badge: "AI Powered",
      badgeColor: "bg-orange-900/50 text-orange-300 border-orange-700/50"
    },
    {
      id: "rejection",
      icon: "💔",
      title: "Rejection Analyzer",
      desc: "Paste any rejection email and get exact reasons + action steps",
      color: "border-red-700/30 hover:border-red-500/50",
      badge: "Most Viral",
      badgeColor: "bg-red-900/50 text-red-300 border-red-700/50"
    },
    {
      id: "progress",
      icon: "📊",
      title: "Progress Tracking",
      desc: "Track your streak, tasks completed, skill count and weekly completion rate",
      color: "border-teal-700/30 hover:border-teal-500/50",
      badge: "Analytics",
      badgeColor: "bg-teal-900/50 text-teal-300 border-teal-700/50"
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">🚀</div>
        <p className="text-indigo-400 font-black text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  const { user: userData, resume, jobs, tasks } = progress || {};

  return (
    <div className="w-full max-w-5xl animate-fade-in">

      {/* Welcome Banner */}
      <div className="glass rounded-3xl p-8 mb-8 border border-indigo-700/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-5" />
        <div className="relative">
          <p className="text-indigo-400 text-sm font-bold mb-1">Welcome back 👋</p>
          <h2 className="text-3xl font-black text-white mb-1">{user.name}</h2>
          <p className="text-gray-400 text-sm mb-6">
            Member since {userData?.member_since} • CareerOS Student
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-orange-900/30 border border-orange-700/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-orange-400">{userData?.streak || 0}</p>
              <p className="text-orange-300 text-xs mt-1">🔥 Streak</p>
            </div>
            <div className="bg-green-900/30 border border-green-700/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-green-400">{userData?.total_tasks_completed || 0}</p>
              <p className="text-green-300 text-xs mt-1">✅ Tasks Done</p>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-indigo-400">{resume?.total_skills || 0}</p>
              <p className="text-indigo-300 text-xs mt-1">🧠 Skills</p>
            </div>
            <div className="bg-purple-900/30 border border-purple-700/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-purple-400">{jobs?.apply_now || 0}</p>
              <p className="text-purple-300 text-xs mt-1">🚀 Apply Now</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      {tasks && (
        <div className="glass rounded-2xl p-5 mb-8 border border-indigo-700/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-black">Today's Progress</h3>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              tasks.today_completed === 3
                ? "bg-green-900/50 text-green-400 border-green-700/50"
                : "bg-indigo-900/50 text-indigo-400 border-indigo-700/50"
            }`}>
              {tasks.today_completed || 0}/3 Tasks
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${((tasks.today_completed || 0) / 3) * 100}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {tasks.today_completed === 3
              ? "🎉 All tasks done for today!"
              : `${3 - (tasks.today_completed || 0)} tasks remaining today`}
          </p>
        </div>
      )}

      {/* Features Section */}
      <div className="mb-6">
        <h3 className="text-xl font-black text-white mb-2">
          🛠️ All Features
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Everything CareerOS offers to help you get hired faster
        </p>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => onNavigate(feature.id)}
              className={`glass rounded-2xl p-5 border card-hover cursor-pointer transition-all ${feature.color}`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{feature.icon}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>
              <h4 className="text-white font-black text-base mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {feature.desc}
              </p>
              <div className="mt-3 flex items-center gap-1 text-indigo-400 text-xs font-bold">
                <span>Open</span>
                <span className="group-hover:translate-x-1 transition-all">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Match Overview */}
      {jobs && (
        <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
          <h3 className="text-white font-black mb-4">🎯 Job Match Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-900/30 border border-green-700/30 rounded-xl p-4 text-center cursor-pointer hover:bg-green-900/40 transition-all" onClick={() => onNavigate("resume")}>
              <p className="text-2xl font-black text-green-400">{jobs.apply_now || 0}</p>
              <p className="text-green-300 text-xs mt-1">🚀 Apply Now</p>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-xl p-4 text-center cursor-pointer hover:bg-yellow-900/40 transition-all" onClick={() => onNavigate("resume")}>
              <p className="text-2xl font-black text-yellow-400">{jobs.apply_learn || 0}</p>
              <p className="text-yellow-300 text-xs mt-1">📚 Learn First</p>
            </div>
            <div className="bg-red-900/30 border border-red-700/30 rounded-xl p-4 text-center cursor-pointer hover:bg-red-900/40 transition-all" onClick={() => onNavigate("resume")}>
              <p className="text-2xl font-black text-red-400">{jobs.prepare_first || 0}</p>
              <p className="text-red-300 text-xs mt-1">🎯 Prepare</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
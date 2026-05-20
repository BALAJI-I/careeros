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
        `http://localhost:8000/progress/${user.id}`
      );
      setProgress(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">🚀</div>
        <p className="text-indigo-400 font-black text-xl">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const { user: userData, resume, jobs, tasks } = progress || {};

  return (
    <div className="w-full max-w-4xl animate-fade-in">

      {/* Welcome Banner */}
      <div className="glass rounded-3xl p-8 mb-6 border border-indigo-700/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-5" />
        <div className="relative">
          <p className="text-indigo-400 text-sm font-bold mb-2">
            Welcome back 👋
          </p>
          <h2 className="text-3xl font-black text-white mb-1">
            {user.name}
          </h2>
          <p className="text-gray-400 text-sm">
            {user.email} • Member since {userData?.member_since}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-orange-900/30 border border-orange-700/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-orange-400">
                {userData?.streak || 0}
              </p>
              <p className="text-orange-300 text-xs mt-1">🔥 Day Streak</p>
            </div>
            <div className="bg-green-900/30 border border-green-700/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-green-400">
                {userData?.total_tasks_completed || 0}
              </p>
              <p className="text-green-300 text-xs mt-1">✅ Tasks Done</p>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-700/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-indigo-400">
                {resume?.total_skills || 0}
              </p>
              <p className="text-indigo-300 text-xs mt-1">🧠 Skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* Today's Tasks */}
        <div className="glass rounded-2xl p-6 border border-indigo-700/20 card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-black">Today's Tasks</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              tasks?.today_completed === 3
                ? "bg-green-900/50 text-green-400 border border-green-700/50"
                : "bg-indigo-900/50 text-indigo-400 border border-indigo-700/50"
            }`}>
              {tasks?.today_completed || 0}/3
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${((tasks?.today_completed || 0) / 3) * 100}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mb-4">
            {tasks?.today_completed === 3
              ? "🎉 All done for today!"
              : `${3 - (tasks?.today_completed || 0)} tasks remaining`}
          </p>
          <button
            onClick={() => onNavigate("tasks")}
            className="w-full py-2.5 rounded-xl text-sm font-bold bg-indigo-600/30 border border-indigo-700/50 text-indigo-300 hover:bg-indigo-600/50 transition-all"
          >
            View Tasks 📋
          </button>
        </div>

        {/* Job Matches */}
        <div className="glass rounded-2xl p-6 border border-green-700/20 card-hover">
          <h3 className="text-white font-black mb-4">Job Matches</h3>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-green-400 text-xs font-bold">🚀 Apply Now</span>
              <span className="text-green-400 font-black">{jobs?.apply_now || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-400 text-xs font-bold">📚 Apply + Learn</span>
              <span className="text-yellow-400 font-black">{jobs?.apply_learn || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-400 text-xs font-bold">🎯 Prepare First</span>
              <span className="text-red-400 font-black">{jobs?.prepare_first || 0}</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate("resume")}
            className="w-full py-2.5 rounded-xl text-sm font-bold bg-green-600/30 border border-green-700/50 text-green-300 hover:bg-green-600/50 transition-all"
          >
            View Jobs 🎯
          </button>
        </div>

      </div>

      {/* Resume Status */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <h3 className="text-white font-black mb-4">📄 Resume Status</h3>
        {resume?.uploaded ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-900/30 border border-green-700/30 rounded-xl p-3">
                <span className="text-3xl">✅</span>
              </div>
              <div>
                <p className="text-white font-bold">{resume.filename}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {resume.total_skills} skills detected
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("resume")}
              className="glass px-4 py-2 rounded-xl text-sm font-bold text-indigo-300 hover:text-white transition-all border border-indigo-700/30"
            >
              View Skills →
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gray-800 rounded-xl p-3">
                <span className="text-3xl">📄</span>
              </div>
              <div>
                <p className="text-white font-bold">No Resume Uploaded</p>
                <p className="text-gray-400 text-xs mt-1">
                  Upload your resume to get started
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("resume")}
              className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-bold text-white hover:bg-indigo-500 btn-glow transition-all"
            >
              Upload Now →
            </button>
          </div>
        )}
      </div>

      {/* Weekly Progress */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-black">📈 Weekly Completion</h3>
          <span className="text-2xl font-black text-green-400">
            {tasks?.completion_rate || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
            style={{ width: `${tasks?.completion_rate || 0}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs">
          {tasks?.completed_days || 0} out of {tasks?.total_days_tracked || 0} days fully completed
        </p>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6 border border-gray-700/20">
        <h3 className="text-white font-black mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📄", label: "Upload Resume", tab: "resume" },
            { icon: "📋", label: "Daily Tasks", tab: "tasks" },
            { icon: "📊", label: "View Progress", tab: "progress" },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => onNavigate(action.tab)}
              className="glass rounded-xl p-4 text-center card-hover border border-gray-700/30 hover:border-indigo-500/50 transition-all"
            >
              <p className="text-3xl mb-2">{action.icon}</p>
              <p className="text-gray-300 text-xs font-bold">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
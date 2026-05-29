import { useState, useEffect } from "react";
import axios from "axios";

function Progress({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await axios.get(
        `https://careeros-0w27.onrender.com/progress/${user.id}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Progress error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">📊</div>
        <p className="text-indigo-400 font-black text-xl">
          Loading Progress...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Could not load progress.</p>
      </div>
    );
  }

  const { user: userData, resume, jobs, tasks } = data;

  return (
    <div className="w-full max-w-3xl animate-fade-in">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-float">📊</div>
        <h2 className="text-3xl font-black text-white mb-2">
          Your Progress
        </h2>
        <p className="text-gray-400 text-sm">
          Member since {userData.member_since}
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-2xl p-6 text-center card-hover border border-orange-700/20">
          <p className="text-4xl mb-2">🔥</p>
          <p className="text-3xl font-black text-orange-400">
            {userData.streak}
          </p>
          <p className="text-gray-400 text-xs mt-1">Day Streak</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center card-hover border border-green-700/20">
          <p className="text-4xl mb-2">✅</p>
          <p className="text-3xl font-black text-green-400">
            {userData.total_tasks_completed}
          </p>
          <p className="text-gray-400 text-xs mt-1">Tasks Done</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center card-hover border border-indigo-700/20">
          <p className="text-4xl mb-2">🧠</p>
          <p className="text-3xl font-black text-indigo-400">
            {resume.total_skills}
          </p>
          <p className="text-gray-400 text-xs mt-1">Skills Found</p>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="glass rounded-2xl p-6 mb-6 border border-indigo-700/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-black text-lg">
            Today's Progress
          </h3>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            tasks.today_completed === 3
              ? "bg-green-900/50 text-green-400 border border-green-700/50"
              : "bg-indigo-900/50 text-indigo-400 border border-indigo-700/50"
          }`}>
            {tasks.today_completed === 3 ? "🎉 Complete!" : `${tasks.today_completed}/3 Done`}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(tasks.today_completed / 3) * 100}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs">
          {tasks.today_completed === 3
            ? "🎉 All tasks completed! Come back tomorrow."
            : `${3 - tasks.today_completed} tasks remaining today`}
        </p>
      </div>

      {/* Job Match Overview */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <h3 className="text-white font-black text-lg mb-4">
          Job Match Overview 🎯
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-900/30 border border-green-700/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-green-400">
              {jobs.apply_now}
            </p>
            <p className="text-green-300 text-xs mt-1">🚀 Apply Now</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-yellow-400">
              {jobs.apply_learn}
            </p>
            <p className="text-yellow-300 text-xs mt-1">📚 Learn First</p>
          </div>
          <div className="bg-red-900/30 border border-red-700/30 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-red-400">
              {jobs.prepare_first}
            </p>
            <p className="text-red-300 text-xs mt-1">🎯 Prepare</p>
          </div>
        </div>
      </div>

      {/* Weekly Rate */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-black text-lg">
            Weekly Completion
          </h3>
          <span className="text-2xl font-black text-green-400">
            {tasks.completion_rate}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${tasks.completion_rate}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs">
          {tasks.completed_days} out of {tasks.total_days_tracked} days fully completed
        </p>
      </div>

      {/* Resume Status */}
      <div className="glass rounded-2xl p-6 border border-gray-700/20">
        <h3 className="text-white font-black text-lg mb-4">
          Resume Status 📄
        </h3>
        {resume.uploaded ? (
          <div className="flex items-center gap-4 bg-green-900/20 border border-green-700/30 rounded-xl p-4">
            <span className="text-4xl">✅</span>
            <div>
              <p className="text-white font-bold">{resume.filename}</p>
              <p className="text-gray-400 text-xs mt-1">
                {resume.total_skills} skills detected
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 bg-gray-800/50 border border-gray-700/30 rounded-xl p-4">
            <span className="text-4xl">📄</span>
            <p className="text-gray-400 text-sm">
              No resume uploaded yet.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Progress;
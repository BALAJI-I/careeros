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
        `http://localhost:8000/progress/${user.id}`
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
        <p className="text-indigo-400 font-bold text-lg">
          Loading your progress... ⏳
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Could not load progress data.</p>
      </div>
    );
  }

  const { user: userData, resume, jobs, tasks } = data;

  return (
    <div className="w-full max-w-3xl">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Your Progress 📊
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Member since {userData.member_since}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        {/* Streak */}
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-3xl mb-1">🔥</p>
          <p className="text-2xl font-bold text-orange-400">
            {userData.streak}
          </p>
          <p className="text-gray-400 text-xs mt-1">Day Streak</p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-3xl mb-1">✅</p>
          <p className="text-2xl font-bold text-green-400">
            {userData.total_tasks_completed}
          </p>
          <p className="text-gray-400 text-xs mt-1">Tasks Done</p>
        </div>

        {/* Skills */}
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <p className="text-3xl mb-1">🧠</p>
          <p className="text-2xl font-bold text-indigo-400">
            {resume.total_skills}
          </p>
          <p className="text-gray-400 text-xs mt-1">Skills Found</p>
        </div>

      </div>

      {/* Today's Progress */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-white font-bold mb-3">
          Today's Progress
        </h3>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-sm">Daily Tasks</p>
          <p className="text-white text-sm font-bold">
            {tasks.today_completed}/3
          </p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-indigo-500 transition-all"
            style={{ width: `${(tasks.today_completed / 3) * 100}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">
          {tasks.today_completed === 3
            ? "🎉 All tasks completed today!"
            : `${3 - tasks.today_completed} tasks remaining today`}
        </p>
      </div>

      {/* Job Match Stats */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-white font-bold mb-4">
          Job Match Overview 🎯
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-900 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-400">
              {jobs.apply_now}
            </p>
            <p className="text-green-300 text-xs mt-1">🚀 Apply Now</p>
          </div>
          <div className="bg-yellow-900 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {jobs.apply_learn}
            </p>
            <p className="text-yellow-300 text-xs mt-1">📚 Learn First</p>
          </div>
          <div className="bg-red-900 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-400">
              {jobs.prepare_first}
            </p>
            <p className="text-red-300 text-xs mt-1">🎯 Prepare</p>
          </div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-white font-bold mb-3">
          Weekly Completion Rate
        </h3>
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-sm">
            {tasks.completed_days}/{tasks.total_days_tracked} days completed
          </p>
          <p className="text-white font-bold">
            {tasks.completion_rate}%
          </p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-green-500 transition-all"
            style={{ width: `${tasks.completion_rate}%` }}
          />
        </div>
      </div>

      {/* Resume Status */}
      <div className="bg-gray-800 rounded-xl p-5">
        <h3 className="text-white font-bold mb-3">
          Resume Status 📄
        </h3>
        {resume.uploaded ? (
          <div className="flex items-center gap-3">
            <span className="text-green-400 text-2xl">✅</span>
            <div>
              <p className="text-white text-sm font-bold">
                {resume.filename}
              </p>
              <p className="text-gray-400 text-xs">
                {resume.total_skills} skills detected
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            No resume uploaded yet.
          </p>
        )}
      </div>

    </div>
  );
}

export default Progress;
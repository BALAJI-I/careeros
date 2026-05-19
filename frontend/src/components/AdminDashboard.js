import { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchResumes();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Users error:", err);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/resumes");
      setResumes(res.data.resumes);
    } catch (err) {
      console.error("Resumes error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-indigo-400 font-bold text-lg">
          Loading admin dashboard... ⏳
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-red-400">
            CareerOS Admin 🔐
          </h1>
          <p className="text-gray-400 text-xs">Admin Dashboard</p>
        </div>
        <button
          onClick={onLogout}
          className="text-xs text-gray-400 hover:text-red-400 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="flex gap-1">
          {[
            { id: "stats", label: "📊 Stats" },
            { id: "users", label: "👥 Users" },
            { id: "resumes", label: "📄 Resumes" },
            { id: "skills", label: "🧠 Top Skills" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-red-500 text-red-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 max-w-6xl mx-auto">

        {/* Stats Tab */}
        {activeTab === "stats" && stats && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Platform Overview
            </h2>

            {/* Main Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-indigo-400">
                  {stats.total_users}
                </p>
                <p className="text-gray-400 text-sm mt-2">Total Users</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-green-400">
                  {stats.total_resumes}
                </p>
                <p className="text-gray-400 text-sm mt-2">Resumes Uploaded</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-yellow-400">
                  {stats.total_tasks_completed}
                </p>
                <p className="text-gray-400 text-sm mt-2">Tasks Completed</p>
              </div>
            </div>

            {/* Job Decision Stats */}
            <h3 className="text-lg font-bold text-white mb-4">
              Job Decision Overview
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-900 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">
                  {stats.job_decisions.apply_now}
                </p>
                <p className="text-green-300 text-sm mt-1">🚀 Apply Now</p>
              </div>
              <div className="bg-yellow-900 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-yellow-400">
                  {stats.job_decisions.apply_learn}
                </p>
                <p className="text-yellow-300 text-sm mt-1">📚 Apply + Learn</p>
              </div>
              <div className="bg-red-900 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-red-400">
                  {stats.job_decisions.prepare_first}
                </p>
                <p className="text-red-300 text-sm mt-1">🎯 Prepare First</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              All Users ({users.length})
            </h2>
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Name</th>
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Email</th>
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Streak</th>
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Tasks Done</th>
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                    >
                      <td className="px-4 py-3 text-white text-sm">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-orange-400 text-sm font-bold">
                        🔥 {user.streak || 0}
                      </td>
                      <td className="px-4 py-3 text-green-400 text-sm font-bold">
                        ✅ {user.total_tasks_completed || 0}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {user.created_at?.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-400">No users yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumes Tab */}
        {activeTab === "resumes" && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              All Resumes ({resumes.length})
            </h2>
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Filename</th>
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Words</th>
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Skills</th>
                    <th className="text-left px-4 py-3 text-gray-300 text-sm">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map((resume, index) => (
                    <tr
                      key={resume._id}
                      className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"}
                    >
                      <td className="px-4 py-3 text-white text-sm">
                        📄 {resume.filename}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {resume.word_count}
                      </td>
                      <td className="px-4 py-3 text-indigo-400 text-sm font-bold">
                        {resume.skills?.length || 0} skills
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {resume.uploaded_at?.slice(0, 10)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {resumes.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-400">No resumes yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Skills Tab */}
        {activeTab === "skills" && stats && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Top Skills Across All Users
            </h2>
            <div className="flex flex-col gap-3">
              {stats.top_skills.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-4 flex items-center gap-4"
                >
                  <span className="text-gray-400 text-sm font-bold w-6">
                    #{index + 1}
                  </span>
                  <span className="text-white font-bold flex-1">
                    {item.skill}
                  </span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-indigo-500"
                        style={{
                          width: `${(item.count / stats.top_skills[0].count) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-indigo-400 text-sm font-bold w-16 text-right">
                      {item.count} users
                    </span>
                  </div>
                </div>
              ))}
              {stats.top_skills.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-400">No skill data yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
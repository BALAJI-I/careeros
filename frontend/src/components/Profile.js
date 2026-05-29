import { useState, useEffect } from "react";
import axios from "axios";

function Profile({ user, onLogout }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);
  const [showResume, setShowResume] = useState(false);

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
      console.error("Profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, name };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">👤</div>
        <p className="text-indigo-400 font-black text-xl">
          Loading Profile...
        </p>
      </div>
    );
  }

  const { user: userData, resume, jobs, tasks } = progress || {};
  const localResume = JSON.parse(localStorage.getItem("resumeData") || "null");
  const resumeId = localResume?.resume_id;

  return (
    <div className="w-full max-w-3xl animate-fade-in">

      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 mb-6 border border-indigo-700/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-5" />
        <div className="relative flex items-start gap-6">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-900/50 text-white px-3 py-2 rounded-xl text-lg font-black outline-none border border-indigo-500 flex-1"
                />
                <button
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="glass text-gray-400 px-4 py-2 rounded-xl text-sm font-bold hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-white">
                  {user.name}
                </h2>
                <button
                  onClick={() => setEditing(true)}
                  className="glass text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg transition-all"
                >
                  ✏️ Edit
                </button>
              </div>
            )}
            <p className="text-indigo-400 text-sm font-bold mb-1">
              {user.email}
            </p>
            <p className="text-gray-500 text-xs">
              Member since {userData?.member_since} • CareerOS Student
            </p>
            {saved && (
              <p className="text-green-400 text-xs mt-2 font-bold">
                ✅ Profile updated!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass rounded-2xl p-4 text-center border border-orange-700/20 card-hover">
          <p className="text-3xl mb-1">🔥</p>
          <p className="text-2xl font-black text-orange-400">
            {userData?.streak || 0}
          </p>
          <p className="text-gray-400 text-xs mt-1">Streak</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-green-700/20 card-hover">
          <p className="text-3xl mb-1">✅</p>
          <p className="text-2xl font-black text-green-400">
            {userData?.total_tasks_completed || 0}
          </p>
          <p className="text-gray-400 text-xs mt-1">Tasks Done</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-indigo-700/20 card-hover">
          <p className="text-3xl mb-1">🧠</p>
          <p className="text-2xl font-black text-indigo-400">
            {resume?.total_skills || 0}
          </p>
          <p className="text-gray-400 text-xs mt-1">Skills</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-purple-700/20 card-hover">
          <p className="text-3xl mb-1">🎯</p>
          <p className="text-2xl font-black text-purple-400">
            {jobs?.apply_now || 0}
          </p>
          <p className="text-gray-400 text-xs mt-1">Apply Now</p>
        </div>
      </div>

      {/* Resume Info */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <h3 className="text-white font-black mb-4">📄 Resume</h3>
        {resume?.uploaded ? (
          <div>
            <div className="flex items-center justify-between mb-4">
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

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResume(!showResume)}
                  className="glass px-4 py-2 rounded-xl text-sm font-bold text-indigo-300 hover:text-white border border-indigo-700/30 transition-all"
                >
                  {showResume ? "Hide ↑" : "View Skills →"}
                </button>
                {resumeId && (
                  <a
                    href={`https://careeros-0w27.onrender.com/resume/view/${resumeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass px-4 py-2 rounded-xl text-sm font-bold text-green-300 hover:text-white border border-green-700/30 transition-all"
                  >
                    📄 View PDF
                  </a>
                )}
              </div>
            </div>

            {/* Skills Display */}
            {showResume && (
              <div className="glass rounded-xl p-4 border border-indigo-700/20">
                <p className="text-gray-400 text-xs font-bold mb-3 uppercase tracking-wider">
                  🧠 Detected Skills ({localResume?.total_skills || resume.total_skills})
                </p>
                <div className="flex flex-wrap gap-2">
                  {localResume?.skills_found && localResume.skills_found.length > 0 ? (
                    localResume.skills_found.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs px-3 py-1.5 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Skills not available. Please upload resume again.
                    </p>
                  )}
                </div>

                {/* Resume Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-indigo-400">
                      {localResume?.total_skills || resume.total_skills}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Skills Found</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-green-400">
                      {localResume?.word_count || 0}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Words Scanned</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              No resume uploaded yet.
            </p>
            <span className="glass text-indigo-300 text-xs px-3 py-1.5 rounded-xl border border-indigo-700/30">
              Go to Resume tab →
            </span>
          </div>
        )}
      </div>

      {/* Job Match Summary */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <h3 className="text-white font-black mb-4">🎯 Job Match Summary</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-900/30 border border-green-700/30 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-green-400">
              {jobs?.apply_now || 0}
            </p>
            <p className="text-green-300 text-xs mt-1">🚀 Apply Now</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/30 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-yellow-400">
              {jobs?.apply_learn || 0}
            </p>
            <p className="text-yellow-300 text-xs mt-1">📚 Learn First</p>
          </div>
          <div className="bg-red-900/30 border border-red-700/30 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-red-400">
              {jobs?.prepare_first || 0}
            </p>
            <p className="text-red-300 text-xs mt-1">🎯 Prepare</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-black">📈 Weekly Completion</h3>
          <span className="text-green-400 font-black text-xl">
            {tasks?.completion_rate || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
            style={{ width: `${tasks?.completion_rate || 0}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">
          {tasks?.completed_days || 0} out of {tasks?.total_days_tracked || 0} days fully completed
        </p>
      </div>

      {/* Account Settings */}
      <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
        <h3 className="text-white font-black mb-4">⚙️ Account</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center glass rounded-xl p-3 border border-gray-700/20">
            <div>
              <p className="text-white text-sm font-bold">Email</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
            <span className="bg-green-900/30 border border-green-700/30 text-green-300 text-xs px-2 py-1 rounded-lg">
              Verified ✅
            </span>
          </div>
          <div className="flex justify-between items-center glass rounded-xl p-3 border border-gray-700/20">
            <div>
              <p className="text-white text-sm font-bold">Plan</p>
              <p className="text-gray-400 text-xs">Free Plan</p>
            </div>
            <span className="bg-indigo-900/30 border border-indigo-700/30 text-indigo-300 text-xs px-2 py-1 rounded-lg">
              Free ✅
            </span>
          </div>
          <div className="flex justify-between items-center glass rounded-xl p-3 border border-gray-700/20">
            <div>
              <p className="text-white text-sm font-bold">Member Since</p>
              <p className="text-gray-400 text-xs">{userData?.member_since}</p>
            </div>
            <span className="glass text-gray-300 text-xs px-2 py-1 rounded-lg">
              🎓 Student
            </span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-4 rounded-2xl font-black text-red-400 glass hover:bg-red-900/20 border border-red-700/20 hover:border-red-500/50 transition-all"
      >
        Logout from CareerOS
      </button>

    </div>
  );
}

export default Profile;
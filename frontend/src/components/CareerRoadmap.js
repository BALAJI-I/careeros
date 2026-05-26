import { useState, useEffect } from "react";
import axios from "axios";

function CareerRoadmap({ resumeData }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [progress, setProgress] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [stage, setStage] = useState("select");

  const roles = [
    "Frontend Developer",
    "Python Backend Developer",
    "Data Scientist",
    "Full Stack Developer",
    "DevOps Engineer",
  ];

  const generateRoadmap = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/roadmap/generate",
        {
          role: selectedRole,
          existing_skills: resumeData?.skills_found || []
        }
      );
      setRoadmap(res.data.roadmap);
      setProgress(res.data.progress);
      setStage("roadmap");
    } catch (err) {
      console.error("Roadmap error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (stage === "select") {
    return (
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🗺️</div>
          <h2 className="text-3xl font-black text-white mb-2">
            AI Career Roadmap
          </h2>
          <p className="text-gray-400 text-sm">
            Get a personalized step-by-step roadmap to your dream role
          </p>
        </div>

        <div className="glass rounded-3xl p-8 border border-indigo-700/20">
          <h3 className="text-white font-black text-lg mb-6">
            What role do you want to achieve?
          </h3>

          <div className="grid grid-cols-1 gap-3 mb-8">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-2xl text-left font-bold transition-all card-hover border ${
                  selectedRole === role
                    ? "bg-indigo-600/30 border-indigo-500 text-white"
                    : "glass border-gray-700/30 text-gray-400 hover:text-white hover:border-indigo-500/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    {role === "Frontend Developer" && "💻 "}
                    {role === "Python Backend Developer" && "🐍 "}
                    {role === "Data Scientist" && "📊 "}
                    {role === "Full Stack Developer" && "🔥 "}
                    {role === "DevOps Engineer" && "⚙️ "}
                    {role}
                  </span>
                  {selectedRole === role && (
                    <span className="text-indigo-400">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={generateRoadmap}
            disabled={!selectedRole || loading}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all text-lg ${
              !selectedRole || loading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-indigo-600 hover:bg-indigo-500 btn-glow active:scale-95"
            }`}
          >
            {loading ? "Generating Roadmap... ⏳" : "Generate My Roadmap 🗺️"}
          </button>
        </div>
      </div>
    );
  }

  if (!roadmap) return null;

  return (
    <div className="w-full max-w-4xl animate-fade-in">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-float">🗺️</div>
        <h2 className="text-3xl font-black text-white mb-2">
          {roadmap.role} Roadmap
        </h2>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="glass text-gray-300 text-xs px-3 py-1.5 rounded-lg">
            💰 {roadmap.avg_salary}
          </span>
          <span className="glass text-gray-300 text-xs px-3 py-1.5 rounded-lg">
            📈 Demand: {roadmap.demand}
          </span>
          <span className="glass text-gray-300 text-xs px-3 py-1.5 rounded-lg">
            ⏱️ {roadmap.time_to_job} to job
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="glass rounded-2xl p-6 mb-6 border border-indigo-700/20">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-black">Your Progress</h3>
          <span className="text-2xl font-black text-indigo-400">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-500 text-xs">
          Based on skills detected in your resume
        </p>
      </div>

      {/* Phases */}
      <div className="flex flex-col gap-4 mb-6">
        {roadmap.phases.map((phase, index) => (
          <div
            key={index}
            className={`glass rounded-2xl border transition-all ${
              expandedPhase === index
                ? "border-indigo-500/50"
                : "border-gray-700/20 hover:border-indigo-500/30"
            }`}
          >
            {/* Phase Header */}
            <div
              className="p-5 cursor-pointer flex items-center gap-4"
              onClick={() => setExpandedPhase(expandedPhase === index ? -1 : index)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                expandedPhase === index
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}>
                {phase.phase}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-black">{phase.title}</h3>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-gray-500 text-xs">⏱️ {phase.duration}</span>
                  {phase.skills.map((skill, i) => (
                    <span key={i} className="bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-gray-500">
                {expandedPhase === index ? "↑" : "↓"}
              </span>
            </div>

            {/* Phase Content */}
            {expandedPhase === index && (
              <div className="px-5 pb-5 border-t border-gray-700/20 pt-4">

                {/* Tasks */}
                <h4 className="text-white font-black mb-3 text-sm">
                  📋 What to Learn
                </h4>
                <div className="flex flex-col gap-2 mb-4">
                  {phase.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-indigo-400 text-xs">→</span>
                      <p className="text-gray-300 text-sm">{task}</p>
                    </div>
                  ))}
                </div>

                {/* Resources */}
                <h4 className="text-white font-black mb-3 text-sm">
                  📚 Free Resources
                </h4>
                <div className="flex flex-col gap-2 mb-4">
                  {phase.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-gray-700/20 hover:border-indigo-500/50 transition-all"
                    >
                      <span className="text-indigo-400 text-sm">🔗</span>
                      <span className="text-gray-300 text-sm font-medium">{res.name}</span>
                      <span className="ml-auto text-gray-600 text-xs">→</span>
                    </a>
                  ))}
                </div>

                {/* Project */}
                <div className="glass rounded-xl p-4 border border-green-700/20 bg-green-900/10">
                  <p className="text-green-400 text-xs font-bold mb-1 uppercase tracking-wider">
                    🏆 Phase Project
                  </p>
                  <p className="text-white font-bold text-sm">{phase.project}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Change Role */}
      <button
        onClick={() => {
          setStage("select");
          setRoadmap(null);
          setSelectedRole("");
        }}
        className="w-full py-3 rounded-2xl font-bold text-gray-400 glass hover:text-white transition-all text-sm"
      >
        Choose Different Role
      </button>

    </div>
  );
}

export default CareerRoadmap;
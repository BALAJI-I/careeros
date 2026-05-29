import { useState, useEffect } from "react";
import axios from "axios";

function LearningResources({ resumeData }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSkill, setActiveSkill] = useState(0);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const missingSkills = getMissingSkills();
      const res = await axios.post(
        "https://careeros-0w27.onrender.com/learning/resources",
        { missing_skills: missingSkills }
      );
      setResources(res.data.resources);
    } catch (err) {
      console.error("Learning error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMissingSkills = () => {
    const commonSkills = [
      "python", "javascript", "react", "nodejs",
      "machine learning", "docker", "aws", "mongodb"
    ];
    const userSkills = resumeData.skills_found || [];
    return commonSkills.filter(
      s => !userSkills.map(x => x.toLowerCase()).includes(s)
    ).slice(0, 6);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "video": return "🎥";
      case "course": return "📚";
      case "practice": return "💻";
      case "docs": return "📖";
      case "platform": return "🌐";
      default: return "🔗";
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "video": return "bg-red-900/30 border-red-700/50 text-red-300";
      case "course": return "bg-blue-900/30 border-blue-700/50 text-blue-300";
      case "practice": return "bg-green-900/30 border-green-700/50 text-green-300";
      case "docs": return "bg-yellow-900/30 border-yellow-700/50 text-yellow-300";
      default: return "bg-purple-900/30 border-purple-700/50 text-purple-300";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">📚</div>
        <p className="text-indigo-400 font-black text-xl">
          Finding Best Resources...
        </p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-green-400 font-black text-xl mb-2">
          You have all the skills!
        </p>
        <p className="text-gray-400 text-sm">
          No missing skills found. Focus on applying to jobs.
        </p>
      </div>
    );
  }

  const current = resources[activeSkill];

  return (
    <div className="w-full max-w-4xl animate-fade-in">

      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-float">📚</div>
        <h2 className="text-3xl font-black text-white mb-2">
          Learning Resources
        </h2>
        <p className="text-gray-400 text-sm">
          Free resources to learn your missing skills
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {resources.map((r, index) => (
          <button
            key={index}
            onClick={() => setActiveSkill(index)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSkill === index
                ? "bg-indigo-600 text-white btn-glow"
                : "glass text-gray-400 hover:text-white"
            }`}
          >
            {r.skill}
          </button>
        ))}
      </div>

      {current && (
        <div className="glass rounded-3xl p-6 mb-6 border border-indigo-700/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black text-white mb-1">
                {current.skill}
              </h3>
              <div className="flex gap-3">
                <span className="glass text-gray-300 text-xs px-2 py-1 rounded-lg">
                  📈 {current.level}
                </span>
                <span className="glass text-gray-300 text-xs px-2 py-1 rounded-lg">
                  ⏱️ {current.time}
                </span>
                <span className="bg-green-900/30 border border-green-700/50 text-green-300 text-xs px-2 py-1 rounded-lg">
                  {current.resources.filter(r => r.free).length} Free Resources
                </span>
              </div>
            </div>
            <div className="text-5xl animate-float">🎯</div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {current.resources.map((resource, i) => (
              <div
                key={i}
                onClick={() => window.open(resource.url, "_blank")}
                className="glass rounded-xl p-4 border border-gray-700/30 hover:border-indigo-500/50 card-hover flex items-center gap-4 transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border ${getTypeColor(resource.type)}`}>
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-white font-bold text-sm">
                      {resource.title}
                    </p>
                    {resource.free && (
                      <span className="bg-green-900/50 border border-green-700/50 text-green-300 text-xs px-2 py-0.5 rounded-full font-bold">
                        FREE
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-indigo-400 text-xs font-bold">
                      {resource.platform}
                    </span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-gray-400 text-xs">
                      {resource.channel}
                    </span>
                    <span className="text-gray-600 text-xs">•</span>
                    <span className="text-gray-400 text-xs">
                      ⏱️ {resource.duration}
                    </span>
                  </div>
                </div>
                <span className="text-gray-500 text-lg">→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-6 border border-gray-700/20">
        <h3 className="text-white font-black mb-4">
          📊 Your Learning Roadmap
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {resources.map((r, index) => (
            <div
              key={index}
              onClick={() => setActiveSkill(index)}
              className={`glass rounded-xl p-4 cursor-pointer card-hover border transition-all ${
                activeSkill === index
                  ? "border-indigo-500/50 bg-indigo-900/20"
                  : "border-gray-700/30 hover:border-indigo-500/30"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-white font-bold text-sm">{r.skill}</p>
                <span className="text-green-400 text-xs font-bold">
                  {r.resources.filter(x => x.free).length} free
                </span>
              </div>
              <p className="text-gray-400 text-xs">{r.time}</p>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default LearningResources;

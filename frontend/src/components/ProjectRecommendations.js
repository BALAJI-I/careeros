import { useState, useEffect } from "react";
import axios from "axios";

function ProjectRecommendations({ resumeData }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const commonSkills = [
        "python", "javascript", "react", "nodejs",
        "machine learning", "docker", "aws"
      ];
      const userSkills = resumeData.skills_found || [];
      const missingSkills = commonSkills.filter(
        s => !userSkills.map(x => x.toLowerCase()).includes(s)
      );

      const res = await axios.post(
        "https://careeros-0w27.onrender.com/projects/recommend",
        {
          missing_skills: missingSkills.slice(0, 4),
          existing_skills: userSkills.slice(0, 3)
        }
      );
      setProjects(res.data.projects);
    } catch (err) {
      console.error("Projects error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-900/50 text-green-300 border-green-700/50";
      case "Intermediate": return "bg-yellow-900/50 text-yellow-300 border-yellow-700/50";
      case "Advanced": return "bg-red-900/50 text-red-300 border-red-700/50";
      default: return "bg-gray-900/50 text-gray-300 border-gray-700/50";
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case "skill_gap": return "bg-red-900/30 border-red-700/30";
      case "skill_boost": return "bg-indigo-900/30 border-indigo-700/30";
      default: return "bg-gray-900/30 border-gray-700/30";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">💻</div>
        <p className="text-indigo-400 font-black text-xl">
          Finding Projects...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl animate-fade-in">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-float">💻</div>
        <h2 className="text-3xl font-black text-white mb-2">
          Project Recommendations
        </h2>
        <p className="text-gray-400 text-sm">
          Build these projects to prove your skills to recruiters
        </p>
      </div>

      {/* Why Projects Matter */}
      <div className="glass rounded-2xl p-5 mb-6 border border-indigo-700/20">
        <p className="text-indigo-300 text-sm font-bold mb-1">
          💡 Why Projects Matter
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Recruiters spend 6 seconds on a resume. A GitHub with real projects
          makes them spend 6 minutes. Each project below is designed to fill
          a specific skill gap and make your resume irresistible.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="flex flex-col gap-4">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`glass rounded-2xl border card-hover transition-all ${getTypeColor(project.type)}`}
          >
            {/* Project Header */}
            <div
              className="p-6 cursor-pointer"
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-white font-black text-lg">
                      {project.title}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                    {project.type === "skill_gap" && (
                      <span className="bg-red-900/50 border border-red-700/50 text-red-300 text-xs px-2 py-0.5 rounded-full font-bold">
                        🎯 Fills Skill Gap
                      </span>
                    )}
                    {project.type === "skill_boost" && (
                      <span className="bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-bold">
                        ⚡ Skill Boost
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {project.description}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <span className="glass text-gray-300 text-xs px-2 py-1 rounded-lg">
                      ⏱️ {project.time}
                    </span>
                    {project.skills.map((s, i) => (
                      <span key={i} className="bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-gray-500 text-lg ml-4">
                  {expanded === index ? "↑" : "↓"}
                </span>
              </div>

              {/* Why this project */}
              <div className="glass rounded-xl p-3 border border-gray-700/20">
                <p className="text-gray-400 text-xs">
                  💡 <span className="font-bold text-gray-300">Why build this:</span> {project.reason}
                </p>
              </div>
            </div>

            {/* Expanded Steps */}
            {expanded === index && (
              <div className="px-6 pb-6 border-t border-gray-700/20 pt-4">
                <h4 className="text-white font-black mb-3">
                  📋 How to Build It
                </h4>
                <div className="flex flex-col gap-2 mb-4">
                  {project.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="bg-indigo-600/30 border border-indigo-700/50 text-indigo-300 text-xs font-black px-2 py-0.5 rounded-lg flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-gray-300 text-sm">{step}</p>
                    </div>
                  ))}
                </div>

                {/* GitHub Search */}
                <a
                
                  href={`https://github.com/search?q=${project.github_topics}&type=repositories&l=Python`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass px-4 py-2 rounded-xl text-sm font-bold text-gray-300 hover:text-white border border-gray-700/30 hover:border-indigo-500/50 transition-all inline-flex items-center gap-2"
                >
                  🔍 See Examples on GitHub →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Tip */}
      <div className="glass rounded-2xl p-6 mt-6 border border-indigo-700/20 text-center">
        <p className="text-2xl mb-3">🏆</p>
        <p className="text-white font-black mb-2">
          Pro Tip from Mentor
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Build 2-3 of these projects and push them to GitHub.
          Add a good README with screenshots.
          Then add the GitHub link to your resume.
          This alone can double your callback rate.
        </p>
      </div>

    </div>
  );
}

export default ProjectRecommendations;
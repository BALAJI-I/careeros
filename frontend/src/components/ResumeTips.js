import { useState, useEffect } from "react";
import axios from "axios";

function ResumeTips({ resumeData }) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzResume();
  }, []);

  const analyzResume = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/tips/analyze",
        {
          text: resumeData.text,
          skills: resumeData.skills_found || [],
          word_count: resumeData.word_count
        }
      );
      setTips(res.data);
    } catch (err) {
      console.error("Tips error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">🔍</div>
        <p className="text-indigo-400 font-black text-xl">
          Analyzing Resume...
        </p>
      </div>
    );
  }

  if (!tips) return null;

  const getTypeStyle = (type) => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-900/30 border-red-700/50",
          icon: "❌",
          badge: "bg-red-900/50 text-red-300 border-red-700/50",
          label: "Fix Required"
        };
      case "warning":
        return {
          bg: "bg-yellow-900/30 border-yellow-700/50",
          icon: "⚠️",
          badge: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
          label: "Suggestion"
        };
      case "success":
        return {
          bg: "bg-green-900/30 border-green-700/50",
          icon: "✅",
          badge: "bg-green-900/50 text-green-300 border-green-700/50",
          label: "Great!"
        };
      default:
        return {
          bg: "bg-gray-800 border-gray-700",
          icon: "💡",
          badge: "bg-gray-700 text-gray-300 border-gray-600",
          label: "Tip"
        };
    }
  };

  return (
    <div className="w-full max-w-3xl animate-fade-in">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-float">📋</div>
        <h2 className="text-3xl font-black text-white mb-2">
          Resume Analysis
        </h2>
        <p className="text-gray-400 text-sm">
          {tips.total_tips} suggestions to improve your resume
        </p>
      </div>

      {/* Score Card */}
      <div className="glass rounded-3xl p-8 mb-6 text-center border border-indigo-700/20">
        <p className="text-gray-400 text-sm font-bold mb-2 uppercase tracking-wider">
          Resume Score
        </p>
        <div className={`text-7xl font-black mb-2 ${
          tips.score >= 8 ? "text-green-400" :
          tips.score >= 6 ? "text-yellow-400" :
          tips.score >= 4 ? "text-orange-400" :
          "text-red-400"
        }`}>
          {tips.score}/10
        </div>
        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-black border ${
          tips.score >= 8
            ? "bg-green-900/50 text-green-300 border-green-700/50"
            : tips.score >= 6
            ? "bg-yellow-900/50 text-yellow-300 border-yellow-700/50"
            : tips.score >= 4
            ? "bg-orange-900/50 text-orange-300 border-orange-700/50"
            : "bg-red-900/50 text-red-300 border-red-700/50"
        }`}>
          {tips.score_label}
        </div>

        {/* Score Bar */}
        <div className="w-full bg-gray-800 rounded-full h-3 mt-6">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              tips.score >= 8 ? "bg-green-400" :
              tips.score >= 6 ? "bg-yellow-400" :
              tips.score >= 4 ? "bg-orange-400" :
              "bg-red-400"
            }`}
            style={{ width: `${tips.score * 10}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-2xl p-4 text-center border border-red-700/20">
          <p className="text-2xl font-black text-red-400">
            {tips.high_priority}
          </p>
          <p className="text-red-300 text-xs mt-1">High Priority</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-yellow-700/20">
          <p className="text-2xl font-black text-yellow-400">
            {tips.tips.filter(t => t.priority === "medium").length}
          </p>
          <p className="text-yellow-300 text-xs mt-1">Suggestions</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-green-700/20">
          <p className="text-2xl font-black text-green-400">
            {tips.tips.filter(t => t.type === "success").length}
          </p>
          <p className="text-green-300 text-xs mt-1">Strengths</p>
        </div>
      </div>

      {/* Tips List */}
      <div className="flex flex-col gap-4">
        {tips.tips.map((tip, index) => {
          const style = getTypeStyle(tip.type);
          return (
            <div
              key={index}
              className={`glass rounded-2xl p-5 border card-hover ${style.bg}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{style.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="glass text-gray-400 text-xs px-2 py-0.5 rounded-full">
                      {tip.category}
                    </span>
                    {tip.priority === "high" && (
                      <span className="bg-red-900/50 text-red-300 border border-red-700/50 text-xs px-2 py-0.5 rounded-full font-bold">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-white font-bold text-sm mb-2">
                    {tip.issue}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    💡 {tip.fix}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Message */}
      <div className="glass rounded-2xl p-6 mt-6 text-center border border-indigo-700/20">
        <p className="text-gray-400 text-sm">
          {tips.score >= 8
            ? "🎉 Your resume is strong! Focus on applying to jobs now."
            : tips.score >= 6
            ? "📈 Good resume! Fix the high priority issues to get more callbacks."
            : "🔧 Your resume needs improvement. Fix all high priority issues first."}
        </p>
      </div>

    </div>
  );
}

export default ResumeTips;
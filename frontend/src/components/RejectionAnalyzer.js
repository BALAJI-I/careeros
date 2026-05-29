import { useState } from "react";
import axios from "axios";

function RejectionAnalyzer() {
  const [emailText, setEmailText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!emailText.trim()) {
      setError("Please paste the rejection email first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "https://careeros-0w27.onrender.com/rejection/analyze",
        {
          email_text: emailText,
          job_title: jobTitle,
          company: company
        }
      );
      setResult(res.data);
    } catch (err) {
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setEmailText("");
    setJobTitle("");
    setCompany("");
    setError("");
  };

  return (
    <div className="w-full max-w-3xl animate-fade-in">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-float">💔</div>
        <h2 className="text-3xl font-black text-white mb-2">
          Rejection Analyzer
        </h2>
        <p className="text-gray-400 text-sm">
          Paste your rejection email. We'll tell you exactly why and what to do next.
        </p>
      </div>

      {!result ? (
        <div className="glass rounded-3xl p-8 border border-gray-700/20">

          {/* Job Info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-xs font-bold mb-2 block uppercase tracking-wider">
                Job Title (optional)
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-bold mb-2 block uppercase tracking-wider">
                Company (optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Swiggy"
                className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 placeholder-gray-600"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="text-gray-400 text-xs font-bold mb-2 block uppercase tracking-wider">
              Paste Rejection Email
            </label>
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Paste the rejection email here... or type 'no response' if you were ghosted."
              rows={8}
              className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 placeholder-gray-600 resize-none"
            />
            <p className="text-gray-600 text-xs mt-1">
              {emailText.length} characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-300 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all text-lg ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 btn-glow active:scale-95"
            }`}
          >
            {loading ? "Analyzing... ⏳" : "Analyze Rejection 🔍"}
          </button>

          {/* Example */}
          <button
            onClick={() => setEmailText("Thank you for your interest in the Frontend Developer position at our company. After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current requirements. We appreciate the time you invested in our interview process and encourage you to apply for future openings that match your qualifications.")}
            className="w-full py-2 mt-3 rounded-xl text-xs text-gray-500 hover:text-gray-300 transition-all"
          >
            Try with example email →
          </button>

        </div>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Rejection Type */}
          <div className="glass rounded-3xl p-6 border border-red-700/20 text-center">
            <p className="text-6xl mb-3">{result.rejection_emoji}</p>
            <h3 className="text-2xl font-black text-white mb-1">
              {result.rejection_type}
            </h3>
            {jobTitle && company && (
              <p className="text-gray-400 text-sm">
                {jobTitle} at {company}
              </p>
            )}
          </div>

          {/* Recovery Score */}
          <div className={`glass rounded-2xl p-6 border text-center ${
            result.recovery_color === "green"
              ? "border-green-700/30"
              : result.recovery_color === "yellow"
              ? "border-yellow-700/30"
              : "border-red-700/30"
          }`}>
            <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">
              Recovery Speed
            </p>
            <p className={`text-3xl font-black mb-2 ${
              result.recovery_color === "green"
                ? "text-green-400"
                : result.recovery_color === "yellow"
                ? "text-yellow-400"
                : "text-red-400"
            }`}>
              {result.recovery}
            </p>
            <p className="text-gray-400 text-sm">
              {result.recovery_message}
            </p>
          </div>

          {/* Why Rejected */}
          <div className="glass rounded-2xl p-6 border border-gray-700/20">
            <h3 className="text-white font-black mb-4">
              🔍 Why You Were Rejected
            </h3>
            <div className="flex flex-col gap-2">
              {result.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-red-400 mt-0.5">•</span>
                  <p className="text-gray-300 text-sm">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What To Fix */}
          <div className="glass rounded-2xl p-6 border border-gray-700/20">
            <h3 className="text-white font-black mb-4">
              🔧 What To Fix
            </h3>
            <div className="flex flex-col gap-3">
              {result.fixes.map((fix, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 border ${
                    fix.priority === "high"
                      ? "bg-red-900/20 border-red-700/30"
                      : fix.priority === "medium"
                      ? "bg-yellow-900/20 border-yellow-700/30"
                      : "bg-green-900/20 border-green-700/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-bold text-sm">
                      {fix.issue}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
                      fix.priority === "high"
                        ? "bg-red-900/50 text-red-300 border-red-700/50"
                        : fix.priority === "medium"
                        ? "bg-yellow-900/50 text-yellow-300 border-yellow-700/50"
                        : "bg-green-900/50 text-green-300 border-green-700/50"
                    }`}>
                      {fix.priority}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    💡 {fix.fix}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="glass rounded-2xl p-6 border border-indigo-700/20">
            <h3 className="text-white font-black mb-4">
              ⚡ Next Steps
            </h3>
            <div className="flex flex-col gap-2">
              {result.next_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="bg-indigo-600/30 border border-indigo-700/50 text-indigo-300 text-xs font-black px-2 py-0.5 rounded-lg flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-gray-300 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <div className="glass rounded-2xl p-6 border border-indigo-700/20 text-center">
            <p className="text-2xl mb-3">💪</p>
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "{result.motivation}"
            </p>
          </div>

          {/* Analyze Another */}
          <button
            onClick={handleReset}
            className="w-full py-4 rounded-2xl font-black text-white glass hover:bg-white/10 transition-all"
          >
            Analyze Another Rejection
          </button>

        </div>
      )}
    </div>
  );
}

export default RejectionAnalyzer;
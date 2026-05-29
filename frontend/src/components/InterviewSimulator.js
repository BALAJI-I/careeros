import { useState } from "react";
import axios from "axios";

function InterviewSimulator() {
  const [stage, setStage] = useState("select");
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    "Frontend Developer",
    "Python Backend Developer",
    "Data Science",
    "Full Stack Developer",
    "ML Engineer",
    "DevOps Engineer",
    "General"
  ];

  const startInterview = async () => {
    if (!role) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "https://careeros-0w27.onrender.com/interview/start",
        { role }
      );
      setQuestions(res.data.questions);
      setStage("interview");
      setCurrentQ(0);
      setResults([]);
    } catch (err) {
      console.error("Start error:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "https://careeros-0w27.onrender.com/interview/evaluate",
        {
          role,
          question: questions[currentQ],
          answer,
          question_index: currentQ
        }
      );
      const newResult = {
        question: questions[currentQ],
        answer,
        evaluation: res.data.evaluation
      };
      setResults([...results, newResult]);
      setEvaluation(res.data.evaluation);
      setStage("feedback");
    } catch (err) {
      console.error("Evaluate error:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setAnswer("");
      setEvaluation(null);
      setStage("interview");
    } else {
      setStage("results");
    }
  };

  const getTotalScore = () => {
    if (results.length === 0) return 0;
    return Math.round(
      results.reduce((sum, r) => sum + r.evaluation.score, 0) / results.length
    );
  };

  // Stage: Select Role
  if (stage === "select") {
    return (
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🎤</div>
          <h2 className="text-3xl font-black text-white mb-2">
            Interview Simulator
          </h2>
          <p className="text-gray-400 text-sm">
            Practice real interview questions and get instant AI feedback
          </p>
        </div>

        <div className="glass rounded-3xl p-8 border border-indigo-700/20">
          <h3 className="text-white font-black text-lg mb-6">
            Select Your Target Role
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`p-4 rounded-2xl text-sm font-bold transition-all card-hover border text-left ${
                  role === r
                    ? "bg-indigo-600/50 border-indigo-500 text-white"
                    : "glass border-gray-700/30 text-gray-400 hover:text-white hover:border-indigo-500/50"
                }`}
              >
                {r === "Frontend Developer" && "💻 "}
                {r === "Python Backend Developer" && "🐍 "}
                {r === "Data Science" && "📊 "}
                {r === "Full Stack Developer" && "🔥 "}
                {r === "ML Engineer" && "🤖 "}
                {r === "DevOps Engineer" && "⚙️ "}
                {r === "General" && "🎯 "}
                {r}
              </button>
            ))}
          </div>

          {role && (
            <div className="glass rounded-2xl p-4 mb-6 border border-indigo-700/30">
              <p className="text-indigo-300 text-sm text-center">
                ✅ Selected: <span className="font-black">{role}</span>
                <br />
                <span className="text-gray-400 text-xs">
                  5 questions • AI feedback on each answer
                </span>
              </p>
            </div>
          )}

          <button
            onClick={startInterview}
            disabled={!role || loading}
            className={`w-full py-4 rounded-2xl font-black text-white transition-all text-lg ${
              !role || loading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-indigo-600 hover:bg-indigo-500 btn-glow active:scale-95"
            }`}
          >
            {loading ? "Starting... ⏳" : "Start Interview 🎤"}
          </button>

          <div className="glass rounded-xl p-4 mt-4 border border-yellow-700/30">
            <p className="text-yellow-300 text-xs text-center">
              💡 Tip: Answer as you would in a real interview.
              The AI evaluates length, examples, metrics and confidence.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Stage: Interview Question
  if (stage === "interview") {
    return (
      <div className="w-full max-w-2xl animate-fade-in">

        {/* Progress */}
        <div className="glass rounded-2xl p-4 mb-6 border border-indigo-700/20">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-sm font-bold">
              Question {currentQ + 1} of {questions.length}
            </p>
            <span className="glass text-indigo-300 text-xs px-3 py-1 rounded-full font-bold">
              {role}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all"
              style={{ width: `${((currentQ) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="glass rounded-3xl p-8 mb-6 border border-indigo-700/20">
          <p className="text-indigo-400 text-xs font-bold mb-3 uppercase tracking-wider">
            Question {currentQ + 1}
          </p>
          <h3 className="text-xl font-black text-white leading-relaxed">
            {questions[currentQ]}
          </h3>
        </div>

        {/* Answer Box */}
        <div className="glass rounded-2xl p-6 mb-4 border border-gray-700/20">
          <label className="text-gray-400 text-xs font-bold mb-3 block uppercase tracking-wider">
            Your Answer
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be specific, use examples, mention metrics."
            rows={6}
            className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 placeholder-gray-600 resize-none"
          />
          <div className="flex justify-between mt-2">
            <p className="text-gray-600 text-xs">
              {answer.split(" ").filter(w => w).length} words
            </p>
            <p className="text-gray-600 text-xs">
              Aim for 100-200 words
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={submitAnswer}
          disabled={!answer.trim() || loading}
          className={`w-full py-4 rounded-2xl font-black text-white transition-all text-lg ${
            !answer.trim() || loading
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-indigo-600 hover:bg-indigo-500 btn-glow active:scale-95"
          }`}
        >
          {loading ? "Evaluating... ⏳" : "Submit Answer →"}
        </button>

      </div>
    );
  }

  // Stage: Feedback
  if (stage === "feedback" && evaluation) {
    return (
      <div className="w-full max-w-2xl animate-fade-in">

        {/* Score */}
        <div className={`glass rounded-3xl p-8 mb-6 text-center border ${
          evaluation.grade_color === "green" ? "border-green-700/30" :
          evaluation.grade_color === "yellow" ? "border-yellow-700/30" :
          evaluation.grade_color === "orange" ? "border-orange-700/30" :
          "border-red-700/30"
        }`}>
          <p className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">
            Answer Score
          </p>
          <p className={`text-6xl font-black mb-2 ${
            evaluation.grade_color === "green" ? "text-green-400" :
            evaluation.grade_color === "yellow" ? "text-yellow-400" :
            evaluation.grade_color === "orange" ? "text-orange-400" :
            "text-red-400"
          }`}>
            {evaluation.score}/10
          </p>
          <span className={`text-sm font-black px-4 py-1.5 rounded-full border ${
            evaluation.grade_color === "green"
              ? "bg-green-900/50 text-green-300 border-green-700/50"
              : evaluation.grade_color === "yellow"
              ? "bg-yellow-900/50 text-yellow-300 border-yellow-700/50"
              : evaluation.grade_color === "orange"
              ? "bg-orange-900/50 text-orange-300 border-orange-700/50"
              : "bg-red-900/50 text-red-300 border-red-700/50"
          }`}>
            {evaluation.grade}
          </span>
        </div>

        {/* What Went Well */}
        {evaluation.feedback.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-4 border border-green-700/20">
            <h3 className="text-white font-black mb-3">✅ What Went Well</h3>
            <div className="flex flex-col gap-2">
              {evaluation.feedback.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-400 text-sm">•</span>
                  <p className="text-gray-300 text-sm">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {evaluation.improvements.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-4 border border-yellow-700/20">
            <h3 className="text-white font-black mb-3">🔧 Improve Next Time</h3>
            <div className="flex flex-col gap-2">
              {evaluation.improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-yellow-400 text-sm mt-0.5">•</span>
                  <p className="text-gray-300 text-sm">{imp}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="glass rounded-2xl p-4 mb-6 border border-indigo-700/20">
          <p className="text-indigo-300 text-sm">
            💡 <span className="font-bold">Pro Tip:</span> {evaluation.tip}
          </p>
        </div>

        {/* Next Button */}
        <button
          onClick={nextQuestion}
          className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 btn-glow transition-all text-lg active:scale-95"
        >
          {currentQ + 1 < questions.length
            ? `Next Question → (${currentQ + 2}/${questions.length})`
            : "See Final Results 🏆"}
        </button>

      </div>
    );
  }

  // Stage: Final Results
  if (stage === "results") {
    const totalScore = getTotalScore();
    return (
      <div className="w-full max-w-2xl animate-fade-in">

        {/* Final Score */}
        <div className="glass rounded-3xl p-8 mb-6 text-center border border-indigo-700/20">
          <div className="text-6xl mb-4 animate-float">🏆</div>
          <h2 className="text-3xl font-black text-white mb-2">
            Interview Complete!
          </h2>
          <p className="text-gray-400 text-sm mb-4">{role}</p>
          <p className={`text-6xl font-black mb-2 ${
            totalScore >= 8 ? "text-green-400" :
            totalScore >= 6 ? "text-yellow-400" :
            totalScore >= 4 ? "text-orange-400" :
            "text-red-400"
          }`}>
            {totalScore}/10
          </p>
          <p className="text-gray-400 text-sm">
            Average score across {results.length} questions
          </p>
        </div>

        {/* Question Breakdown */}
        <div className="glass rounded-2xl p-6 mb-6 border border-gray-700/20">
          <h3 className="text-white font-black mb-4">📊 Question Breakdown</h3>
          <div className="flex flex-col gap-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between glass rounded-xl p-3 border border-gray-700/20">
                <p className="text-gray-300 text-xs flex-1 mr-4 line-clamp-1">
                  Q{i + 1}: {r.question}
                </p>
                <span className={`text-sm font-black px-2 py-0.5 rounded-lg flex-shrink-0 ${
                  r.evaluation.score >= 8 ? "text-green-400" :
                  r.evaluation.score >= 6 ? "text-yellow-400" :
                  r.evaluation.score >= 4 ? "text-orange-400" :
                  "text-red-400"
                }`}>
                  {r.evaluation.score}/10
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Message */}
        <div className="glass rounded-2xl p-6 mb-6 border border-indigo-700/20 text-center">
          <p className="text-white font-bold mb-2">
            {totalScore >= 8 ? "🎉 Excellent! You're interview-ready!" :
             totalScore >= 6 ? "👍 Good performance! Practice a bit more." :
             totalScore >= 4 ? "📚 Keep practicing. You're getting there!" :
             "💪 Don't give up! Practice makes perfect."}
          </p>
          <p className="text-gray-400 text-sm">
            {totalScore >= 8
              ? "Start applying to jobs with confidence."
              : "Practice daily using CareerOS Interview Simulator."}
          </p>
        </div>

        {/* Try Again */}
        <button
          onClick={() => {
            setStage("select");
            setRole("");
            setQuestions([]);
            setCurrentQ(0);
            setAnswer("");
            setResults([]);
            setEvaluation(null);
          }}
          className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 btn-glow transition-all text-lg active:scale-95"
        >
          Practice Again 🎤
        </button>

      </div>
    );
  }
}

export default InterviewSimulator;
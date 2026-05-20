import { useEffect, useState } from "react";
import axios from "axios";

function JobMatch({ skills, resumeId }) {
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/jobs/match",
          { skills, resume_id: resumeId }
        );
        setJobs(res.data.jobs);
        setFiltered(res.data.jobs);
      } catch (err) {
        console.error("Job match error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [skills]);

  useEffect(() => {
    let result = jobs;
    if (search) {
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter !== "All") {
      result = result.filter((j) => j.decision === filter);
    }
    if (locationFilter !== "All") {
      result = result.filter((j) => j.location === locationFilter);
    }
    setFiltered(result);
  }, [search, filter, locationFilter, jobs]);

  const locations = ["All", ...new Set(jobs.map((j) => j.location))];
  const applyNow = jobs.filter((j) => j.decision === "Apply Now").length;
  const applyLearn = jobs.filter((j) => j.decision === "Apply + Learn").length;
  const prepareFirst = jobs.filter((j) => j.decision === "Prepare First").length;

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 animate-float">🎯</div>
        <p className="text-indigo-400 text-xl font-black mb-2">
          Matching Jobs...
        </p>
        <p className="text-gray-500 text-sm">
          Analyzing your {skills.length} skills
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl animate-fade-in">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">
          Job Matches 🎯
        </h2>
        <p className="text-gray-400 text-sm">
          {jobs.length} jobs matched based on your {skills.length} skills
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setFilter(filter === "Apply Now" ? "All" : "Apply Now")}
          className={`rounded-2xl p-5 text-center cursor-pointer transition-all card-hover border ${
            filter === "Apply Now"
              ? "bg-green-700/50 border-green-500"
              : "bg-green-900/30 border-green-700/30 hover:border-green-500"
          }`}
        >
          <p className="text-3xl font-black text-green-400">{applyNow}</p>
          <p className="text-green-300 text-xs mt-1 font-bold">🚀 Apply Now</p>
        </div>
        <div
          onClick={() => setFilter(filter === "Apply + Learn" ? "All" : "Apply + Learn")}
          className={`rounded-2xl p-5 text-center cursor-pointer transition-all card-hover border ${
            filter === "Apply + Learn"
              ? "bg-yellow-700/50 border-yellow-500"
              : "bg-yellow-900/30 border-yellow-700/30 hover:border-yellow-500"
          }`}
        >
          <p className="text-3xl font-black text-yellow-400">{applyLearn}</p>
          <p className="text-yellow-300 text-xs mt-1 font-bold">📚 Apply + Learn</p>
        </div>
        <div
          onClick={() => setFilter(filter === "Prepare First" ? "All" : "Prepare First")}
          className={`rounded-2xl p-5 text-center cursor-pointer transition-all card-hover border ${
            filter === "Prepare First"
              ? "bg-red-700/50 border-red-500"
              : "bg-red-900/30 border-red-700/30 hover:border-red-500"
          }`}
        >
          <p className="text-3xl font-black text-red-400">{prepareFirst}</p>
          <p className="text-red-300 text-xs mt-1 font-bold">🎯 Prepare First</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="glass rounded-2xl p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by job title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 mb-3 placeholder-gray-600"
        />
        <div className="flex gap-2 flex-wrap">
          {["All", "Apply Now", "Apply + Learn", "Prepare First"].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === d
                  ? "bg-indigo-600 text-white"
                  : "glass text-gray-400 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
          <span className="text-gray-700 text-xs py-1">|</span>
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                locationFilter === loc
                  ? "bg-purple-600 text-white"
                  : "glass text-gray-400 hover:text-white"
              }`}
            >
              📍 {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-400 text-sm mb-4">
        Showing <span className="text-white font-bold">{filtered.length}</span> jobs
      </p>

      {/* No Results */}
      {filtered.length === 0 && (
        <div className="text-center py-16 glass rounded-2xl">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-400 font-bold mb-2">No jobs found</p>
          <button
            onClick={() => { setSearch(""); setFilter("All"); setLocationFilter("All"); }}
            className="text-indigo-400 text-sm hover:text-indigo-300 mt-2"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Job Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map((job) => (
          <div
            key={job.job_id}
            className={`glass rounded-2xl p-6 border card-hover transition-all ${
              job.decision === "Apply Now"
                ? "border-green-700/30 hover:border-green-500/50"
                : job.decision === "Apply + Learn"
                ? "border-yellow-700/30 hover:border-yellow-500/50"
                : "border-red-700/30 hover:border-red-500/50"
            }`}
          >
            {/* Job Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-black text-white mb-1">
                  {job.title}
                </h3>
                <p className="text-indigo-400 text-sm font-bold">
                  {job.company}
                </p>
                <div className="flex gap-3 mt-2 flex-wrap">
                  <span className="glass text-gray-300 text-xs px-2 py-1 rounded-lg">
                    📍 {job.location}
                  </span>
                  <span className="glass text-gray-300 text-xs px-2 py-1 rounded-lg">
                    💼 {job.experience}
                  </span>
                  <span className="glass text-gray-300 text-xs px-2 py-1 rounded-lg">
                    💰 {job.salary}
                  </span>
                </div>
              </div>

              {/* Match % */}
              <div className="text-center ml-4">
                <div className={`text-3xl font-black ${
                  job.match_percent >= 70
                    ? "text-green-400"
                    : job.match_percent >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}>
                  {job.match_percent}%
                </div>
                <p className="text-gray-500 text-xs">Match</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  job.match_percent >= 70
                    ? "bg-green-400"
                    : job.match_percent >= 50
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${job.match_percent}%` }}
              />
            </div>

            {/* Skills */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {job.matched_skills.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">
                    ✅ You Have
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.matched_skills.map((skill, i) => (
                      <span key={i} className="bg-green-900/40 border border-green-700/50 text-green-300 text-xs px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {job.missing_skills.length > 0 && (
                <div>
                  <p className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">
                    ❌ You Need
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.missing_skills.map((skill, i) => (
                      <span key={i} className="bg-red-900/40 border border-red-700/50 text-red-300 text-xs px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Decision */}
            <div className={`w-full py-3 rounded-xl text-center font-black text-sm ${
              job.decision === "Apply Now"
                ? "bg-green-600/80 text-white"
                : job.decision === "Apply + Learn"
                ? "bg-yellow-600/80 text-white"
                : "bg-red-900/50 text-red-200"
            }`}>
              {job.decision_emoji} {job.decision}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default JobMatch;
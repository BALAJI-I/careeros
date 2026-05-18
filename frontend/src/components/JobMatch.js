import { useEffect, useState } from "react";
import axios from "axios";

function JobMatch({ skills }) {
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
          { skills }
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

  // Filter + Search
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

  // Get unique locations
  const locations = ["All", ...new Set(jobs.map((j) => j.location))];

  // Stats
  const applyNow = jobs.filter((j) => j.decision === "Apply Now").length;
  const applyLearn = jobs.filter((j) => j.decision === "Apply + Learn").length;
  const prepareFirst = jobs.filter((j) => j.decision === "Prepare First").length;

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-indigo-400 text-lg font-bold">
          Matching Jobs...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Analyzing your {skills.length} skills
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-white">
          Job Matches 🎯
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {jobs.length} jobs matched based on your {skills.length} skills
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setFilter("Apply Now")}
          className="bg-green-900 rounded-xl p-4 text-center cursor-pointer hover:bg-green-800 transition-all"
        >
          <p className="text-2xl font-bold text-green-400">{applyNow}</p>
          <p className="text-green-300 text-xs mt-1">🚀 Apply Now</p>
        </div>
        <div
          onClick={() => setFilter("Apply + Learn")}
          className="bg-yellow-900 rounded-xl p-4 text-center cursor-pointer hover:bg-yellow-800 transition-all"
        >
          <p className="text-2xl font-bold text-yellow-400">{applyLearn}</p>
          <p className="text-yellow-300 text-xs mt-1">📚 Apply + Learn</p>
        </div>
        <div
          onClick={() => setFilter("Prepare First")}
          className="bg-red-900 rounded-xl p-4 text-center cursor-pointer hover:bg-red-800 transition-all"
        >
          <p className="text-2xl font-bold text-red-400">{prepareFirst}</p>
          <p className="text-red-300 text-xs mt-1">🎯 Prepare First</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 flex flex-col gap-3">

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by job title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm outline-none border border-gray-700 focus:border-indigo-500"
        />

        {/* Filter Row */}
        <div className="flex gap-2 flex-wrap">

          {/* Decision Filter */}
          {["All", "Apply Now", "Apply + Learn", "Prepare First"].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filter === d
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {d}
            </button>
          ))}

          {/* Divider */}
          <span className="text-gray-600 text-xs py-1">|</span>

          {/* Location Filter */}
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                locationFilter === loc
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
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
        <div className="text-center py-10 bg-gray-800 rounded-xl">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-400">No jobs found. Try different filters.</p>
          <button
            onClick={() => {
              setSearch("");
              setFilter("All");
              setLocationFilter("All");
            }}
            className="mt-4 text-indigo-400 text-sm hover:text-indigo-300"
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
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-indigo-500 transition-all"
          >
            {/* Job Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {job.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {job.company}
                </p>
                <div className="flex gap-3 mt-1">
                  <span className="text-gray-500 text-xs">
                    📍 {job.location}
                  </span>
                  <span className="text-gray-500 text-xs">
                    💼 {job.experience}
                  </span>
                  <span className="text-gray-500 text-xs">
                    💰 {job.salary}
                  </span>
                </div>
              </div>

              {/* Match % */}
              <div className="text-center min-w-16">
                <div className={`text-3xl font-bold ${
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
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all ${
                  job.match_percent >= 70
                    ? "bg-green-400"
                    : job.match_percent >= 50
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
                style={{ width: `${job.match_percent}%` }}
              />
            </div>

            {/* Skills Row */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {job.matched_skills.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-bold mb-2 uppercase">
                    ✅ You Have
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.matched_skills.map((skill, i) => (
                      <span key={i}
                        className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {job.missing_skills.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-bold mb-2 uppercase">
                    ❌ You Need
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {job.missing_skills.map((skill, i) => (
                      <span key={i}
                        className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Decision Button */}
            <div className={`w-full py-3 rounded-xl text-center font-bold text-sm ${
              job.decision === "Apply Now"
                ? "bg-green-600 text-white"
                : job.decision === "Apply + Learn"
                ? "bg-yellow-600 text-white"
                : "bg-red-900 text-red-200"
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
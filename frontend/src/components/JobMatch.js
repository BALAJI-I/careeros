import { useEffect, useState } from "react";
import axios from "axios";

function JobMatch({ skills }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/jobs/match",
          { skills }
        );
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Job match error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [skills]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-indigo-400 text-lg font-bold">
          Matching Jobs... ⏳
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white">
          Job Matches 🎯
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Based on your {skills.length} skills
        </p>
      </div>

      {/* Job Cards */}
      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div
            key={job.job_id}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            {/* Job Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {job.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {job.company} • {job.location}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {job.experience} • {job.salary}
                </p>
              </div>

              {/* Match % Badge */}
              <div className="text-center">
                <div className={`text-2xl font-bold ${
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

            {/* Match % Bar */}
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

            {/* Matched Skills */}
            {job.matched_skills.length > 0 && (
              <div className="mb-3">
                <p className="text-gray-400 text-xs font-bold mb-2 uppercase">
                  ✅ You Have
                </p>
                <div className="flex flex-wrap gap-1">
                  {job.matched_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {job.missing_skills.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 text-xs font-bold mb-2 uppercase">
                  ❌ You Need
                </p>
                <div className="flex flex-wrap gap-1">
                  {job.missing_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-red-900 text-red-300 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
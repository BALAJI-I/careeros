import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import JobMatch from "./components/JobMatch";

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [showJobs, setShowJobs] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-400">CareerOS 🚀</h1>
        <p className="text-gray-400 text-xs">Your Daily Job Co-Pilot</p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 -mt-16">

        {/* Step 1: Upload Resume */}
        {!resumeData && (
          <ResumeUpload onUploadSuccess={setResumeData} />
        )}

        {/* Step 2: Skills + Match Jobs */}
        {resumeData && !showJobs && (
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-2xl">

            {/* Success Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">✅</div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Resume Analyzed!
                </h2>
                <p className="text-gray-400 text-sm">
                  {resumeData.filename} • {resumeData.word_count} words
                </p>
              </div>
            </div>

            {/* Skills Found */}
            <div className="bg-gray-900 rounded-xl p-4 mb-6">
              <h3 className="text-gray-400 text-xs font-bold mb-3 uppercase">
                Skills Found ({resumeData.total_skills})
              </h3>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills_found &&
                  resumeData.skills_found.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-indigo-400">
                  {resumeData.total_skills}
                </p>
                <p className="text-gray-400 text-xs mt-1">Skills Found</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {resumeData.word_count}
                </p>
                <p className="text-gray-400 text-xs mt-1">Words Scanned</p>
              </div>
            </div>

            {/* Match Jobs Button */}
            <button
              onClick={() => setShowJobs(true)}
              className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all mb-3"
            >
              Find Matching Jobs 🎯
            </button>

            {/* Upload Another */}
            <button
              onClick={() => setResumeData(null)}
              className="w-full py-3 rounded-xl font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all"
            >
              Upload Another Resume
            </button>

          </div>
        )}

        {/* Step 3: Job Matches */}
        {resumeData && showJobs && (
          <div className="w-full max-w-3xl">
            <button
              onClick={() => setShowJobs(false)}
              className="mb-6 text-gray-400 hover:text-white text-sm"
            >
              ← Back to Skills
            </button>
            <JobMatch skills={resumeData.skills_found || []} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";

function App() {
  const [resumeData, setResumeData] = useState(null);

  const handleUploadSuccess = (data) => {
    setResumeData(data);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-400">
          CareerOS 🚀
        </h1>
        <p className="text-gray-400 text-xs">
          Your Daily Job Co-Pilot
        </p>
      </div>

      {/* Main */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
        
        {!resumeData ? (
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
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

            {/* Extracted Text Preview */}
            <div className="bg-gray-900 rounded-xl p-4 mb-6">
              <h3 className="text-gray-400 text-xs font-bold mb-2 uppercase">
                Extracted Text Preview
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-6">
                {resumeData.text.slice(0, 500)}...
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-indigo-400">
                  {resumeData.word_count}
                </p>
                <p className="text-gray-400 text-xs mt-1">Words Found</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  ✅
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Successfully Parsed
                </p>
              </div>
            </div>

            {/* Upload Another */}
            <button
              onClick={() => setResumeData(null)}
              className="w-full py-3 rounded-xl font-bold text-white bg-gray-700 hover:bg-gray-600 transition-all"
            >
              Upload Another Resume
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
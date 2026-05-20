import { useState } from "react";
import axios from "axios";

function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setError("Please select a PDF file only");
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setError("");
    } else {
      setError("Please drop a PDF file only");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post(
        "http://localhost:8000/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const skillsRes = await axios.post(
        "http://localhost:8000/skills/extract",
        {
          text: uploadRes.data.text,
          resume_id: uploadRes.data.resume_id
        }
      );

      onUploadSuccess({
        ...uploadRes.data,
        ...skillsRes.data,
      });

    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl animate-slide-up">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-float">📄</div>
        <h2 className="text-3xl font-black text-white mb-2">
          Upload Your Resume
        </h2>
        <p className="text-gray-400 text-sm">
          PDF format only • AI extracts your skills instantly
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-2xl p-10 text-center mb-4 transition-all cursor-pointer ${
          dragOver
            ? "border-indigo-400 bg-indigo-900/20"
            : file
            ? "border-green-500 bg-green-900/10"
            : "border-gray-700 hover:border-indigo-500 glass"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
        <label htmlFor="resume-upload" className="cursor-pointer">
          <div className="text-5xl mb-4">
            {file ? "✅" : dragOver ? "📥" : "📤"}
          </div>
          <p className="text-white font-bold text-lg mb-1">
            {file ? file.name : "Drop your resume here"}
          </p>
          <p className="text-gray-400 text-sm">
            {file
              ? `${(file.size / 1024).toFixed(1)} KB • Ready to upload`
              : "or click to browse files"}
          </p>
          {!file && (
            <div className="mt-4 bg-indigo-600/20 border border-indigo-700/50 rounded-xl px-4 py-2 inline-block">
              <p className="text-indigo-300 text-xs font-bold">
                📄 PDF files only • Max 10MB
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-300 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`w-full py-4 rounded-2xl font-black text-white transition-all text-lg ${
          loading || !file
            ? "bg-gray-700 cursor-not-allowed opacity-50"
            : "bg-indigo-600 hover:bg-indigo-500 btn-glow active:scale-95"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Analyzing Resume...
          </span>
        ) : (
          "Upload & Extract Skills 🚀"
        )}
      </button>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { icon: "🧠", text: "AI Skill Detection" },
          { icon: "🎯", text: "Job Matching" },
          { icon: "📋", text: "Daily Tasks" },
        ].map((f, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <p className="text-2xl mb-1">{f.icon}</p>
            <p className="text-gray-400 text-xs">{f.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default ResumeUpload;
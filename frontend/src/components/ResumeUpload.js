import { useState } from "react";
import axios from "axios";

function ResumeUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Step 1: Upload resume with token
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

      // Step 2: Extract + save skills
      const skillsRes = await axios.post(
        "http://localhost:8000/skills/extract",
        {
          text: uploadRes.data.text,
          resume_id: uploadRes.data.resume_id
        }
      );

      // Combine results
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
    <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg">
      <h2 className="text-2xl font-bold text-white mb-2">
        Upload Your Resume
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        PDF format only. We will extract your skills automatically.
      </p>
      <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center mb-4 hover:border-indigo-400 transition-colors">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
        <label htmlFor="resume-upload" className="cursor-pointer">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-gray-300 text-sm">
            {file ? file.name : "Click to select PDF resume"}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Maximum 10MB"}
          </p>
        </label>
      </div>
      {error && (
        <p className="text-red-400 text-sm mb-4">❌ {error}</p>
      )}
      {file && !error && (
        <p className="text-green-400 text-sm mb-4">
          ✅ {file.name} ready to upload
        </p>
      )}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
          loading || !file
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
        }`}
      >
        {loading ? "Extracting Skills... ⏳" : "Upload & Extract Skills 🚀"}
      </button>
    </div>
  );
}

export default ResumeUpload;
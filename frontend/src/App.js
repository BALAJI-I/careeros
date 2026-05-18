import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("❌ Not Connected"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-indigo-400">CareerOS</h1>
        <p className="text-gray-400 mt-2 text-lg">
          Your Daily Job Co-Pilot 🚀
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-gray-800 rounded-2xl p-6 text-center w-80">
        <p className="text-gray-400 text-sm mb-2">Backend Status</p>
        <p className={`text-xl font-bold ${
          status === "healthy" 
            ? "text-green-400" 
            : "text-red-400"
        }`}>
          {status === "healthy" ? "✅ Connected" : status}
        </p>
      </div>

      {/* Tagline */}
      <p className="mt-8 text-gray-500 text-sm text-center max-w-md">
        AI that tells students exactly what to do 
        every day to get hired.
      </p>

    </div>
  );
}

export default App;
import { useState } from "react";
import axios from "axios";

function AdminLogin({ onAdminLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:8000/admin/login",
        { email, password }
      );
      localStorage.setItem("admin_token", res.data.token);
      onAdminLogin();
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-400">🔐 Admin</h1>
          <p className="text-gray-400 text-sm mt-2">CareerOS Admin Panel</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs font-bold mb-2 block uppercase">
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@careeros.com"
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-red-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-400 text-xs font-bold mb-2 block uppercase">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-red-500"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4">❌ {error}</p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {loading ? "Logging in... ⏳" : "Admin Login 🔐"}
        </button>

      </div>
    </div>
  );
}

export default AdminLogin;
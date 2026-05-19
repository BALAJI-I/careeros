import { useState } from "react";
import axios from "axios";

function Auth({ onAuthSuccess, onAdminClick }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const url = isLogin
        ? "http://localhost:8000/auth/login"
        : "http://localhost:8000/auth/signup";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axios.post(url, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-indigo-400">CareerOS 🚀</h1>
        <p className="text-gray-400 text-sm mt-2">Your Daily Job Co-Pilot</p>
      </div>

      {/* Auth Card */}
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700 animate-slide-up">

        {/* Tabs */}
        <div className="flex bg-gray-900 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              isLogin
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              !isLogin
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-6">
          {isLogin ? "Welcome back 👋" : "Create your account 🎉"}
        </h2>

        {/* Name - signup only */}
        {!isLogin && (
          <div className="mb-4">
            <label className="text-gray-400 text-xs font-bold mb-2 block uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Your full name"
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 placeholder-gray-600"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-400 text-xs font-bold mb-2 block uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="your@email.com"
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-400 text-xs font-bold mb-2 block uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="••••••••"
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl text-sm outline-none border border-gray-700 focus:border-indigo-500 placeholder-gray-600"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-300 text-sm">❌ {error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 active:scale-95"
          }`}
        >
          {loading
            ? "Please wait... ⏳"
            : isLogin
            ? "Login 🚀"
            : "Create Account 🎉"}
        </button>

        {/* Switch */}
        <p className="text-gray-400 text-sm text-center mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-indigo-400 hover:text-indigo-300 font-bold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {/* Admin Link */}
        <p className="text-center mt-4">
          <button
            onClick={onAdminClick}
            className="text-gray-600 hover:text-gray-400 text-xs transition-all"
          >
            Admin Access
          </button>
        </p>

      </div>
    </div>
  );
}

export default Auth;
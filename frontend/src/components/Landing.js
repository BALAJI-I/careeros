function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen animated-bg text-white overflow-hidden">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <h1 className="text-xl font-bold gradient-text">CareerOS</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onGetStarted}
            className="text-gray-400 hover:text-white text-sm font-medium transition-all"
          >
            Login
          </button>
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold btn-glow"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-24 pb-20 relative">

        {/* Glow orb */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 animate-pulse-slow" />

        <div className="bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs font-bold px-4 py-2 rounded-full mb-8 animate-fade-in">
          🎯 Built for Indian Students & Freshers
        </div>

        <h1 className="text-6xl font-black text-white mb-6 leading-tight max-w-4xl animate-slide-up">
          Get Hired Faster with
          <br />
          <span className="gradient-text">AI-Powered Career OS</span>
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in">
          Upload resume → Get job matches → Complete daily tasks → Get hired.
          CareerOS is your personal career co-pilot.
        </p>

        <div className="flex gap-4 mb-20 animate-slide-up">
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold text-lg btn-glow"
          >
            Start Free Today 🚀
          </button>
          <button
            onClick={onGetStarted}
            className="glass hover:bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all"
          >
            See Demo →
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-12 mb-24">
          {[
            { value: "20+", label: "Job Categories", color: "text-indigo-400" },
            { value: "3", label: "Daily Tasks", color: "text-green-400" },
            { value: "100%", label: "Free to Start", color: "text-yellow-400" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="w-full max-w-5xl mb-24">
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
            How It Works
          </p>
          <h2 className="text-4xl font-black text-white mb-16">
            3 Steps to Your Dream Job
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { step: "01", icon: "📄", title: "Upload Resume", desc: "Upload your PDF resume. AI extracts your skills automatically in seconds." },
              { step: "02", icon: "🎯", title: "Get Job Matches", desc: "See exactly which jobs to Apply Now, Apply+Learn, or Prepare First." },
              { step: "03", icon: "📋", title: "Daily Tasks", desc: "Get 3 personalized tasks every morning. Build your streak. Get hired." },
            ].map((item) => (
              <div key={item.step} className="glass rounded-2xl p-7 text-left card-hover">
                <div className="text-indigo-400 text-xs font-black mb-4 tracking-widest">
                  STEP {item.step}
                </div>
                <div className="text-5xl mb-5 animate-float">{item.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Engine */}
        <div className="w-full max-w-5xl mb-24">
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
            The Core Feature
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            The Decision Engine 🎯
          </h2>
          <p className="text-gray-400 mb-12">
            No more guessing. Know exactly what to do for every job.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                icon: "🚀",
                title: "Apply Now",
                range: "70%+ match",
                desc: "You're ready. Apply immediately. Don't wait.",
                bg: "bg-green-900/30",
                border: "border-green-700/50",
                color: "text-green-400"
              },
              {
                icon: "📚",
                title: "Apply + Learn",
                range: "50–70% match",
                desc: "Apply while filling skill gaps. You can get this job.",
                bg: "bg-yellow-900/30",
                border: "border-yellow-700/50",
                color: "text-yellow-400"
              },
              {
                icon: "🎯",
                title: "Prepare First",
                range: "Below 50%",
                desc: "Build key skills first. Then apply with confidence.",
                bg: "bg-red-900/30",
                border: "border-red-700/50",
                color: "text-red-400"
              },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} border ${item.border} rounded-2xl p-7 text-center card-hover`}>
                <p className="text-5xl mb-4">{item.icon}</p>
                <p className={`${item.color} font-black text-xl mb-1`}>{item.title}</p>
                <p className={`${item.color} text-xs mb-4 opacity-70`}>{item.range}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-5xl mb-24">
          <h2 className="text-4xl font-black text-white mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🧠", title: "AI Skill Extraction", desc: "Detect 50+ skills from your resume automatically" },
              { icon: "📊", title: "Match % Score", desc: "Know exactly how qualified you are for each job" },
              { icon: "🔥", title: "Daily Streak", desc: "Build a job hunting habit with daily tasks" },
              { icon: "📈", title: "Progress Tracking", desc: "Track your entire job hunting journey" },
              { icon: "🔍", title: "Smart Job Search", desc: "Filter by location, decision, and company" },
              { icon: "👑", title: "Admin Dashboard", desc: "Full analytics for placement officers" },
            ].map((f, i) => (
              <div key={i} className="glass rounded-xl p-5 flex items-start gap-4 card-hover">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h3 className="text-white font-bold mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="w-full max-w-3xl glass rounded-3xl p-12 text-center border border-indigo-700/30 mb-16">
          <div className="text-5xl mb-6 animate-float">🚀</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Get Hired?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join students using CareerOS to land their dream job.
            Free to start. No credit card needed.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-2xl font-black text-xl btn-glow"
          >
            Start Free Today 🎉
          </button>
          <p className="text-gray-600 text-xs mt-4">
            Free forever • No credit card • Indian job market focused
          </p>
        </div>

        {/* Footer */}
        <div className="text-gray-600 text-xs text-center">
          <p className="font-bold gradient-text text-sm mb-2">CareerOS</p>
          <p>Built for Indian Students 🇮🇳 • © 2026 All rights reserved</p>
        </div>

      </div>
    </div>
  );
}

export default Landing;
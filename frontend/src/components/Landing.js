function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-indigo-400">CareerOS 🚀</h1>
        <button
          onClick={onGetStarted}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all"
        >
          Get Started
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="bg-indigo-900 text-indigo-300 text-xs font-bold px-4 py-2 rounded-full mb-6">
          🎯 Built for Indian Students & Freshers
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 leading-tight max-w-3xl">
          Your AI Career
          <span className="text-indigo-400"> Co-Pilot </span>
          for Getting Hired
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed">
          Upload your resume. See which jobs to apply for.
          Get 3 daily tasks. Track your progress.
          CareerOS tells you exactly what to do every day to get hired.
        </p>

        <div className="flex gap-4 mb-16">
          <button
            onClick={onGetStarted}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
          >
            Start Free Today 🚀
          </button>
          <button
            onClick={onGetStarted}
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
          >
            See How It Works
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-400">20+</p>
            <p className="text-gray-400 text-sm mt-1">Job Categories</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">3</p>
            <p className="text-gray-400 text-sm mt-1">Daily Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">100%</p>
            <p className="text-gray-400 text-sm mt-1">Free to Start</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="w-full max-w-4xl mb-20">
          <h2 className="text-3xl font-bold text-white mb-12">
            How CareerOS Works
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "📄",
                title: "Upload Resume",
                desc: "Upload your PDF resume. We extract your skills automatically using AI."
              },
              {
                step: "02",
                icon: "🎯",
                title: "Get Job Matches",
                desc: "See which jobs you can Apply Now, Apply + Learn, or need to Prepare First."
              },
              {
                step: "03",
                icon: "📋",
                title: "Daily Tasks",
                desc: "Get 3 personalized tasks every day based on your skill gaps. Build your streak."
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-gray-800 rounded-2xl p-6 text-left border border-gray-700"
              >
                <div className="text-indigo-400 text-xs font-bold mb-3">
                  STEP {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="w-full max-w-4xl mb-20">
          <h2 className="text-3xl font-bold text-white mb-12">
            Everything You Need to Get Hired
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🧠", title: "AI Skill Extraction", desc: "Automatically detect 50+ skills from your resume" },
              { icon: "📊", title: "Match % Score", desc: "Know exactly how qualified you are for each job" },
              { icon: "🚀", title: "Decision Engine", desc: "Apply Now, Apply+Learn, or Prepare First" },
              { icon: "🔥", title: "Daily Streak", desc: "Build a job hunting habit with daily tasks" },
              { icon: "🎯", title: "Skill Gap Analysis", desc: "See exactly what skills you're missing" },
              { icon: "📈", title: "Progress Tracking", desc: "Track your job hunting journey daily" },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-5 flex items-start gap-4 border border-gray-700"
              >
                <span className="text-3xl">{feature.icon}</span>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Engine Showcase */}
        <div className="w-full max-w-4xl mb-20 bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            The Decision Engine 🎯
          </h2>
          <p className="text-gray-400 text-sm text-center mb-8">
            No more guessing which jobs to apply for
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-900 rounded-xl p-5 text-center border border-green-700">
              <p className="text-3xl mb-2">🚀</p>
              <p className="text-green-400 font-bold text-lg">Apply Now</p>
              <p className="text-green-300 text-xs mt-2">70%+ match</p>
              <p className="text-gray-400 text-xs mt-2">
                You're ready. Apply immediately.
              </p>
            </div>
            <div className="bg-yellow-900 rounded-xl p-5 text-center border border-yellow-700">
              <p className="text-3xl mb-2">📚</p>
              <p className="text-yellow-400 font-bold text-lg">Apply + Learn</p>
              <p className="text-yellow-300 text-xs mt-2">50–70% match</p>
              <p className="text-gray-400 text-xs mt-2">
                Apply while filling skill gaps.
              </p>
            </div>
            <div className="bg-red-900 rounded-xl p-5 text-center border border-red-700">
              <p className="text-3xl mb-2">🎯</p>
              <p className="text-red-400 font-bold text-lg">Prepare First</p>
              <p className="text-red-300 text-xs mt-2">Below 50% match</p>
              <p className="text-gray-400 text-xs mt-2">
                Build skills before applying.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full max-w-2xl bg-indigo-900 rounded-2xl p-10 text-center border border-indigo-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Hired? 🚀
          </h2>
          <p className="text-indigo-300 text-sm mb-8">
            Join students who use CareerOS to land their dream job.
            Free to start. No credit card needed.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-indigo-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all"
          >
            Start Free Today 🎉
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-gray-600 text-xs text-center">
          <p>CareerOS — Built for Indian Students 🇮🇳</p>
          <p className="mt-1">
            © 2026 CareerOS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
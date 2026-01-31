import Link from "next/link";

const FeatureCard = ({ title, description, icon, variant = "current" }: { 
  title: string; 
  description: string; 
  icon: string;
  variant?: "current" | "upcoming";
}) => (
  <div className={`group relative p-6 rounded-2xl border transition-all duration-500 ${
    variant === "current" 
      ? "bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1" 
      : "bg-slate-50/20 dark:bg-slate-900/20 border-dashed border-slate-300/50 dark:border-slate-700/50 opacity-80"
  } backdrop-blur-md`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 ${
      variant === "current" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"
    }`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className={`text-xl font-bold mb-2 ${variant === "current" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
      {title}
      {variant === "upcoming" && (
        <span className="ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-medium">Coming Soon</span>
      )}
    </h3>
    <p className={`text-sm leading-relaxed ${variant === "current" ? "text-slate-600 dark:text-slate-400" : "text-slate-500 dark:text-slate-500"}`}>
      {description}
    </p>
  </div>
);

export default function Home() {
  const currentFeatures = [
    { title: "Markdown-Based", description: "Simple and powerful content creation using familiar markdown syntax.", icon: "📝" },
    { title: "Live Preview", description: "Real-time visualization of your CV as you type, with instant feedback.", icon: "⚡" },
    { title: "PDF Export", description: "Generate high-quality, professional PDF files ready for job applications.", icon: "📄" },
    { title: "Privacy First", description: "No sign-up required. Your data is stored locally in your browser.", icon: "🛡️" },
    { title: "Modern Templates", description: "Choose from a variety of professionally designed, industry-standard templates.", icon: "🎨" },
    { title: "Open Source", description: "Transparent, community-driven, and fully free to use under MIT license.", icon: "🤝" },
  ];

  const upcomingFeatures = [
    { title: "AI Assistant", description: "Smart content suggestions and optimization tailored for your target roles.", icon: "🤖" },
    { title: "LinkedIn Import", description: "Quickly generate your CV by importing data directly from your profile.", icon: "📥" },
    { title: "Dark Mode Support", description: "Specialized dark-themed templates for a modern, high-tech aesthetic.", icon: "🌙" },
    { title: "Multi-CV Sync", description: "Manage multiple versions of your CV and sync them across devices.", icon: "🔄" },
    { title: "Custom Branding", description: "Personalize your CV with custom colors, fonts, and professional logos.", icon: "🏷️" },
    { title: "Job Tracking", description: "A simple dashboard to track your job applications and CV versions.", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-emerald-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 rounded-2xl px-6 py-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-black text-xl">L</span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-2xl tracking-tight">lebenslauf</span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
            >
              Features
            </a>
            <a
              href="https://github.com/bimalpaudels/lebenslauf"
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-all p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase mb-8 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>2026 Edition Now Live</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
            Elevate Your Career with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              Modern Markdown.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Beautifully designed, highly customisable CVs built in minutes. 
            Privacy-first, open-source, and developer-friendly.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/dashboard"
              className="group relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Start Building</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <a
              href="#features"
              className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              See Features
            </a>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
              Powerful simplicity.
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              We focus on the perfect balance between professional aesthetics and intuitive markdown editing.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Card: Current Features */}
            <div className="group relative p-10 rounded-[40px] bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-3xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">V1.0 LIVE</h3>
                  <p className="text-emerald-500 font-bold text-sm uppercase tracking-widest mt-1">Available Now</p>
                </div>
              </div>
              <div className="space-y-6">
                {currentFeatures.map((f, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors group/item">
                    <div className="text-2xl mt-1 group-hover/item:scale-110 transition-transform duration-300">{f.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{f.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Upcoming Features */}
            <div className="group relative p-10 rounded-[40px] bg-slate-50/20 dark:bg-slate-900/20 border border-dashed border-slate-300/50 dark:border-slate-700/50 backdrop-blur-md opacity-90 transition-all duration-500 hover:opacity-100">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-500 shadow-sm">
                  <span className="text-3xl">💎</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">V2.0 NEXT</h3>
                  <p className="text-blue-500 font-bold text-sm uppercase tracking-widest mt-1">Coming Soon</p>
                </div>
              </div>
              <div className="space-y-6">
                {upcomingFeatures.map((f, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl opacity-60 hover:opacity-100 transition-opacity">
                    <div className="text-2xl mt-1">{f.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center">
                        {f.title}
                        <span className="ml-2 text-[8px] uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold">Planned</span>
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-0.5">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center px-12 py-20 bg-slate-900 dark:bg-white rounded-[48px] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white dark:text-slate-900 mb-8 leading-tight">
              Ready to land your <br />
              <span className="text-emerald-400 dark:text-emerald-600">dream job?</span>
            </h2>
            <p className="text-xl text-slate-400 dark:text-slate-600 mb-12 max-w-2xl mx-auto">
              No sign-up, no hidden fees. Just professional CVs in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/dashboard"
                className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1"
              >
                Create Your CV
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 dark:text-white font-bold">L</span>
            </div>
            <span className="text-slate-600 dark:text-slate-400 font-bold">lebenslauf</span>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            © {new Date().getFullYear()} lebenslauf. Built with Markdown and Passion.
          </p>
          <div className="flex items-center space-x-6">
            <a href="https://github.com/bimalpaudels/lebenslauf" className="text-slate-400 hover:text-emerald-500 transition-colors">GitHub</a>
            <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

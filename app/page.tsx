import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "lebenslauf — Elevate Your Resume with Modern Markdown",
  description: "Create professional, industry-standard CVs in minutes with our open-source, markdown-based builder. Privacy-focused and no sign-up required.",
};

const currentFeatures = [
  {
    title: "Markdown-Based",
    description: "Simple and powerful content creation using markdown syntax.",
  },
  {
    title: "Live Preview",
    description: "Real-time visualization of your CV as you type.",
  },
  {
    title: "PDF Export",
    description: "Generate high-quality PDF files ready for job applications.",
  },
  {
    title: "Privacy First",
    description: "No sign-up required. Your data is stored locally in your browser.",
  },
  {
    title: "Templates Based",
    description: "Choose from a variety of designed templates.",
  },
  {
    title: "Open Source",
    description: "Transparent and designed to be community-driven.",
  },
];

const upcomingFeatures = [
  {
    title: "AI Support - BYOK",
    description: "Bring your own API key to help you generate your CV.",
    status: "Planned",
  },
  {
    title: "More Templates",
    description: "More templates to choose from.",
    status: "WIP",
  },
  {
    title: "Country Specific Templates",
    description: "Templates specific to countries that follow their own standards.",
    status: "WIP",
  },
  {
    title: "Granular Control to The Markdown Editor",
    description: "Ability to edit each section of the CV independently.",
    status: "Planned",
  },
  {
    title: "Save on Your Phone",
    description: "QR Code to save your CV on your phone.",
    status: "Planned",
  },
  {
    title: "Request Features and Report Bug",
    description: "Help us make lebenslauf better by reporting bugs or requesting new features.",
    link: "https://github.com/bimalpaudels/lebenslauf/issues",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <BackgroundOrbs />

      <SiteHeader variant="floating" />

      {/* Hero Section */}
      <main className="pt-48 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 mb-8 backdrop-blur-sm">
            <span className="text-rose-500 font-black text-xs uppercase tracking-widest">lebenslauf</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold tracking-tight lowercase italic">/le:bnslaʊf/ — life&apos;s course; CV</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white mb-8 leading-[0.95] tracking-tighter">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">Resume</span>
            <span className="block">
              With <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">Markdown.</span>
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 font-medium leading-relaxed">
            Beautifully designed, highly customisable CVs built in minutes.
            Privacy-first, open-source, and developer-friendly.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/dashboard"
              className="group relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(244,63,94,0.3)] hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Start Building</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              Built with focus on the perfect balance between professional aesthetics and
              intuitive markdown editing.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Card: Current Features */}
            <div className="group relative p-10 rounded-[40px] bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-rose-500/10">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <div className="w-6 h-1 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    V1.0 LIVE
                  </h3>
                  <p className="text-rose-500 font-bold text-sm uppercase tracking-widest mt-1">
                    Available Now
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {currentFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors group/item"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-rose-500 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {f.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {f.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Upcoming Features */}
            <div className="group relative p-10 rounded-[40px] bg-slate-50/20 dark:bg-slate-900/20 border border-dashed border-slate-300/50 dark:border-slate-700/50 backdrop-blur-md opacity-90 transition-all duration-500 hover:opacity-100">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 text-orange-500 shadow-sm">
                  <div className="w-6 h-1 bg-orange-500 rounded-full opacity-50"></div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                    V2.0 NEXT
                  </h3>
                  <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mt-1">
                    Coming Soon
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {upcomingFeatures.map((f, i) => {
                  const content = (
                    <div className="flex items-start space-x-4 p-4 rounded-2xl opacity-60 hover:opacity-100 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                      <div className="w-1.5 h-1.5 mt-2 rounded-full bg-orange-500"></div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center">
                          {f.title}
                          {f.status && (
                            <span className="ml-2 text-[8px] uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold">
                              {f.status}
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-500 mt-0.5">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  );

                  return f.link ? (
                    <a key={i} href={f.link} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <div key={i}>{content}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center px-12 py-20 bg-white dark:bg-slate-900 rounded-[48px] relative overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
              Ready to land your <br />
              <span className="text-rose-500">dream job?</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              No sign-up. Just professional CVs in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/dashboard"
                className="px-10 py-5 bg-rose-500 text-white rounded-2xl font-black text-xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/20 hover:-translate-y-1"
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
              <span className="text-slate-900 dark:text-white font-bold text-xs uppercase">cv</span>
            </div>
            <span className="text-slate-600 dark:text-slate-400 font-bold">lebenslauf</span>
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            © {new Date().getFullYear()} lebenslauf. Built with Markdown and Passion.
          </p>
        </div>
      </footer>
    </div>
  );
}

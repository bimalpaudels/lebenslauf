import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#3ECF8E] rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">CV</span>
            </div>
            <span className="text-white font-semibold text-xl">BuildCV</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-[#3ECF8E] transition-colors"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-slate-300 hover:text-[#3ECF8E] transition-colors"
            >
              Templates
            </a>
            <a
              href="https://github.com/buildcv/buildcv"
              className="text-slate-300 hover:text-[#3ECF8E] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Your CV in
            <span className="block bg-gradient-to-r from-[#3ECF8E] to-[#4BE4B4] bg-clip-text text-transparent">
              Minutes with Markdown
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create professional CVs effortlessly with our{" "}
            <span className="text-[#3ECF8E] font-semibold">open source</span>,
            lightweight, and fast CV builder. No sign-up required - contribute
            templates and help build the future of CV creation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/builder"
              className="group bg-[#3ECF8E] text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#4BE4B4] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Building Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
            <Link
              href="/templates"
              className="group border-2 border-[#3ECF8E] text-[#3ECF8E] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#3ECF8E] hover:text-slate-900 transition-all duration-300"
            >
              Contribute Templates
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <div className="bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full text-slate-300 text-sm border border-slate-700">
              🚀 Open Source
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full text-slate-300 text-sm border border-slate-700">
              ⚡ Lightning Fast
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full text-slate-300 text-sm border border-slate-700">
              🔒 No Sign-up Required
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full text-slate-300 text-sm border border-slate-700">
              📄 PDF Export
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 px-6 py-20 bg-slate-800/30 backdrop-blur-sm border-y border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Everything You Need
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50">
              <div className="w-12 h-12 bg-[#3ECF8E] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Easy Editing
              </h3>
              <p className="text-slate-300">
                Edit your CV with a simple template system. Change fonts,
                colors, and add photos with ease.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50">
              <div className="w-12 h-12 bg-[#3ECF8E] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Live Preview
              </h3>
              <p className="text-slate-300">
                See your changes instantly with our real-time preview feature.
                What you see is what you get.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50">
              <div className="w-12 h-12 bg-[#3ECF8E] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📥</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                PDF Download
              </h3>
              <p className="text-slate-300">
                Export your finished CV as a high-quality PDF ready for job
                applications.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50">
              <div className="w-12 h-12 bg-[#3ECF8E] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Community Driven
              </h3>
              <p className="text-slate-300">
                Join our open source community. Contribute templates, suggest
                features, and help others build amazing CVs.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50">
              <div className="w-12 h-12 bg-[#3ECF8E] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔓</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Open Source
              </h3>
              <p className="text-slate-300">
                Fully transparent and open source. View the code, contribute
                improvements, and help shape the future.
              </p>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-700/60 transition-all duration-300 border border-slate-700/50">
              <div className="w-12 h-12 bg-[#3ECF8E] rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Template Library
              </h3>
              <p className="text-slate-300">
                Choose from community-contributed templates or create your own.
                Share your designs with others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Perfect CV?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join our open source community and help thousands of professionals
            create amazing CVs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/builder"
              className="group inline-flex items-center bg-[#3ECF8E] text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-[#4BE4B4] transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
            >
              Get Started Free
              <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">
                →
              </span>
            </Link>
            <Link
              href="https://github.com/buildcv/buildcv"
              className="group inline-flex items-center border-2 border-[#3ECF8E] text-[#3ECF8E] px-10 py-5 rounded-full font-bold text-xl hover:bg-[#3ECF8E] hover:text-slate-900 transition-all duration-300"
            >
              <span className="mr-3">⭐</span>
              Star on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-[#3ECF8E] rounded flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">CV</span>
            </div>
            <span className="text-white font-semibold">BuildCV</span>
            <span className="text-slate-400 text-sm ml-2">Open Source</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-400 text-sm">
            <a
              href="https://github.com/buildcv/buildcv"
              className="hover:text-[#3ECF8E] transition-colors"
            >
              GitHub
            </a>
            <a
              href="#contribute"
              className="hover:text-[#3ECF8E] transition-colors"
            >
              Contribute
            </a>
            <a href="#docs" className="hover:text-[#3ECF8E] transition-colors">
              Docs
            </a>
            <a
              href="#contact"
              className="hover:text-[#3ECF8E] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3ECF8E]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3ECF8E]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

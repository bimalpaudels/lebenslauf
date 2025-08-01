import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#3ECF8E] rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">CV</span>
            </div>
            <span className="text-white font-semibold text-xl">BuildCV</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
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

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My CVs
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl">
              Create, manage, and customize your professional CVs. All your work
              is saved locally in your browser.
            </p>
          </div>

          {/* CVs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create New CV Card */}
            <Link
              href="/builder"
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 hover:bg-slate-700/60 transition-all duration-300 border-2 border-dashed border-slate-600 hover:border-[#3ECF8E] flex flex-col items-center justify-center aspect-[3/4] min-h-[300px]"
            >
              <div className="w-16 h-16 bg-[#3ECF8E]/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#3ECF8E]/30 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-[#3ECF8E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#3ECF8E] transition-colors duration-300">
                Create New CV
              </h3>
              <p className="text-slate-400 text-center text-sm">
                Start building your professional CV with our easy-to-use editor
              </p>
            </Link>

            {/* Example CV Cards (placeholder for when user has CVs) */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 aspect-[3/4] min-h-[300px] flex flex-col opacity-50">
              <div className="flex-1 bg-slate-700/50 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-slate-500 text-sm">CV Preview</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">
                  Software Developer CV
                </h4>
                <p className="text-slate-400 text-xs">
                  Last edited: 2 days ago
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">Draft</span>
                  <div className="flex space-x-1">
                    <button className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center hover:bg-slate-600 transition-colors">
                      <svg
                        className="w-3 h-3 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center hover:bg-slate-600 transition-colors">
                      <svg
                        className="w-3 h-3 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 aspect-[3/4] min-h-[300px] flex flex-col opacity-50">
              <div className="flex-1 bg-slate-700/50 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-slate-500 text-sm">CV Preview</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm">
                  Marketing Manager CV
                </h4>
                <p className="text-slate-400 text-xs">
                  Last edited: 1 week ago
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">Complete</span>
                  <div className="flex space-x-1">
                    <button className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center hover:bg-slate-600 transition-colors">
                      <svg
                        className="w-3 h-3 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center hover:bg-slate-600 transition-colors">
                      <svg
                        className="w-3 h-3 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State Message */}
          <div className="mt-16 text-center">
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No CVs yet
              </h3>
              <p className="text-slate-400 mb-6">
                Create your first CV to get started. It only takes a few
                minutes!
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center bg-[#3ECF8E] text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-[#4BE4B4] transition-all duration-300"
              >
                Create Your First CV
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

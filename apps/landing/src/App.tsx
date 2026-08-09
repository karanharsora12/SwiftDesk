import exeUrl from "./assets/SwiftDesk Setup 0.1.0.exe?url";

const DownloadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const ArrowRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-slate-100 font-sans selection:bg-primary/30">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px]"></div>
        <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[150px]"></div>
        <div className="absolute top-0 left-0 w-full h-[800px] bg-grid-pattern opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      {/* Floating Header */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4">
        <nav className="max-w-7xl mx-auto rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 px-4 sm:px-6 py-3 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="SwiftDesk Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.4)]"
            />
            <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              SwiftDesk
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
            {/* <a
              href="https://github.com/SwiftDesk"
              className="hover:text-white transition-colors"
            >
              Documentation
            </a> */}
          </div>
          <a
            href={exeUrl}
            download="SwiftDesk Setup 0.1.0.exe"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 text-xs sm:text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
          >
            <span className="hidden sm:inline">Download Free</span>
            <span className="sm:hidden">Download</span>
          </a>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 md:pt-40">
        {/* Split Hero Section */}
        <section className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center mb-32">
          {/* Left Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full mb-8 md:mb-0">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              SwiftDesk v0.1.0 is now live
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-[5rem] font-bold tracking-tight leading-[1.05] mb-6">
              <span className="block text-white">Remote Access,</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-violet-400">
                Without Limits.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Experience zero-latency connections and crystal-clear screen
              sharing. Native Windows integration powered by next-gen WebRTC
              technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <a
                href={exeUrl}
                download="SwiftDesk Setup 0.1.0.exe"
                className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-slate-950 font-bold text-lg transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <DownloadIcon /> Download for Windows
              </a>
              {/* <a href="https://github.com/SwiftDesk" target="_blank" className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 font-semibold text-lg transition-all backdrop-blur-md">
                View Source <ArrowRight />
              </a> */}
            </div>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm text-slate-500 font-medium w-full">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <ZapIcon /> 60fps Streaming
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <ShieldIcon /> E2E Encrypted
              </div>
            </div>
          </div>

          {/* Right Floating 3D Graphic */}
          <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] perspective-[1000px] z-0">
            {/* Background Blur blob behind UI */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-primary/30 to-violet-500/30 blur-[80px] rounded-full"></div>

            {/* The Main App Window */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: "rotateY(-10deg) rotateX(5deg) scale(1.05)" }}
            >
              <div className="relative w-full max-w-[500px] rounded-2xl border border-white/20 bg-slate-900/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-700 hover:rotate-y-0 hover:rotate-x-0">
                <div className="h-10 bg-slate-800/50 flex items-center px-4 gap-2 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="mx-auto text-xs font-medium text-slate-400 pr-10">
                    SwiftDesk
                  </div>
                </div>
                <div className="p-8 pb-12 flex flex-col items-center bg-gradient-to-b from-transparent to-slate-950/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-[1px] mb-6 shadow-xl shadow-primary/20">
                    <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                      <img
                        src="/logo.png"
                        className="w-12 h-12 rounded-lg"
                        alt=""
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to Connect
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 text-center">
                    Your local device is secure and ready.
                  </p>

                  <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex justify-between items-center group cursor-pointer hover:border-primary/50 transition-colors">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                        Your SwiftDesk ID
                      </p>
                      <p className="text-2xl font-mono text-white tracking-wider">
                        842 194 021
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </div>
                  </div>

                  <div className="w-full mt-4 bg-primary text-slate-900 font-bold py-3 rounded-xl flex justify-center items-center gap-2 opacity-90 shadow-lg shadow-primary/20">
                    Start Session
                  </div>
                </div>
              </div>

              {/* Floating Element 1 */}
              <div className="absolute left-2 sm:-left-12 top-1/4 bg-slate-800/80 backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 animate-blob scale-75 sm:scale-100 origin-left">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldIcon />
                </div>
                <div className="pr-2">
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Connection
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Encrypted
                  </p>
                </div>
              </div>

              {/* Floating Element 2 */}
              <div
                className="absolute right-2 sm:-right-8 bottom-1/4 bg-slate-800/80 backdrop-blur-xl border border-white/10 p-2 sm:p-3 rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 animate-blob scale-75 sm:scale-100 origin-right"
                style={{ animationDelay: "2s" }}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <ZapIcon />
                </div>
                <div className="pr-2">
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Latency
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    ~12ms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="py-24 border-t border-white/5 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Uncompromised Performance.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We ripped out the legacy protocols and built SwiftDesk purely on
              modern WebRTC architecture for speed you can actually feel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ZapIcon,
                color: "text-primary",
                bg: "bg-primary/10",
                title: "Ultra-Low Latency",
                desc: "Engineered with modern signaling, providing a near-native experience.",
              },
              {
                icon: ShieldIcon,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                title: "Bank-Grade Security",
                desc: "Purely peer-to-peer and encrypted end-to-end. We can never see your screen.",
              },
              {
                icon: GlobeIcon,
                color: "text-violet-400",
                bg: "bg-violet-500/10",
                title: "No Firewall Config",
                desc: "Advanced NAT traversal and smart fallbacks ensure SwiftDesk just works.",
              },
              {
                icon: MonitorIcon,
                color: "text-rose-400",
                bg: "bg-rose-500/10",
                title: "Native Integration",
                desc: "Deep OS integration allows precise mouse movements and keyboard shortcuts.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-lg`}
                >
                  <feature.icon />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Footer */}
        <section className="py-24 text-center">
          <div className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Animated hover glow */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-[50%] h-[100%] bg-violet-600/10 blur-[100px] rounded-full group-hover:bg-violet-600/20 transition-colors duration-700"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                Ready for a faster desktop?
              </h2>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                Download SwiftDesk today and experience what modern remote
                access feels like. It's completely free for personal use.
              </p>
              <a
                href={exeUrl}
                download="SwiftDesk Setup 0.1.0.exe"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white text-slate-900 font-bold text-xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105"
              >
                Download SwiftDesk
                <ArrowRight />
              </a>
            </div>
          </div>
        </section>

        <footer className="py-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 border-t border-white/5 mt-8">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img
              src="/logo.png"
              className="w-6 h-6 rounded-md opacity-50 grayscale"
              alt=""
            />
            <span>© 2026 SwiftDesk. All rights reserved.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms
            </a>
            <a
              href="https://github.com/SwiftDesk"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

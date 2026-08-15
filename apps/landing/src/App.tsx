import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import exeUrl from "./assets/SwiftDesk Setup 0.1.0.exe?url";

/* ----------------------------- Icons ----------------------------- */
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

const CopyIcon = () => (
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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const MenuIcon = () => (
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
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ArrowUp = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ChatIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const FolderIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const ActivityIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);



/* --------------------------- Hooks --------------------------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function useTilt<T extends HTMLElement>(maxTilt = 12) {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);
  const [style, setStyle] = useState<CSSProperties>({
    transform: "perspective(1100px) rotateY(-8deg) rotateX(4deg)",
    transition: "transform 0.2s ease-out",
  });

  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setStyle({
        transform: `perspective(1100px) rotateY(${(px * maxTilt).toFixed(2)}deg) rotateX(${(-py * maxTilt).toFixed(2)}deg)`,
        transition: "transform 0.15s ease-out",
      });
    });
  };

  const onMouseLeave = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    setStyle({
      transform: "perspective(1100px) rotateY(-8deg) rotateX(4deg)",
      transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  };

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return { ref, style, onMouseMove, onMouseLeave };
}

/* --------------------------- Sections --------------------------- */
const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
];

function Header({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handle = (href: string) => {
    setOpen(false);
    onNavigate(href);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-4">
      <nav
        className={`max-w-7xl mx-auto rounded-2xl border px-4 sm:px-6 py-3 flex justify-between items-center shadow-2xl transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/70 backdrop-blur-xl border-white/10"
            : "bg-slate-900/40 backdrop-blur-md border-white/5"
        }`}
      >
        <button
          onClick={() => handle("#top")}
          className="flex items-center gap-2 sm:gap-3 group"
          aria-label="SwiftDesk home"
        >
          <img
            src="/logo.png"
            alt="SwiftDesk Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.4)] group-hover:scale-110 transition-transform"
          />
          <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SwiftDesk
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => handle(l.href)}
              className="hover:text-white transition-colors relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={exeUrl}
            download="SwiftDesk Setup 0.1.0.exe"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-200 text-xs sm:text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
          >
            <span className="hidden sm:inline">Download Free</span>
            <span className="sm:hidden">Download</span>
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden max-w-7xl mx-auto mt-2 origin-top transition-all duration-300 ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 flex flex-col gap-1 shadow-2xl">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => handle(l.href)}
              className="text-left px-4 py-3 rounded-xl text-slate-200 hover:bg-white/5 hover:text-white transition-colors font-medium"
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const [copied, setCopied] = useState(false);
  const SWIFT_ID = "842 194 021";
  const { ref, style, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>(10);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(SWIFT_ID.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="top" className="relative mb-24">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* --- Headline block --- */}
        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            SwiftDesk v0.1.0 is now live
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
            <span className="block text-white">Remote Access,</span>
            <span className="block bg-gradient-to-r from-primary via-violet-400 to-primary bg-[length:200%_auto] animate-shine bg-clip-text text-transparent">
              Without Limits.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0">
            Experience zero-latency connections and crystal-clear screen sharing.
            Native Windows integration powered by next-gen WebRTC technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            <a
              href={exeUrl}
              download="SwiftDesk Setup 0.1.0.exe"
              className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-slate-950 font-bold text-lg transition-all hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 bg-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <DownloadIcon /> Download for Windows
            </a>
            <a
              href="#how"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 font-semibold text-lg transition-all backdrop-blur-md"
            >
              See how it works <ArrowRight />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm text-slate-500 font-medium w-full">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <ZapIcon /> 60fps Streaming
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <ShieldIcon /> E2E Encrypted
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <GlobeIcon /> Works Anywhere
            </div>
          </div>
        </div>

      {/* --- App mockup --- */}
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative w-full perspective-[1100px]"
      >
        {/* Glow behind the window */}
        <div className="absolute -inset-6 sm:-inset-10 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-primary/25 via-blue-500/10 to-violet-500/25 blur-3xl"></div>

        <div style={style} className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-900/70 backdrop-blur-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
            {/* Title bar */}
            <div className="h-11 bg-slate-800/60 border-b border-white/10 flex items-center px-4 gap-3">
              <div className="flex gap-2 shrink-0">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex-1 hidden sm:flex h-6 rounded-lg bg-white/5 border border-white/10 items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                app.swiftdesk.com
              </div>
              <span className="text-xs text-slate-500 font-bold tracking-widest">
                ···
              </span>
            </div>

            <div className="flex text-left">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col items-center gap-1.5 py-4 px-2.5 bg-slate-900/40 border-r border-white/5">
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                  <HomeIcon />
                </div>
                <div className="w-9 h-9 rounded-xl hover:bg-white/5 text-slate-400 flex items-center justify-center transition-colors">
                  <ChatIcon />
                </div>
                <div className="w-9 h-9 rounded-xl hover:bg-white/5 text-slate-400 flex items-center justify-center transition-colors">
                  <FolderIcon />
                </div>
                <div className="w-9 h-9 rounded-xl hover:bg-white/5 text-slate-400 flex items-center justify-center transition-colors">
                  <ActivityIcon />
                </div>
                <div className="w-9 h-9 rounded-xl hover:bg-white/5 text-slate-400 flex items-center justify-center transition-colors mt-auto">
                  <SettingsIcon />
                </div>
              </div>

              {/* Main panel */}
              <div className="flex-1 p-5 sm:p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 p-[1px] shadow-lg shadow-primary/20">
                      <div className="w-full h-full rounded-[11px] bg-slate-950 flex items-center justify-center">
                        <img
                          src="/logo.png"
                          className="w-5 h-5 rounded"
                          alt=""
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">
                        This Device
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Windows 11 · SwiftDesk 0.1.0
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online
                  </span>
                </div>

                <button
                  onClick={copyId}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3 group hover:border-primary/50 transition-colors"
                  aria-label="Copy SwiftDesk ID"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                      Your SwiftDesk ID
                    </p>
                    <p className="text-xl sm:text-2xl font-mono text-white tracking-wider">
                      {SWIFT_ID}
                    </p>
                  </div>
                  <div
                    className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                      copied
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/5 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </div>
                </button>
                {copied && (
                  <p className="mt-1.5 text-xs text-emerald-400 font-medium text-left">
                    Copied to clipboard!
                  </p>
                )}

                <button className="w-full mt-3 bg-primary text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Start Session <ArrowRight />
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400">
                    <ZapIcon /> 60fps
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400">
                    <ShieldIcon /> E2E Encrypted
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400">
                    <ActivityIcon /> 12ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

const FEATURES = [
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
];

function Features() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="features" className="py-24 border-t border-white/5 relative">
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

      <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className={`p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group reveal ${
              visible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: `${i * 80}ms` }}
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
  );
}

const STEPS = [
  {
    icon: DownloadIcon,
    num: "01",
    title: "Install in seconds",
    body: "Download the lightweight installer and run it. No admin rights, no bloat, no reboots — ready before your coffee gets cold.",
    points: ["Under 15MB", "No background services", "Portable option"],
  },
  {
    icon: GlobeIcon,
    num: "02",
    title: "Share your ID",
    body: "Every device gets a unique SwiftDesk ID. Share it with a trusted peer and a secure, peer-to-peer tunnel is established automatically.",
    points: ["Auto NAT traversal", "No port forwarding", "E2E encrypted"],
  },
  {
    icon: MonitorIcon,
    num: "03",
    title: "Take control",
    body: "Stream at up to 60fps with native input handling. Transfer files, copy-paste across machines, and switch monitors seamlessly.",
    points: ["60fps streaming", "File transfer", "Multi-monitor"],
  },
];

function HowItWorks() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="how" className="py-24 border-t border-white/5 relative">
      <div
        ref={ref}
        className={`text-center mb-16 reveal ${visible ? "is-visible" : ""}`}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Up and running in three steps.
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          SwiftDesk removes the friction from remote access. Here is exactly how
          a session comes to life.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {STEPS.map((s, i) => (
          <div
            key={s.num}
            className={`relative p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group reveal ${
              visible ? "is-visible" : ""
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {/* Watermark number */}
            <span className="absolute top-6 right-7 text-5xl font-bold text-white/5 group-hover:text-primary/10 transition-colors">
              {s.num}
            </span>

            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-primary/5">
              <s.icon />
            </div>

            <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{s.body}</p>

            <div className="flex flex-wrap gap-2">
              {s.points.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="py-24 text-center">
      <div
        ref={ref}
        className={`p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-2xl relative overflow-hidden group reveal ${
          visible ? "is-visible" : ""
        }`}
      >
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[100%] bg-violet-600/10 blur-[100px] rounded-full group-hover:bg-violet-600/20 transition-colors duration-700"></div>

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready for a faster desktop?
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Download SwiftDesk today and experience what modern remote access
            feels like. It's completely free for personal use.
          </p>
          <a
            href={exeUrl}
            download="SwiftDesk Setup 0.1.0.exe"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white text-slate-900 font-bold text-xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
          >
            Download SwiftDesk
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
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
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp />
    </button>
  );
}

function App() {
  const navigate = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-slate-100 font-sans selection:bg-primary/30">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[150px]"></div>
        <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[150px]"></div>
        <div className="absolute top-0 left-0 w-full h-[800px] bg-grid-pattern opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      <Header onNavigate={navigate} />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 md:pt-40">
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
        <Footer />
      </main>

      <BackToTop />
    </div>
  );
}

export default App;

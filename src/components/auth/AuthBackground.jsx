import { BriefcaseBusiness, Search, Users, Sparkles } from "lucide-react";

function AuthBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full  bg-slate-950">

      {/* ================= ANIMATED BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Gradient blobs */}
        <div className="auth-blob auth-blob-one" />
        <div className="auth-blob auth-blob-two" />
        <div className="auth-blob auth-blob-three" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Small decorative dots */}
        <div className="auth-dot left-[10%] top-[20%]" />
        <div className="auth-dot left-[25%] top-[70%]" />
        <div className="auth-dot right-[15%] top-[25%]" />
        <div className="auth-dot right-[25%] bottom-[20%]" />
        <div className="auth-dot left-[50%] top-[10%]" />

      </div>

      {/* ================= FLOATING ELEMENTS ================= */}

      <div className="pointer-events-none absolute inset-0 hidden lg:block">

        {/* Job card */}
        <div className="auth-floating-card left-[7%] top-[15%]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <BriefcaseBusiness className="h-5 w-5 text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Frontend Developer
              </p>

              <p className="text-xs text-white/50">
                Remote • Full-time
              </p>
            </div>
          </div>
        </div>

        {/* Recruiter card */}
        <div className="auth-floating-card right-[7%] top-[18%]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
              <Users className="h-5 w-5 text-purple-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Top Recruiters
              </p>

              <p className="text-xs text-white/50">
                Find your opportunity
              </p>
            </div>
          </div>
        </div>

        {/* Search card */}
        <div className="auth-floating-card bottom-[15%] left-[8%]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Search className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Discover Jobs
              </p>

              <p className="text-xs text-white/50">
                Build your career
              </p>
            </div>
          </div>
        </div>

        {/* Sparkle */}
        <div className="absolute bottom-[20%] right-[12%] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur">
          <Sparkles className="h-5 w-5 text-yellow-300" />
        </div>

      </div>

      {/* ================= AUTH CONTENT ================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">
        {children}
      </div>

    </div>
  );
}

export default AuthBackground;
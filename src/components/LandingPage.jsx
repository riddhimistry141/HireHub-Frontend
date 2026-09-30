import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setVisibleSections(function (previous) {
              return {
                ...previous,
                [entry.target.id]: true,
              };
            });

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });

    return function () {
      observer.disconnect();
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <style>{`
        /* =====================================================
           HireHub Landing Page - Polish
        ===================================================== */

        .hirehub-landing {
          --hirehub-indigo: #4f46e5;
          --hirehub-purple: #9333ea;
          --hirehub-cyan: #0891b2;
        }

        /* =====================================================
           HERO BACKGROUND
        ===================================================== */

        .hirehub-grid {
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            );

          background-size: 42px 42px;

          mask-image: linear-gradient(
            to bottom,
            black 0%,
            black 72%,
            transparent 100%
          );
        }

        .hirehub-glow {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          filter: blur(95px);
          opacity: 0.42;
          animation: hirehubGlow 16s ease-in-out infinite;
        }

        .hirehub-glow-one {
          width: 420px;
          height: 420px;
          top: -190px;
          left: -120px;
          background: #3730a3;
        }

        .hirehub-glow-two {
          width: 400px;
          height: 400px;
          right: -160px;
          top: 25%;
          background: #581c87;
          animation-delay: -5s;
        }

        .hirehub-glow-three {
          width: 360px;
          height: 360px;
          left: 38%;
          bottom: -220px;
          background: #164e63;
          animation-delay: -9s;
        }

        @keyframes hirehubGlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(28px, -22px, 0) scale(1.08);
          }
        }

        /* =====================================================
           REVEAL ANIMATION
        ===================================================== */

        .hirehub-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 700ms ease,
            transform 700ms ease;
        }

        .hirehub-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hirehub-delay-1 {
          transition-delay: 100ms;
        }

        .hirehub-delay-2 {
          transition-delay: 180ms;
        }

        .hirehub-delay-3 {
          transition-delay: 260ms;
        }

        /* =====================================================
           CARDS
        ===================================================== */

        .hirehub-card {
          transition:
            transform 250ms ease,
            box-shadow 250ms ease,
            border-color 250ms ease;
        }

        .hirehub-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.09);
          border-color: rgba(79, 70, 229, 0.22);
        }

        .dark .hirehub-card:hover {
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
        }

        /* =====================================================
           BUTTONS
        ===================================================== */

        .hirehub-button {
          transition:
            transform 200ms ease,
            box-shadow 200ms ease,
            background-color 200ms ease;
        }

        .hirehub-button:hover {
          transform: translateY(-1px);
        }

        /* =====================================================
           FLOATING PREVIEW CARDS
        ===================================================== */

        .hirehub-floating-card {
          animation: hirehubFloating 5s ease-in-out infinite;
        }

        .hirehub-floating-card-delay {
          animation-delay: -2.2s;
        }

        @keyframes hirehubFloating {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        /* =====================================================
           PULSE
        ===================================================== */

        .hirehub-pulse {
          animation: hirehubPulse 2.2s ease-in-out infinite;
        }

        @keyframes hirehubPulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .hirehub-glow,
          .hirehub-floating-card,
          .hirehub-pulse {
            animation: none !important;
          }

          .hirehub-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }

          .hirehub-card,
          .hirehub-button {
            transition: none !important;
          }
        }
      `}</style>

      <div className="hirehub-landing min-h-screen bg-background text-foreground">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            <Link
              to="/"
              onClick={closeMenu}
              className="group flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-transform duration-200 group-hover:scale-105">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-base font-bold leading-none">
                  Hire<span className="text-indigo-500">Hub</span>
                </p>

                <p className="mt-1 hidden text-[10px] text-muted-foreground sm:block">
                  Job & Recruitment Platform
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 md:flex">
              <a
                href="#home"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Find Jobs
              </a>

              <a
                href="#recruiters"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                For Recruiters
              </a>

              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </a>

              <a
                href="#about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </a>
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>

              <Button
                asChild
                className="hirehub-button rounded-lg bg-foreground text-background hover:bg-foreground/90"
              >
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <button
              type="button"
              onClick={function () {
                setMenuOpen(!menuOpen);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-muted md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {menuOpen && (
            <div className="border-t border-border/60 bg-background px-4 py-4 md:hidden">
              <nav className="flex flex-col">
                <a
                  href="#home"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                >
                  Find Jobs
                </a>

                <a
                  href="#recruiters"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                >
                  For Recruiters
                </a>

                <a
                  href="#how-it-works"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                >
                  How It Works
                </a>

                <a
                  href="#about"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted"
                >
                  About
                </a>

                <div className="mt-3 flex gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1"
                  >
                    <Link to="/login">Login</Link>
                  </Button>

                  <Button
                    asChild
                    className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Link to="/register">Get Started</Link>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </header>

        <main>

          {/* =====================================================
              HERO
          ===================================================== */}

          <section id= "home" className="relative overflow-hidden bg-[#050817] text-white">

            <div className="hirehub-grid absolute inset-0" />

            <div className="hirehub-glow hirehub-glow-one" />
            <div className="hirehub-glow hirehub-glow-two" />
            <div className="hirehub-glow hirehub-glow-three" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_.95fr] lg:px-8 lg:py-20">

              {/* Hero Content */}

              <div className="max-w-2xl">

                <div className="hirehub-reveal hirehub-visible">
                  <Badge className="mb-5 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-white hover:bg-white/10">
                    <Sparkles className="mr-2 h-3.5 w-3.5 text-cyan-300" />
                    Job & Recruitment Platform
                  </Badge>
                </div>

                <h1 className="hirehub-reveal hirehub-visible hirehub-delay-1 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">

                  <span className="block text-white">
                    Find your next
                  </span>

                  <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    opportunity.
                  </span>

                </h1>

                <p className="hirehub-reveal hirehub-visible hirehub-delay-2 mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                  HireHub brings job seekers and recruiters together
                  with a simple, organized platform for discovering
                  jobs, managing applications, and building teams.
                </p>

                <div className="hirehub-reveal hirehub-visible hirehub-delay-3 mt-7 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-xl">

                  <div className="flex flex-col gap-2 sm:flex-row">

                    <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-white/[0.07] px-4">
                      <Search className="h-5 w-5 shrink-0 text-slate-400" />

                      <span className="text-sm text-slate-400">
                        Search jobs, skills or companies...
                      </span>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="hirehub-button min-h-12 rounded-xl bg-white px-6 text-slate-950 hover:bg-slate-100"
                    >
                      <Link to="/jobs">
                        Find Jobs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Easy applications
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Resume management
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    Hiring management
                  </div>
                </div>
              </div>

              {/* Product Preview */}

              <div className="relative mx-auto w-full max-w-xl">

                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">

                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-950">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          HireHub
                        </p>

                        <p className="text-[11px] text-slate-500">
                          Job & Recruitment Platform
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[105px_1fr]">

                    <div className="hidden border-r border-white/10 p-3 sm:block">
                      <div className="mb-5 h-7 rounded-md bg-white/5" />

                      <div className="space-y-2">
                        <div className="h-7 rounded-md bg-indigo-500/20" />
                        <div className="h-7 rounded-md bg-white/5" />
                        <div className="h-7 rounded-md bg-white/5" />
                        <div className="h-7 rounded-md bg-white/5" />
                      </div>

                      <div className="mt-8 space-y-2">
                        <div className="h-7 rounded-md bg-white/5" />
                        <div className="h-7 rounded-md bg-white/5" />
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">

                      <div className="mb-5">
                        <p className="text-[11px] text-slate-500">
                          Dashboard
                        </p>

                        <p className="mt-1 text-base font-semibold">
                          Find your next opportunity
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                          <p className="text-[10px] text-slate-500">
                            Jobs
                          </p>

                          <p className="mt-1 text-xl font-bold">
                            24
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                          <p className="text-[10px] text-slate-500">
                            Applications
                          </p>

                          <p className="mt-1 text-xl font-bold">
                            08
                          </p>
                        </div>

                      </div>

                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold">
                              Recommended jobs
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                              Based on your profile
                            </p>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-500" />
                        </div>

                        <div className="mt-4 space-y-2.5">

                          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                              <BriefcaseBusiness className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium">
                                Frontend Developer
                              </p>

                              <p className="mt-1 text-[10px] text-slate-500">
                                React • Remote
                              </p>
                            </div>

                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          </div>

                          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                              <Building2 className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium">
                                Full Stack Developer
                              </p>

                              <p className="mt-1 text-[10px] text-slate-500">
                                Node.js • Hybrid
                              </p>
                            </div>

                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hirehub-floating-card absolute -left-4 top-14 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl sm:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                      <BriefcaseBusiness className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Frontend Developer
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Remote • Full-time
                      </p>
                    </div>

                  </div>
                </div>

                <div className="hirehub-floating-card hirehub-floating-card-delay absolute -right-4 bottom-14 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl sm:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                      <Users className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Recruiter workspace
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Manage your hiring
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* =====================================================
              PLATFORM CAPABILITIES
          ===================================================== */}

          <section
            id="about"
            data-reveal
            className="border-b border-border"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">

              {[
                {
                  icon: Search,
                  title: "Find Jobs",
                  text: "Discover opportunities",
                },
                {
                  icon: UserRound,
                  title: "Build Profile",
                  text: "Showcase your skills",
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Track Applications",
                  text: "Follow your progress",
                },
                {
                  icon: Users,
                  title: "Manage Hiring",
                  text: "Organize recruitment",
                },
              ].map(function (item, index) {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`px-5 py-7 text-center transition-all duration-700 sm:py-8 ${
                      index !== 0
                        ? "border-l border-border"
                        : ""
                    } ${
                      visibleSections.about
                        ? "hirehub-visible"
                        : "hirehub-reveal"
                    }`}
                    style={{
                      transitionDelay: `${index * 70}ms`,
                    }}
                  >
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>

                    <p className="mt-3 text-sm font-semibold">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                );
              })}

            </div>
          </section>

          {/* =====================================================
              FEATURES
          ===================================================== */}

          <section
            id="jobs"
            data-reveal
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
          >

            <div
              className={`mx-auto max-w-2xl text-center ${
                visibleSections.jobs
                  ? "hirehub-visible"
                  : "hirehub-reveal"
              }`}
            >

              <Badge
                variant="outline"
                className="mb-4 rounded-full"
              >
                One platform
              </Badge>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need for the
                <span className="text-indigo-500">
                  {" "}
                  hiring journey.
                </span>
              </h2>

              <p className="mt-4 leading-7 text-muted-foreground">
                HireHub keeps job discovery, applications, profiles,
                recruiting, and interviews organized in one place.
              </p>

            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {[
                {
                  icon: Search,
                  title: "Discover jobs",
                  text: "Explore opportunities and find roles that match your skills and career goals.",
                },
                {
                  icon: UserRound,
                  title: "Build your profile",
                  text: "Keep your professional details, education, skills, and resume organized.",
                },
                {
                  icon: BriefcaseBusiness,
                  title: "Apply easily",
                  text: "Submit applications and keep track of where you are in the hiring process.",
                },
                {
                  icon: Users,
                  title: "Manage applicants",
                  text: "Recruiters can review candidates and organize the hiring process efficiently.",
                },
                {
                  icon: Building2,
                  title: "Manage jobs",
                  text: "Create, edit, publish, and manage job opportunities from one workspace.",
                },
                {
                  icon: ShieldCheck,
                  title: "Stay organized",
                  text: "Keep important recruitment information structured and easy to access.",
                },
              ].map(function (feature, index) {
                const Icon = feature.icon;

                return (
                  <Card
                    key={feature.title}
                    className={`hirehub-card rounded-2xl border-border bg-card ${
                      visibleSections.jobs
                        ? "hirehub-visible"
                        : "hirehub-reveal"
                    }`}
                    style={{
                      transitionDelay: `${index * 70}ms`,
                    }}
                  >
                    <CardContent className="p-6">

                      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="font-semibold">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {feature.text}
                      </p>

                    </CardContent>
                  </Card>
                );
              })}

            </div>
          </section>

          {/* =====================================================
              HOW IT WORKS
          ===================================================== */}

          <section
            id="how-it-works"
            data-reveal
            className="border-y border-border bg-muted/20"
          >
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

              <div
                className={`max-w-2xl ${
                  visibleSections["how-it-works"]
                    ? "hirehub-visible"
                    : "hirehub-reveal"
                }`}
              >

                <Badge
                  variant="outline"
                  className="mb-4 rounded-full"
                >
                  How it works
                </Badge>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Simple from
                  <span className="text-indigo-500">
                    {" "}
                    start to finish.
                  </span>
                </h2>

                <p className="mt-4 leading-7 text-muted-foreground">
                  A straightforward experience for candidates and
                  recruiters.
                </p>

              </div>

              <div className="mt-10 grid gap-8 md:grid-cols-3">

                {[
                  {
                    number: "01",
                    title: "Create your profile",
                    text: "Add your professional information, skills, education, and resume.",
                  },
                  {
                    number: "02",
                    title: "Find and apply",
                    text: "Explore jobs, review the details, and submit applications.",
                  },
                  {
                    number: "03",
                    title: "Move forward",
                    text: "Track applications and interviews throughout your recruitment journey.",
                  },
                ].map(function (step, index) {
                  return (
                    <div
                      key={step.number}
                      className={`${
                        visibleSections["how-it-works"]
                          ? "hirehub-visible"
                          : "hirehub-reveal"
                      }`}
                      style={{
                        transitionDelay: `${index * 120}ms`,
                      }}
                    >

                      <div className="mb-5 flex items-center gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
                          {step.number}
                        </div>

                        {index < 2 && (
                          <div className="hidden h-px flex-1 bg-border md:block" />
                        )}

                      </div>

                      <h3 className="font-semibold">
                        {step.title}
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                        {step.text}
                      </p>

                    </div>
                  );
                })}

              </div>
            </div>
          </section>

          {/* =====================================================
              RECRUITERS
          ===================================================== */}

          <section
            id="recruiters"
            data-reveal
            className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
          >

            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

              <div
                className={
                  visibleSections.recruiters
                    ? "hirehub-visible"
                    : "hirehub-reveal"
                }
              >

                <Badge
                  variant="outline"
                  className="mb-5 rounded-full"
                >
                  For recruiters
                </Badge>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  A focused workspace for
                  <span className="text-indigo-500">
                    {" "}
                    better hiring.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                  Create jobs, review applicants, manage interviews,
                  and keep your recruitment process organized from
                  one workspace.
                </p>

                <div className="mt-6 space-y-3.5">

                  {[
                    "Create and manage job postings",
                    "Review applicants and resumes",
                    "Track application progress",
                    "Schedule and manage interviews",
                  ].map(function (item) {
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />

                        <span className="text-sm font-medium">
                          {item}
                        </span>
                      </div>
                    );
                  })}

                </div>

                <Button
                  asChild
                  className="hirehub-button mt-7 rounded-lg bg-foreground text-background hover:bg-foreground/90"
                >
                  <Link to="/register">
                    Start recruiting
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

              </div>

              <div
                className={
                  visibleSections.recruiters
                    ? "hirehub-visible"
                    : "hirehub-reveal"
                }
              >

                <Card className="hirehub-card rounded-3xl border-border bg-card">

                  <CardContent className="p-6">

                    <div className="flex items-center justify-between border-b border-border pb-5">

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Recruiter workspace
                        </p>

                        <h3 className="mt-1 font-semibold">
                          Hiring overview
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="hirehub-pulse h-2 w-2 rounded-full bg-emerald-500" />
                        Active
                      </div>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">

                      {[
                        ["Jobs", "12"],
                        ["Applicants", "48"],
                        ["Interviews", "08"],
                        ["Hired", "05"],
                      ].map(function (item) {
                        return (
                          <div
                            key={item[0]}
                            className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/50"
                          >
                            <p className="text-xs text-muted-foreground">
                              {item[0]}
                            </p>

                            <p className="mt-2 text-2xl font-bold">
                              {item[1]}
                            </p>
                          </div>
                        );
                      })}

                    </div>

                    <div className="mt-4 rounded-xl border border-border p-4">

                      <div className="flex items-center justify-between">

                        <div>
                          <p className="text-sm font-semibold">
                            Frontend Developer
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            14 applicants
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-600"
                        >
                          ACTIVE
                        </Badge>

                      </div>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[68%] rounded-full bg-foreground" />
                      </div>

                    </div>

                  </CardContent>
                </Card>

              </div>
            </div>
          </section>

          {/* =====================================================
              CTA
          ===================================================== */}

          <section
            id="get-started"
            data-reveal
            className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
          >

            <div
              className={`mx-auto max-w-7xl ${
                visibleSections["get-started"]
                  ? "hirehub-visible"
                  : "hirehub-reveal"
              }`}
            >

              <div className="relative overflow-hidden rounded-3xl bg-[#050817] px-6 py-12 text-center text-white sm:px-12 lg:px-20">

                <div className="hirehub-glow hirehub-glow-one" />
                <div className="hirehub-glow hirehub-glow-two" />

                <div className="relative">

                  <Sparkles className="mx-auto mb-5 h-6 w-6 text-cyan-300" />

                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready for your next step?
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    Create your HireHub account and start exploring
                    opportunities today.
                  </p>

                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                    <Button
                      asChild
                      size="lg"
                      className="hirehub-button rounded-lg bg-white px-7 text-slate-950 hover:bg-slate-100"
                    >
                      <Link to="/register">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-lg border-white/20 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link to="/login">
                        Sign In
                      </Link>
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="border-t border-border">

          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Hire<span className="text-indigo-500">Hub</span>
                </p>

                <p className="text-xs text-muted-foreground">
                  Job & Recruitment Platform
                </p>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HireHub. All rights reserved.
            </p>

          </div>
        </footer>

      </div>
    </>
  );
}

export default LandingPage;
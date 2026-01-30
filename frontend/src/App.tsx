import { useEffect, useMemo, useState } from "react";
import {
  loginUser,
  registerUser,
  fetchAnalyses,
  downloadResumeForAnalysis,
  analyzeResume,
  fetchJobStatus,
} from "./api";
import type { User, AnalysisItem } from "./api";
// import overviewImage from "./assets/overview-image.png";
import pdfImage from "./assets/pdf.png";
import { MdEmojiFlags, MdOutlineEditNote } from "react-icons/md";
import { SiPastebin, SiVictoriametrics } from "react-icons/si";
import { GoGoal, GoProjectSymlink } from "react-icons/go";
import { BsGrid3X2Gap } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import { GrDocumentMissing } from "react-icons/gr";
import { GiShintoShrineMirror } from "react-icons/gi";

function ScoreCard({ label, value }: { label: string; value?: number }) {
  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-blue-200">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="relative text-xs font-semibold uppercase tracking-wider text-gray-600">{label}</p>
      <p className={`relative mt-3 text-5xl font-bold ${getScoreColor(value)}`}>
        {value ?? "—"}
      </p>
      {value && (
        <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500"
              }`}
            style={{ width: `${value}%` }}
          />
        </div>
      )}
    </div>
  );
}

function HowItWorksGrid() {
  const steps = [
    {
      icon: <MdOutlineEditNote fontSize={40} className="fill-blue-700" />,
      title: "Paste JD",
      description: "Paste the job description and upload PDF/DOCX resume",
      bgColor: "bg-blue-100",
    },
    {
      icon: <SiPastebin fontSize={40} className="fill-purple-700" />,
      title: "Text Extraction",
      description: "Text extraction + section/skill/keyword detection",
      bgColor: "bg-purple-100",
    },
    {
      icon: <GoGoal fontSize={40} className="fill-green-700" />,
      title: "Deterministic Scoring",
      description: "Deterministic scoring for Fit, ATS, Writing",
      bgColor: "bg-green-100",
    },
    {
      icon: <BsGrid3X2Gap fontSize={40} className="fill-orange-700" />,
      title: "Surface Gaps",
      description:
        "Surface gaps: missing skills/sections, bullet issues, format flags",
      bgColor: "bg-orange-100",
    },
  ];


  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        How it works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full ${step.bgColor}`}
            >
              {step.icon}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatYouGetGrid() {
  const items = [
    {
      icon: <FaPen size={30} className="fill-blue-700" />, text:
        "Fit / ATS / Writing scores",
    },
    {
      icon: <GrDocumentMissing size={30} className="stroke-blue-700" />, text:
        "Missing skills and keywords to add",
    },
    {
      icon: <GoProjectSymlink size={30} className="fill-blue-700" />, text:
        "Missing sections (Summary, Skills, Projects, Education)",
    },
    {
      icon: <SiVictoriametrics size={30} className="fill-blue-700" />, text:
        "Bullet/style issues (no metrics, weak verbs, passive voice, too long)",
    },
    {
      icon: <MdEmojiFlags size={30} className="fill-blue-700" />, text:
        "Formatting flags (columns/images if detected)",
    },
    {
      icon: <GiShintoShrineMirror size={30} className="fill-blue-700" />, text:
        "Summary hints and writing suggestions"
    }
  ];

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center">What you get</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center text-center space-y-3 p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-5xl">
              {item.icon}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// @ts-expect-error - Function is commented out but kept for future use
function PrivacySection() {
  // @ts-expect-error - Variable is commented out but kept for future use
  const items = [
    "Deterministic processing by default; no AI unless you request it.",
    "AI rewrite sends only needed text to Gemini; requires your key.",
    "Skip AI rewrite anytime; core results stay rule-based."
  ];

  // return (
  //   <section className="space-y-8">
  //     <h2 className="text-3xl font-bold text-gray-900 text-center">Privacy & control</h2>
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
  //       <div className="space-y-4">
  //         {items.map((item, idx) => (
  //           <div key={idx} className="flex gap-3">
  //             <span className="text-purple-600 font-bold flex-shrink-0 mt-1">•</span>
  //             <p className="text-gray-700 leading-relaxed">{item}</p>
  //           </div>
  //         ))}
  //       </div>
  //       <div className="rounded-2xl bg-gray-50 p-8 border border-gray-200 h-64 flex items-center justify-center">
  //         <p className="text-gray-400 text-sm">Visual element</p>
  //       </div>
  //     </div>
  //   </section>
  // );
}

function HowToUseGrid() {
  const steps = [
    "Paste JD text.",
    "Upload your resume (PDF/DOCX).",
    "Click Analyze and wait for processing.",
    "Review scores and suggestions."
  ];

  return (
    <section className="">
      <div className="flex justify-evenly items-center gap-12 flex-wrap">
        <div className="w-[250px] lg:w-[450px]">
          <img src={pdfImage} className="w-full h-full" alt="Resume analysis illustration" />
        </div>
        <div className="flex flex-col items-start">
          <h2 className="text-3xl font-bold text-gray-900 text-center">How to use</h2>
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center text-center gap-4 mt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm lg:text-lg text-gray-900 font-medium leading-relaxed text-start">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [jdText, setJdText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [analysesLoading, setAnalysesLoading] = useState(false);
  const [analysesError, setAnalysesError] = useState<string | null>(null);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!file) {
      setAnalyzeError("Select a resume file first");
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError(null);
    setStatusData(null);

    try {
      const result = await analyzeResume(jdText, file);
      setJobId(result.job_id);

      const status = await fetchJobStatus(result.job_id);
      setStatusData(status);
      // If results are ready and user is not logged in, show auth modal to gate results
      if (!currentUser) {
        setShowAuthModal(true);
      }
    } catch (error) {
      setAnalyzeError((error as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };


  const suggestions = statusData?.result?.suggestions;
  const scores = statusData?.result?.scores;
  const hasResults = statusData?.status === "done" && !!statusData?.result;

  const missingSkills = useMemo(() => suggestions?.missingSkills || [], [suggestions]);
  const keywordsToAdd = useMemo(() => suggestions?.keywordsToAdd || [], [suggestions]);
  const bulletIssues = useMemo(() => suggestions?.bulletIssues || [], [suggestions]);
  const spellingIssues = useMemo(() => suggestions?.spellingIssues || [], [suggestions]);
  const missingSections = useMemo(() => suggestions?.missingSections || [], [suggestions]);
  const formatFlags = useMemo(() => suggestions?.formatFlags || [], [suggestions]);

  useEffect(() => {
    const storedUser = localStorage.getItem("ra_current_user");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  // Lock background scroll when auth modal is open
  useEffect(() => {
    if (showAuthModal && !currentUser) {
      const originalStyle = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [showAuthModal, currentUser]);

  useEffect(() => {
    if (showProfile && currentUser) {
      setAnalysesLoading(true);
      setAnalysesError(null);
      fetchAnalyses()
        .then((items) => {
          setAnalyses(items);
        })
        .catch((err) => {
          setAnalysesError((err as Error).message);
        })
        .finally(() => {
          setAnalysesLoading(false);
        });
    }
  }, [showProfile, currentUser]);

  const handleAuthInputChange = (field: string, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitSignup = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const resp = await registerUser({
        fullName: authForm.fullName,
        email: authForm.email,
        password: authForm.password,
        confirmPassword: authForm.confirmPassword,
      });
      // Registration succeeds but does NOT log the user in automatically.
      // Switch to login mode and pre-fill email so they can log in explicitly.
      setAuthMode("login");
      setAuthForm((prev) => ({
        ...prev,
        email: resp.user.email,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setAuthError((err as Error).message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmitLogin = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const resp = await loginUser({
        email: authForm.email,
        password: authForm.password,
      });
      setCurrentUser(resp.user);
      localStorage.setItem("ra_current_user", JSON.stringify(resp.user));
      localStorage.setItem("ra_token", resp.token);
      setShowAuthModal(false);
      setShowProfileMenu(false);
    } catch (err) {
      setAuthError((err as Error).message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoHome = () => {
    // Close profile menu if open
    setShowProfileMenu(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToUpload = () => {
    const uploadSection = document.getElementById("upload-section");
    if (uploadSection) {
      // Scroll with offset to show the section properly
      const offset = 100; // Offset in pixels from top
      const elementPosition = uploadSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className={`sticky top-0 border-b border-gray-200 bg-white shadow-sm ${showAuthModal ? 'z-30' : 'z-50'}`}>
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-5">
            <button
              type="button"
              onClick={handleGoHome}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Qualifyd.ai</h1>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">BETA</span>
                </div>
                <p className="text-xs text-gray-600">Resume optimization & ATS analysis</p>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                {currentUser ? (
                  <>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => setShowProfileMenu((v) => !v)}
                    >
                      {currentUser.fullName
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0]?.toUpperCase())
                        .join("") || "U"}
                    </button>
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-lg">
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setShowProfile(true);
                            setShowProfileMenu(false);
                          }}
                        >
                          Profile
                        </button>
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setCurrentUser(null);
                            localStorage.removeItem("ra_current_user");
                            localStorage.removeItem("ra_token");
                            setShowProfile(false);
                            setShowProfileMenu(false);
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                    }}
                  >
                    Log in
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!showProfile && (
        <>
        {/* Hero Section */}
        <section className="flex min-h-[85vh] items-center py-12">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-6 text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Optimize your resume to get more interviews
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                  Qualifyd.ai helps you optimize your resume for any job, highlighting the key experience and skills recruiters need to see.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleScrollToUpload}
                    className="rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                  >
                    Scan Your Resume For Free
                  </button>
                </div>
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-4">Qualifyd.ai users have been hired by:</p>
                  <div className="flex flex-wrap items-center gap-8 opacity-60">
                    {/* Facebook/Meta */}
                    <div className="text-base font-semibold text-gray-600 tracking-wide">Meta</div>
                    {/* Apple */}
                    <div className="text-base font-semibold text-gray-600 tracking-wide">Apple</div>
                    {/* Amazon */}
                    <div className="text-base font-semibold text-gray-600 tracking-wide">Amazon</div>
                    {/* Netflix */}
                    <div className="text-base font-semibold text-gray-600 tracking-wide">Netflix</div>
                    {/* Google */}
                    <div className="text-base font-semibold text-gray-600 tracking-wide">Google</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className="relative hidden lg:block">
                <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 p-8 shadow-2xl">
                  {/* Animated Background Shapes */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
                  </div>

                  {/* Main Visual Content */}
                  <div className="relative space-y-6">
                    {/* Score Cards */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <div className="text-3xl font-bold text-emerald-600">92</div>
                        <div className="text-xs text-gray-600 mt-1">Fit Score</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <div className="text-3xl font-bold text-blue-600">88</div>
                        <div className="text-xs text-gray-600 mt-1">ATS Score</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg text-center">
                        <div className="text-3xl font-bold text-purple-600">85</div>
                        <div className="text-xs text-gray-600 mt-1">Writing</div>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Skills Match</span>
                          <span className="text-gray-500">95%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Keywords</span>
                          <span className="text-gray-500">87%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Formatting</span>
                          <span className="text-gray-500">92%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Icons */}
                    <div className="flex justify-center gap-6 pt-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-100 rounded-full p-3">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">Resume</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-purple-100 rounded-full p-3">
                          <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">Analyze</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-emerald-100 rounded-full p-3">
                          <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">Optimize</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="mb-16 pt-12">
          <HowItWorksGrid />
        </section>

        {/* Upload Section */}
        <div id="upload-section" className="mb-12 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <label className="mb-3 block text-lg font-semibold text-gray-900">
                Job Description
              </label>
              <textarea
                className="h-[244px] w-full resize-none rounded-xl border border-gray-300 bg-white p-5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Paste the complete job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            </div>
            <div className="lg:col-span-6">
              <label className="mb-3 block text-lg font-semibold text-gray-900">
                Upload Resume
              </label>
              <div className="group relative overflow-hidden rounded-xl bg-blue-700 text-center transition-all">
                <div className="m-3 rounded-xl border-2 border-dashed border-gray-300 bg-blue-800 p-10">
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFile(f);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <div className="pointer-events-none">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 transition-all group-hover:bg-gray-300">
                      <svg
                        className="h-10 w-10 text-gray-600 transition-all group-hover:text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>

                    {file ? (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-100">{file.name}</p>
                        <p className="mt-1 text-xs text-gray-200">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <p className="font-semibold text-gray-100">
                          Drop your file here
                        </p>
                        <p className="mt-1 text-xs text-gray-100">
                          PDF or DOCX (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="mt-5 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none"
                onClick={handleAnalyze}
                disabled={!jdText || !file || isAnalyzing}
              >
                {isAnalyzing ? "🔄 Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="col-span-6 flex flex-col gap-6">
                <p className="font-medium text-sm lg:text-lg">
                  Resume ↔ JD analyzer that parses both, scores Fit/ATS/Writing, and delivers
                  actionable, rule-based improvements.
                </p>
              </div>
              <div className="col-span-6">
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm lg:text-lg font-medium">
                    Deterministic processing by default; fully transparent and explainable.
                  </li>
                  <li className="text-sm lg:text-lg font-medium">
                    Rule-based scoring ensures consistent and reliable results.
                  </li>
                  <li className="text-sm lg:text-lg font-medium">
                    Privacy-focused; your data stays secure and private.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* <button
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
            onClick={handleAnalyze}
            disabled={!jdText || !file || isAnalyzing}
          >
            {isAnalyzing ? "🔄 Analyzing..." : "🚀 Analyze Resume"}
          </button> */}

          {analyzeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {analyzeError}
            </div>
          )}
          {jobId && (
            <p className="text-xs text-gray-600">Job ID: {jobId}</p>
          )}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Processing your resume...
            </div>
          )}
          {/* Results Section */}
          {hasResults && (
            <>
              <div
                className={`border-t border-gray-200 pt-16 space-y-16 transition-all ${
                  hasResults && !currentUser && showAuthModal ? "blur-sm pointer-events-none select-none" : ""
                }`}
              >
                {/* Scores */}
                <div className="space-y-8">
                  <h2 className="text-4xl font-bold text-gray-900">📈 Your Scores</h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    <ScoreCard label="Fit Score" value={scores?.fit} />
                    <ScoreCard label="ATS Score" value={scores?.ats} />
                    <ScoreCard label="Writing Score" value={scores?.writing} />
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="space-y-8">
                  <h2 className="text-4xl font-bold text-gray-900">💡 Recommendations</h2>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                        <span className="text-xl">🎯</span> Missing Skills
                      </h3>
                      <div className="space-y-2">
                        {missingSkills.length ? (
                          missingSkills.map((s: string) => (
                            <div key={s} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 border border-gray-200">
                              {s}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">✓ All key skills present</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                        <span className="text-xl">🔑</span> Keywords to Add
                      </h3>
                      <div className="space-y-2">
                        {keywordsToAdd.length ? (
                          keywordsToAdd.map((k: string) => (
                            <div key={k} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 border border-gray-200">
                              {k}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">✓ Keywords optimized</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                        <span className="text-xl">📑</span> Missing Sections
                      </h3>
                      <div className="space-y-2">
                        {missingSections.length ? (
                          missingSections.map((s: string) => (
                            <div key={s} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 border border-gray-200">
                              {s}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">✓ All sections complete</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                        <span className="text-xl">⚠️</span> Format Issues
                      </h3>
                      <div className="space-y-2">
                        {formatFlags.length ? (
                          formatFlags.map((f: string, idx: number) => (
                            <div key={idx} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 border border-gray-200">
                              {f}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">✓ Format looks good</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Writing Improvements */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <span className="text-xl">📝</span> Writing Improvements
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">Spelling checks</p>
                      {spellingIssues.length ? (
                        spellingIssues.map((s: string, idx: number) => (
                          <div key={idx} className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 border border-gray-200">
                            {s}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">✓ No obvious spelling issues detected</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">Bullet structure & clarity</p>
                      {bulletIssues.length ? (
                        bulletIssues.map((b: string, idx: number) => (
                          <div key={idx} className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 border border-gray-200">
                            {b}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">✓ No structural writing issues detected</p>
                      )}
                    </div>
                  </div>

                  {suggestions?.summaryHint && (
                    <div className="rounded-lg bg-blue-50 p-4 text-sm border border-gray-200">
                      <span className="font-semibold text-gray-900">💡 Summary Tip: </span>
                      <span className="text-gray-700">{suggestions.summaryHint}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        {!currentUser && showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}>
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              {/* Only show close button when there are NO results - if results exist, user MUST login */}
              {!hasResults && (
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <h2 className="mb-4 text-xl font-bold text-gray-900 text-center">
                {authMode === "signup" ? "Create your free account to view results" : "Log in to view your results"}
              </h2>
              <p className="mb-6 text-sm text-gray-600 text-center">
                Save your analysis and come back anytime. It takes less than a minute.
              </p>

              <div className="mb-4 flex justify-center rounded-full bg-gray-100 p-1 text-sm font-medium">
                <button
                  type="button"
                  className={`flex-1 px-3 py-1.5 transition-all ${
                    authMode === "signup" 
                      ? "bg-white text-gray-900 shadow-sm rounded-full" 
                      : "text-gray-500"
                  }`}
                  onClick={() => setAuthMode("signup")}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  className={`flex-1 px-3 py-1.5 transition-all ${
                    authMode === "login" 
                      ? "bg-white text-gray-900 shadow-sm rounded-full" 
                      : "text-gray-500"
                  }`}
                  onClick={() => setAuthMode("login")}
                >
                  Log in
                </button>
              </div>

              <div className="space-y-3">
                {authMode === "signup" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Full name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={authForm.fullName}
                      onChange={(e) => handleAuthInputChange("fullName", e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={authForm.email}
                    onChange={(e) => handleAuthInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={authForm.password}
                    onChange={(e) => handleAuthInputChange("password", e.target.value)}
                  />
                </div>

                {authMode === "signup" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">Confirm password</label>
                    <input
                      type="password"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={authForm.confirmPassword}
                      onChange={(e) => handleAuthInputChange("confirmPassword", e.target.value)}
                    />
                  </div>
                )}

                {authError && (
                  <p className="text-xs text-red-600">{authError}</p>
                )}

                <button
                  type="button"
                  className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  disabled={authLoading}
                  onClick={authMode === "signup" ? handleSubmitSignup : handleSubmitLogin}
                >
                  {authLoading
                    ? authMode === "signup"
                      ? "Creating account..."
                      : "Logging in..."
                    : authMode === "signup"
                    ? "Sign up to view results"
                    : "Log in to view results"}
                </button>

                <div className="mt-2 text-[11px] text-gray-500 text-center space-y-1">
                  {authMode === "login" ? (
                    <>
                      <p>
                        New user?{" "}
                        <button
                          type="button"
                          className="font-semibold text-blue-600 hover:underline"
                          onClick={() => setAuthMode("signup")}
                        >
                          Register for free now
                        </button>{" "}
                        – no credit card needed.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Already a user?{" "}
                        <button
                          type="button"
                          className="font-semibold text-blue-600 hover:underline"
                          onClick={() => setAuthMode("login")}
                        >
                          Log in here
                        </button>
                        .
                      </p>
                    </>
                  )}
                  <p>
                    You won&apos;t be able to close this until you&apos;re logged in — this keeps results tied to a user.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
        </>
        )}

        {showProfile && currentUser && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-600 mt-1">View your account details and past analyses.</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={() => setShowProfile(false)}
              >
                ← Back to analyzer
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account</p>
                <p className="text-lg font-semibold text-gray-900">{currentUser.fullName}</p>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Saved analyses</h3>
              </div>

              {analysesLoading && (
                <p className="text-sm text-gray-600">Loading your analyses…</p>
              )}
              {analysesError && (
                <p className="text-sm text-red-600">{analysesError}</p>
              )}
              {!analysesLoading && !analysesError && analyses.length === 0 && (
                <p className="text-sm text-gray-600">No analyses saved yet. Run an analysis to see it here.</p>
              )}

              <div className="space-y-3">
                {analyses.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-gray-200 bg-white">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3 text-left"
                      onClick={() =>
                        setExpandedAnalysisId((prev) => (prev === a.id ? null : a.id))
                      }
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {a.jobTitle || "Analysis"}{" "}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-gray-400 text-xl">
                        {expandedAnalysisId === a.id ? "−" : "+"}
                      </span>
                    </button>
                    {expandedAnalysisId === a.id && (
                      <div className="border-t border-gray-200 px-4 py-4 space-y-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Job description
                          </p>
                          <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 whitespace-pre-wrap">
                            {a.jdText}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {a.resumeOriginalName && (
                            <button
                              type="button"
                              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                              onClick={async () => {
                                try {
                                  const blob = await downloadResumeForAnalysis(a.id);
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = a.resumeOriginalName || "resume";
                                  document.body.appendChild(link);
                                  link.click();
                                  link.remove();
                                  URL.revokeObjectURL(url);
                                } catch (err) {
                                  alert((err as Error).message);
                                }
                              }}
                            >
                              Download resume ({a.resumeOriginalName})
                            </button>
                          )}

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                              Fit: {a.scores.fit}
                            </span>
                            <span className="rounded-full bg-purple-50 px-3 py-1 font-semibold text-purple-700">
                              ATS: {a.scores.ats}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                              Writing: {a.scores.writing}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Key suggestions
                          </p>
                          <div className="space-y-1 text-xs text-gray-700">
                            {a.suggestions.missingSkills.length > 0 && (
                              <p>
                                <span className="font-semibold">Missing skills:</span>{" "}
                                {a.suggestions.missingSkills.join(", ")}
                              </p>
                            )}
                            {a.suggestions.keywordsToAdd.length > 0 && (
                              <p>
                                <span className="font-semibold">Keywords to add:</span>{" "}
                                {a.suggestions.keywordsToAdd.join(", ")}
                              </p>
                            )}
                            {a.suggestions.summaryHint && (
                              <p>
                                <span className="font-semibold">Summary hint:</span>{" "}
                                {a.suggestions.summaryHint}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Overview Section */}
        {/* <section className="mb-16 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-8 flex items-center justify-center">
              <img src={overviewImage} className="max-h-80" alt="Overview" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Resume ↔ JD analyzer that parses both, scores Fit/ATS/Writing, and delivers actionable, rule-based
                improvements.
              </p>
            </div>
          </div>
        </section> */}

        {/* What you get Section */}
        <section className="mb-16 border-t border-gray-200 pt-16">
          <WhatYouGetGrid />
        </section>

        {/* Privacy & control Section */}
        {/* <section className="mb-16 border-t border-gray-200 pt-16">
          <PrivacySection />
        </section> */}

        {/* How to use Section */}
        <section className="border-t border-gray-200 pt-16">
          <HowToUseGrid />
        </section>


      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start text-sm">
                <span className="font-semibold text-gray-900">Qualifyd.ai</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700">Rule-based scoring and analysis</span>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Made with love for the community by <a href="https://infoloop.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Infoloop Technologies LLP</a>.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
              <a href="/privacy.html" className="transition-colors hover:text-blue-600 font-medium">Privacy</a>
              <a href="/terms.html" className="transition-colors hover:text-blue-600 font-medium">Terms</a>
              <a href="mailto:support@infoloop.co" className="transition-colors hover:text-blue-600 font-medium">Support</a>
              <a href="/sitemap.xml" className="transition-colors hover:text-blue-600 font-medium">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}

export default App;

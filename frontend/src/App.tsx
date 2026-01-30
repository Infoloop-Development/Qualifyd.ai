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
import qualifydLogo from "./assets/qualifyd-logo.png";
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
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary-200">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="relative text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-600">{label}</p>
      <p className={`relative mt-2 sm:mt-3 text-4xl sm:text-5xl font-bold ${getScoreColor(value)}`}>
        {value ?? "—"}
      </p>
      {value && (
        <div className="relative mt-3 sm:mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
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
      icon: <MdOutlineEditNote fontSize={40} className="fill-primary-500" />,
      title: "Paste JD",
      description: "Paste the job description and upload PDF/DOCX resume",
      bgColor: "bg-primary-100",
    },
    {
      icon: <SiPastebin fontSize={40} className="fill-secondary-400" />,
      title: "Text Extraction",
      description: "Text extraction + section/skill/keyword detection",
      bgColor: "bg-secondary-100",
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
    <section className="space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
        How it works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center space-y-3 sm:space-y-4"
          >
            <div
              className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full ${step.bgColor}`}
            >
              <div className="text-3xl sm:text-4xl">
                {step.icon}
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed px-2">
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
      icon: <FaPen size={30} className="fill-primary-500" />, text:
        "Fit / ATS / Writing scores",
    },
    {
      icon: <GrDocumentMissing size={30} className="stroke-primary-500" />, text:
        "Missing skills and keywords to add",
    },
    {
      icon: <GoProjectSymlink size={30} className="fill-primary-500" />, text:
        "Missing sections (Summary, Skills, Projects, Education)",
    },
    {
      icon: <SiVictoriametrics size={30} className="fill-primary-500" />, text:
        "Bullet/style issues (no metrics, weak verbs, passive voice, too long)",
    },
    {
      icon: <MdEmojiFlags size={30} className="fill-primary-500" />, text:
        "Formatting flags (columns/images if detected)",
    },
    {
      icon: <GiShintoShrineMirror size={30} className="fill-primary-500" />, text:
        "Summary hints and writing suggestions"
    }
  ];

  return (
    <section className="space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">What you get</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3 p-4 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary-100">
              <div className="text-2xl sm:text-3xl">
                {item.icon}
              </div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">{item.text}</p>
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
      <div className="flex flex-col lg:flex-row justify-evenly items-center gap-8 sm:gap-10 lg:gap-12">
        <div className="w-full max-w-[250px] sm:max-w-[300px] lg:w-[450px] order-2 lg:order-1">
          <img src={pdfImage} className="w-full h-full" alt="Resume analysis illustration" />
        </div>
        <div className="flex flex-col items-start lg:items-start w-full lg:w-auto order-1 lg:order-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left w-full lg:text-left mb-4 sm:mb-6">How to use</h2>
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start text-left gap-3 sm:gap-4 mt-3 sm:mt-4 w-full">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary-100 text-base sm:text-lg font-bold text-primary-500 flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base lg:text-lg text-gray-900 font-medium leading-relaxed text-left">{step}</p>
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
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [analysesLoading, setAnalysesLoading] = useState(false);
  const [analysesError, setAnalysesError] = useState<string | null>(null);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<number | null>(null);
  const [isHowItWorksVisible, setIsHowItWorksVisible] = useState(false);

  const handleAnalyze = async () => {
    // Clear previous errors
    setAnalyzeError(null);

    // Validate both fields
    if (!jdText.trim() && !file) {
      setAnalyzeError("Please fill in both the job description and upload a resume file to analyze.");
      return;
    }

    if (!jdText.trim()) {
      setAnalyzeError("Please fill in the job description to continue.");
      return;
    }

    if (!file) {
      setAnalyzeError("Please upload a resume file to continue.");
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeError(null);
    setStatusData(null);

    try {
      const result = await analyzeResume(jdText, file);
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

  // Intersection Observer for "How it works" section visibility on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHowItWorksVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before it enters viewport
      }
    );

    const howItWorksSection = document.getElementById('how-it-works-section');
    if (howItWorksSection) {
      observer.observe(howItWorksSection);
    }

    return () => {
      if (howItWorksSection) {
        observer.unobserve(howItWorksSection);
      }
    };
  }, []);

  const handleAuthInputChange = (field: string, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof typeof fieldErrors];
        return newErrors;
      });
    }
    setAuthError(null);
  };

  // Validation functions
  const validateFullName = (name: string): string | null => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    if (/\d/.test(name)) {
      return "Full name cannot contain numbers";
    }
    if (/[^a-zA-Z\s'-]/.test(name)) {
      return "Full name can only contain letters, spaces, hyphens, and apostrophes";
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[a-zA-Z]/.test(password)) {
      return "Password must contain at least one letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | null => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return null;
  };

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (!password) return { strength: "", color: "" };
    if (password.length < 8) return { strength: "Weak", color: "text-red-600" };
    if (password.length >= 8 && password.length < 12) return { strength: "Medium", color: "text-yellow-600" };
    return { strength: "Strong", color: "text-green-600" };
  };

  const handleSubmitSignup = async () => {
    setAuthError(null);
    
    // Validate all fields
    const errors: typeof fieldErrors = {};
    const fullNameError = validateFullName(authForm.fullName);
    const emailError = validateEmail(authForm.email);
    const passwordError = validatePassword(authForm.password);
    const confirmPasswordError = validateConfirmPassword(authForm.confirmPassword, authForm.password);

    if (fullNameError) errors.fullName = fullNameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setAuthLoading(true);
    try {
      const resp = await registerUser({
        fullName: authForm.fullName.trim(),
        email: authForm.email.trim(),
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
      const errorMessage = (err as Error).message.toLowerCase();
      if (errorMessage.includes("invalid") || errorMessage.includes("incorrect") || errorMessage.includes("login failed") || errorMessage.includes("credentials")) {
        setAuthError("Incorrect Email Id or Password");
      } else {
        setAuthError((err as Error).message);
      }
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
    <div className={`min-h-screen text-gray-900 relative ${!showProfile && !hasResults ? '' : 'bg-white'}`}>
      {/* Vanta Dots Background - Only on main page */}
      {!showProfile && !hasResults && (
        <div id="vanta-bg" className="fixed inset-0 z-0" style={{ width: '100%', height: '100%' }}></div>
      )}
      <div className={`relative ${!showProfile && !hasResults ? 'z-10' : 'z-0'}`}>
      {/* Header */}
      <header className={`sticky top-0 border-b border-gray-200 bg-white shadow-sm ${showAuthModal ? 'z-30' : 'z-50'}`}>
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-5">
            <button
              type="button"
              onClick={handleGoHome}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer p-0 m-0 border-0 bg-transparent"
            >
              <img 
                src={qualifydLogo} 
                alt="Qualifyd.ai Logo" 
                className="h-8 w-auto sm:h-10 lg:h-12 object-contain"
              />
              <p className="text-[10px] sm:text-xs text-gray-600 hidden xs:block">Resume optimization & ATS analysis</p>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                {currentUser ? (
                  <>
                    <button
                      type="button"
                      className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
                      <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-lg z-50">
                        <button
                          type="button"
                          className="block w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setShowProfile(true);
                            setShowProfileMenu(false);
                          }}
                        >
                          Profile
                        </button>
                        <button
                          type="button"
                          className="block w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50"
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
                    className="rounded-lg bg-primary-500 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl"
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {!showProfile && (
        <>
        {/* Hero Section */}
        <section className="flex min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] items-center py-8 sm:py-10 lg:py-12 mb-8 sm:mb-12 lg:mb-16">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-center sm:text-left order-1 lg:order-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900">
                  Optimize your resume to get more interviews
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto sm:mx-0">
                  Qualifyd.ai helps you optimize your resume for any job, highlighting the key experience and skills recruiters need to see.
                </p>
                <div className="pt-2 flex justify-center sm:justify-start">
                  <button
                    onClick={handleScrollToUpload}
                    className="rounded-lg bg-primary-500 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl w-full sm:w-auto"
                  >
                    Scan Your Resume For Free
                  </button>
                </div>
                <div className="pt-3 sm:pt-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4 text-center sm:text-left">Qualifyd.ai users have been hired by:</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 lg:gap-8 opacity-70">
                    {/* Apple */}
                    <img 
                      src="https://static.jobscan.co/blog/uploads/Apple_logo_grey.png" 
                      alt="Apple logo" 
                      className="h-6 sm:h-7 lg:h-8 object-contain grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                    {/* Amazon */}
                    <img 
                      src="https://static.jobscan.co/blog/uploads/Amazon-logo.png" 
                      alt="Amazon logo" 
                      className="h-6 sm:h-7 lg:h-8 object-contain grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                    {/* Facebook/Meta */}
                    <img 
                      src="https://static.jobscan.co/blog/uploads/Facebook-logo.png" 
                      alt="Meta logo" 
                      className="h-6 sm:h-7 lg:h-8 object-contain grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                    {/* General Electric */}
                    <img 
                      src="https://static.jobscan.co/blog/uploads/1024px-General_Electric_logo.svg_.png" 
                      alt="General Electric logo" 
                      className="h-6 sm:h-7 lg:h-8 object-contain grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                    {/* Uber */}
                    <img 
                      src="https://static.jobscan.co/blog/uploads/Uber-Logo.png" 
                      alt="Uber logo" 
                      className="h-6 sm:h-7 lg:h-8 object-contain grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                    {/* IBM */}
                    <img 
                      src="https://static.jobscan.co/blog/uploads/purepng.com-ibm-logologobrand-logoiconslogos-251519939176ka7y8.png" 
                      alt="IBM logo" 
                      className="h-6 sm:h-7 lg:h-8 object-contain grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Element */}
              <div className="relative order-2 lg:order-2 mt-8 lg:mt-0 max-w-md mx-auto lg:max-w-none lg:mx-0">
                <div className="relative rounded-2xl bg-gradient-to-br from-primary-50 via-secondary-50 to-emerald-50 p-3 sm:p-6 lg:p-8 shadow-2xl scale-90 sm:scale-100">
                  {/* Animated Background Shapes */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-200 opacity-20 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary-200 opacity-20 blur-3xl"></div>
                  </div>

                  {/* Main Visual Content */}
                  <div className="relative space-y-4 sm:space-y-6">
                    {/* Score Cards */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600">92</div>
                        <div className="text-xs text-gray-600 mt-1">Fit Score</div>
                      </div>
                      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary-500">88</div>
                        <div className="text-xs text-gray-600 mt-1">ATS Score</div>
                      </div>
                      <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-secondary-400">85</div>
                        <div className="text-xs text-gray-600 mt-1">Writing</div>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg space-y-3 sm:space-y-4">
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                          <span className="font-medium text-gray-700">Skills Match</span>
                          <span className="text-gray-500">95%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                          <span className="font-medium text-gray-700">Keywords</span>
                          <span className="text-gray-500">87%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-secondary-400 to-primary-500 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-2">
                          <span className="font-medium text-gray-700">Formatting</span>
                          <span className="text-gray-500">92%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-primary-500 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Icons */}
                    <div className="flex justify-center gap-4 sm:gap-6 pt-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-primary-100 rounded-full p-2 sm:p-3">
                          <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-600 mt-2">Resume</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-secondary-100 rounded-full p-3">
                          <svg className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <section 
          id="how-it-works-section"
          className={`mb-8 sm:mb-12 lg:mb-16 py-8 sm:py-10 lg:py-12 transition-opacity duration-700 ${
            isHowItWorksVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <HowItWorksGrid />
        </section>

        {/* Upload Section */}
        <div id="upload-section" className="mb-8 sm:mb-12 lg:mb-16 py-8 sm:py-10 lg:py-12 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-6">
              <label className="mb-2 sm:mb-3 block text-base sm:text-lg font-semibold text-gray-900">
                Job Description
              </label>
              <textarea
                className="min-h-[200px] sm:h-[244px] w-full resize-none rounded-xl border border-gray-300 bg-white p-4 sm:p-5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Paste the complete job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            </div>
            <div className="lg:col-span-6">
              <label className="mb-2 sm:mb-3 block text-base sm:text-lg font-semibold text-gray-900">
                Upload Resume {!file && <span className="text-red-500">*</span>}
              </label>
              <div className={`group relative overflow-hidden rounded-xl bg-primary-600 text-center transition-all ${
                !file && analyzeError && analyzeError.includes("resume file")
                  ? "ring-2 ring-red-500 ring-offset-2"
                  : ""
              }`}>
                <div className="m-2 sm:m-3 rounded-xl border-2 border-dashed border-gray-300 bg-primary-700 p-6 sm:p-8 lg:p-10">
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setFile(f);
                        if (analyzeError) setAnalyzeError(null);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <div className="pointer-events-none">
                    <div className="mx-auto mb-3 sm:mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gray-200 transition-all group-hover:bg-gray-300">
                      <svg
                        className="h-8 w-8 sm:h-10 sm:w-10 text-gray-600 transition-all group-hover:text-gray-700"
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
                      <div className="text-xs sm:text-sm">
                        <p className="font-semibold text-gray-100 break-words px-2">{file.name}</p>
                        <p className="mt-1 text-[10px] sm:text-xs text-gray-200">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm">
                        <p className="font-semibold text-gray-100">
                          Drop your file here
                        </p>
                        <p className="mt-1 text-[10px] sm:text-xs text-gray-100">
                          PDF or DOCX (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!file && analyzeError && analyzeError.includes("resume file") && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">This field is required</p>
              )}
              <button
                className="mt-4 sm:mt-5 w-full rounded-xl bg-primary-500 px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? "🔄 Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
                <p className="font-medium text-sm sm:text-base lg:text-lg">
                  Resume ↔ JD analyzer that parses both, scores Fit/ATS/Writing, and delivers
                  actionable, rule-based improvements.
                </p>
              </div>
              <div className="lg:col-span-6">
                <ul className="list-disc pl-4 sm:pl-5 space-y-2">
                  <li className="text-sm sm:text-base lg:text-lg font-medium">
                    Deterministic processing by default; fully transparent and explainable.
                  </li>
                  <li className="text-sm sm:text-base lg:text-lg font-medium">
                    Rule-based scoring ensures consistent and reliable results.
                  </li>
                  <li className="text-sm sm:text-base lg:text-lg font-medium">
                    Privacy-focused; your data stays secure and private.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* <button
            className="w-full rounded-xl bg-primary-500 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
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
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-sm text-primary-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              Processing your resume...
            </div>
          )}
          {/* Results Section */}
          {hasResults && (
            <>
              <div
                className={`border-t border-gray-200 pt-8 sm:pt-12 lg:pt-16 space-y-10 sm:space-y-12 lg:space-y-16 transition-all ${
                  hasResults && !currentUser && showAuthModal ? "blur-sm pointer-events-none select-none" : ""
                }`}
              >
                {/* Scores */}
                <div className="space-y-6 sm:space-y-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">📈 Your Scores</h2>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    <ScoreCard label="Fit Score" value={scores?.fit} />
                    <ScoreCard label="ATS Score" value={scores?.ats} />
                    <ScoreCard label="Writing Score" value={scores?.writing} />
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="space-y-6 sm:space-y-8">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">💡 Recommendations</h2>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
                      <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
                        <span className="text-lg sm:text-xl">🎯</span> Missing Skills
                      </h3>
                      <div className="space-y-2">
                        {missingSkills.length ? (
                          missingSkills.map((s: string) => (
                            <div key={s} className="rounded-lg bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700 border border-gray-200 break-words">
                              {s}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-600">✓ All key skills present</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
                      <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
                        <span className="text-lg sm:text-xl">🔑</span> Keywords to Add
                      </h3>
                      <div className="space-y-2">
                        {keywordsToAdd.length ? (
                          keywordsToAdd.map((k: string) => (
                            <div key={k} className="rounded-lg bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700 border border-gray-200 break-words">
                              {k}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-600">✓ Keywords optimized</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
                      <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
                        <span className="text-lg sm:text-xl">📑</span> Missing Sections
                      </h3>
                      <div className="space-y-2">
                        {missingSections.length ? (
                          missingSections.map((s: string) => (
                            <div key={s} className="rounded-lg bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700 border border-gray-200 break-words">
                              {s}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-600">✓ All sections complete</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
                      <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
                        <span className="text-lg sm:text-xl">⚠️</span> Format Issues
                      </h3>
                      <div className="space-y-2">
                        {formatFlags.length ? (
                          formatFlags.map((f: string, idx: number) => (
                            <div key={idx} className="rounded-lg bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700 border border-gray-200 break-words">
                              {f}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-600">✓ Format looks good</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Writing Improvements */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
                    <span className="text-lg sm:text-xl">📝</span> Writing Improvements
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">Spelling checks</p>
                      {spellingIssues.length ? (
                        spellingIssues.map((s: string, idx: number) => (
                          <div key={idx} className="rounded-lg bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 border border-gray-200 break-words">
                            {s}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-600">✓ No obvious spelling issues detected</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">Bullet structure & clarity</p>
                      {bulletIssues.length ? (
                        bulletIssues.map((b: string, idx: number) => (
                          <div key={idx} className="rounded-lg bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 border border-gray-200 break-words">
                            {b}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-gray-600">✓ No structural writing issues detected</p>
                      )}
                    </div>
                  </div>

                  {suggestions?.summaryHint && (
                    <div className="rounded-lg bg-primary-50 p-3 sm:p-4 text-xs sm:text-sm border border-gray-200">
                      <span className="font-semibold text-gray-900">💡 Summary Tip: </span>
                      <span className="text-gray-700">{suggestions.summaryHint}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        {!currentUser && showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}>
            <div className="relative w-full max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto mx-auto">
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
              <h2 className="mb-3 sm:mb-4 text-base sm:text-lg lg:text-xl font-bold text-gray-900 text-center leading-tight px-2">
                {authMode === "signup" ? "Create your free account to view results" : "Log in to view your results"}
              </h2>
              <p className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600 text-center">
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
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        fieldErrors.fullName
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      }`}
                      value={authForm.fullName}
                      onChange={(e) => handleAuthInputChange("fullName", e.target.value)}
                      placeholder="Enter your full name"
                    />
                    {fieldErrors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      fieldErrors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                    value={authForm.email}
                    onChange={(e) => handleAuthInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      fieldErrors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    }`}
                    value={authForm.password}
                    onChange={(e) => handleAuthInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                  />
                  {authForm.password && !fieldErrors.password && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`text-xs font-medium ${getPasswordStrength(authForm.password).color}`}>
                        Password strength: {getPasswordStrength(authForm.password).strength}
                      </span>
                    </div>
                  )}
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                  )}
                  {authMode === "signup" && !fieldErrors.password && (
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be alphanumeric (letters and numbers only), at least 8 characters
                    </p>
                  )}
                </div>

                {authMode === "signup" && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Confirm password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        fieldErrors.confirmPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      }`}
                      value={authForm.confirmPassword}
                      onChange={(e) => handleAuthInputChange("confirmPassword", e.target.value)}
                      placeholder="Confirm your password"
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {authError && (
                  <p className="text-xs text-red-600">{authError}</p>
                )}

                <button
                  type="button"
                  className="mt-2 w-full rounded-lg bg-primary-500 px-4 py-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-400 min-h-[44px] whitespace-normal break-words"
                  disabled={authLoading}
                  onClick={authMode === "signup" ? handleSubmitSignup : handleSubmitLogin}
                >
                  {authLoading
                    ? authMode === "signup"
                      ? "Creating account"
                      : "Logging in"
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
                          className="font-semibold text-primary-500 hover:underline"
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
                          className="font-semibold text-primary-500 hover:underline"
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
          <section className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">View your account details and past analyses.</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-gray-200 bg-white px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 min-h-[44px] whitespace-nowrap w-full sm:w-auto"
                onClick={() => setShowProfile(false)}
              >
                <span className="hidden sm:inline">← </span>Back to analyzer
              </button>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Account</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">{currentUser.fullName}</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Saved analyses</h3>
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

              <div className="space-y-2 sm:space-y-3">
                {analyses.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-gray-200 bg-white">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 sm:px-4 py-3 text-left min-h-[44px]"
                      onClick={() =>
                        setExpandedAnalysisId((prev) => (prev === a.id ? null : a.id))
                      }
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">
                          {a.jobTitle || "Analysis"}{" "}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-gray-400 text-lg sm:text-xl flex-shrink-0">
                        {expandedAnalysisId === a.id ? "−" : "+"}
                      </span>
                    </button>
                    {expandedAnalysisId === a.id && (
                      <div className="border-t border-gray-200 px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Job description
                          </p>
                          <div className="max-h-40 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 whitespace-pre-wrap">
                            {a.jdText}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
                          {a.resumeOriginalName && (
                            <button
                              type="button"
                              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 min-h-[44px] flex items-center break-words"
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
                              <span className="whitespace-normal">Download resume</span>
                              <span className="block sm:inline sm:ml-1 text-[10px] sm:text-xs opacity-75">
                                ({a.resumeOriginalName.length > 15 ? a.resumeOriginalName.substring(0, 15) + '...' : a.resumeOriginalName})
                              </span>
                            </button>
                          )}

                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-primary-50 px-2.5 sm:px-3 py-1 font-semibold text-primary-600">
                              Fit: {a.scores.fit}
                            </span>
                            <span className="rounded-full bg-secondary-50 px-2.5 sm:px-3 py-1 font-semibold text-secondary-400">
                              ATS: {a.scores.ats}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-2.5 sm:px-3 py-1 font-semibold text-emerald-700">
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
        <section className="mb-8 sm:mb-12 lg:mb-16 border-t border-gray-200 pt-8 sm:pt-12 lg:pt-16">
          <WhatYouGetGrid />
        </section>

        {/* Privacy & control Section */}
        {/* <section className="mb-16 border-t border-gray-200 pt-16">
          <PrivacySection />
        </section> */}

        {/* How to use Section */}
        <section className="mb-8 sm:mb-12 lg:mb-16 border-t border-gray-200 pt-8 sm:pt-12 lg:pt-16">
          <HowToUseGrid />
        </section>


      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center md:justify-start mb-2">
                <img 
                  src={qualifydLogo} 
                  alt="Qualifyd.ai Logo" 
                  className="h-6 w-auto sm:h-8 object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center md:justify-start text-xs sm:text-sm">
                <span className="text-gray-700">Rule-based scoring and analysis</span>
              </div>
              <p className="mt-2 text-[10px] sm:text-xs text-gray-600 text-center md:text-left">
                Made with love for the community by <a href="https://infoloop.co/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">Infoloop Technologies LLP</a>.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700">
              <a href="/privacy.html" className="transition-colors hover:text-primary-500 font-medium min-h-[44px] flex items-center">Privacy</a>
              <a href="/terms.html" className="transition-colors hover:text-primary-500 font-medium min-h-[44px] flex items-center">Terms</a>
              <a href="mailto:support@infoloop.co" className="transition-colors hover:text-primary-500 font-medium min-h-[44px] flex items-center">Support</a>
              <a href="/sitemap.xml" className="transition-colors hover:text-primary-500 font-medium min-h-[44px] flex items-center">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default App;

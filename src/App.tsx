import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
} from "lucide-react";

// Types for Team and Players
interface Player {
  id: string;
  number: string;
  role: string;
  name: string;
  matricNo: string;
  idPassport: string;
  school: string;
  contactNumber?: string; // Only for Player 01 (Team Leader)
}

interface TeamRegistration {
  teamName: string;
  schoolFaculty: string;
  players: [Player, Player, Player];
}

const AnimatedError = ({ error, className = "text-xs text-brand-magenta font-mono" }: { error?: string; className?: string }) => {
  return (
    <AnimatePresence initial={false}>
      {error ? (
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ height: "auto", opacity: 1, marginTop: 6 }}
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <span className={`${className} block`}>{error}</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const HeroSection = React.memo(function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const state = useRef({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    isHovered: false,
    relX: 0,
    relY: 0,
    dist: 0,
    jitterX: 0,
    jitterY: 0
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = (x - centerX) / centerX;
    const relY = (y - centerY) / centerY;
    const dist = Math.sqrt(relX * relX + relY * relY);

    const now = Date.now();
    const dt = now - state.current.lastTime;
    let computedVelocity = state.current.velocity;

    if (dt > 0) {
      const dx = x - state.current.lastX;
      const dy = y - state.current.lastY;
      const distanceMoved = Math.sqrt(dx * dx + dy * dy);
      const instSpeed = distanceMoved / dt;
      computedVelocity = computedVelocity * 0.4 + instSpeed * 0.6;
      computedVelocity = Math.min(computedVelocity, 8);
    }

    state.current = {
      ...state.current,
      lastX: x,
      lastY: y,
      lastTime: now,
      velocity: computedVelocity,
      x,
      y,
      relX,
      relY,
      dist,
      isHovered: true,
    };

    if (followerRef.current) {
      followerRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    state.current.velocity = 0;
    state.current.relX = 0;
    state.current.relY = 0;
    state.current.dist = 0;
    state.current.isHovered = false;
    state.current.jitterX = 0;
    state.current.jitterY = 0;
    
    if (followerRef.current) {
      followerRef.current.style.opacity = '0';
    }
    if (heroTitleRef.current) {
      heroTitleRef.current.style.transform = `translate(0px, 0px)`;
    }
    if (containerRef.current) {
      containerRef.current.style.setProperty("--mouse-rel-x", "0");
      containerRef.current.style.setProperty("--mouse-rel-y", "0");
      containerRef.current.style.setProperty("--mouse-dist", "0");
    }
  };

  useEffect(() => {
    let animId: number;

    const tick = () => {
      const s = state.current;
      
      if (s.isHovered) {
        s.velocity *= 0.92;
        const vel = s.velocity;

        if (vel > 1.2) {
          s.jitterX = (Math.random() - 0.5) * (vel * 8);
          s.jitterY = (Math.random() - 0.5) * (vel * 12);
        } else {
          s.jitterX = 0;
          s.jitterY = 0;
        }

        if (containerRef.current) {
          containerRef.current.style.setProperty("--mouse-rel-x", s.relX.toString());
          containerRef.current.style.setProperty("--mouse-rel-y", s.relY.toString());
          containerRef.current.style.setProperty("--mouse-dist", s.dist.toString());
        }

        if (heroTitleRef.current) {
          heroTitleRef.current.style.transform = `translate(${s.jitterX}px, ${s.jitterY}px)`;
        }

        if (followerRef.current && glowRef.current) {
          followerRef.current.style.left = `${s.x}px`;
          followerRef.current.style.top = `${s.y}px`;
          const size = 140 + vel * 45;
          followerRef.current.style.width = `${size}px`;
          followerRef.current.style.height = `${size}px`;
          
          glowRef.current.style.background = vel > 1.2
            ? 'radial-gradient(circle, rgba(255,0,255,0.22) 0%, rgba(0,255,255,0.18) 72%)'
            : 'radial-gradient(circle, rgba(0,255,255,0.25) 0%, rgba(255,0,255,0.15) 70%)';
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      id="introduction-section"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex flex-col justify-center items-center py-16 px-4 md:px-8 max-w-7xl mx-auto z-10 overflow-hidden introduction-section-interactive"
    >
      <div
        ref={followerRef}
        className="absolute pointer-events-none z-30 mix-blend-screen overflow-hidden"
        style={{
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.08s ease-out, height 0.08s ease-out, opacity 0.2s ease',
        }}
      >
        <div
          ref={glowRef}
          className="absolute rounded-full w-full h-full blur-2xl opacity-40 mix-blend-color-dodge transition-all duration-200"
        />
      </div>

      <div id="intro-status" className="inline-flex items-center gap-2 px-5 py-2 bg-black border-2 border-brand-green mb-8 rotate-[-1deg] hover:rotate-1 transition-transform pointer-events-none">
        <span className="w-3 h-3 rounded-full bg-brand-green animate-ping"></span>
        <span className="font-stencil text-brand-green text-sm md:text-base tracking-widest">REGISTRATIONS OPEN</span>
      </div>

      <div className="text-center w-full max-w-5xl mb-12 relative z-20 px-2">
        <h1
          id="hero-title"
          ref={heroTitleRef}
          className="font-syne font-extrabold leading-none tracking-tighter italic cursor-default select-none uppercase"
          style={{
            transition: 'transform 0.05s ease-out'
          }}
        >
          <span
            className="text-brand-magenta block glitch-effect tracking-tight text-[8vw] sm:text-5xl md:text-7xl lg:text-[80px] xl:text-[100px]"
            data-text="CS-HOOPERS"
          >
            CS-HOOPERS
          </span>
          <span className="bg-brand-green text-black px-2.5 sm:px-8 py-1 sm:py-2.5 mx-1 sm:mx-2 my-2.5 sm:my-3 transform rotate-[1.5deg] inline-block font-urban text-[3vw] sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl tracking-normal shadow-[3px_3px_0px_#ff00ff] md:shadow-[6px_6px_0px_#ff00ff]">
            COMPUTER SCIENCE
          </span>
          <span
            className="text-white block tracking-tighter text-[6vw] sm:text-5xl md:text-7xl lg:text-[80px] xl:text-[100px] mt-2 glitch-effect leading-none"
            data-text="SPORTS DAY"
          >
            SPORTS DAY
          </span>
        </h1>
      </div>

      <div className="max-w-2xl text-center bg-zinc-950/90 p-6 md:p-8 border-l-4 border-brand-magenta mb-16 shadow-[8px_8px_0px_#111]">
        <p className="font-sans text-base md:text-lg text-zinc-300 leading-relaxed">
          The premier collegiate basketball tournament where data meets the asphalt. Assemble your squad, register your roster, and prepare for high-stakes urban competition.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div
          id="card-dates"
          className="bg-gradient-to-br from-[#111111]/90 via-[#1d1233]/90 to-[#0A0A0A]/90 backdrop-blur-md border-4 border-brand-magenta p-8 flex flex-col items-center text-center transform rotate-[-1deg] transition-all hover:rotate-0 hover:scale-105 shadow-[6px_6px_0px_#000]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-brand-magenta flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-brand-magenta" />
          </div>
          <h3 className="font-urban text-lg text-white mb-2 tracking-wide uppercase">DATES</h3>
          <p className="stencil-text text-xl md:text-2xl text-brand-green font-bold">
            OCT 15 - 20, 2024
          </p>
          <span className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">Live Schedule</span>
        </div>

        <div
          id="card-venue"
          className="bg-gradient-to-br from-[#111111]/90 via-[#0a2315]/90 to-[#0A0A0A]/90 backdrop-blur-md border-4 border-brand-green p-8 flex flex-col items-center text-center transform rotate-[1.5deg] transition-all hover:rotate-0 hover:scale-105 shadow-[6px_6px_0px_#000]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-brand-green flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-brand-green" />
          </div>
          <h3 className="font-urban text-lg text-white mb-2 tracking-wide uppercase">VENUE</h3>
          <p className="stencil-text text-xl md:text-2xl text-brand-magenta font-bold">
            MAIN VARSITY ARENA
          </p>
          <span className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">UTM COURT A</span>
        </div>

        <div
          id="card-prize"
          className="bg-gradient-to-br from-[#111111]/90 via-[#0d1c33]/90 to-[#0A0A0A]/90 backdrop-blur-md border-4 border-brand-magenta p-8 flex flex-col items-center text-center transform rotate-[-2deg] transition-all hover:rotate-0 hover:scale-105 shadow-[6px_6px_0px_#000]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-brand-magenta flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-brand-magenta" />
          </div>
          <h3 className="font-urban text-lg text-white mb-2 tracking-wide uppercase">PRIZE</h3>
          <p className="stencil-text text-xl md:text-2xl text-brand-green font-bold">
            $5,000 + RINGS
          </p>
          <span className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">Championship Pack</span>
        </div>
      </div>
    </section>
  );
});

export default function App() {
  const registrationSectionRef = useRef<HTMLElement>(null);
  const [showMobileSubmit, setShowMobileSubmit] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState<number>(0);

  // State for the Form
  const [formData, setFormData] = useState<TeamRegistration>({
    teamName: "",
    schoolFaculty: "",
    players: [
      {
        id: "p1",
        number: "PLAYER 01",
        role: "TEAM LEADER",
        name: "",
        matricNo: "",
        idPassport: "",
        school: "",
        contactNumber: ""
      },
      {
        id: "p2",
        number: "PLAYER 02",
        role: "ACTIVE ROSTER",
        name: "",
        matricNo: "",
        idPassport: "",
        school: ""
      },
      {
        id: "p3",
        number: "PLAYER 03",
        role: "ACTIVE ROSTER",
        name: "",
        matricNo: "",
        idPassport: "",
        school: ""
      }
    ]
  });

  // Simple accordion state for FAQ
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form error notification state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Submit success state
  const [submittedData, setSubmittedData] = useState<TeamRegistration | null>(null);

  // Input change handler for top level team details
  const handleTeamChange = (field: "teamName" | "schoolFaculty", value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear field error on change
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Change handler for player inputs
  const handlePlayerChange = (playerIndex: number, field: keyof Player, value: string) => {
    setFormData(prev => {
      const updatedPlayers = [...prev.players] as [Player, Player, Player];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        [field]: value
      };
      return {
        ...prev,
        players: updatedPlayers
      };
    });

    // Clear specific field errors
    const errorKey = `p${playerIndex + 1}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  // Form validation & submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Validate Team info
    if (!formData.teamName.trim()) {
      errors.teamName = "Team Name is required";
    }
    if (!formData.schoolFaculty.trim()) {
      errors.schoolFaculty = "School/Faculty is required";
    }

    // Validate players
    formData.players.forEach((player, idx) => {
      const i = idx + 1;
      if (!player.name.trim()) {
        errors[`p${i}_name`] = `Player 0${i} Name is required`;
      }
      if (!player.matricNo.trim()) {
        errors[`p${i}_matricNo`] = `Player 0${i} Metric/Student ID is required`;
      }
      if (!player.idPassport.trim()) {
        errors[`p${i}_idPassport`] = `Player 0${i} ID/Passport is required`;
      }
      if (!player.school.trim()) {
        errors[`p${i}_school`] = `Player 0${i} School is required`;
      }
      
      // Player 01 validation for Contact
      if (idx === 0) {
        if (!player.contactNumber || !player.contactNumber.trim()) {
          errors.p1_contactNumber = "Team Leader Contact Number is required";
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to the error banner or form
      const formElement = document.getElementById("registration-section");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Success payload
    console.log("SUCCESSFUL REGISTRATION PAYLOAD:", JSON.stringify(formData, null, 2));
    setFormErrors({});
    setSubmittedData(formData);

    // Scroll automatically to success panel
    setTimeout(() => {
      const successPanel = document.getElementById("success-panel");
      if (successPanel) {
        successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  const handleResetForm = () => {
    setFormData({
      teamName: "",
      schoolFaculty: "",
      players: [
        {
          id: "p1",
          number: "PLAYER 01",
          role: "TEAM LEADER",
          name: "",
          matricNo: "",
          idPassport: "",
          school: "",
          contactNumber: ""
        },
        {
          id: "p2",
          number: "PLAYER 02",
          role: "ACTIVE ROSTER",
          name: "",
          matricNo: "",
          idPassport: "",
          school: ""
        },
        {
          id: "p3",
          number: "PLAYER 03",
          role: "ACTIVE ROSTER",
          name: "",
          matricNo: "",
          idPassport: "",
          school: ""
        }
      ]
    });
    setSubmittedData(null);
    setFormErrors({});
  };

  // FAQ mock data
  const faqs = [
    {
      question: "ELIGIBILITY RULES?",
      answer: "Valid university or college students only. All registered athletes must bring their physical active Student ID to the venue on tournament days. No ID, no entry onto the court. Strict academic verification applies."
    },
    {
      question: "UNIFORM CODE?",
      answer: "Teams must sport matching color jerseys. High-contrast numbers must be permanently visible on either the front or the back of the active tops. We strongly suggest rugged, gritty sportswear built to survive real street play."
    },
    {
      question: "GAME SCHEDULE?",
      answer: "Full elimination brackets will drop exactly 48 hours after user registration windows officially lock. Standard tournament slots are rigid with zero rescheduling options. Check-in is precisely 30 minutes before your tip-off."
    }
  ];

  useEffect(() => {
    const section = registrationSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMobileSubmit(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const calculateCompletedFields = () => {
    let count = 0;
    if (formData.teamName.trim()) count++;
    if (formData.schoolFaculty.trim()) count++;
    formData.players.forEach((p, idx) => {
      if (p.name.trim()) count++;
      if (p.matricNo.trim()) count++;
      if (p.idPassport.trim()) count++;
      if (p.school.trim()) count++;
      if (idx === 0 && p.contactNumber?.trim()) count++;
    });
    return count;
  };
  
  const completedFields = calculateCompletedFields();
  const isFormComplete = completedFields === 15;

  return (
    <div id="app-root" className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-brand-green selection:text-black antialiased relative overflow-x-hidden">
      
      {/* Gritty Street Overlays and Side Murals for exact visual similarity */}
      <div className="halftone-overlay pointer-events-none"></div>
      <div className="visual-noise pointer-events-none"></div>

      {/* Floating Street Spray Graffiti tags on desktop for visual energy */}
      <div className="hidden xl:block graffiti-tag top-[14%] left-[10%] rotate-[-12deg] text-brand-magenta select-none">SLAM</div>
      <div className="hidden xl:block graffiti-tag top-[44%] right-[8%] rotate-[14deg] text-brand-green select-none">DUNK</div>
      <div className="hidden xl:block graffiti-tag bottom-[25%] left-[6%] rotate-[-7deg] text-brand-cyan select-none">UTM</div>

      {/* Left and Right Side Gritty Athlete Murals on Large Desktops */}
      <div className="hidden lg:block mural-side mural-left animate-pulse duration-[8000ms]"></div>
      <div className="hidden lg:block mural-side mural-right animate-pulse duration-[8500ms]"></div>

      {/* FIXED TOP NAVIGATION BAR */}
      <nav id="top-navigation" className="bg-black/95 backdrop-blur-md sticky top-0 border-b-4 border-brand-magenta z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          
          {/* Logo with Street Attitude */}
          <a href="#introduction-section" className="flex items-center gap-2 group relative">
            <Flame className="w-8 h-8 text-brand-green animate-pulse" />
            <div 
              className="font-urban text-lg md:text-2xl tracking-tighter text-brand-green italic leading-none"
              data-text="VARSITY_ARENA"
            >
              VARSITY<span className="text-brand-magenta block text-xs md:text-sm tracking-widest font-bold">ARENA</span>
            </div>
          </a>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#introduction-section" className="font-marker text-lg text-brand-magenta hover:text-brand-green transition-colors tracking-widest">
              INTRODUCTION
            </a>
            <a href="#registration-section" className="font-marker text-lg text-white hover:text-brand-magenta transition-colors tracking-widest">
              REGISTRATION
            </a>
            <a href="#faq-section" className="font-marker text-lg text-white hover:text-brand-magenta transition-colors tracking-widest">
              FAQ
            </a>
          </div>

          {/* Join Now Action */}
          <a 
            href="#registration-section"
            className="attention-join-btn relative inline-flex items-center justify-center min-h-11 font-urban text-xs md:text-sm px-4 md:px-6 py-2 bg-brand-magenta text-black border-2 border-black font-extrabold select-none shadow-[4px_4px_0px_#39ff14] active:translate-y-[2px]"
            id="nav-join-btn"
          >
            JOIN NOW
          </a>
        </div>
      </nav>

      <HeroSection />

      {/* CORE REGISTRATION SECTION */}
      <section 
        id="registration-section" 
        ref={registrationSectionRef}
        className="py-24 px-4 md:px-8 border-y-8 border-black bg-[#0A0A0A] relative z-20"
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16 relative z-10">
            <h2 
              id="registration-title"
              className="font-urban font-extrabold text-4xl md:text-6xl text-white uppercase italic tracking-tighter inline-block"
              data-text="ENTER THE ARENA"
            >
              ENTER THE <span className="text-brand-green">ARENA</span>
            </h2>
            {/* Hand-drawn/graffiti paint brush looking thick underline like in image */}
            <div className="h-4 w-48 bg-brand-magenta mx-auto my-4 transform rotate-[-2.5deg] skew-x-[-10deg] opacity-90 shadow-[2px_2px_0px_#000]"></div>
            <p className="font-sans text-zinc-400 max-w-md mx-auto text-sm md:text-base">
              Lock in your 3-member team. Finalize your roster for the 3v3 battle. No subs. No excuses.
            </p>
          </div>

          {/* Verification Errors Banner */}
          <AnimatePresence initial={false}>
            {Object.keys(formErrors).length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0, scale: 0.95, marginBottom: 0 }}
                animate={{ height: "auto", opacity: 1, scale: 1, marginBottom: 32 }}
                exit={{ height: 0, opacity: 0, scale: 0.95, marginBottom: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div id="error-alert" className="p-6 bg-red-950/90 border-4 border-brand-magenta text-white shadow-[6px_6px_0px_#000] rotate-[-0.5deg]">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-brand-magenta shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-urban text-brand-magenta tracking-wider text-sm mb-2 uppercase">ROSTER VERIFICATION FAILURE</h4>
                      <p className="text-xs text-zinc-300 font-medium mb-3">
                        Your team submission lacks details. Please fill in all required fields marked in the inputs:
                      </p>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 font-mono">
                        {Object.values(formErrors).slice(0, 5).map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                        {Object.keys(formErrors).length > 5 && (
                          <li>And {Object.keys(formErrors).length - 5} more roster errors...</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Form with offset glowing framing borders for exact mockup match */}
          <div className="relative mb-8 group">
            {/* Offset Neon Background Borders */}
            <div className="absolute inset-0 border-4 border-brand-magenta translate-x-3 translate-y-3 pointer-events-none opacity-80 z-0"></div>
            <div className="absolute inset-0 border-4 border-brand-green -translate-x-1.5 -translate-y-1.5 pointer-events-none opacity-90 z-0"></div>

            <form 
              onSubmit={handleSubmit}
              className="bg-[#111111]/95 backdrop-blur-md p-4 md:p-12 border-4 border-zinc-900 relative z-10 shadow-[12px_12px_0px_#000]"
              id="registration-inner-form"
            >
              
              {/* Spray decal look-alike block decorations */}
              <div className="absolute top-[-10px] left-[20px] bg-brand-magenta text-black text-[10px] font-mono px-2 py-0.5 tracking-widest uppercase font-bold">
                3V3 REGISTRATION
              </div>

              {/* TEAM IDENTITY MODULE */}
              <div id="team-identity-block" className="mb-14">
                
                <div className="tape-label mb-8">
                  TEAM IDENTITY
                </div>

                {/* Grid 2 Column for Team Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Team Name Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-urban text-brand-magenta tracking-wider text-xs uppercase font-extrabold">
                      TEAM NAME
                    </label>
                    <input 
                      type="text"
                      className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${formErrors.teamName ? 'border-brand-magenta' : 'border-black focus:border-brand-green'} outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                      value={formData.teamName}
                      onChange={(e) => handleTeamChange("teamName", e.target.value)}
                      placeholder="e.g. PHANTOM BALLERS"
                      name="teamName"
                      autoComplete="organization"
                      autoCapitalize="characters"
                    />
                    <AnimatedError error={formErrors.teamName} />
                  </div>

                  {/* Team School Faculty Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-urban text-brand-magenta tracking-wider text-xs uppercase font-extrabold">
                      SCHOOL/FACULTY
                    </label>
                    <input 
                      type="text"
                      className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${formErrors.schoolFaculty ? 'border-brand-magenta' : 'border-black focus:border-brand-green'} outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                      value={formData.schoolFaculty}
                      onChange={(e) => handleTeamChange("schoolFaculty", e.target.value)}
                      placeholder="e.g. FACULTY OF COMPUTER SCIENCE"
                      name="schoolFaculty"
                      autoComplete="organization-title"
                      autoCapitalize="characters"
                    />
                    <AnimatedError error={formErrors.schoolFaculty} />
                  </div>

                </div>

              </div>

              {/* TEAM ROSTER MODULE */}
              <div id="roster-players-block" className="space-y-12">
              
              <div className="relative mb-8">
                <div className="absolute inset-0 border-2 border-brand-green translate-x-1.5 translate-y-1.5 pointer-events-none z-0"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/90 p-4 border-l-4 border-brand-green">
                  <span className="bg-brand-green text-black px-4 py-1 font-stencil font-bold tracking-widest text-sm transform rotate-[-1deg]">
                    TEAM ROSTER (03 PLAYERS REQUIRED)
                  </span>
                  <span className="font-mono text-xs text-brand-green tracking-widest animate-pulse font-bold">
                    STATUS: LOCKED_3V3
                  </span>
                </div>
              </div>

              {/* Player Iteration */}
              {formData.players.map((player, index) => {
                const playerNumString = player.number; // e.g. "PLAYER 01"
                const errorPrefix = `p${index + 1}_`;
                const isLeader = index === 0;
                const isExpanded = expandedPlayer === index;

                return (
                  <div 
                    key={player.id}
                    className={`p-4 md:p-8 border-4 bg-[#0a0a0a]/90 relative overflow-hidden mb-8 shadow-[4px_4px_0px_#000] player-grid-card ${
                      isLeader ? 'border-brand-magenta player-01-card' : 'border-zinc-850 player-other-card'
                    }`}
                  >
                    
                    {/* Aligned Large Visual Numeric Badge so users clearly spot the player number (player 03 or player 02) */}
                    <div className="absolute right-4 top-2 select-none pointer-events-none">
                      <span className="font-urban text-7xl md:text-9xl text-zinc-900 tracking-tighter opacity-70 block font-outline">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Header line inside card - NOW CLICKABLE AS ACCORDION TRIGGER */}
                    <div 
                      className={`flex justify-between items-center ${isExpanded ? 'mb-6 pb-4 border-b border-zinc-900' : ''} relative z-10 cursor-pointer`}
                      onClick={() => setExpandedPlayer(isExpanded ? -1 : index)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-xs px-2.5 py-1 font-bold">
                          {playerNumString}
                        </span>
                        {isLeader ? (
                          <span className="relative inline-block bg-brand-magenta text-black font-urban text-[11px] px-3 py-1 tracking-tight italic font-black shadow-[2px_2px_0px_#000] rotate-[-1deg]">
                            TEAM LEADER
                          </span>
                        ) : (
                          <span className="relative inline-block bg-brand-green text-black font-urban text-[11px] px-3 py-1 tracking-tight uppercase font-black shadow-[2px_2px_0px_#000] rotate-[1deg]">
                            ACTIVE ROSTER
                          </span>
                        )}
                      </div>
                      <ChevronDown 
                        className={`w-6 h-6 text-brand-magenta transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {/* Inputs inside this specific player box */}
                          {/* Stacks to single column in mobile and formats cleanly in desktop */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 font-sans mt-4">
                            
                            {/* Name input */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-urban text-brand-magenta uppercase tracking-widest font-extrabold">
                                Student Name *
                              </label>
                              <input 
                                type="text"
                                value={player.name}
                                onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                                placeholder="FULL NAME"
                                className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${formErrors[`${errorPrefix}name`] ? 'border-brand-magenta' : 'border-black focus:border-brand-green'} outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                                autoComplete={isLeader ? "name" : "off"}
                                autoCapitalize="characters"
                              />
                              <AnimatedError error={formErrors[`${errorPrefix}name`]} className="text-[11px] text-brand-magenta font-mono" />
                            </div>

                            {/* Matric / Student ID input */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-urban text-brand-magenta uppercase tracking-widest font-extrabold">
                                Matrics Number *
                              </label>
                              <input 
                                type="text"
                                value={player.matricNo}
                                onChange={(e) => handlePlayerChange(index, "matricNo", e.target.value)}
                                placeholder="STUDENT ID"
                                className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${formErrors[`${errorPrefix}matricNo`] ? 'border-brand-magenta' : 'border-black focus:border-brand-green'} outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                                autoComplete="off"
                                autoCapitalize="characters"
                              />
                              <AnimatedError error={formErrors[`${errorPrefix}matricNo`]} className="text-[11px] text-brand-magenta font-mono" />
                            </div>

                            {/* ID / Passport input */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-urban text-brand-magenta uppercase tracking-widest font-extrabold">
                                ID/Passport Number *
                              </label>
                              <input 
                                type="text"
                                value={player.idPassport}
                                onChange={(e) => handlePlayerChange(index, "idPassport", e.target.value)}
                                placeholder="ID NO."
                                className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${formErrors[`${errorPrefix}idPassport`] ? 'border-brand-magenta' : 'border-black focus:border-brand-green'} outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                                autoComplete="off"
                                autoCapitalize="characters"
                              />
                              <AnimatedError error={formErrors[`${errorPrefix}idPassport`]} className="text-[11px] text-brand-magenta font-mono" />
                            </div>

                            {/* School Field */}
                            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
                              <label className="text-xs font-urban text-brand-magenta uppercase tracking-widest font-extrabold">
                                School / Faculty *
                              </label>
                              <input 
                                type="text"
                                value={player.school}
                                onChange={(e) => handlePlayerChange(index, "school", e.target.value)}
                                placeholder="SCHOOL FACULTY NAME"
                                className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${formErrors[`${errorPrefix}school`] ? 'border-brand-magenta' : 'border-black focus:border-brand-green'} outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                                autoComplete="organization"
                                autoCapitalize="characters"
                              />
                              <AnimatedError error={formErrors[`${errorPrefix}school`]} className="text-[11px] text-brand-magenta font-mono" />
                            </div>

                            {/* Contact Number */}
                            {isLeader && (
                              <div className="flex flex-col gap-1.5 md:col-span-2">
                                <label className="text-xs font-urban text-brand-green uppercase tracking-widest font-extrabold">
                                  Contact Number *
                                </label>
                                <input 
                                  type="tel"
                                  inputMode="tel"
                                  value={player.contactNumber || ""}
                                  onChange={(e) => handlePlayerChange(0, "contactNumber", e.target.value)}
                                  placeholder="+60..."
                                  className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${formErrors.p1_contactNumber ? 'border-brand-magenta' : 'border-black focus:border-brand-green'} outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                                  autoComplete="tel"
                                />
                                <AnimatedError error={formErrors.p1_contactNumber} className="text-[11px] text-brand-magenta font-mono" />
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}

            </div>

            {/* Submitting Trigger Button */}
            <div className="mt-14 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-end items-center gap-6">
              <span className="text-xs text-zinc-500 font-mono text-center sm:text-right max-w-xs">
                Make sure all Student IDs match real physical documents. Disqualification is absolute.
              </span>
              <button 
                type="submit"
                id="submit-roster-btn"
                className={`relative w-full sm:w-auto min-h-12 inline-flex items-center justify-center font-urban text-lg px-10 py-5 border-2 font-extrabold select-none transition-all cursor-pointer
                  ${isFormComplete 
                    ? 'bg-brand-green text-black border-black shadow-[6px_6px_0px_#ff00ff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#ff00ff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0px_#ff00ff]' 
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 shadow-[4px_4px_0px_#000] hover:bg-zinc-700'}`}
              >
                {isFormComplete ? "SUBMIT ROSTER" : `FILL ${15 - completedFields} MORE FIELDS`}
              </button>
            </div>

          </form>
          </div>

          {/* SENSATIONAL SUCCESS OUTPUT BANNER (Renders program registration payload inside the screen upon click success) */}
          {submittedData && (
            <div 
              id="success-panel" 
              className="mt-12 bg-zinc-950 border-4 border-brand-green p-6 md:p-10 shadow-[10px_10px_0px_#000] scroll-mt-24"
            >
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
                <CheckCircle2 className="w-8 h-8 text-brand-green shrink-0" />
                <div>
                  <h3 className="font-urban text-xl text-brand-green tracking-tight uppercase">REGISTRATION SECURED</h3>
                  <p className="text-zinc-400 text-xs font-mono uppercase">CS-HOOPERS SQUAD ROSTER LOGGED SUCCESSFULLY</p>
                </div>
              </div>

              <div className="p-4 bg-[#0A0A0A] border border-zinc-800 mb-6 rounded-none">
                <h4 className="text-xs font-stencil mb-2 text-brand-magenta tracking-widest uppercase">REGISTRATION PAYLOAD OUTPUT</h4>
                <pre className="text-xs text-brand-green font-mono overflow-x-auto max-h-60 p-2 whitespace-pre">
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#111] p-4 border-l-4 border-brand-magenta">
                <div className="text-xs text-zinc-400 font-sans">
                  <span className="font-bold text-white block">Next Objective:</span>
                  Save your student IDs, keep checking your leader's inbox, and train at UTM Court A. Live brackets drop shortly.
                </div>
                <button 
                  onClick={handleResetForm}
                  className="px-5 py-2 hover:bg-zinc-900 border border-zinc-700 hover:text-white text-zinc-400 text-xs uppercase font-urban shrink-0 transition-colors"
                >
                  Register Another Team
                </button>
              </div>
            </div>
          )}

        </div>
        <AnimatePresence>
          {showMobileSubmit && (
            <motion.div
              initial={{ y: 72, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 72, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t-2 px-4 py-3 backdrop-blur-sm ${isFormComplete ? 'border-brand-green' : 'border-zinc-800'}`}
            >
              <button
                type="submit"
                form="registration-inner-form"
                className={`w-full min-h-12 inline-flex items-center justify-center font-urban text-base border-2 font-extrabold active:translate-y-[2px] transition-all
                  ${isFormComplete 
                    ? 'bg-brand-green text-black border-black shadow-[4px_4px_0px_#ff00ff]' 
                    : 'bg-zinc-800 text-zinc-400 border-zinc-900 shadow-none'}`}
              >
                {isFormComplete ? "SUBMIT ROSTER" : `FILL ${15 - completedFields} MORE FIELDS`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ROAD STREET FAQ SECTION (Interactive pure React collapsible state driven) */}
      <section 
        id="faq-section" 
        className="py-24 px-4 md:px-8 bg-[#0A0A0A] relative z-20 max-w-4xl mx-auto"
      >
        <div className="mb-14 relative inline-block">
          <h2 className="font-urban text-4xl text-white uppercase italic tracking-tighter">
            STREET <span className="text-brand-green">FAQ</span>
          </h2>
          <div className="h-2 w-full bg-brand-green mt-2"></div>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-[#111111] border-4 border-zinc-800 transition-all hover:border-zinc-700"
              >
                {/* Accordion Trigger */}
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left flex justify-between items-center p-6 cursor-pointer font-marker text-lg md:text-xl text-white hover:text-brand-green transition-colors focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`w-6 h-6 text-brand-magenta transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Accordion Content */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-56 border-t border-zinc-900 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                >
                  <div className="p-6 text-sm md:text-base text-zinc-300 leading-relaxed font-sans font-medium">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] border-t-8 border-brand-green py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          
          <div className="text-center md:text-left">
            <h2 className="font-urban text-2xl text-white italic tracking-tighter uppercase">
              VARSITY <span className="text-brand-magenta">ARENA</span>
            </h2>
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-2">
              Championship system platform
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="font-stencil text-zinc-400 hover:text-brand-magenta uppercase tracking-wider text-xs transition-colors">Privacy</a>
            <a href="#" className="font-stencil text-zinc-400 hover:text-brand-magenta uppercase tracking-wider text-xs transition-colors">Terms</a>
            <a href="#" className="font-stencil text-zinc-400 hover:text-brand-magenta uppercase tracking-wider text-xs transition-colors">Rules</a>
            <a href="#" className="font-stencil text-zinc-400 hover:text-brand-magenta uppercase tracking-wider text-xs transition-colors">Support</a>
          </div>

          <div className="font-stencil text-xs text-zinc-500 tracking-widest text-center md:text-right">
            © 2026 VARSITY ARENA.<br />
            <span className="text-brand-green tracking-wide block font-urban text-[10px] mt-1">
              RAW. GRITTY. TECHNICAL.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
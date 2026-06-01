import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import AdminDashboard from "./components/AdminDashboard";
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
  contactNumber?: string; // Only for Player 01 (Team Leader)
  isOptional?: boolean; // For substitutes flaging
}

interface TeamRegistration {
  teamName: string;
  players: Player[];
}

const AnimatedError = ({
  error,
  className = "text-xs text-brand-magenta font-mono",
}: {
  error?: string;
  className?: string;
}) => {
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
    jitterY: 0,
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
      followerRef.current.style.opacity = "1";
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
      followerRef.current.style.opacity = "0";
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
          containerRef.current.style.setProperty(
            "--mouse-rel-x",
            s.relX.toString(),
          );
          containerRef.current.style.setProperty(
            "--mouse-rel-y",
            s.relY.toString(),
          );
          containerRef.current.style.setProperty(
            "--mouse-dist",
            s.dist.toString(),
          );
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

          glowRef.current.style.background =
            vel > 1.2
              ? "radial-gradient(circle, rgba(255,0,255,0.22) 0%, rgba(0,255,255,0.18) 72%)"
              : "radial-gradient(circle, rgba(0,255,255,0.25) 0%, rgba(255,0,255,0.15) 70%)";
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
      className="relative min-h-[90vh] flex flex-col justify-center items-center py-10 px-4 md:px-8 max-w-7xl mx-auto z-10 overflow-hidden introduction-section-interactive"
    >
      <div
        ref={followerRef}
        className="absolute pointer-events-none z-30 mix-blend-screen overflow-hidden"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%)",
          transition:
            "width 0.08s ease-out, height 0.08s ease-out, opacity 0.2s ease",
        }}
      >
        <div
          ref={glowRef}
          className="absolute rounded-full w-full h-full blur-2xl opacity-40 mix-blend-color-dodge transition-all duration-200"
        />
      </div>

      <div
        id="intro-status"
        className="inline-flex items-center gap-2 px-5 py-2 bg-black border-2 border-brand-green mb-8 rotate-[-1deg] hover:rotate-1 transition-transform pointer-events-none"
      >
        <span className="w-3 h-3 rounded-full bg-brand-green animate-ping"></span>
        <span className="font-stencil text-brand-green text-sm md:text-base tracking-widest">
          REGISTRATIONS OPEN
        </span>
      </div>

      <div className="text-center w-full max-w-5xl mb-12 relative z-20 px-2">
        <h1
          id="hero-title"
          ref={heroTitleRef}
          className="font-syne font-extrabold leading-none tracking-tighter italic cursor-default select-none uppercase"
          style={{
            transition: "transform 0.05s ease-out",
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
          The premier collegiate basketball tournament where data meets the
          asphalt. Assemble your squad, register your roster, and prepare for
          some low-cortisol streetball.
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
          <h3 className="font-urban text-lg text-white mb-2 tracking-wide uppercase">
            DATES
          </h3>
          <p className="stencil-text text-xl md:text-2xl text-brand-green font-bold">
            JUNE 13, 2026
          </p>
          <span className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">
            D-DAY
          </span>
        </div>

        <div
          id="card-venue"
          className="bg-gradient-to-br from-[#111111]/90 via-[#0a2315]/90 to-[#0A0A0A]/90 backdrop-blur-md border-4 border-brand-green p-8 flex flex-col items-center text-center transform rotate-[1.5deg] transition-all hover:rotate-0 hover:scale-105 shadow-[6px_6px_0px_#000]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-brand-green flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-brand-green" />
          </div>
          <h3 className="font-urban text-lg text-white mb-2 tracking-wide uppercase">
            VENUE
          </h3>
          <p className="stencil-text text-xl md:text-2xl text-brand-magenta font-bold">
            BAKTI FAJAR PERMAI
          </p>
          <span className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">
            BASKETBALL COURT
          </span>
        </div>

        <div
          id="card-prize"
          className="bg-gradient-to-br from-[#111111]/90 via-[#0d1c33]/90 to-[#0A0A0A]/90 backdrop-blur-md border-4 border-brand-magenta p-8 flex flex-col items-center text-center transform rotate-[-2deg] transition-all hover:rotate-0 hover:scale-105 shadow-[6px_6px_0px_#000]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border-2 border-brand-magenta flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-brand-magenta" />
          </div>
          <h3 className="font-urban text-lg text-white mb-2 tracking-wide uppercase">
            PRIZE
          </h3>
          <p className="stencil-text text-xl md:text-2xl text-brand-green font-bold">
            TO BE ANNOUNCED
          </p>
          <span className="text-xs text-zinc-500 font-mono mt-3 uppercase tracking-widest">
            💔🙏
          </span>
        </div>
      </div>
      {/* 1. SEPARATE HEADER CONTAINER */}
      <div className="relative z-20 w-full max-w-5xl mx-auto mt-8 mb-3 px-4 text-center">
        <span className="text-sm md:text-base text-zinc-300 font-mono uppercase tracking-widest font-black">
          Organized By
        </span>
      </div>

      {/* 2. THE TICKER CONTAINER */}
      <div className="relative z-20 w-full bg-zinc-100 border-y-4 border-brand-magenta overflow-hidden flex group">
        <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-zinc-100 to-transparent z-30 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-zinc-100 to-transparent z-30 pointer-events-none"></div>

        {/* 3. THE SCROLLING TRACK (No longer holds the animation class) */}
        <div className="flex items-center">
          {/* FIRST SET OF LOGOS (Animation applied directly here. flex-wrap removed) */}
          <div className="flex gap-x-6 md:gap-x-24 items-center gap-y-6 px-6 md:px-12 shrink-0 animate-marquee">
            <img
              src="/Asset-BHEPA.png"
              alt="BHEPA"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-USM.png"
              alt="USM"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-CS.png"
              alt="CS Society"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-MPPCS.png"
              alt="MPPCS"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-MDEC.png"
              alt="MDEC"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
          </div>

          {/* SECOND SET OF LOGOS (Animation applied directly here. flex-wrap removed) */}
          <div
            aria-hidden="true"
            className="flex gap-x-6 md:gap-x-24 items-center gap-y-6 px-6 md:px-12 shrink-0 animate-marquee"
          >
            <img
              src="/Asset-BHEPA.png"
              alt="BHEPA"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-USM.png"
              alt="USM"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-CS.png"
              alt="CS Society"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-MPPCS.png"
              alt="MPPCS"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
            <img
              src="/Asset-MDEC.png"
              alt="MDEC"
              className="h-[130px] md:h-[150px] w-auto object-contain shrink-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

export default function App() {
  // If the URL ends in /admin, hijack the render and show the dashboard instead
  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }
  const registrationSectionRef = useRef<HTMLElement>(null);
  const [showMobileSubmit, setShowMobileSubmit] = useState(false);
  const [expandedPlayer, setExpandedPlayer] = useState<number>(0);

  // The Security Lock
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for the Form
  const [formData, setFormData] = useState<TeamRegistration>({
    teamName: "",
    players: [
      {
        id: "p1",
        number: "PLAYER 01",
        role: "TEAM LEADER",
        name: "",
        matricNo: "",
        contactNumber: "",
      },
      {
        id: "p2",
        number: "PLAYER 02",
        role: "ACTIVE ROSTER",
        name: "",
        matricNo: "",
      },
      {
        id: "p3",
        number: "PLAYER 03",
        role: "ACTIVE ROSTER",
        name: "",
        matricNo: "",
      },
      {
        id: "p4",
        number: "PLAYER 04 (SUB)",
        role: "MANDATORY SUB",
        name: "",
        matricNo: "",
      },
      {
        id: "p5",
        number: "PLAYER 05 (SUB)",
        role: "OPTIONAL SUB",
        name: "",
        matricNo: "",
        isOptional: true,
      },
    ],
  });

  // Simple accordion state for FAQ
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form error notification state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Submit success state
  const [submittedData, setSubmittedData] = useState<TeamRegistration | null>(
    null,
  );

  // Input change handler for top level team details
  const handleTeamChange = (field: "teamName", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear field error on change
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Change handler for player inputs
  const handlePlayerChange = (
    playerIndex: number,
    field: keyof Player,
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedPlayers = [...prev.players] as Player[];
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        [field]: value,
      };
      return {
        ...prev,
        players: updatedPlayers,
      };
    });

    // Clear specific field errors
    const errorKey = `p${playerIndex + 1}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  // Form validation & submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. THE SHIELD: If it's already submitting, kill the function instantly
    if (isSubmitting) return;

    // 2. Engage the lock
    setIsSubmitting(true);

    const errors: Record<string, string> = {};

    // Validate Team info
    if (!formData.teamName.trim()) {
      errors.teamName = "Team Name is required";
    }

    // Validate players
    formData.players.forEach((player, idx) => {
      const i = idx + 1;
      const isSlotEmpty = !player.name.trim() && !player.matricNo.trim();

      if (player.isOptional && isSlotEmpty) {
        return;
      }

      if (!player.name.trim()) {
        errors[`p${i}_name`] = `Player 0${i} Name is required`;
      }
      if (!player.matricNo.trim()) {
        errors[`p${i}_matricNo`] = `Player 0${i} Matric/Student ID is required`;
      }
      if (idx === 0) {
        if (!player.contactNumber || !player.contactNumber.trim()) {
          errors.p1_contactNumber = "Team Leader Contact Number is required";
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const formElement = document.getElementById("registration-section");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
      // Disengage the lock so they can fix errors and try again
      setIsSubmitting(false);
      return;
    }

    setFormErrors({});

    try {
      const rosterPayload = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      const rostersCollection = collection(db, "rosters");
      const docRef = await addDoc(rostersCollection, rosterPayload);
      console.log("SUCCESSFUL REGISTRATION PAYLOAD LOCKED WITH ID:", docRef.id);

      // This triggers the Success Panel to show the team they just registered
      setSubmittedData(formData);

      // 🚨 THE AMNESIA PROTOCOL: WIPE THE FORM CLEAN 🚨
      // If you have an `initialFormData` constant at the top of your file, you can just do setFormData(initialFormData).
      // Otherwise, explicitly reset it like this:
      setFormData({
        teamName: "",
        players: [
          {
            id: "p1",
            number: "PLAYER 01",
            role: "TEAM LEADER",
            name: "",
            matricNo: "",
            contactNumber: "",
            isOptional: false,
          },
          {
            id: "p2",
            number: "PLAYER 02",
            role: "ACTIVE ROSTER",
            name: "",
            matricNo: "",
            isOptional: false,
          },
          {
            id: "p3",
            number: "PLAYER 03",
            role: "ACTIVE ROSTER",
            name: "",
            matricNo: "",
            isOptional: false,
          },
          {
            id: "p4",
            number: "PLAYER 04 (SUB)",
            role: "MANDATORY SUB",
            name: "",
            matricNo: "",
            isOptional: false,
          },
          {
            id: "p5",
            number: "PLAYER 05 (SUB)",
            role: "OPTIONAL SUB",
            name: "",
            matricNo: "",
            isOptional: true,
          },
        ],
      });

      setTimeout(() => {
        const successPanel = document.getElementById("success-panel");
        if (successPanel) {
          successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setIsSubmitting(false);
      }, 150);
    } catch (error) {
      console.error("CRITICAL DATABASE CONNECTION ERROR:", error);
      setFormErrors({
        submit:
          "Connection to the arena vault timed out. Please check your network connection.",
      });

      const formElement = document.getElementById("registration-section");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
      // Disengage the lock if Firebase fails so they can retry
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      teamName: "",
      players: [
        {
          id: "p1",
          number: "PLAYER 01",
          role: "TEAM LEADER",
          name: "",
          matricNo: "",
          contactNumber: "",
        },
        {
          id: "p2",
          number: "PLAYER 02",
          role: "ACTIVE ROSTER",
          name: "",
          matricNo: "",
        },
        {
          id: "p3",
          number: "PLAYER 03",
          role: "ACTIVE ROSTER",
          name: "",
          matricNo: "",
        },
        {
          id: "p4",
          number: "PLAYER 04 (SUB)",
          role: "MANDATORY SUB",
          name: "",
          matricNo: "",
        },
        {
          id: "p5",
          number: "PLAYER 05 (SUB)",
          role: "OPTIONAL SUB",
          name: "",
          matricNo: "",
          isOptional: true, // Crucial flag for the validation engine
        },
      ],
    });
    setSubmittedData(null);
    setFormErrors({});

    // Smoothly scroll the user back to the top of the registration section
    const formElement = document.getElementById("registration-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // FAQ mock data
  const faqs = [
    {
      question: "Who is eligible to join the tournament?",
      answer:
        "🎓 Only currently enrolled Computer Science students at USM are allowed to step onto the court and compete!",
    },
    {
      question: "What is the official dress code?",
      answer:
        "👕 You have total freedom to wear whatever you want to hoop in, as long as the attire stays modest and respectful!",
    },
    {
      question: "Where can I find the game schedule?",
      answer:
        "📅 The official match brackets and tip-off times will be dropped exclusively inside the registered players' Whatsapp group chat!",
    },
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
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const calculateFieldStatus = () => {
    let completed = 0;
    let target = 0;

    // 1. Base Team Info
    target += 1; // Team Name
    if (formData.teamName.trim()) completed++;

    // 2. Dynamic Player Info
    formData.players.forEach((p, idx) => {
      const isSlotEmpty = !p.name.trim() && !p.matricNo.trim();

      // If it's an optional sub and completely blank, it adds nothing to the target
      if (p.isOptional && isSlotEmpty) {
        return;
      }

      // Calculate how many fields this specific player SHOULD have
      let expectedForThisPlayer = 2; // Name, Matric
      if (idx === 0) expectedForThisPlayer = 3; // Leader has Contact Number

      target += expectedForThisPlayer; // Dynamically raise the required denominator

      // Tally the fields they actually filled out
      if (p.name.trim()) completed++;
      if (p.matricNo.trim()) completed++;
      if (idx === 0 && p.contactNumber?.trim()) completed++;
    });

    return { completed, target };
  };

  const { completed, target } = calculateFieldStatus();
  const isFormComplete = completed === target;
  const remainingFields = target - completed;
  return (
    <div
      id="app-root"
      className="bg-[#0A0A0A] text-white min-h-screen font-sans selection:bg-brand-green selection:text-black antialiased relative overflow-x-hidden"
    >
      {/* Gritty Street Overlays and Side Murals for exact visual similarity */}
      <div className="halftone-overlay pointer-events-none"></div>
      <div className="visual-noise pointer-events-none"></div>

      {/* Floating Street Spray Graffiti tags on desktop for visual energy */}
      <div className="hidden xl:block graffiti-tag top-[14%] left-[10%] rotate-[-12deg] text-brand-magenta select-none">
        SLAM
      </div>
      <div className="hidden xl:block graffiti-tag top-[44%] right-[8%] rotate-[14deg] text-brand-green select-none">
        DUNK
      </div>
      <div className="hidden xl:block graffiti-tag bottom-[25%] left-[6%] rotate-[-7deg] text-brand-cyan select-none">
        UTM
      </div>

      {/* Left and Right Side Gritty Athlete Murals on Large Desktops */}
      <div className="hidden lg:block mural-side mural-left animate-pulse duration-[8000ms]"></div>
      <div className="hidden lg:block mural-side mural-right animate-pulse duration-[8500ms]"></div>

      {/* FIXED TOP NAVIGATION BAR */}
      <nav
        id="top-navigation"
        className="bg-black/95 backdrop-blur-md sticky top-0 border-b-4 border-brand-magenta z-50"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          {/* Logo with Street Attitude */}
          <a
            href="#introduction-section"
            className="flex items-center gap-2 group relative"
          >
            <Flame className="w-8 h-8 text-brand-green animate-pulse" />
            <div
              className="font-urban text-lg md:text-2xl tracking-tighter text-brand-green italic leading-none"
              data-text="MPP_CS_CREW_USM"
            >
              CS Sports Day
              <span className="text-brand-magenta block text-xs md:text-sm tracking-widest font-bold">
                Hoopers Assemble!
              </span>
            </div>
          </a>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#introduction-section"
              className="font-marker text-lg text-brand-magenta hover:text-brand-green transition-colors tracking-widest"
            >
              INTRODUCTION
            </a>
            <a
              href="#registration-section"
              className="font-marker text-lg text-white hover:text-brand-magenta transition-colors tracking-widest"
            >
              REGISTRATION
            </a>
            <a
              href="#faq-section"
              className="font-marker text-lg text-white hover:text-brand-magenta transition-colors tracking-widest"
            >
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
        className="py-6 px-4 md:px-8 border-y-8 border-black bg-[#0A0A0A] relative z-20"
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
              Lock in your 3-member + 1 mandatory substitute and 1 optional
              substitute in the team. Finalize your roster for the 3v3 battle.
              Let's ball 🏀🏀
            </p>
          </div>

          {/* Verification Errors Banner */}
          <AnimatePresence initial={false}>
            {Object.keys(formErrors).length > 0 && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                  scale: 0.95,
                  marginBottom: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  scale: 1,
                  marginBottom: 32,
                }}
                exit={{ height: 0, opacity: 0, scale: 0.95, marginBottom: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div
                  id="error-alert"
                  className="p-6 bg-red-950/90 border-4 border-brand-magenta text-white shadow-[6px_6px_0px_#000] rotate-[-0.5deg]"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-brand-magenta shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-urban text-brand-magenta tracking-wider text-sm mb-2 uppercase">
                        ROSTER VERIFICATION FAILURE
                      </h4>
                      <p className="text-xs text-zinc-300 font-medium mb-3">
                        Your team submission lacks details. Please fill in all
                        required fields marked in the inputs:
                      </p>
                      <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 font-mono">
                        {Object.values(formErrors)
                          .slice(0, 5)
                          .map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        {Object.keys(formErrors).length > 5 && (
                          <li>
                            And {Object.keys(formErrors).length - 5} more roster
                            errors...
                          </li>
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
              <div
                id="team-identity-block"
                className="mb-12 w-full flex flex-col items-start"
              >
                {/* Tape Label - Left Aligned for sleek visual flow */}
                <div className="mb-6">
                  <div className="tape-label">TEAM NAME</div>
                </div>

                {/* Hero Input Container - Full width to match the roster box below */}
                <div className="w-full flex flex-col gap-4">
                  {/* The 'group' wrapper allows us to trigger effects on the background when the input is focused */}
                  <div className="relative group cursor-text w-full">
                    {/* The Dynamic Brutalist Shadow (Tighter on mobile, identical on desktop) */}
                    <div
                      className={`absolute inset-0 translate-x-1.5 translate-y-1.5 md:translate-x-3 md:translate-y-3 transition-all duration-300 ease-out ${
                        formErrors.teamName
                          ? "bg-brand-magenta"
                          : "bg-brand-magenta group-focus-within:bg-cyan-400 group-focus-within:translate-x-2.5 group-focus-within:translate-y-2.5 md:group-focus-within:translate-x-5 md:group-focus-within:translate-y-5"
                      }`}
                    ></div>

                    {/* The Actual Input Field - Scaled down for mobile, untouched for desktop */}
                    <textarea
                      rows={1}
                      className={`
                        relative z-10 w-full bg-[#0a0a0a] text-white text-left
                        placeholder-zinc-800 font-urban text-lg md:text-4xl py-3 px-4 md:py-1 md:px-6
                        border-4 ${
                          formErrors.teamName
                            ? "border-brand-magenta"
                            : "border-zinc-800 focus:border-cyan-400"
                        }
                        outline-none transition-colors duration-300
                        uppercase tracking-[0.1em] md:tracking-[0.2em] font-black skew-x-[-2deg]
                        focus:shadow-[0_0_30px_rgba(0,255,255,0.2)]
                        resize-none overflow-hidden leading-normal min-h-[52px] md:min-h-[80px]
                      `}
                      value={formData.teamName}
                      onChange={(e) => {
                        // 1. Send the cleaned value to state (no newlines allowed)
                        handleTeamChange(
                          "teamName",
                          e.target.value.replace(/\n/g, ""),
                        );

                        // 2. Auto-expand magic: Reset height, then snap to new scroll height
                        e.target.style.height = "60px";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      placeholder="CS BALLERS"
                      name="teamName"
                      autoComplete="organization"
                      autoCapitalize="characters"
                    />
                  </div>

                  {/* Error message aligned to the left under the input */}
                  <div className="flex justify-start mt-1">
                    <AnimatedError error={formErrors.teamName} />
                  </div>
                </div>
              </div>

              {/* --- SQUAD ROSTER SECTION HEADER --- */}
              <div className="w-full flex flex-col items-start mt-8 mb-8">
                {/* Reusing the tape-label to perfectly match the website's aesthetic */}
                <div className="mb-5">
                  <div className="tape-label">TEAM ROSTER</div>
                </div>

                {/* Sleek, minimal requirement tags replacing the old bulky green box */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-cyan-400 font-mono text-[10px] md:text-xs tracking-[0.1em] uppercase border border-cyan-400/30 px-2.5 py-1 bg-cyan-400/10 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                    03 Players + 1 Sub Required
                  </span>
                  <span className="text-zinc-500 font-mono text-[10px] md:text-xs tracking-widest uppercase">
                    Status: Locked_3v3
                  </span>
                </div>
              </div>
              {/* ----------------------------------- */}

              {/* TEAM ROSTER MODULE */}
              <div id="roster-players-block" className="space-y-12">
                {/* Player Iteration */}
                {formData.players.map((player, index) => {
                  const playerNumString = player.number; // e.g. "PLAYER 01"
                  const errorPrefix = `p${index + 1}_`;
                  const isLeader = index === 0;
                  const isExpanded = expandedPlayer === index;

                  return (
                    <div
                      key={player.id}
                      className={`p-4 md:p-8 border-4 bg-[#0a0a0a]/90 relative overflow-hidden mb-8 player-grid-card transition-all duration-300 ${
                        isLeader
                          ? "border-brand-magenta shadow-[4px_4px_0px_#ff00ff] player-01-card"
                          : player.isOptional
                            ? isExpanded
                              ? "border-[#00ffff] border-dashed shadow-[0_0_20px_rgba(0,255,255,0.5),inset_0_0_15px_rgba(0,255,255,0.2)]" // Added inner and outer pure cyan glow
                              : "border-zinc-800 border-dashed shadow-[4px_4px_0px_#27272a]"
                            : "border-zinc-850 shadow-[4px_4px_0px_#000] player-other-card"
                      }`}
                    >
                      {/* Aligned Large Visual Numeric Badge */}
                      <div className="absolute right-4 top-2 select-none pointer-events-none">
                        <span
                          className={`font-urban text-7xl md:text-9xl tracking-tighter block transition-all duration-300 ${
                            isExpanded && player.isOptional
                              ? "text-transparent [-webkit-text-stroke:3px_#00ffff] opacity-100 drop-shadow-[0_0_25px_rgba(0,255,255,0.9)]"
                              : "font-outline text-zinc-900 opacity-70"
                          }`}
                        >
                          0{index + 1}
                        </span>
                      </div>

                      {/* Header line inside card - NOW CLICKABLE AS ACCORDION TRIGGER */}
                      <div
                        className={`flex justify-between items-center ${
                          isExpanded ? "mb-6 pb-4 border-b border-zinc-900" : ""
                        } relative z-10 cursor-pointer`}
                        onClick={() =>
                          setExpandedPlayer(isExpanded ? -1 : index)
                        }
                      >
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono text-xs px-2.5 py-1 font-bold">
                            {playerNumString}
                          </span>

                          {/* DYNAMIC ROLE BADGE */}
                          <span
                            className={`relative inline-block text-black font-urban text-[11px] px-3 py-1 tracking-tight uppercase font-black shadow-[2px_2px_0px_#000] ${
                              isLeader
                                ? "bg-brand-magenta italic rotate-[-1deg]"
                                : player.isOptional
                                  ? "bg-cyan-400 rotate-[1deg]" // Cyan badge to match the new glow
                                  : "bg-brand-green rotate-[1deg]"
                            }`}
                          >
                            {player.role}
                          </span>

                          {/* EXTRA VISUAL CUE FOR OPTIONAL PLAYER */}
                          {player.isOptional && (
                            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase border border-zinc-800 px-2 py-0.5">
                              Leave Blank to Skip
                            </span>
                          )}
                        </div>

                        <ChevronDown
                          className={`w-6 h-6 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          } ${player.isOptional ? "text-cyan-400" : "text-brand-magenta"}`}
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
                            {/* Adjusted grid layout to perfectly balance 2 columns instead of 3 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 font-sans mt-4">
                              {/* Name input */}
                              <div className="flex flex-col gap-1.5">
                                <label
                                  className={`text-xs font-urban uppercase tracking-widest font-extrabold flex justify-between ${player.isOptional ? "text-cyan-400" : "text-brand-magenta"}`}
                                >
                                  Student Name
                                </label>
                                <input
                                  type="text"
                                  value={player.name}
                                  onChange={(e) =>
                                    handlePlayerChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="FULL NAME"
                                  className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${
                                    formErrors[`${errorPrefix}name`]
                                      ? "border-brand-magenta"
                                      : `border-black focus:${player.isOptional ? "border-cyan-400" : "border-brand-green"}`
                                  } outline-none focus:ring-4 ${player.isOptional ? "focus:ring-cyan-400/30" : "focus:ring-brand-green/30"} text-sm skew-x-[-0.5deg] uppercase`}
                                  autoComplete={isLeader ? "name" : "off"}
                                  autoCapitalize="characters"
                                />
                                <AnimatedError
                                  error={formErrors[`${errorPrefix}name`]}
                                  className="text-[11px] text-brand-magenta font-mono"
                                />
                              </div>

                              {/* Matric / Student ID input */}
                              <div className="flex flex-col gap-1.5">
                                <label
                                  className={`text-xs font-urban uppercase tracking-widest font-extrabold ${player.isOptional ? "text-cyan-400" : "text-brand-magenta"}`}
                                >
                                  Matrics Number
                                </label>
                                <input
                                  type="text"
                                  value={player.matricNo}
                                  onChange={(e) =>
                                    handlePlayerChange(
                                      index,
                                      "matricNo",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="243******"
                                  className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${
                                    formErrors[`${errorPrefix}matricNo`]
                                      ? "border-brand-magenta"
                                      : `border-black focus:${player.isOptional ? "border-cyan-400" : "border-brand-green"}`
                                  } outline-none focus:ring-4 ${player.isOptional ? "focus:ring-cyan-400/30" : "focus:ring-brand-green/30"} text-sm skew-x-[-0.5deg] uppercase`}
                                  autoComplete="off"
                                  autoCapitalize="characters"
                                />
                                <AnimatedError
                                  error={formErrors[`${errorPrefix}matricNo`]}
                                  className="text-[11px] text-brand-magenta font-mono"
                                />
                              </div>

                              {/* Contact Number (Leader Only) */}
                              {isLeader && (
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                  <label className="text-xs font-urban text-brand-green uppercase tracking-widest font-extrabold">
                                    Contact Number
                                  </label>
                                  <input
                                    type="tel"
                                    inputMode="tel"
                                    value={player.contactNumber || ""}
                                    onChange={(e) =>
                                      handlePlayerChange(
                                        0,
                                        "contactNumber",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="+60123456789"
                                    className={`w-full bg-white text-black placeholder-zinc-400 font-mono py-3.5 px-4 border-2 ${
                                      formErrors.p1_contactNumber
                                        ? "border-brand-magenta"
                                        : "border-black focus:border-brand-green"
                                    } outline-none focus:ring-4 focus:ring-brand-green/30 text-sm skew-x-[-0.5deg] uppercase`}
                                    autoComplete="tel"
                                  />
                                  <AnimatedError
                                    error={formErrors.p1_contactNumber}
                                    className="text-[11px] text-brand-magenta font-mono"
                                  />
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
                  Make sure all Student IDs match real physical documents.
                  Jangan Tipu" bro💔💔
                </span>
                <button
                  type="submit"
                  id="submit-roster-btn"
                  disabled={isSubmitting || !isFormComplete}
                  className={`relative w-full sm:w-auto min-h-12 inline-flex items-center justify-center font-urban text-lg px-10 py-5 border-2 font-extrabold select-none transition-all
                  ${
                    isSubmitting
                      ? "bg-zinc-700 text-zinc-400 border-zinc-800 shadow-none cursor-wait"
                      : isFormComplete
                        ? "bg-brand-green text-black border-black shadow-[6px_6px_0px_#ff00ff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#ff00ff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[3px_3px_0px_#ff00ff] cursor-pointer"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 shadow-[4px_4px_0px_#000] cursor-not-allowed"
                  }`}
                >
                  {isSubmitting
                    ? "SUBMITTING PAYLOAD..."
                    : isFormComplete
                      ? "SUBMIT ROSTER"
                      : `FILL ${remainingFields} MORE FIELDS`}
                </button>
              </div>
            </form>
          </div>

          {/* SENSATIONAL SUCCESS OUTPUT BANNER (Renders program registration payload inside the screen upon click success) */}
          {submittedData && (
            <div
              id="success-panel"
              className="mt-12 bg-[#0A0A0A] border-4 border-brand-green p-6 md:p-10 shadow-[10px_10px_0px_#000] scroll-mt-24 relative overflow-hidden"
            >
              {/* Decorative background watermark */}
              <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none select-none">
                <span className="text-9xl font-black font-stencil">3v3</span>
              </div>

              <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-zinc-800 relative z-10">
                <CheckCircle2 className="w-10 h-10 text-brand-green shrink-0" />
                <div>
                  <h3 className="font-urban text-2xl text-brand-green tracking-tight uppercase font-black">
                    ARENA ACCESS GRANTED
                  </h3>
                  <p className="text-zinc-400 text-sm font-mono uppercase tracking-wider">
                    OFFICIAL SQUAD ROSTER LOCKED IN
                  </p>
                </div>
              </div>

              {/* Stylized Roster Ticket instead of JSON */}
              <div className="bg-[#111] border-2 border-brand-magenta p-6 mb-8 relative z-10">
                <h4 className="text-sm font-mono mb-1 text-brand-magenta tracking-widest uppercase">
                  Squad Designation
                </h4>
                <h2 className="text-4xl sm:text-5xl font-black font-stencil text-white uppercase mb-6 tracking-wide break-words">
                  {submittedData.teamName}
                </h2>

                <div className="space-y-4">
                  {submittedData.players.map((player, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-zinc-800 pb-2"
                    >
                      <div className="font-mono text-xs text-zinc-500 uppercase mb-1 sm:mb-0">
                        {index === 0
                          ? "TEAM LEADER (01)"
                          : `ROSTER PLAYER (0${index + 1})`}
                      </div>
                      <div className="font-urban text-xl text-white uppercase font-bold tracking-wide">
                        {player.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Objective Block */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-[#111] p-5 border-l-4 border-brand-green relative z-10">
                <div className="text-sm text-zinc-400 font-sans">
                  <span className="font-black text-brand-green block mb-1 uppercase tracking-wider text-base">
                    Next Objective:
                  </span>
                  Santai, minum Teh Tarik and lets ball soon🏀🏀🏀🏀.
                </div>
                <button
                  onClick={handleResetForm}
                  className="px-6 py-4 bg-zinc-900 border-2 border-zinc-700 hover:border-brand-magenta hover:text-brand-magenta text-white text-xs uppercase font-black font-urban shrink-0 transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#ff00ff]"
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
              className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t-2 px-4 py-3 backdrop-blur-sm ${
                isFormComplete && !isSubmitting
                  ? "border-brand-green"
                  : "border-zinc-800"
              }`}
            >
              <button
                type="submit"
                form="registration-inner-form"
                disabled={isSubmitting || !isFormComplete}
                className={`w-full min-h-12 inline-flex items-center justify-center font-urban text-base border-2 font-extrabold transition-all
                  ${
                    isSubmitting
                      ? "bg-zinc-700 text-zinc-400 border-zinc-800 shadow-none cursor-wait"
                      : isFormComplete
                        ? "bg-brand-green text-black border-black shadow-[4px_4px_0px_#ff00ff] active:translate-y-[2px]"
                        : "bg-zinc-800 text-zinc-400 border-zinc-900 shadow-none cursor-not-allowed"
                  }`}
              >
                {isSubmitting
                  ? "SUBMITTING..."
                  : isFormComplete
                    ? "SUBMIT ROSTER"
                    : `FILL ${remainingFields} MORE FIELDS`}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ROAD STREET FAQ SECTION (Interactive pure React collapsible state driven) */}
      <section
        id="faq-section"
        className="py-6 px-4 md:px-8 bg-[#0A0A0A] relative z-20 max-w-4xl mx-auto"
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
                    className={`w-6 h-6 text-brand-magenta transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Accordion Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-56 border-t border-zinc-900 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
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
              CS <span className="text-brand-magenta">Sports Day</span>
            </h2>
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-2">
              3v3 Basketball Tournament
            </p>
          </div>

          <div className="font-stencil text-xs text-zinc-500 tracking-widest text-center md:text-right">
            © 2026 MPP CS CREW.
            <br />
            <span className="text-brand-green tracking-wide block font-urban text-[10px] mt-1">
              LETS GO BALLIN🏀🏀
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

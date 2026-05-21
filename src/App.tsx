import { useState, useRef, SyntheticEvent } from 'react';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Info, 
  Phone, 
  IdCard, 
  School, 
  Award, 
  Check, 
  X,
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';

// Rigid Player Types as requested
interface Player01 {
  studentName: string;
  matricNumber: string;
  idPassportNumber: string;
  contactNumber: string; // Required for Team Leader
}

interface PlayerStandard {
  studentName: string;
  matricNumber: string;
  idPassportNumber: string;
}

// Rigid state array consisting of Player01 and standard PlayerStandard objects
type PlayersState = [Player01, PlayerStandard, PlayerStandard];

interface TeamRegistrationPayload {
  teamName: string;
  school: string;
  players: PlayersState;
  submittedAt: string;
}

export default function App() {
  // Navigation elements for active indicators
  const [activeTab, setActiveTab] = useState<'intro' | 'register' | 'faq'>('intro');

  // Accordion faq active indexes
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Rigid form state management meeting absolute specifications
  const [teamName, setTeamName] = useState('');
  const [school, setSchool] = useState('');
  
  const [players, setPlayers] = useState<PlayersState>([
    { studentName: '', matricNumber: '', idPassportNumber: '', contactNumber: '' }, // Player 01 (Team Leader)
    { studentName: '', matricNumber: '', idPassportNumber: '' },                   // Player 02
    { studentName: '', matricNumber: '', idPassportNumber: '' }                    // Player 03
  ]);

  // Submission validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loggedPayload, setLoggedPayload] = useState<TeamRegistrationPayload | null>(null);

  // Smooth-scrolling handler
  const scrollToSection = (id: string, tab: 'intro' | 'register' | 'faq') => {
    setActiveTab(tab);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // State update handlers for nested array
  const handlePlayer01Change = (field: keyof Player01, value: string) => {
    setPlayers(prev => {
      const updated = [...prev] as PlayersState;
      updated[0] = {
        ...updated[0],
        [field]: value
      };
      return updated;
    });
    // Clear field-specific error
    if (errors[`player01-${field}`]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[`player01-${field}`];
        return copy;
      });
    }
  };

  const handlePlayerStandardChange = (index: 1 | 2, field: keyof PlayerStandard, value: string) => {
    setPlayers(prev => {
      const updated = [...prev] as PlayersState;
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
    // Clear field-specific error
    if (errors[`player${index + 1}-${field}`]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[`player${index + 1}-${field}`];
        return copy;
      });
    }
  };

  // Form submission logic with precise local logging
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    
    // Robust local validation checks
    const newErrors: { [key: string]: string } = {};

    if (!teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!school.trim()) newErrors.school = 'School or Faculty name is required';

    // Player 01 Validation
    if (!players[0].studentName.trim()) newErrors['player01-studentName'] = 'Student name is required';
    if (!players[0].matricNumber.trim()) newErrors['player01-matricNumber'] = 'Matric number is required';
    if (!players[0].idPassportNumber.trim()) newErrors['player01-idPassportNumber'] = 'ID/Passport number is required';
    if (!players[0].contactNumber.trim()) newErrors['player01-contactNumber'] = 'Contact number is required for Team Leader';

    // Player 02 Validation
    if (!players[1].studentName.trim()) newErrors['player02-studentName'] = 'Student name is required';
    if (!players[1].matricNumber.trim()) newErrors['player02-matricNumber'] = 'Matric number is required';
    if (!players[1].idPassportNumber.trim()) newErrors['player02-idPassportNumber'] = 'ID/Passport number is required';

    // Player 03 Validation
    if (!players[2].studentName.trim()) newErrors['player03-studentName'] = 'Student name is required';
    if (!players[2].matricNumber.trim()) newErrors['player03-matricNumber'] = 'Matric number is required';
    if (!players[2].idPassportNumber.trim()) newErrors['player03-idPassportNumber'] = 'ID/Passport number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to the first error item or general registration container
      const regSection = document.getElementById('registration');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Prepare Payload
    const payload: TeamRegistrationPayload = {
      teamName: teamName.trim(),
      school: school.trim(),
      players: [
        {
          studentName: players[0].studentName.trim(),
          matricNumber: players[0].matricNumber.trim(),
          idPassportNumber: players[0].idPassportNumber.trim(),
          contactNumber: players[0].contactNumber.trim()
        },
        {
          studentName: players[1].studentName.trim(),
          matricNumber: players[1].matricNumber.trim(),
          idPassportNumber: players[1].idPassportNumber.trim()
        },
        {
          studentName: players[2].studentName.trim(),
          matricNumber: players[2].matricNumber.trim(),
          idPassportNumber: players[2].idPassportNumber.trim()
        }
      ],
      submittedAt: new Date().toISOString()
    };

    // Rigorously fulfill: "Log the final JSON payload to the console when 'SUBMIT ROSTER' is clicked."
    console.log('CS-HOOPERS ROSTER SUBMISSION PAYLOAD:', JSON.stringify(payload, null, 2));

    setLoggedPayload(payload);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setTeamName('');
    setSchool('');
    setPlayers([
      { studentName: '', matricNumber: '', idPassportNumber: '', contactNumber: '' },
      { studentName: '', matricNumber: '', idPassportNumber: '' },
      { studentName: '', matricNumber: '', idPassportNumber: '' }
    ]);
    setErrors({});
    setIsSubmitted(false);
    setLoggedPayload(null);
  };

  // FAQ mock database
  const faqData = [
    {
      question: "Who is eligible to participate?",
      answer: "The tournament is strictly open to active undergrad and postgrad college students. A valid student ID card or matric registration document must be presented during live on-court check-in at the Varsity Arena."
    },
    {
      question: "What are the uniform requirements?",
      answer: "Teams must sport matching athletic standard jerseys or t-shirts with clearly visible distinct back numbers. In the event of color conflicts on court, high-contrast tournament bibs will be supplied by our technical court committee."
    },
    {
      question: "How is scheduling handled?",
      answer: "The university tournament uses a strict double-elimination knockout bracket architecture. Final time schedules and court numbers will be published on our boards exactly 3 days prior. All players on the roster must check in at court control 30 minutes before tip-off."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-bg text-[#e5e2e1] overflow-x-hidden font-sans selection:bg-brand-primary selection:text-black">
      
      {/* GLOBAL SYSTEM ANNOUNCEMENT HEADER ACCORDING TO ATHLETIC SCOREBOARD MOOD */}
      <div className="bg-brand-primary/10 border-b border-brand-primary/20 text-center py-2 px-4 text-xs font-mono tracking-wider flex items-center justify-center gap-2">
        <span className="inline-block w-2 bg-brand-primary animate-ping" style={{ height: '8px', width: '8px' }}></span>
        <span className="text-brand-primary uppercase font-bold text-[10px] md:text-xs">SYSTEM STATUS: ROSTERS UNLOCKED • REGISTER TODAY</span>
      </div>

      {/* STICKY GLASSMORPHIC HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-bg/80 border-b border-[#2A2A2A]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('introduction', 'intro')}
          >
            <div className="border-l-4 border-brand-primary pl-2 py-1">
              <span className="font-display text-xl md:text-2xl font-extrabold tracking-widest text-[#e5e2e1]">
                VARSITY<span className="text-brand-primary">ARENA</span>
              </span>
            </div>
          </div>

          {/* Navigation Links with Smooth Scroll */}
          <nav className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => scrollToSection('introduction', 'intro')}
              className={`font-display text-sm tracking-widest font-bold transition-all relative py-2 uppercase rounded-none ${
                activeTab === 'intro' ? 'text-brand-primary' : 'text-[#e5e2e1] hover:text-brand-primary'
              }`}
            >
              INTRODUCTION
              {activeTab === 'intro' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary"></span>
              )}
            </button>
            <button 
              onClick={() => scrollToSection('registration', 'register')}
              className={`font-display text-sm tracking-widest font-bold transition-all relative py-2 uppercase rounded-none ${
                activeTab === 'register' ? 'text-brand-primary' : 'text-[#e5e2e1] hover:text-brand-primary'
              }`}
            >
              REGISTRATION
              {activeTab === 'register' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary"></span>
              )}
            </button>
            <button 
              onClick={() => scrollToSection('faq', 'faq')}
              className={`font-display text-sm tracking-widest font-bold transition-all relative py-2 uppercase rounded-none ${
                activeTab === 'faq' ? 'text-brand-primary' : 'text-[#e5e2e1] hover:text-brand-primary'
              }`}
            >
              FAQ
              {activeTab === 'faq' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary"></span>
              )}
            </button>
          </nav>

          {/* Action button */}
          <button 
            type="button"
            onClick={() => scrollToSection('registration', 'register')}
            className="bg-brand-primary text-black font-display font-black text-xs md:text-sm tracking-widest py-3 px-6 rounded-none border border-brand-primary hover:bg-transparent hover:text-brand-primary transition-all duration-300 transform active:scale-95"
          >
            REGISTER NOW
          </button>
        </div>
      </header>

      {/* HERO / HEADER SECTION */}
      <section id="introduction" className="relative border-b border-[#2A2A2A] min-h-[90vh] flex flex-col justify-center">
        {/* Absolute Background with dark Overlay & High-contrast Unsplash Photo */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=1920" 
            alt="Varsity Arena Dark Moody Basketball Hoop" 
            className="w-full h-full object-cover object-bottom filter brightness-[0.25] contrast-[1.1]"
            referrerPolicy="no-referrer"
          />
          {/* Kinetic gradients and dark vignettes protecting readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-[#0A0A0A]/70 to-[#0A0A0A]/90 z-10"></div>
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-brand-primary/10 to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-brand-secondary/5 to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Hero Interactive Area */}
        <div className="relative max-w-[1280px] mx-auto px-4 md:px-16 py-16 z-20 w-full flex-grow flex flex-col justify-center">
          
          {/* Active status badge */}
          <div className="self-start mb-6">
            <div className="inline-flex items-center gap-2 border border-brand-secondary/30 bg-brand-secondary/10 px-4 py-1.5 rounded-none">
              <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></span>
              <span className="font-mono text-[10px] md:text-xs text-brand-secondary uppercase tracking-widest font-black">
                REGISTRATIONS OPEN
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-7xl font-black text-[#e5e2e1] leading-tight md:leading-none tracking-tight uppercase max-w-4xl mb-6">
            CS-HOOPERS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-primary-dim">UNIVERSITY TOURNAMENT</span>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-[#c8c6c5] text-base md:text-lg max-w-2xl leading-relaxed mb-12">
            The premier collegiate basketball tournament where data meets the court. 
            Assemble your squad, register your roster, and prepare for high-stakes competition. 
            Experience elite 3v3 gameplay tracked with precision analytics.
          </p>

          {/* Three Tournament Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            
            {/* Card 01 - Tournament Dates */}
            <div className="bg-[#1C1B1B] border border-[#2A2A2A] rounded-none p-6 relative group hover:border-brand-primary/50 transition-all duration-300">
              <div className="absolute top-0 left-0 h-[3px] w-12 bg-brand-primary group-hover:w-full transition-all duration-300"></div>
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-brand-primary/10 p-3 text-brand-primary rounded-none">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#e5e2e1] uppercase tracking-wider">Tournament Dates</h3>
                  <p className="font-mono text-xs text-brand-primary">OCT 15 - 20, 2026</p>
                </div>
              </div>
            </div>

            {/* Card 02 - Venue */}
            <div className="bg-[#1C1B1B] border border-[#2A2A2A] rounded-none p-6 relative group hover:border-brand-secondary/50 transition-all duration-300">
              <div className="absolute top-0 left-0 h-[3px] w-12 bg-brand-secondary group-hover:w-full transition-all duration-300"></div>
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-brand-secondary/10 p-3 text-brand-secondary rounded-none">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#e5e2e1] uppercase tracking-wider">Venue</h3>
                  <p className="font-sans text-xs text-stone-300">Main Varsity Arena</p>
                </div>
              </div>
            </div>

            {/* Card 03 - Prize Pool */}
            <div className="bg-[#1C1B1B] border border-[#2A2A2A] rounded-none p-6 relative group hover:border-brand-primary/50 transition-all duration-300">
              <div className="absolute top-0 left-0 h-[3px] w-12 bg-brand-primary group-hover:w-full transition-all duration-300"></div>
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-brand-primary/10 p-3 text-brand-primary rounded-none">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#e5e2e1] uppercase tracking-wider">Prize Pool</h3>
                  <p className="font-mono text-xs text-brand-primary font-bold">$5,000 + Championship Rings</p>
                </div>
              </div>
            </div>

          </div>

          {/* Quick CTA back down to registration link */}
          <div className="mt-12">
            <button 
              onClick={() => scrollToSection('registration', 'register')}
              className="inline-flex items-center gap-3 border-b-2 border-brand-primary pb-1 text-sm font-bold tracking-widest text-[#e5e2e1] hover:text-brand-primary hover:border-brand-primary-dim transition-all uppercase"
            >
              Enter Roster details immediately <span className="animate-bounce">↓</span>
            </button>
          </div>

        </div>
      </section>

      {/* REGISTRATION SECTION */}
      <section id="registration" className="py-24 border-b border-[#2A2A2A] bg-brand-bg relative">
        <div className="absolute top-10 right-10 opacity-5 pointer-events-none select-none z-0 hidden lg:block">
          <span className="font-display text-[220px] font-black leading-none text-[#ffffff]">COURT</span>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-16 relative z-10">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block p-1 bg-brand-primary/10 text-brand-primary mb-3">
              <Award className="w-6 h-6 mx-auto" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white uppercase mb-4">
              ENTER THE ARENA
            </h2>
            <div className="h-[2px] w-20 bg-brand-primary mx-auto mb-4"></div>
            <p className="font-sans text-[#c8c6c5] text-sm md:text-base">
              Lock in your 3-member team. Finalize your roster for the 3v3 battle. Prepare for tip-off.
            </p>
          </div>

          {/* FORM AREA / SUBMIT SUCCESS WRAPPERS */}
          {isSubmitted && loggedPayload ? (
            
            // Submited Status View
            <div className="max-w-4xl mx-auto bg-[#1C1B1B] border-2 border-brand-secondary rounded-none p-8 md:p-12 transition-all">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-brand-secondary/10 flex items-center justify-center border border-brand-secondary/30 mb-6">
                  <CheckCircle2 className="w-12 h-12 text-brand-secondary animate-pulse" />
                </div>
                <h3 className="font-display text-3xl font-black text-white uppercase tracking-tight">Roster Locked & Saved</h3>
                <p className="text-brand-secondary font-mono text-xs tracking-wider uppercase mt-2">ROSTER RECEIVED SECURELY AT VARSITY CONTROL</p>
                <p className="text-[#c8c6c5] text-xs max-w-md mt-4">
                  The roster submission below has been successfully evaluated and logged to the central console. Ensure your team brings Student ID credentials on tournament check-in day.
                </p>
              </div>

              {/* Saved details rendering */}
              <div className="border border-[#2a2a2a] bg-[#0E0E0E] p-6 mb-8 select-all">
                <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3 mb-4">
                  <span className="font-mono text-xs text-stone-500">JSON STATE PAYLOAD PREVIEW</span>
                  <span className="font-mono text-[10px] bg-brand-secondary/15 text-brand-secondary px-2 py-0.5 uppercase tracking-widest font-bold">CLIENT STATE</span>
                </div>
                <pre className="text-xs text-brand-secondary font-mono overflow-x-auto p-2 bg-[#0A0A0A] max-h-80 border border-[#1a1a1a]">
                  {JSON.stringify(loggedPayload, null, 2)}
                </pre>
              </div>

              {/* Roster visual summary check */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#131313] p-4 border border-[#2a2a2a]">
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-2">Team Parameters</h4>
                  <div className="space-y-1 text-xs">
                    <p><span className="text-stone-500">TEAM NAME:</span> <span className="text-[#e5e2e1] font-bold">{loggedPayload.teamName}</span></p>
                    <p><span className="text-stone-500">UNIVERSITY:</span> <span className="text-[#e5e2e1] font-bold">{loggedPayload.school}</span></p>
                  </div>
                </div>
                <div className="bg-[#131313] p-4 border border-[#2a2a2a]">
                  <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-2">Players Loaded</h4>
                  <ul className="text-xs space-y-1 text-stone-300">
                    <li>01 (Leader): <span className="text-brand-primary">{loggedPayload.players[0].studentName}</span> • Matric {loggedPayload.players[0].matricNumber}</li>
                    <li>02: <span className="text-brand-secondary">{loggedPayload.players[1].studentName}</span> • Matric {loggedPayload.players[1].matricNumber}</li>
                    <li>03: <span className="text-brand-secondary">{loggedPayload.players[2].studentName}</span> • Matric {loggedPayload.players[2].matricNumber}</li>
                  </ul>
                </div>
              </div>

              {/* Reset roster option */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="bg-brand-primary text-black font-display font-black text-sm tracking-widest py-4 px-8 rounded-none border border-brand-primary hover:bg-transparent hover:text-brand-primary transition-all uppercase"
                >
                  REGISTER A NEW SQUAD
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq', 'faq')}
                  className="bg-stone-800 text-white font-display font-black text-sm tracking-widest py-4 px-8 rounded-none border border-stone-700 hover:bg-transparent hover:text-white hover:border-white transition-all uppercase"
                >
                  VIEW RULES & FAQ
                </button>
              </div>
            </div>

          ) : (

            // Registration Form
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#131313] border border-[#2A2A2A] rounded-none p-6 md:p-10 relative">
              
              {/* Decorative side outline bars for technical feel */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-primary"></div>

              {/* Section 1: Team Identity */}
              <div className="mb-10">
                <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-3 mb-6">
                  <School className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                    TEAM IDENTITY
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Team Name Input */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-widest text-[#aa897f] uppercase mb-2">
                      TEAM NAME <span className="text-brand-primary">*</span>
                    </label>
                    <input 
                      type="text"
                      value={teamName}
                      onChange={(e) => {
                        setTeamName(e.target.value);
                        if (errors.teamName) setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.teamName;
                          return copy;
                        });
                      }}
                      placeholder="e.g. Neon Knights"
                      className={`w-full bg-[#1C1B1B] text-white border-b-2 ${
                        errors.teamName ? 'border-red-500 bg-red-950/20' : 'border-[#2A2A2A]'
                      } focus:border-brand-secondary outline-none py-3 px-4 font-sans text-sm tracking-wide rounded-none transition-all placeholder:text-[#525252] focus:bg-[#201F1F]`}
                    />
                    {errors.teamName && (
                      <p className="text-red-400 font-mono text-[10px] uppercase mt-1.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> {errors.teamName}
                      </p>
                    )}
                  </div>

                  {/* School/Pusat Pengajian Input */}
                  <div>
                    <label className="block text-[11px] font-mono tracking-widest text-[#aa897f] uppercase mb-2">
                      SCHOOL/PUSAT PENGAJIAN <span className="text-brand-primary">*</span>
                    </label>
                    <input 
                      type="text"
                      value={school}
                      onChange={(e) => {
                        setSchool(e.target.value);
                        if (errors.school) setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.school;
                          return copy;
                        });
                      }}
                      placeholder="e.g. Faculty of Computer Science"
                      className={`w-full bg-[#1C1B1B] text-white border-b-2 ${
                        errors.school ? 'border-red-500 bg-red-950/20' : 'border-[#2A2A2A]'
                      } focus:border-brand-secondary outline-none py-3 px-4 font-sans text-sm tracking-wide rounded-none transition-all placeholder:text-[#525252] focus:bg-[#201F1F]`}
                    />
                    {errors.school && (
                      <p className="text-red-400 font-mono text-[10px] uppercase mt-1.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> {errors.school}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Section 2: Team Roster Heading */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-brand-primary" />
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                      TEAM ROSTER (3 MEMBERS EXACTLY)
                    </h3>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] bg-brand-secondary/10 px-3 py-1 text-brand-secondary uppercase tracking-wider font-extrabold border border-brand-secondary/20">
                      <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full"></span>
                      03 PLAYERS (FIXED)
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  
                  {/* Player 01 (Team Leader) Block */}
                  <div className="bg-[#1C1B1B] border border-brand-primary/30 p-6 relative group">
                    <div className="absolute top-0 right-0 bg-brand-primary/10 border-l border-b border-brand-primary/30 px-3 py-1 font-mono text-[9px] text-brand-primary uppercase tracking-widest font-black">
                      PRIMARY CONTACT
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-display text-4xl md:text-5xl font-black text-stone-700 leading-none">01</span>
                      <div className="bg-brand-primary text-black font-display font-black text-[10px] tracking-widest px-2.5 py-0.5 uppercase">
                        TEAM LEADER
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          STUDENT NAME <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[0].studentName}
                          onChange={(e) => handlePlayer01Change('studentName', e.target.value)}
                          placeholder="Full Name"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player01-studentName'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-primary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player01-studentName'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player01-studentName']}
                          </p>
                        )}
                      </div>

                      {/* Matric Number */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          MATRICS NUMBER <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[0].matricNumber}
                          onChange={(e) => handlePlayer01Change('matricNumber', e.target.value)}
                          placeholder="Student ID"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player01-matricNumber'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-primary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player01-matricNumber'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player01-matricNumber']}
                          </p>
                        )}
                      </div>

                      {/* ID/Passport Number */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          IDENTIFICATION/PASSPORT NUMBER <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[0].idPassportNumber}
                          onChange={(e) => handlePlayer01Change('idPassportNumber', e.target.value)}
                          placeholder="ID/Passport"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player01-idPassportNumber'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-primary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player01-idPassportNumber'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player01-idPassportNumber']}
                          </p>
                        )}
                      </div>

                      {/* Contact Number (CRITICAL ONLY FOR PLAYER 01) */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-brand-primary uppercase mb-1.5">
                          CONTACT NUMBER (TEAM LEADER) <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[0].contactNumber}
                          onChange={(e) => handlePlayer01Change('contactNumber', e.target.value)}
                          placeholder="Phone Number"
                          className={`w-full bg-[#131313] text-white border-b font-mono ${
                            errors['player01-contactNumber'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-primary outline-none py-2 px-3 text-xs md:text-sm rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player01-contactNumber'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player01-contactNumber']}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Player 02 Block */}
                  <div className="bg-[#1C1B1B] border border-[#2A2A2A] hover:border-brand-secondary/40 p-6 relative group transition-all duration-300">
                    
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-display text-4xl md:text-5xl font-black text-stone-700 leading-none">02</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          STUDENT NAME <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[1].studentName}
                          onChange={(e) => handlePlayerStandardChange(1, 'studentName', e.target.value)}
                          placeholder="Full Name"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player02-studentName'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-secondary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player02-studentName'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player02-studentName']}
                          </p>
                        )}
                      </div>

                      {/* Matric Number */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          MATRICS NUMBER <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[1].matricNumber}
                          onChange={(e) => handlePlayerStandardChange(1, 'matricNumber', e.target.value)}
                          placeholder="Student ID"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player02-matricNumber'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-secondary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player02-matricNumber'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player02-matricNumber']}
                          </p>
                        )}
                      </div>

                      {/* ID/Passport Number */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          IDENTIFICATION/PASSPORT NUMBER <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[1].idPassportNumber}
                          onChange={(e) => handlePlayerStandardChange(1, 'idPassportNumber', e.target.value)}
                          placeholder="ID/Passport"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player02-idPassportNumber'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-secondary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player02-idPassportNumber'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player02-idPassportNumber']}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Player 03 Block */}
                  <div className="bg-[#1C1B1B] border border-[#2A2A2A] hover:border-brand-secondary/40 p-6 relative group transition-all duration-300">
                    
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-display text-4xl md:text-5xl font-black text-stone-700 leading-none">03</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Name input */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          STUDENT NAME <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[2].studentName}
                          onChange={(e) => handlePlayerStandardChange(2, 'studentName', e.target.value)}
                          placeholder="Full Name"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player03-studentName'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-secondary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player03-studentName'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player03-studentName']}
                          </p>
                        )}
                      </div>

                      {/* Matric Number */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          MATRICS NUMBER <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[2].matricNumber}
                          onChange={(e) => handlePlayerStandardChange(2, 'matricNumber', e.target.value)}
                          placeholder="Student ID"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player03-matricNumber'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-secondary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player03-matricNumber'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player03-matricNumber']}
                          </p>
                        )}
                      </div>

                      {/* ID/Passport Number */}
                      <div>
                        <label className="block text-[10px] font-mono tracking-widest text-[#aa897f] uppercase mb-1.5">
                          IDENTIFICATION/PASSPORT NUMBER <span className="text-brand-primary">*</span>
                        </label>
                        <input 
                          type="text"
                          value={players[2].idPassportNumber}
                          onChange={(e) => handlePlayerStandardChange(2, 'idPassportNumber', e.target.value)}
                          placeholder="ID/Passport"
                          className={`w-full bg-[#131313] text-white border-b ${
                            errors['player03-idPassportNumber'] ? 'border-red-500 bg-red-950/10' : 'border-[#2A2A2A]'
                          } focus:border-brand-secondary outline-none py-2 px-3 text-xs md:text-sm font-sans rounded-none transition-all placeholder:text-[#444]`}
                        />
                        {errors['player03-idPassportNumber'] && (
                          <p className="text-red-400 font-mono text-[9px] uppercase mt-1">
                            {errors['player03-idPassportNumber']}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Submitting Feedback errors summary at bottom if has errors */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-500/10 border border-red-500 text-red-200 p-4 mb-6 text-xs font-mono uppercase tracking-wide flex items-start gap-3">
                  <span className="bg-red-500 text-black px-1.5 py-0.5 font-bold font-mono">ERROR</span>
                  <div>
                    <p className="font-bold">Roster rejected. Please correct the highlighted errors above:</p>
                    <ul className="list-disc list-inside mt-2 text-[10px] space-y-1 text-red-300">
                      <li>Check team parameters are complete.</li>
                      <li>Ensured all 3 players have valid student names, student IDs, and ID cards.</li>
                      <li>Team Leader must supply contact number.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Submit Button Block */}
              <div className="flex justify-end border-t border-[#2A2A2A] pt-8">
                <button
                  type="submit"
                  className="bg-brand-primary text-black font-display font-black text-sm md:text-base tracking-widest py-4 px-10 rounded-none border border-brand-primary hover:bg-transparent hover:text-brand-primary transition-all duration-300 transform active:scale-95 flex items-center gap-3 cursor-pointer"
                >
                  SUBMIT ROSTER <Send className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 border-b border-[#2A2A2A] bg-brand-surface-dim relative">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left label part */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="border-l-4 border-brand-primary pl-4">
                  <h2 className="font-display text-4xl md:text-5xl font-black text-[#e5e2e1] uppercase tracking-tight">
                    FAQ
                  </h2>
                </div>
                <p className="text-[#c8c6c5] text-sm mt-4 font-sans leading-relaxed max-w-xs">
                  Everything you and your team need to know about eligibility, uniform policies, and game times.
                </p>
                <div className="mt-8 border border-[#2a2a2a] bg-stone-900/40 p-5 rounded-none text-xs text-stone-400">
                  <p className="font-bold text-stone-200 mb-2 uppercase tracking-wider font-mono">Support Court</p>
                  <p>Have special matric card issues or registration inquiries?</p>
                  <a href="mailto:support@varsityarena.edu" className="text-brand-primary block mt-2 hover:underline font-mono">support@varsityarena.com</a>
                </div>
              </div>
            </div>

            {/* Right Accordion Questions */}
            <div className="lg:col-span-2 space-y-4">
              {faqData.map((faq, idx) => {
                const isOpened = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-[#2a2a2a] bg-[#131313] transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpened ? null : idx)}
                      className="w-full text-left py-6 px-6 flex items-center justify-between font-display text-base md:text-lg font-bold uppercase tracking-wide text-white focus:outline-none focus:text-brand-primary"
                    >
                      <span>{faq.question}</span>
                      {isOpened ? (
                        <ChevronUp className="w-5 h-5 text-brand-primary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-500" />
                      )}
                    </button>
                    
                    {/* Collapsible Answer */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpened ? 'max-h-52 border-t border-[#2a2a2a] p-6' : 'max-h-0'
                      }`}
                    >
                      <p className="font-sans text-[#c8c6c5] text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-bg border-t border-[#2A2A2A] py-16 text-stone-400 text-xs font-sans">
        <div className="max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Info */}
            <div className="md:col-span-2">
              <span className="font-display text-2xl font-black text-white tracking-widest uppercase">
                VARSITY<span className="text-brand-primary font-black">ARENA</span>
              </span>
              <p className="mt-4 text-[#c8c6c5] max-w-sm leading-relaxed">
                Empowering college athletes with high-intensity tournament spaces and technical analytics instrumentation. Register your team to claim prestige.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-display text-sm font-bold text-stone-300 uppercase tracking-wider mb-4">TOURNAMENT LEGAL</h4>
              <ul className="space-y-2 font-mono text-[10px]">
                <li><a href="#introduction" className="hover:text-brand-primary transition-all">PRIVACY POLICY</a></li>
                <li><a href="#introduction" className="hover:text-brand-primary transition-all">TERMS OF SERVICE</a></li>
                <li><a href="#introduction" className="hover:text-brand-primary transition-all">TOURNAMENT RULES</a></li>
                <li><a href="#introduction" className="hover:text-brand-primary transition-all">CONTACT SUPPORT</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-display text-sm font-bold text-stone-300 uppercase tracking-wider mb-4">ARENA ADDRESS</h4>
              <p className="leading-relaxed font-sans text-stone-400">
                Main Campus Varsity Gymnasium Complex<br />
                Arena Avenue Block 10A<br />
                Technical Education Quarter
              </p>
            </div>

          </div>

          <div className="border-t border-[#2A2A2A] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
              © 2026 VARSITY ARENA. TECHNICAL EXCELLENCE IN COLLEGIATE ATHLETICS.
            </p>
            
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="text-stone-500 uppercase">SYSTEM POWER:</span>
              <span className="bg-[#1C1B1B] text-brand-secondary px-2 py-0.5 border border-[#2a2a2a]">KINETIC PRECISION v4</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
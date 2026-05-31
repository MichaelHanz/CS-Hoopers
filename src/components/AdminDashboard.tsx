import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingTeam, setEditingTeam] = useState<any | null>(null);

  const SECRET_PIN = "HOOP2026";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PIN) {
      setIsAuthenticated(true);
      fetchTeams();
    } else {
      alert("ACCESS DENIED");
      setPassword("");
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "rosters"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedTeams = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    const isConfirmed = window.confirm(
      `CRITICAL WARNING: Are you sure you want to delete squad [${teamName}]? This action is permanent.`,
    );
    if (!isConfirmed) return;

    try {
      await deleteDoc(doc(db, "rosters", teamId));
      setTeams(teams.filter((team) => team.id !== teamId));
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Database error: Failed to delete team.");
    }
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    try {
      const teamRef = doc(db, "rosters", editingTeam.id);
      await updateDoc(teamRef, {
        teamName: editingTeam.teamName,
        schoolFaculty: editingTeam.schoolFaculty,
      });

      setTeams(teams.map((t) => (t.id === editingTeam.id ? editingTeam : t)));
      setEditingTeam(null);
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Database error: Failed to update team.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm border-2 border-brand-magenta p-6 sm:p-8 bg-black shadow-[8px_8px_0px_#ff00ff]"
        >
          <h2 className="font-urban text-xl sm:text-2xl text-white mb-6 uppercase font-black tracking-widest text-center">
            Admin's Page
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER PIN"
            className="w-full bg-zinc-900 text-white font-mono py-3 px-4 border border-zinc-700 focus:border-brand-magenta outline-none mb-6 text-center tracking-widest"
          />
          <button
            type="submit"
            className="w-full bg-brand-magenta text-black font-urban font-black py-3 hover:bg-white transition-colors"
          >
            INITIALIZE
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white font-sans relative overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-6 sm:py-10">
        {/* RESPONSIVE HEADER: Stacks on mobile, side-by-side on tablet+ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b-2 border-zinc-800 pb-4">
          <div className="w-full sm:w-auto">
            {/* Scaled text sizes and added break-words */}
            <h1 className="font-urban text-3xl sm:text-4xl md:text-5xl text-brand-green uppercase tracking-tighter font-black break-words">
              Tournament Command
            </h1>
            <p className="text-zinc-500 font-mono text-xs sm:text-sm mt-2">
              LIVE ROSTER DATABASE // {teams.length} SQUADS REGISTERED
            </p>
          </div>
          <button
            onClick={fetchTeams}
            className="w-full sm:w-auto text-xs font-mono bg-zinc-900 border border-zinc-700 px-4 py-3 sm:py-2 hover:bg-zinc-800 transition-colors"
          >
            REFRESH DATA
          </button>
        </div>

        {loading ? (
          <div className="text-brand-magenta font-mono animate-pulse text-sm sm:text-base">
            FETCHING PAYLOADS...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {teams.map((team) => {
              const activePlayers = team.players.filter(
                (p: any) => p.name.trim() !== "",
              );
              const date = new Date(team.timestamp).toLocaleString();

              return (
                <div
                  key={team.id}
                  className="border-2 border-zinc-800 bg-black p-4 sm:p-6 relative group"
                >
                  {/* Scaled down badge on mobile to prevent overlapping */}
                  <div className="absolute top-0 right-0 bg-brand-green text-black font-mono text-[8px] sm:text-[10px] px-2 py-1 font-bold">
                    {date}
                  </div>

                  {/* Added pr-20 to ensure long team names don't crash into the date badge */}
                  <div className="mb-4 pr-20">
                    <h3 className="font-urban text-xl sm:text-2xl uppercase font-black text-white break-words">
                      {team.teamName}
                    </h3>
                    <p className="text-zinc-400 font-mono text-xs break-words">
                      {team.schoolFaculty}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 border-t border-zinc-900 pt-4 mt-4">
                    {activePlayers.map((player: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-zinc-900/50 p-4 border border-zinc-800 flex flex-col gap-3"
                      >
                        {/* CHANGED: Now displays "PLAYER 0X" and appends "(SUB)" if applicable */}
                        <span className="text-[10px] text-brand-magenta font-mono uppercase border-b border-zinc-800 pb-2">
                          {player.number}
                          {player.role.includes("SUB") ? " (SUB)" : ""}
                        </span>

                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block mb-0.5">
                            Name :
                          </span>
                          <p className="font-bold text-sm uppercase truncate text-white">
                            {player.name}
                          </p>
                        </div>

                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block mb-0.5">
                            Matrics Number :
                          </span>
                          <p className="text-xs text-zinc-300 font-mono truncate">
                            {player.matricNo}
                          </p>
                        </div>

                        {player.school && (
                          <div>
                            <span className="text-[9px] text-zinc-500 font-mono uppercase block mb-0.5">
                              School / Pusat Pengajian :
                            </span>
                            <p className="text-xs text-zinc-300 font-mono truncate">
                              {player.school}
                            </p>
                          </div>
                        )}

                        {player.contactNumber && (
                          <div>
                            <span className="text-[9px] text-brand-green/70 font-mono uppercase block mb-0.5">
                              Contact Number :
                            </span>
                            <p className="text-xs text-brand-green font-mono truncate">
                              {player.contactNumber}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* RESPONSIVE ACTION BAR: Full width buttons on mobile */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end border-t border-zinc-900 pt-4">
                    <button
                      onClick={() => setEditingTeam(team)}
                      className="w-full sm:w-auto text-xs font-mono text-cyan-400 hover:text-white transition-colors uppercase tracking-widest border border-cyan-400/30 px-4 py-3 sm:py-2 hover:bg-cyan-400/10"
                    >
                      [ Edit Squad ]
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.teamName)}
                      className="w-full sm:w-auto text-xs font-mono text-brand-magenta hover:text-white transition-colors uppercase tracking-widest border border-brand-magenta/30 px-4 py-3 sm:py-2 hover:bg-brand-magenta/10"
                    >
                      [ Delete ]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT MODAL OVERLAY */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          {/* Added max-h-screen and overflow-y-auto in case mobile keyboards push the modal off screen */}
          <form
            onSubmit={handleUpdateTeam}
            className="bg-[#0a0a0a] border-2 border-cyan-400 p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_rgba(34,211,238,0.5)] relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditingTeam(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white font-mono text-xl sm:text-base"
            >
              [X]
            </button>

            <h2 className="font-urban text-xl sm:text-2xl text-cyan-400 mb-6 uppercase font-black tracking-widest pr-8">
              Update Squad
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <label className="text-xs font-urban uppercase tracking-widest font-extrabold text-white mb-2 block">
                  Team Name
                </label>
                <input
                  type="text"
                  value={editingTeam.teamName}
                  onChange={(e) =>
                    setEditingTeam({ ...editingTeam, teamName: e.target.value })
                  }
                  className="w-full bg-zinc-900 text-white font-mono py-3 px-4 border border-zinc-700 focus:border-cyan-400 outline-none uppercase"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-urban uppercase tracking-widest font-extrabold text-white mb-2 block">
                  School / Faculty
                </label>
                <input
                  type="text"
                  value={editingTeam.schoolFaculty}
                  onChange={(e) =>
                    setEditingTeam({
                      ...editingTeam,
                      schoolFaculty: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-900 text-white font-mono py-3 px-4 border border-zinc-700 focus:border-cyan-400 outline-none uppercase"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 text-black font-urban font-black py-4 hover:bg-white transition-colors text-base sm:text-lg"
            >
              SAVE CHANGES
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { background: #07070f; font-family: 'Crimson Text', Georgia, serif; color: #e8e0d0; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0d0d1a; }
    ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 3px; }
    @keyframes twinkle { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.8;transform:scale(1.3)} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 #f1c40f44} 50%{box-shadow:0 0 0 8px #f1c40f00} }
    .fade-in { animation: fadeIn 0.4s ease both; }
    button { cursor: pointer; font-family: inherit; }
    input, textarea { font-family: inherit; }
  `}</style>
);

// ─── DEFAULT ROLES ────────────────────────────────────────────────────────────
const DEFAULT_ROLES = [
  { id: "loup-garou", name: "Loup-Garou", emoji: "🐺", camp: "loups", color: "#c0392b", nightOrder: 3, power: "Chaque nuit, se réveille avec les autres loups et choisit une victime à dévorer.", description: "Prédateur nocturne, il doit éliminer tous les villageois sans se faire démasquer.", phase: "night", isCustom: false },
  { id: "voyante", name: "Voyante", emoji: "🔮", camp: "village", color: "#8e44ad", nightOrder: 1, power: "Chaque nuit, peut regarder secrètement la carte d'un joueur de son choix.", description: "Elle connaît la vérité mais doit convaincre le village sans révéler son rôle.", phase: "night", isCustom: false },
  { id: "sorciere", name: "Sorcière", emoji: "🧪", camp: "village", color: "#27ae60", nightOrder: 4, power: "Possède 2 potions (une vie, une mort) utilisables chacune une seule fois par partie.", description: "Elle peut sauver la victime des loups ou empoisonner un joueur de son choix.", phase: "night", isCustom: false },
  { id: "chasseur", name: "Chasseur", emoji: "🏹", camp: "village", color: "#d35400", nightOrder: null, power: "Quand il meurt (jour ou nuit), il tire immédiatement sur un joueur de son choix.", description: "Sa mort n'est jamais gratuite. Il emporte toujours quelqu'un avec lui.", phase: "death", isCustom: false },
  { id: "cupidon", name: "Cupidon", emoji: "💘", camp: "village", color: "#e91e8c", nightOrder: 0, power: "La première nuit, désigne deux joueurs qui tombent amoureux. Ils partagent le même destin.", description: "Si l'un des amoureux meurt, l'autre mourra de chagrin immédiatement.", phase: "night", isCustom: false },
  { id: "idiot", name: "Idiot du Village", emoji: "🃏", camp: "village", color: "#f39c12", nightOrder: null, power: "S'il est élu par le village, il est révélé mais reste en vie (sans droit de vote).", description: "La révélation de son innocence le protège de l'élimination lors du vote.", phase: "day", isCustom: false },
  { id: "salvateur", name: "Salvateur", emoji: "🛡️", camp: "village", color: "#2980b9", nightOrder: 2, power: "Chaque nuit, protège un joueur de l'attaque des loups (pas deux fois de suite le même).", description: "Gardien silencieux du village, il veille dans l'ombre.", phase: "night", isCustom: false },
  { id: "simple-villageois", name: "Simple Villageois", emoji: "👨‍🌾", camp: "village", color: "#7f8c8d", nightOrder: null, power: "Aucun pouvoir spécial. Sa force réside dans son vote et sa conviction.", description: "Sans pouvoir, mais indispensable : c'est lui qui fait basculer les votes.", phase: null, isCustom: false },
  { id: "ancien", name: "Ancien", emoji: "🧙", camp: "village", color: "#6c5ce7", nightOrder: null, power: "Résiste à la première attaque des loups. Si le village l'élimine, tous perdent leurs pouvoirs.", description: "Sa sagesse est une armure. Sa trahison par le village est catastrophique.", phase: null, isCustom: false },
  { id: "corbeau", name: "Corbeau", emoji: "🪶", camp: "village", color: "#636e72", nightOrder: 0, power: "Chaque nuit, peut ajouter deux votes supplémentaires contre un joueur pour le lendemain.", description: "Son pouvoir d'accusation renforce la pression sur ses cibles.", phase: "night", isCustom: false },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── LAYOUT WRAPPER ───────────────────────────────────────────────────────────
function Layout({ children, sidebar, title, onBack, backLabel = "← Retour" }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header style={{ background: "#07070f", borderBottom: "1px solid #1a1a30", padding: "12px 32px", display: "flex", alignItems: "center", gap: 20, position: "sticky", top: 0, zIndex: 100 }}>
        {onBack && <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: 14, letterSpacing: 1 }}>{backLabel}</button>}
        <h1 style={{ fontFamily: "'Cinzel', serif", color: "#f1c40f", fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>🐺 Loup-Garou</h1>
        {title && <span style={{ color: "#555", fontSize: 13 }}>/ {title}</span>}
      </header>
      {/* Body */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: sidebar ? "1fr 360px" : "1fr", gap: 0, maxWidth: 1400, margin: "0 auto", width: "100%", padding: "32px 32px 60px" }}>
        <main style={{ minWidth: 0 }} className="fade-in">{children}</main>
        {sidebar && <aside style={{ paddingLeft: 32 }} className="fade-in">{sidebar}</aside>}
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ children, accent, style = {} }) {
  return (
    <div style={{ background: "#0d0d1f", border: `1px solid ${accent || "#1e1e3a"}`, borderRadius: 16, padding: "24px", ...style }}>
      {children}
    </div>
  );
}

// ─── ROLE CARD ────────────────────────────────────────────────────────────────
function RoleCard({ role, count, onChange, showCounter = false, onDelete }) {
  return (
    <div style={{ background: "#0a0a1c", border: `1px solid ${role.color}33`, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.2s", borderLeft: `4px solid ${role.color}` }}>
      <span style={{ fontSize: 32, flexShrink: 0 }}>{role.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, color: role.color, fontSize: 15 }}>{role.name}</span>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: role.camp === "loups" ? "#c0392b22" : "#27ae6022", color: role.camp === "loups" ? "#e74c3c" : "#2ecc71", fontWeight: 700, letterSpacing: 1 }}>
            {role.camp === "loups" ? "LOUPS" : "VILLAGE"}
          </span>
          {role.isCustom && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "#f1c40f22", color: "#f1c40f" }}>CUSTOM</span>}
        </div>
        <p style={{ color: "#888", fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{role.power}</p>
        {role.phase === "night" && role.nightOrder !== null && (
          <span style={{ fontSize: 11, color: "#6c5ce7", marginTop: 4, display: "block" }}>🌙 Réveil ordre {role.nightOrder}</span>
        )}
      </div>
      {showCounter && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onChange(-1)} style={{ width: 30, height: 30, borderRadius: 8, background: "#1a1a30", border: "1px solid #333", color: "#e8e0d0", fontSize: 18 }}>−</button>
          <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: 18, minWidth: 24, textAlign: "center", color: count > 0 ? "#f1c40f" : "#555" }}>{count}</span>
          <button onClick={() => onChange(+1)} style={{ width: 30, height: 30, borderRadius: 8, background: "#1a1a30", border: "1px solid #333", color: "#e8e0d0", fontSize: 18 }}>+</button>
        </div>
      )}
      {onDelete && (
        <button onClick={onDelete} style={{ background: "none", border: "none", color: "#666", fontSize: 18, flexShrink: 0 }}>🗑</button>
      )}
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
  const base = { fontFamily: "'Cinzel',serif", fontWeight: 700, letterSpacing: 1, border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, transition: "all 0.2s", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, ...style };
  const variants = {
    primary: { background: "linear-gradient(135deg,#f1c40f,#e67e22)", color: "#07070f" },
    secondary: { background: "transparent", border: "1px solid #333", color: "#aaa" },
    danger: { background: "#c0392b22", border: "1px solid #c0392b55", color: "#e74c3c" },
    success: { background: "#27ae6022", border: "1px solid #27ae6055", color: "#2ecc71" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ onStart, onRoles }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 50% 30%, #1a1220 0%, #07070f 70%)" }}>
      <GlobalStyles />
      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: 2, height: 2, borderRadius: "50%", background: "#f1c40f", opacity: Math.random() * 0.6 + 0.1, animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`, animationDelay: `${Math.random() * 3}s` }} />
      ))}
      <div style={{ animation: "float 4s ease-in-out infinite", fontSize: 100, marginBottom: 8, filter: "drop-shadow(0 0 40px #f1c40f66)" }}>🌕</div>
      <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(40px,8vw,80px)", fontWeight: 900, color: "#f1c40f", letterSpacing: 4, textShadow: "0 0 60px #f1c40f44", marginBottom: 8 }}>Loup-Garou</h1>
      <p style={{ fontFamily: "'Cinzel',serif", letterSpacing: 6, color: "#7a6a50", fontSize: "clamp(12px,2vw,16px)", marginBottom: 8, textTransform: "uppercase" }}>de Thiercelieux</p>
      <p style={{ color: "#4a4030", fontSize: 14, marginBottom: 48, letterSpacing: 2 }}>Application du Meneur de Jeu</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Btn onClick={onStart} style={{ fontSize: 16, padding: "16px 40px", animation: "pulse 2s infinite" }}>🎮 Nouvelle Partie</Btn>
        <Btn onClick={onRoles} variant="secondary" style={{ fontSize: 16, padding: "16px 40px" }}>📜 Gérer les Rôles</Btn>
      </div>
    </div>
  );
}

// ─── SETUP ────────────────────────────────────────────────────────────────────
function SetupScreen({ players, setPlayers, roles, selectedRoles, setSelectedRoles, onNext, onBack }) {
  const [name, setName] = useState("");
  const total = Object.values(selectedRoles).reduce((a, b) => a + b, 0);
  const needed = players.length;
  const diff = needed - total;

  const addPlayer = () => {
    if (name.trim() && players.length < 24) { setPlayers([...players, name.trim()]); setName(""); }
  };
  const change = (id, delta) => setSelectedRoles(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));

  const sidebar = (
    <div style={{ position: "sticky", top: 96 }}>
      <Card accent="#f1c40f33">
        <h3 style={{ fontFamily: "'Cinzel',serif", color: "#f1c40f", marginBottom: 16, fontSize: 16 }}>Résumé</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#aaa", fontSize: 14 }}>
          <span>Joueurs</span><strong style={{ color: "#e8e0d0" }}>{players.length}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#aaa", fontSize: 14 }}>
          <span>Rôles assignés</span><strong style={{ color: total === needed ? "#2ecc71" : "#e74c3c" }}>{total}/{needed}</strong>
        </div>
        {diff !== 0 && (
          <p style={{ color: diff > 0 ? "#e74c3c" : "#e67e22", fontSize: 13, marginTop: 8 }}>
            {diff > 0 ? `⚠ Il manque ${diff} rôle${diff > 1 ? "s" : ""}` : `⚠ ${Math.abs(diff)} rôle${Math.abs(diff) > 1 ? "s" : ""} en trop`}
          </p>
        )}
        {diff === 0 && players.length >= 4 && <p style={{ color: "#2ecc71", fontSize: 13, marginTop: 8 }}>✓ Prêt à jouer !</p>}
        <div style={{ marginTop: 20 }}>
          {Object.entries(selectedRoles).filter(([, v]) => v > 0).map(([id, count]) => {
            const r = roles.find(x => x.id === id);
            if (!r) return null;
            return <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginBottom: 4 }}><span>{r.emoji} {r.name}</span><span style={{ color: r.color }}>×{count}</span></div>;
          })}
        </div>
        <Btn onClick={onNext} disabled={diff !== 0 || players.length < 4} style={{ width: "100%", marginTop: 20 }}>
          Distribuer les Rôles →
        </Btn>
      </Card>
    </div>
  );

  return (
    <Layout title="Configuration" onBack={onBack} sidebar={sidebar}>
      <GlobalStyles />
      {/* Players */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, color: "#f1c40f", marginBottom: 20 }}>👥 Joueurs</h2>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && addPlayer()}
            placeholder="Prénom du joueur…"
            style={{ flex: 1, background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 10, padding: "12px 18px", color: "#e8e0d0", fontSize: 16, outline: "none" }} />
          <Btn onClick={addPlayer}>Ajouter</Btn>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {players.map((p, i) => (
            <div key={i} style={{ background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 24, padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 15 }}>
              <span>👤 {p}</span>
              <button onClick={() => setPlayers(players.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#555", fontSize: 14 }}>✕</button>
            </div>
          ))}
          {players.length === 0 && <p style={{ color: "#444", fontSize: 14 }}>Ajoute au moins 4 joueurs pour commencer.</p>}
        </div>
      </section>

      {/* Roles */}
      <section>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 24, color: "#f1c40f", marginBottom: 20 }}>🎭 Rôles</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12 }}>
          {roles.map(r => (
            <RoleCard key={r.id} role={r} count={selectedRoles[r.id] || 0} onChange={d => change(r.id, d)} showCounter />
          ))}
        </div>
      </section>
    </Layout>
  );
}

// ─── ROLES MANAGER ────────────────────────────────────────────────────────────
function RolesScreen({ roles, setRoles, onBack, onCustom }) {
  const [filter, setFilter] = useState("all");
  const filtered = roles.filter(r => filter === "all" ? true : filter === "custom" ? r.isCustom : r.camp === filter);

  return (
    <Layout title="Rôles" onBack={onBack}>
      <GlobalStyles />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, color: "#f1c40f" }}>📜 Tous les Rôles</h2>
        <Btn onClick={onCustom}>✚ Nouveau Rôle</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[["all","Tous"],["village","Village"],["loups","Loups"],["custom","Personnalisés"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: "6px 16px", borderRadius: 20, border: "1px solid", borderColor: filter === v ? "#f1c40f" : "#333", background: filter === v ? "#f1c40f22" : "transparent", color: filter === v ? "#f1c40f" : "#888", fontSize: 13, fontFamily: "'Cinzel',serif" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12 }}>
        {filtered.map(r => (
          <RoleCard key={r.id} role={r} onDelete={r.isCustom ? () => setRoles(roles.filter(x => x.id !== r.id)) : null} />
        ))}
      </div>
    </Layout>
  );
}

// ─── CUSTOM ROLE ──────────────────────────────────────────────────────────────
function CustomRoleScreen({ roles, setRoles, onBack }) {
  const EMOJIS = ["⭐","👁️","🗡️","🧛","🦊","🐍","💀","🧝","🏔️","🌊","🔥","❄️","⚡","🌿","🎭","🧟","👻","🦅","🐻","🌙","🕷️","🦁","🐉","🌑"];
  const [form, setForm] = useState({ name: "", emoji: "⭐", camp: "village", power: "", description: "", nightOrder: "", phase: "night" });
  const [error, setError] = useState("");

  const save = () => {
    if (!form.name.trim()) { setError("Le nom est obligatoire."); return; }
    if (!form.power.trim()) { setError("Le pouvoir est obligatoire."); return; }
    setRoles([...roles, { ...form, id: "custom-" + Date.now(), nightOrder: form.nightOrder !== "" ? parseInt(form.nightOrder) : null, color: form.camp === "loups" ? "#e74c3c" : "#3498db", isCustom: true }]);
    onBack();
  };

  const F = ({ label, children }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", color: "#888", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Cinzel',serif" }}>{label}</label>
      {children}
    </div>
  );

  return (
    <Layout title="Nouveau Rôle" onBack={onBack}>
      <GlobalStyles />
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, color: "#f1c40f", marginBottom: 32 }}>✨ Créer un Rôle Personnalisé</h2>
        {error && <p style={{ color: "#e74c3c", marginBottom: 16, fontSize: 14 }}>⚠ {error}</p>}

        <F label="Icône">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                style={{ fontSize: 24, padding: 8, borderRadius: 8, border: `2px solid ${form.emoji === e ? "#f1c40f" : "transparent"}`, background: form.emoji === e ? "#f1c40f22" : "#0d0d1f" }}>
                {e}
              </button>
            ))}
          </div>
        </F>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <F label="Nom du rôle *">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Le Traître, L'Oracle…"
              style={{ width: "100%", background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 10, padding: "12px 16px", color: "#e8e0d0", fontSize: 15, outline: "none" }} />
          </F>
          <F label="Camp">
            <div style={{ display: "flex", gap: 8 }}>
              {[["village","🏡 Village","#27ae60"],["loups","🐺 Loups","#c0392b"]].map(([v, l, c]) => (
                <button key={v} onClick={() => setForm({ ...form, camp: v })}
                  style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${form.camp === v ? c : "#333"}`, background: form.camp === v ? c + "33" : "#0d0d1f", color: form.camp === v ? c : "#888", fontFamily: "'Cinzel',serif", fontSize: 13 }}>
                  {l}
                </button>
              ))}
            </div>
          </F>
        </div>

        <F label="Pouvoir (pour le meneur) *">
          <textarea value={form.power} onChange={e => setForm({ ...form, power: e.target.value })}
            placeholder="Ex: Chaque nuit, peut voir la cible des loups sans la changer…"
            style={{ width: "100%", background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 10, padding: "12px 16px", color: "#e8e0d0", fontSize: 14, minHeight: 90, resize: "vertical", outline: "none" }} />
        </F>

        <F label="Description (pour le joueur)">
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Ex: Ombre parmi les ombres, il sait tout mais ne peut rien dire…"
            style={{ width: "100%", background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 10, padding: "12px 16px", color: "#e8e0d0", fontSize: 14, minHeight: 70, resize: "vertical", outline: "none" }} />
        </F>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <F label="Phase d'activation">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[["night","🌙 Nuit"],["day","☀️ Jour"],["death","💀 Mort"],["none","❌ Aucune"]].map(([v, l]) => (
                <button key={v} onClick={() => setForm({ ...form, phase: v })}
                  style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${form.phase === v ? "#6c5ce7" : "#333"}`, background: form.phase === v ? "#6c5ce722" : "#0d0d1f", color: form.phase === v ? "#6c5ce7" : "#888", fontSize: 12, fontFamily: "'Cinzel',serif" }}>
                  {l}
                </button>
              ))}
            </div>
          </F>
          {form.phase === "night" && (
            <F label="Ordre de réveil (nuit)">
              <input type="number" value={form.nightOrder} onChange={e => setForm({ ...form, nightOrder: e.target.value })}
                placeholder="Ex: 2"
                style={{ width: "100%", background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 10, padding: "12px 16px", color: "#e8e0d0", fontSize: 15, outline: "none" }} />
            </F>
          )}
        </div>

        {/* Preview */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: "#555", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Cinzel',serif", marginBottom: 10 }}>Aperçu</p>
          <RoleCard role={{ ...form, color: form.camp === "loups" ? "#e74c3c" : "#3498db", isCustom: true, nightOrder: form.nightOrder || null }} />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Btn onClick={save}>💾 Enregistrer</Btn>
          <Btn onClick={onBack} variant="secondary">Annuler</Btn>
        </div>
      </div>
    </Layout>
  );
}

// ─── DISTRIBUTE ───────────────────────────────────────────────────────────────
function DistributeScreen({ assignments, onDone }) {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState("tap");
  const current = assignments[idx];
  const done = idx >= assignments.length;

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <GlobalStyles />
      <div style={{ fontFamily: "'Cinzel',serif", color: "#f1c40f", fontSize: 20, marginBottom: 32, letterSpacing: 2 }}>🐺 Distribution Secrète</div>
      {!done ? (
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }} className="fade-in">
          <p style={{ color: "#888", fontSize: 16, marginBottom: 24 }}>Passe le téléphone / écran à</p>
          <p style={{ fontFamily: "'Cinzel',serif", fontSize: 32, color: "#f1c40f", marginBottom: 32 }}>{current.player}</p>
          {step === "tap" && (
            <button onClick={() => setStep("showing")}
              style={{ width: 280, height: 360, background: "linear-gradient(135deg, #0d0d2a, #1a1a40)", border: "2px solid #2a2a5a", borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 16, margin: "0 auto", animation: "pulse 2s infinite" }}>
              <span style={{ fontSize: 72 }}>🌙</span>
              <span style={{ color: "#555", fontSize: 14, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>APPUIE POUR VOIR</span>
            </button>
          )}
          {step === "showing" && (
            <div style={{ width: 280, background: `linear-gradient(135deg, ${current.role.color}22, #07070f)`, border: `2px solid ${current.role.color}`, borderRadius: 24, padding: 32, margin: "0 auto", textAlign: "center" }} className="fade-in">
              <div style={{ fontSize: 72, marginBottom: 12 }}>{current.role.emoji}</div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, color: current.role.color, fontWeight: 700, marginBottom: 8 }}>{current.role.name}</div>
              <div style={{ display: "inline-block", fontSize: 11, padding: "3px 12px", borderRadius: 20, background: current.role.camp === "loups" ? "#c0392b33" : "#27ae6033", color: current.role.camp === "loups" ? "#e74c3c" : "#2ecc71", fontFamily: "'Cinzel',serif", marginBottom: 16 }}>
                {current.role.camp === "loups" ? "🐺 LOUP-GAROU" : "🏡 VILLAGE"}
              </div>
              <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{current.role.power}</p>
              {current.role.description && <p style={{ color: "#666", fontSize: 12, fontStyle: "italic", lineHeight: 1.5, marginBottom: 20 }}>{current.role.description}</p>}
              <Btn onClick={() => { setStep("tap"); setIdx(idx + 1); }} style={{ width: "100%" }}>✓ Lu et compris</Btn>
            </div>
          )}
          <p style={{ color: "#333", marginTop: 24, fontSize: 13 }}>{idx + 1} / {assignments.length}</p>
        </div>
      ) : (
        <div style={{ textAlign: "center" }} className="fade-in">
          <div style={{ fontSize: 80, marginBottom: 24 }}>🎮</div>
          <h2 style={{ fontFamily: "'Cinzel',serif", color: "#f1c40f", fontSize: 28, marginBottom: 12 }}>Tous les rôles distribués !</h2>
          <p style={{ color: "#888", marginBottom: 32 }}>Que les loups se cachent bien… la nuit commence.</p>
          <Btn onClick={onDone} style={{ fontSize: 16, padding: "16px 40px" }}>🌙 Commencer la Partie</Btn>
        </div>
      )}
    </div>
  );
}

// ─── GAME ─────────────────────────────────────────────────────────────────────
function GameScreen({ gameState, setGameState, onEnd }) {
  const [phase, setPhase] = useState("night");
  const [nightStep, setNightStep] = useState(0);
  const [dayVote, setDayVote] = useState(null);
  const [log, setLog] = useState([{ time: "Début", msg: "🌙 La partie commence. Nuit 1." }]);
  const [showLog, setShowLog] = useState(false);

  const alive = gameState.players.filter(p => p.alive);
  const wolves = alive.filter(p => p.role.camp === "loups");
  const villagers = alive.filter(p => p.role.camp === "village");
  const gameOver = wolves.length === 0 || wolves.length >= villagers.length;
  const winner = wolves.length === 0 ? "village" : "loups";

  const addLog = msg => setLog(l => [...l, { time: `${phase === "night" ? "🌙" : "☀️"} N${gameState.night}`, msg }]);

  const kill = name => {
    setGameState(gs => ({ ...gs, players: gs.players.map(p => p.player === name ? { ...p, alive: false } : p) }));
    addLog(`💀 ${name} a été éliminé.`);
  };

  const nightRoles = gameState.nightRoles.filter(r => gameState.players.some(p => p.alive && p.role.id === r.id));

  const nextPhase = () => {
    if (phase === "night") {
      setPhase("day"); setNightStep(0);
      addLog(`☀️ Le village se réveille — Jour ${gameState.night}`);
    } else {
      if (dayVote) { kill(dayVote); setDayVote(null); }
      setGameState(gs => ({ ...gs, night: gs.night + 1 }));
      setPhase("night");
      addLog(`🌙 Nuit ${gameState.night + 1}`);
    }
  };

  const sidebar = (
    <div style={{ position: "sticky", top: 96 }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontFamily: "'Cinzel',serif", color: "#f1c40f", fontSize: 15 }}>Journal</h3>
          <button onClick={() => setShowLog(!showLog)} style={{ background: "none", border: "none", color: "#888", fontSize: 12 }}>{showLog ? "Masquer" : "Afficher"}</button>
        </div>
        {showLog && (
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {log.map((l, i) => (
              <div key={i} style={{ fontSize: 12, color: "#aaa", marginBottom: 6, lineHeight: 1.5 }}>
                <span style={{ color: "#f1c40f" }}>{l.time}</span> — {l.msg}
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card>
        <h3 style={{ fontFamily: "'Cinzel',serif", color: "#aaa", fontSize: 13, marginBottom: 12 }}>JOUEURS VIVANTS ({alive.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {gameState.players.map(p => (
            <div key={p.player} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: p.alive ? "#0d0d1f" : "#070710", opacity: p.alive ? 1 : 0.3, border: `1px solid ${p.alive ? p.role.color + "44" : "#111"}` }}>
              <span style={{ fontSize: 18 }}>{p.role.emoji}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{p.player}</span>
              {p.alive && <button onClick={() => kill(p.player)} style={{ background: "#c0392b22", border: "1px solid #c0392b55", borderRadius: 6, color: "#e74c3c", fontSize: 11, padding: "2px 8px" }}>✕ Élim.</button>}
              {!p.alive && <span style={{ fontSize: 11, color: "#555" }}>💀</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  if (gameOver) {
    return (
      <Layout title="Fin de Partie" onBack={onEnd} backLabel="← Nouvelle Partie" sidebar={sidebar}>
        <GlobalStyles />
        <div style={{ textAlign: "center", padding: "60px 0" }} className="fade-in">
          <div style={{ fontSize: 100, marginBottom: 24 }}>{winner === "village" ? "🏡" : "🐺"}</div>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(28px,5vw,48px)", color: winner === "village" ? "#2ecc71" : "#e74c3c", marginBottom: 12 }}>
            {winner === "village" ? "Le Village a gagné !" : "Les Loups ont gagné !"}
          </h2>
          <p style={{ color: "#888", marginBottom: 40, fontSize: 16 }}>
            {winner === "village" ? "Tous les loups ont été démasqués et éliminés." : "Les loups dominent le village."}
          </p>
          <Card style={{ maxWidth: 500, margin: "0 auto", textAlign: "left" }}>
            <h3 style={{ fontFamily: "'Cinzel',serif", color: "#f1c40f", marginBottom: 16 }}>Rôles révélés</h3>
            {gameState.players.map(p => (
              <div key={p.player} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{p.role.emoji}</span>
                <span style={{ flex: 1, color: p.alive ? "#2ecc71" : "#e74c3c" }}>{p.player}</span>
                <span style={{ color: p.role.color, fontFamily: "'Cinzel',serif", fontSize: 13 }}>{p.role.name}</span>
                <span style={{ fontSize: 12 }}>{p.alive ? "✅" : "💀"}</span>
              </div>
            ))}
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${phase === "night" ? "🌙 Nuit" : "☀️ Jour"} ${gameState.night}`} onBack={onEnd} backLabel="← Quitter" sidebar={sidebar}>
      <GlobalStyles />
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 36, color: phase === "night" ? "#6c5ce7" : "#f1c40f" }}>
          {phase === "night" ? "🌙" : "☀️"}
        </div>
        <div>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, color: phase === "night" ? "#6c5ce7" : "#f1c40f" }}>
            {phase === "night" ? `Nuit ${gameState.night}` : `Jour ${gameState.night}`}
          </h2>
          <p style={{ color: "#666", fontSize: 14 }}>
            {alive.length} joueurs en vie · {wolves.length} loup{wolves.length > 1 ? "s" : ""} · {villagers.length} villageois
          </p>
        </div>
      </div>

      {phase === "night" && (
        <div className="fade-in">
          <h3 style={{ fontFamily: "'Cinzel',serif", color: "#aaa", fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>GUIDE DE NUIT — ORDRE DES RÉVEILS</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {nightRoles.length === 0 && <p style={{ color: "#444" }}>Aucun rôle nocturne actif cette nuit.</p>}
            {nightRoles.map((r, i) => (
              <Card key={r.id} accent={i === nightStep ? r.color : "#1e1e3a"} style={{ opacity: i < nightStep ? 0.4 : 1, borderLeft: `4px solid ${i === nightStep ? r.color : "#1e1e3a"}`, transition: "all 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{r.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cinzel',serif", color: i === nightStep ? r.color : "#888", fontWeight: 700, fontSize: 16 }}>{r.name}</div>
                    <p style={{ color: "#777", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{r.power}</p>
                  </div>
                  {i === nightStep && (
                    <Btn onClick={() => setNightStep(s => s + 1)} style={{ flexShrink: 0 }}>✓ Fait</Btn>
                  )}
                  {i < nightStep && <span style={{ color: "#2ecc71", fontSize: 20 }}>✓</span>}
                </div>
              </Card>
            ))}
            {nightStep >= nightRoles.length && nightRoles.length > 0 && (
              <p style={{ color: "#2ecc71", fontSize: 14, marginTop: 8 }}>✓ Toutes les actions nocturnes sont terminées.</p>
            )}
          </div>
        </div>
      )}

      {phase === "day" && (
        <div className="fade-in">
          <h3 style={{ fontFamily: "'Cinzel',serif", color: "#aaa", fontSize: 14, letterSpacing: 2, marginBottom: 16 }}>DÉLIBÉRATION & VOTE</h3>
          <p style={{ color: "#777", marginBottom: 20, lineHeight: 1.6 }}>Le village débat. Qui est le loup ? Sélectionne le joueur à éliminer par vote.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, marginBottom: 20 }}>
            {alive.map(p => (
              <button key={p.player} onClick={() => setDayVote(dayVote === p.player ? null : p.player)}
                style={{ padding: "14px 16px", borderRadius: 12, border: `2px solid ${dayVote === p.player ? "#e74c3c" : "#2a2a4a"}`, background: dayVote === p.player ? "#c0392b22" : "#0d0d1f", color: "#e8e0d0", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.2s" }}>
                <span style={{ fontSize: 28 }}>{p.role.emoji}</span>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: 13 }}>{p.player}</span>
                {dayVote === p.player && <span style={{ fontSize: 11, color: "#e74c3c" }}>ÉLIMINÉ 🗳</span>}
              </button>
            ))}
          </div>
          {dayVote && <p style={{ color: "#e74c3c", fontSize: 14, marginBottom: 16 }}>⚠ {dayVote} sera éliminé à la fin du vote.</p>}
        </div>
      )}

      <div style={{ marginTop: 32 }}>
        <Btn onClick={nextPhase} style={{ fontSize: 16, padding: "14px 36px" }}>
          {phase === "night" ? "☀️ Passer au Jour →" : "🌙 Passer à la Nuit →"}
        </Btn>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState([]);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [gameState, setGameState] = useState(null);

  const distribute = () => {
    let pool = [];
    roles.forEach(r => { for (let i = 0; i < (selectedRoles[r.id] || 0); i++) pool.push(r); });
    pool = shuffle(pool);
    const shuffledPlayers = shuffle([...players]);
    setAssignments(shuffledPlayers.map((p, i) => ({ player: p, role: pool[i] })));
    setScreen("distribute");
  };

  const startGame = (assigns) => {
    const nightRoles = roles.filter(r => r.phase === "night" && r.nightOrder !== null)
      .sort((a, b) => a.nightOrder - b.nightOrder)
      .filter(r => assigns.some(a => a.role.id === r.id));
    setGameState({ players: assigns.map(a => ({ ...a, alive: true })), night: 1, nightRoles });
    setScreen("game");
  };

  if (screen === "home") return <><GlobalStyles /><HomeScreen onStart={() => setScreen("setup")} onRoles={() => setScreen("roles")} /></>;
  if (screen === "setup") return <SetupScreen players={players} setPlayers={setPlayers} roles={roles} selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles} onNext={distribute} onBack={() => setScreen("home")} />;
  if (screen === "roles") return <RolesScreen roles={roles} setRoles={setRoles} onBack={() => setScreen("home")} onCustom={() => setScreen("custom-role")} />;
  if (screen === "custom-role") return <CustomRoleScreen roles={roles} setRoles={setRoles} onBack={() => setScreen("roles")} />;
  if (screen === "distribute") return <DistributeScreen assignments={assignments} onDone={() => startGame(assignments)} />;
  if (screen === "game") return <GameScreen gameState={gameState} setGameState={setGameState} onEnd={() => { setScreen("home"); setPlayers([]); setSelectedRoles({}); }} />;
  return null;
}
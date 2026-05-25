import { useState, useEffect } from "react";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getMonthYear() {
  const now = new Date();
  return now.toLocaleString("en-US", { month: "long", year: "numeric" }).toUpperCase();
}

const STORAGE_KEY = "dream_architecture_v1";

const defaultData = {
  myDream: "",
  why: "",
  monthlyAxis: ["", "", ""],
  decisiveMove: "",
  weeklySchedule: Object.fromEntries(DAYS.map(d => [d, []])),
  note: "",
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  } catch {
    return defaultData;
  }
}

const C = {
  cream: "#F8F4EF",
  warmWhite: "#FDFAF7",
  taupe: "#C4B49A",
  dark: "#1C1A18",
  gold: "#9A7F5A",
  soft: "#E8E0D5",
  todayBg: "#F0EAE0",
  font: "'Cormorant Garamond', Georgia, serif",
};

export default function App() {
  const [active, setActive] = useState("dream");
  const [data, setData] = useState(loadData);
  const [showAdd, setShowAdd] = useState(null);
  const [newEvent, setNewEvent] = useState({ text: "", time: "09:00" });
  const weekDates = getWeekDates();
  const todayIdx = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  function update(field, value) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  function updateMonthly(i, val) {
    const arr = [...data.monthlyAxis];
    arr[i] = val;
    update("monthlyAxis", arr);
  }

  function addEvent() {
    if (!newEvent.text.trim() || !showAdd) return;
    const prev = data.weeklySchedule[showAdd] || [];
    update("weeklySchedule", {
      ...data.weeklySchedule,
      [showAdd]: [...prev, { text: newEvent.text.trim(), time: newEvent.time }]
        .sort((a, b) => a.time.localeCompare(b.time)),
    });
    setShowAdd(null);
    setNewEvent({ text: "", time: "09:00" });
  }

  function removeEvent(day, idx) {
    const arr = [...(data.weeklySchedule[day] || [])];
    arr.splice(idx, 1);
    update("weeklySchedule", { ...data.weeklySchedule, [day]: arr });
  }

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: C.font, color: C.dark, maxWidth: 480, margin: "0 auto" }}>
      {/* HEADER */}
      <header style={{ background: C.dark, padding: "20px 20px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <span style={{ color: C.cream, fontSize: 15, letterSpacing: "0.22em", fontWeight: 600 }}>DREAM ARCHITECTURE</span>
          <span style={{ color: C.taupe, fontSize: 10, letterSpacing: "0.15em" }}>{getMonthYear()}</span>
        </div>
        <nav style={{ display: "flex", borderTop: "1px solid rgba(196,180,154,0.2)" }}>
          {[
            { key: "dream", label: "DREAM" },
            { key: "monthly", label: "MONTHLY" },
            { key: "weekly", label: "WEEKLY" },
            { key: "note", label: "NOTE" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActive(key)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer",
              color: active === key ? C.cream : C.taupe,
              fontSize: 9, letterSpacing: "0.15em", padding: "12px 4px",
              fontFamily: C.font, fontWeight: 500,
              borderBottom: active === key ? `2px solid ${C.gold}` : "2px solid transparent",
              transition: "all 0.2s",
            }}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: "28px 20px", paddingBottom: 60 }}>

        {/* DREAM */}
        {active === "dream" && (
          <div>
            <SectionTitle number="01" title="MY DREAM" />
            <Textarea value={data.myDream} onChange={e => update("myDream", e.target.value)} placeholder="Write your dream here..." rows={6} />
            <Divider />
            <SectionTitle number="02" title="WHY" subtitle="Your deeper purpose" />
            <Textarea value={data.why} onChange={e => update("why", e.target.value)} placeholder="Why does this dream matter to you?" rows={5} />
            <div style={{ borderLeft: `2px solid ${C.gold}`, paddingLeft: 16, marginTop: 28 }}>
              <span style={{ fontSize: 13, color: C.taupe, fontStyle: "italic", letterSpacing: "0.04em", lineHeight: 1.7 }}>
                "The future belongs to those who believe in the beauty of their dreams."
              </span>
            </div>
          </div>
        )}

        {/* MONTHLY */}
        {active === "monthly" && (
          <div>
            <SectionTitle number="03" title="MONTHLY AXIS" subtitle={getMonthYear()} />
            <p style={{ fontSize: 11, color: C.taupe, letterSpacing: "0.1em", marginBottom: 20, marginTop: -10 }}>3 pillars that define this month</p>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <span style={{ fontSize: 24, color: C.taupe, fontWeight: 300, minWidth: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                <input
                  style={{ flex: 1, background: "none", border: "none", borderBottom: `1px solid ${C.soft}`, padding: "10px 4px", fontSize: 17, fontFamily: C.font, color: C.dark, outline: "none", letterSpacing: "0.04em" }}
                  placeholder={["Focus", "Growth", "Release"][i]}
                  value={data.monthlyAxis[i]}
                  onChange={e => updateMonthly(i, e.target.value)}
                />
              </div>
            ))}
            <Divider />
            <SectionTitle number="04" title="THIS WEEK'S DECISIVE MOVE" />
            <Textarea value={data.decisiveMove} onChange={e => update("decisiveMove", e.target.value)} placeholder="The one action that changes everything this week..." rows={4} />
          </div>
        )}

        {/* WEEKLY */}
        {active === "weekly" && (
          <div>
            <SectionTitle number="05" title="WEEKLY" subtitle="Tap + to add events" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DAYS.map((day, idx) => {
                const date = weekDates[idx];
                const isToday = idx === todayIdx;
                const events = data.weeklySchedule[day] || [];
                return (
                  <div key={day} style={{
                    background: isToday ? C.todayBg : C.warmWhite,
                    border: `1px solid ${isToday ? C.gold : C.soft}`,
                    borderRadius: 4, padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: events.length ? 10 : 0 }}>
                      <div>
                        <div style={{ fontSize: 9, letterSpacing: "0.18em", color: isToday ? C.gold : C.taupe }}>{day}</div>
                        <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1, marginTop: 2 }}>{date.getDate()}</div>
                      </div>
                      <button onClick={() => { setShowAdd(day); setNewEvent({ text: "", time: "09:00" }); }} style={{
                        width: 30, height: 30, borderRadius: "50%", background: C.dark, color: C.cream,
                        border: "none", fontSize: 20, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", fontWeight: 300, lineHeight: 1,
                      }}>+</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {events.map((ev, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", background: C.cream, borderRadius: 3 }}>
                          <span style={{ fontSize: 10, color: C.gold, letterSpacing: "0.08em", minWidth: 36 }}>{ev.time}</span>
                          <span style={{ flex: 1, fontSize: 14 }}>{ev.text}</span>
                          <button onClick={() => removeEvent(day, i)} style={{ background: "none", border: "none", color: C.taupe, fontSize: 16, cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* NOTE */}
        {active === "note" && (
          <div>
            <SectionTitle number="06" title="NOTE" subtitle="Free space for thoughts" />
            <Textarea value={data.note} onChange={e => update("note", e.target.value)} placeholder="Thoughts, ideas, reflections..." rows={16} />
          </div>
        )}
      </main>

      {/* ADD EVENT MODAL */}
      {showAdd && (
        <div onClick={() => setShowAdd(null)} style={{ position: "fixed", inset: 0, background: "rgba(28,26,24,0.6)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.warmWhite, width: "100%", maxWidth: 480, margin: "0 auto", borderRadius: "12px 12px 0 0", padding: "28px 24px 48px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: C.taupe }}>ADD EVENT — {showAdd}</div>
            <input
              autoFocus
              style={{ background: C.cream, border: `1px solid ${C.soft}`, borderRadius: 4, padding: "12px 14px", fontSize: 16, fontFamily: C.font, color: C.dark, width: "100%" }}
              placeholder="Event name"
              value={newEvent.text}
              onChange={e => setNewEvent(s => ({ ...s, text: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addEvent()}
            />
            <input
              type="time"
              style={{ background: C.cream, border: `1px solid ${C.soft}`, borderRadius: 4, padding: "12px 14px", fontSize: 16, fontFamily: C.font, color: C.dark, width: "100%" }}
              value={newEvent.time}
              onChange={e => setNewEvent(s => ({ ...s, time: e.target.value }))}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={() => setShowAdd(null)} style={{ flex: 1, padding: 12, background: "none", border: `1px solid ${C.soft}`, borderRadius: 4, fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", fontFamily: C.font, color: C.taupe }}>CANCEL</button>
              <button onClick={addEvent} style={{ flex: 1, padding: 12, background: C.dark, border: "none", borderRadius: 4, fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", fontFamily: C.font, color: C.cream }}>ADD</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ number, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
      <span style={{ fontSize: 11, color: "#C4B49A", letterSpacing: "0.1em" }}>{number}</span>
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "0.12em", lineHeight: 1.1 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: "#C4B49A", letterSpacing: "0.15em", marginTop: 2 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%", background: "#FDFAF7", border: "1px solid #E8E0D5",
        borderRadius: 4, padding: "14px 16px", fontSize: 16,
        fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#1C1A18",
        resize: "none", outline: "none", lineHeight: 1.7, letterSpacing: "0.02em",
      }}
    />
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#E8E0D5", margin: "24px 0" }} />;
}

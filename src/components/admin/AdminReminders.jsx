import React, { useEffect, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { db } from "@/api/base44Client";
import { formatDate, formatINR } from "@/lib/sdlUtils";

const STAGES = ["all", "upcoming", "due_today", "overdue"];

export default function AdminReminders() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    const list = await db.entities.RepaymentReminder.list("-created_date", 200).catch(() => []);
    setRows(list);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const runNow = async () => {
    setRunning(true);
    setMessage("");
    try {
      const res = await db.functions.invoke("sendRepaymentReminders", { force: true });
      setMessage(`Generated ${res.generated || 0}, sent ${res.sent || 0}, failed ${res.failed || 0}.`);
      await loadData();
    } catch (e) {
      setMessage(e.message || "Reminder run failed.");
    } finally {
      setRunning(false);
    }
  };

  const filtered = filter === "all" ? rows : rows.filter((r) => r.stage === filter);

  if (loading) return <div className="neu-card p-6 text-center text-sm text-slate-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="neu-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-700">Repayment reminders</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Nightly email run at 08:00 IST</p>
          </div>
          <button
            onClick={runNow}
            disabled={running}
            className="sdl-gradient px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${running ? "animate-spin" : ""}`} /> Run now
          </button>
        </div>
        {message && <p className="text-[11px] text-slate-500 mt-2">{message}</p>}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STAGES.map((stage) => (
          <button
            key={stage}
            onClick={() => setFilter(stage)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap ${filter === stage ? "sdl-gradient text-white" : "neu-btn text-slate-500"}`}
          >
            {stage.replace("_", " ")}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="neu-card p-6 text-center text-sm text-slate-400">No reminders yet.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="neu-card-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">{r.user_name || r.loan_code || "Borrower"}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {r.stage_label || r.stage} · Due {formatDate(r.due_date)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold sdl-gradient-text">{formatINR(r.total_payable || r.repayment_amount)}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                  <Bell className="w-3 h-3" /> {r.email_status || "pending"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { X } from "lucide-react";
import { formatDate, formatINR } from "@/lib/sdlUtils";

const STATUS_STYLES = {
  pending_disbursement: "bg-amber-50 text-amber-600",
  disbursed: "bg-blue-50 text-blue-600",
  pending_verification: "bg-purple-50 text-purple-600",
  repaid: "bg-green-50 text-green-600",
  overdue: "bg-red-50 text-sdl-red",
  rejected: "bg-slate-100 text-slate-500",
};

const STATUS_LABELS = {
  pending_disbursement: "Pending",
  disbursed: "Active",
  pending_verification: "Verifying",
  repaid: "Repaid",
  overdue: "Overdue",
  rejected: "Rejected",
};

export default function AllLoansModal({ loans = [], onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-t-3xl p-5 neu-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-700">All Loans</h3>
          <button onClick={onClose} className="neu-btn w-9 h-9 rounded-full flex items-center justify-center">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {loans.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No loans yet.</p>
        ) : (
          <div className="space-y-2">
            {loans.map((loan) => (
              <div key={loan.id} className="neu-card-sm p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">{formatINR(loan.amount)}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {loan.loan_id || "Loan"} · Due {formatDate(loan.due_date)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold ${STATUS_STYLES[loan.status] || "bg-slate-100 text-slate-500"}`}>
                    {STATUS_LABELS[loan.status] || loan.status}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">Repay {formatINR(loan.repayment_amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

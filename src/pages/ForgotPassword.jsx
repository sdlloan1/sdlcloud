import { db } from "@/api/base44Client";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import NeuAuthLayout from "@/components/NeuAuthLayout";
import NeuInput from "@/components/NeuInput";
import PasswordInput from "@/components/PasswordInput";
import NeuButton from "@/components/NeuButton";
import { useAuth } from "@/lib/AuthContext";
import { Mail, ArrowLeft, KeyRound, Lock } from "lucide-react";

// Password reset in two steps: a six-digit code emailed to the account, then the
// new password. The emailed reset link keeps working too (see ResetPassword).
export default function ForgotPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [email, setEmail] = useState(params.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const sendCode = async (e) => {
    e?.preventDefault();
    setError("");
    if (!validEmail) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await db.auth.requestResetCode(email.trim());
      setStep("code");
    } catch (err) {
      setError(err.message || "Could not send the code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const resetToken = await db.auth.verifyResetCode(email.trim(), code.trim());
      await db.auth.resetPassword({ resetToken, newPassword: password });
      await checkUserAuth();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Could not reset your password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeuAuthLayout
      title="Reset Password"
      subtitle={step === "email" ? "We'll email you a 6-digit reset code" : "Enter the code and your new password"}
      footer={
        <Link to="/login" className="sdl-gradient-text font-semibold inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to log in
        </Link>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-sdl-red text-sm text-center neu-inset-sm">{error}</div>
      )}
      {step === "email" ? (
        <form onSubmit={sendCode} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Email Address</label>
            <NeuInput
              type="email"
              icon={Mail}
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <NeuButton type="submit" variant="gradient" loading={loading} className="w-full h-12 rounded-2xl">
            Send Reset Code
          </NeuButton>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Reset code</label>
            <NeuInput
              icon={KeyRound}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500 mt-2 ml-1">
              Sent to {email}.{" "}
              <button type="button" onClick={sendCode} className="sdl-gradient-text font-semibold">
                Resend
              </button>
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">New Password</label>
            <PasswordInput
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Confirm Password</label>
            <PasswordInput
              icon={Lock}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <NeuButton type="submit" variant="gradient" loading={loading} className="w-full h-12 rounded-2xl">
            Reset Password
          </NeuButton>
        </form>
      )}
    </NeuAuthLayout>
  );
}

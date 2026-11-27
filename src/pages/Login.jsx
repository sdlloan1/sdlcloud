import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ShieldCheck, KeyRound } from "lucide-react";
import NeuAuthLayout from "@/components/NeuAuthLayout";
import NeuInput from "@/components/NeuInput";
import PasswordInput from "@/components/PasswordInput";
import NeuButton from "@/components/NeuButton";
import { db } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Passwordless sign-in: a six-digit code emailed to the account.
  const [useCode, setUseCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [loginCode, setLoginCode] = useState("");
  const [sendingCode, setSendingCode] = useState(false);

  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  const handleSendCode = async () => {
    setError("");
    if (!validEmail) {
      setError("Enter a valid email address");
      return;
    }
    setSendingCode(true);
    try {
      await db.auth.requestLoginCode(email.trim());
      setCodeSent(true);
    } catch (err) {
      setError(err.message || "Could not send the code. Try again.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNeedsPassword(false);
    setLoading(true);
    try {
      if (useCode) {
        await db.auth.loginWithCode(email.trim(), loginCode.trim());
      } else {
        await db.auth.loginViaEmailPassword(email, password, code || undefined);
      }
      await checkUserAuth();
      navigate("/", { replace: true });
    } catch (err) {
      if (err.code === "mfa_required") {
        setNeedsCode(true);
        setError("");
      } else if (err.code === "password_not_set") {
        setNeedsPassword(true);
        setError("");
      } else {
        setError(err.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeuAuthLayout
      title="Welcome Back"
      subtitle={useCode ? "We'll email you a one-time login code" : "Log in to your SDL account"}
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="sdl-gradient-text font-semibold">Create one</Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-sdl-red text-sm text-center neu-inset-sm">
          {error}
        </div>
      )}
      {needsPassword && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 text-sm text-center neu-inset-sm">
          <p className="text-slate-600 mb-1">This account was imported from the old app and has no password yet.</p>
          <Link
            to={`/forgot-password?email=${encodeURIComponent(email)}`}
            className="sdl-gradient-text font-semibold"
          >
            Set your password
          </Link>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Email</label>
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
        {!useCode && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-500 ml-1">Password</label>
              <Link to="/forgot-password" className="text-xs sdl-gradient-text font-medium">Forgot password?</Link>
            </div>
            <PasswordInput
              icon={Lock}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}
        {useCode && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-500 ml-1">Login code</label>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode}
                className="text-xs sdl-gradient-text font-medium"
              >
                {sendingCode ? "Sending..." : codeSent ? "Resend code" : "Email me a code"}
              </button>
            </div>
            <NeuInput
              icon={KeyRound}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500 mt-2 ml-1">
              {codeSent ? `Code sent to ${email}.` : "Enter the 6-digit code from your email."}
            </p>
          </div>
        )}
        {needsCode && (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Two-factor code</label>
            <NeuInput
              icon={ShieldCheck}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
        )}
        <NeuButton type="submit" variant="gradient" loading={loading} className="w-full h-12 rounded-2xl mt-2">
          {!loading && <LogIn className="w-4 h-4" />}
          {loading ? "Logging in..." : useCode ? "Log In with Code" : "Log In"}
        </NeuButton>
        <button
          type="button"
          onClick={() => {
            setUseCode(!useCode);
            setCodeSent(false);
            setLoginCode("");
            setError("");
          }}
          className="w-full text-xs text-slate-500 hover:text-slate-700 text-center"
        >
          {useCode ? "Use my password instead" : "Sign in with an emailed code instead"}
        </button>
      </form>
    </NeuAuthLayout>
  );
}

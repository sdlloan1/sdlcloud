import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ShieldCheck, ShieldOff } from "lucide-react";
import NeuAuthLayout from "@/components/NeuAuthLayout";
import NeuInput from "@/components/NeuInput";
import PasswordInput from "@/components/PasswordInput";
import NeuButton from "@/components/NeuButton";
import { db } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

// Two-factor authentication settings: an authenticator app plus one-time recovery codes.
export default function Mfa() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState("");
  const [uri, setUri] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const status = await db.auth.mfaStatus();
      setEnabled(status.enabled);
    } catch (e) {
      setError(e.message || "Could not load your security settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStatus(); }, []);

  const startEnrol = async () => {
    setError("");
    setBusy(true);
    try {
      const result = await db.auth.mfaEnroll();
      setSecret(result.secret);
      setUri(result.otpauth_url);
    } catch (e) {
      setError(e.message || "Could not start setup");
    } finally {
      setBusy(false);
    }
  };

  const activate = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await db.auth.mfaActivate(code.trim());
      setRecoveryCodes(result.recovery_codes || []);
      setEnabled(true);
      setSecret("");
      setUri("");
      setCode("");
    } catch (err) {
      setError(err.message || "That code is not valid");
    } finally {
      setBusy(false);
    }
  };

  const disable = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await db.auth.mfaDisable(password);
      setEnabled(false);
      setPassword("");
      setRecoveryCodes([]);
    } catch (err) {
      setError(err.message || "Could not turn off two-factor authentication");
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <NeuAuthLayout
        title="Two-Factor Authentication"
        subtitle="Sign in to manage your security settings"
        footer={<Link to="/login" className="sdl-gradient-text font-semibold">Log in</Link>}
      >
        <p className="text-sm text-slate-500 text-center">You need to be signed in.</p>
      </NeuAuthLayout>
    );
  }

  return (
    <NeuAuthLayout
      title="Two-Factor Authentication"
      subtitle="Add an extra layer of protection when signing in"
      footer={<Link to="/" className="sdl-gradient-text font-semibold">Back to app</Link>}
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-sdl-red text-sm text-center neu-inset-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 text-center py-4">Loading...</p>
      ) : enabled ? (
        <div className="space-y-4">
          <div className="neu-card-sm p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-slate-700">Authenticator app is on</p>
              <p className="text-[11px] text-slate-400 mt-0.5">You'll be asked for a code each time you sign in.</p>
            </div>
          </div>
          {recoveryCodes.length > 0 && (
            <div className="neu-card-sm p-4">
              <p className="text-xs font-semibold text-slate-600 mb-2">Save these recovery codes</p>
              <div className="grid grid-cols-2 gap-1.5">
                {recoveryCodes.map((value) => (
                  <code key={value} className="text-xs text-slate-600 neu-inset-sm px-2 py-1 rounded-lg">{value}</code>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={disable} className="space-y-3">
            <PasswordInput
              icon={KeyRound}
              autoComplete="current-password"
              placeholder="Confirm your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <NeuButton type="submit" loading={busy} className="w-full h-12 rounded-2xl text-sdl-red">
              {!busy && <ShieldOff className="w-4 h-4" />}
              Turn off
            </NeuButton>
          </form>
        </div>
      ) : secret ? (
        <form onSubmit={activate} className="space-y-4">
          <div className="neu-card-sm p-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">Add this key to your authenticator app</p>
            <code className="block text-xs text-slate-600 neu-inset-sm px-3 py-2 rounded-lg break-all">{secret}</code>
            <p className="text-[11px] text-slate-400 mt-2 break-all">{uri}</p>
          </div>
          <NeuInput
            icon={ShieldCheck}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter the 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <NeuButton type="submit" variant="gradient" loading={busy} className="w-full h-12 rounded-2xl">
            {!busy && <ShieldCheck className="w-4 h-4" />}
            Turn on
          </NeuButton>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="neu-card-sm p-4 flex items-center gap-3">
            <ShieldOff className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm font-semibold text-slate-700">Authenticator app is off</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Protect your account with a 6-digit code.</p>
            </div>
          </div>
          <NeuButton onClick={startEnrol} variant="gradient" loading={busy} className="w-full h-12 rounded-2xl">
            {!busy && <ShieldCheck className="w-4 h-4" />}
            Set up authenticator
          </NeuButton>
        </div>
      )}
    </NeuAuthLayout>
  );
}

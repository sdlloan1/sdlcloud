import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus, User } from "lucide-react";
import NeuAuthLayout from "@/components/NeuAuthLayout";
import NeuInput from "@/components/NeuInput";
import PasswordInput from "@/components/PasswordInput";
import NeuButton from "@/components/NeuButton";
import { db } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await db.auth.register({ email, password, full_name: fullName });
      await checkUserAuth();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Could not create your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NeuAuthLayout
      title="Create Account"
      subtitle="Start borrowing on your salary date"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="sdl-gradient-text font-semibold">Log in</Link>
        </>
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 text-sdl-red text-sm text-center neu-inset-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Full name</label>
          <NeuInput
            icon={User}
            autoComplete="name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Email</label>
          <NeuInput
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Password</label>
          <PasswordInput
            icon={Lock}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2 ml-1">Confirm password</label>
          <PasswordInput
            icon={Lock}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <NeuButton type="submit" variant="gradient" loading={loading} className="w-full h-12 rounded-2xl mt-2">
          {!loading && <UserPlus className="w-4 h-4" />}
          {loading ? "Creating account..." : "Create Account"}
        </NeuButton>
      </form>
    </NeuAuthLayout>
  );
}

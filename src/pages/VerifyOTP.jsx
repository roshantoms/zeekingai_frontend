import React, { useState } from "react";
import client from "../api/axiosClient";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Verify OTP, 2: Reset Password

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await client.post("/auth/verify-otp/", { email, otp });
      setMessage("OTP verified successfully!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await client.post("/auth/reset-password/", {
        email,
        otp,
        new_password: newPassword,
        confirm_new_password: confirmPassword
      });

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">🤖 ZeekingAI</div>
          <h2>Reset Password</h2>
          <p>{step === 1 ? "Enter OTP sent to your email" : "Set your new password"}</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={email || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">OTP Code</label>
              <input
                className="form-input"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                disabled={loading}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-info">{message}</div>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                className="form-input"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-info">{message}</div>}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Resetting...
              </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
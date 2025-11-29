import React, { useState } from "react";
import client from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/z_ico.ico";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await client.post("/auth/forgot-password/", { email });

      // For development, show OTP in alert
      if (res.data.otp) {
        alert(`DEV: Your OTP is ${res.data.otp}. In production, this would be sent via email.`);
      }

      setMessage(res.data.message || "OTP sent to your email!");

      // Redirect to OTP verification page
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <img src={logo} alt=" " className="logo-icon" />
            ZeekingAI
          </div>
          <h2>Forgot Password</h2>
          <p>Enter your email to receive OTP</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              disabled={loading}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-info">{message}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
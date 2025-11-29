import React, { useState } from "react";
import client from "../api/axiosClient";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import logo from "../assets/z_ico.ico";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (pass !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api";
      const res = await client.post(`${base}/auth/reset-password/`, {
        email: searchParams.get("email") || "",
        otp: token || searchParams.get("otp") || "",
        new_password: pass,
        confirm_new_password: confirm
      });
      setMsg(res.data.message || "Password reset. Please login.");
      setTimeout(()=>nav("/login"), 1200);
    } catch (err) {
      setMsg(err.response?.data?.error || "Reset failed.");
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
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <input
              className="form-input"
              type="password"
              required
              placeholder="New password"
              value={pass}
              onChange={(e)=>setPass(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="password"
              required
              placeholder="Confirm password"
              value={confirm}
              onChange={(e)=>setConfirm(e.target.value)}
              disabled={loading}
            />
          </div>

          <button className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        {msg && <div className="alert alert-info mt-3">{msg}</div>}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
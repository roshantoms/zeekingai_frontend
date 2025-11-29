import React, { useState } from "react";
import client from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/z_ico.ico";

export default function Register() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm_password) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await client.post("/auth/register/", form);

      // Store tokens from response
      if (res.data.tokens && res.data.tokens.access) {
        localStorage.setItem("access", res.data.tokens.access);
        localStorage.setItem("refresh", res.data.tokens.refresh);
        alert(res.data.message || "Registration successful!");
        nav("/chat");
      } else {
        setErr("Registration failed: No tokens received");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          setErr(errorData);
        } else if (errorData.email) {
          setErr(errorData.email[0]);
        } else if (errorData.error) {
          setErr(errorData.error);
        } else {
          setErr("Registration failed");
        }
      } else {
        setErr("Network error. Please try again.");
      }
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
          <h2>Create your account</h2>
          <p>Join our AI-powered assistant</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input
              className="form-input"
              required
              value={form.full_name}
              onChange={(e)=>setForm({...form, full_name:e.target.value})}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              required
              value={form.email}
              onChange={(e)=>setForm({...form, email:e.target.value})}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              required
              value={form.password}
              onChange={(e)=>setForm({...form, password:e.target.value})}
              placeholder="Create a password (min. 6 characters)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              required
              value={form.confirm_password}
              onChange={(e)=>setForm({...form, confirm_password:e.target.value})}
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          {err && (
            <div className="alert alert-error">
              {err}
            </div>
          )}

          <button className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
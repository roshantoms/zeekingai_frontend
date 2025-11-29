import React, { useState } from "react";
import client from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/z_ico.ico";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.email || !form.password) {
      setErr("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await client.post("/auth/login/", {
        email: form.email,
        password: form.password
      });

      console.log("Login response:", res.data);

      // Store tokens from response
      if (res.data.tokens && res.data.tokens.access) {
        localStorage.setItem("access", res.data.tokens.access);
        localStorage.setItem("refresh", res.data.tokens.refresh);
        console.log("Login successful, redirecting to chat...");
        nav("/chat", { replace: true });
      } else {
        setErr("Login failed: No access token received");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          setErr(errorData);
        } else if (errorData.detail) {
          setErr(errorData.detail);
        } else if (errorData.error) {
          setErr(errorData.error);
        } else if (errorData.message) {
          setErr(errorData.message);
        } else {
          setErr("Invalid email or password");
        }
      } else if (error.request) {
        setErr("Network error. Please check your connection.");
      } else {
        setErr("An unexpected error occurred.");
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
          <h2>Welcome back</h2>
          <p>Sign in to continue your AI journey</p>
        </div>

        <form onSubmit={submit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
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
              onChange={(e) => setForm({...form, password: e.target.value})}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          {err && (
            <div className="alert alert-error">
              {err}
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
          <span>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
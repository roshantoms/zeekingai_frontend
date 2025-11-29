import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import client from "../api/axiosClient";
import logo from "../assets/z_ico.ico";

export default function Topbar() {
  const navigate = useNavigate();
  const [tokensLeft, setTokensLeft] = useState(null);
  const [dailyTokensUsed, setDailyTokensUsed] = useState(0);
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const isLogged = !!localStorage.getItem("access");

  useEffect(() => {
    if (isLogged) {
      getUserProfile();
    }
  }, [isLogged]);

  const getUserProfile = async () => {
    try {
      const res = await client.get("/auth/stats/");
      setTokensLeft(res.data.tokens_left ?? 10000);
      setDailyTokensUsed(res.data.daily_tokens_used ?? 0);
      setUser(res.data);
    } catch (err) {
      console.error("Profile error:", err);
    }
  };

  const clearChat = () => {
    window.dispatchEvent(new CustomEvent('clearChat'));
  };

  return (
    <nav className="topbar">
      <div className="topbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="ZeekingAI" className="logo-icon" />
          ZeekingAI
        </Link>
        <div className="topbar-actions">
          {isLogged && (
            <div className="topbar-info">
              <div className="token-badge">
                <i className="fa fa-calendar me-1"></i>
                <span>Daily: {dailyTokensUsed}/5000</span>
              </div>
              <div className="token-badge">
                <i className="fa fa-coins me-1"></i>
                <span>Total: {tokensLeft}</span>
              </div>
            </div>
          )}
          <ThemeToggle />
          {isLogged ? (
            <div className="topbar-buttons">
              <button className="btn-logout" onClick={logout}>
                <i className="fa fa-sign-out me-1"></i>
                Logout
              </button>
            </div>
          ) : (
            <div className="topbar-buttons">
              <Link to="/login" className="btn-login">
                <i className="fa fa-sign-in me-1"></i>
                Login
              </Link>
              <Link to="/register" className="btn-register">
                <i className="fa fa-user-plus me-1"></i>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
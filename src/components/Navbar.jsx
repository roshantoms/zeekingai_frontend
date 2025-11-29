import { Link } from "react-router-dom";
import logo from "../assets/z_ico.ico";

export default function Navbar() {
  return (
    <nav className="topnav">
      <Link to="/" className="logo-link">
        <img src={logo} alt=" " className="logo-icon" />
        ZeekingAI
      </Link>

      <div className="right">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Bot, Menu } from "lucide-react";
//import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; 
import "./Navbar.css";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="navbar"
    >
      <Link to="/" className="navbar-brand">
        <Bot className="logo-icon" />
        <span className="brand-text">TranslateAI</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/features">Features</NavLink>
        <NavLink to="/languages">Languages</NavLink>
        <NavLink to="/voice">Voice Tools</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
      </div>

      <div className="nav-buttons">
        <button className="btn ghost">Sign In</button>
        <button className="btn primary">Get Started</button>
      </div>

      <button className="btn icon mobile-menu">
        <Menu className="menu-icon" />
      </button>
    </motion.nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="nav-link">
      {children}
      <span className="underline" />
    </Link>
  );
}

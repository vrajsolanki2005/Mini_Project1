import React from "react";
import { Bot, Menu } from "lucide-react";
import { motion } from "framer-motion";
import "./Navbar.css";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar"
    >
      <a href="/" className="brand">
        <Bot className="icon" />
        <span className="brand-text">ResearchAI</span>
      </a>

      <div className="nav-links">
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/how-it-works">How it Works</NavLink>
        <NavLink href="/examples">Examples</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
      </div>

      <div className="auth-buttons">
        <button className="btn ghost">Sign In</button>
        <button className="btn primary">Get Started</button>
      </div>

      <button className="menu-button">
        <Menu className="menu-icon" />
      </button>
    </motion.nav>
  );
}

function NavLink({ href, children }) {
  return (
    <a href={href} className="nav-link">
      {children}
      <span className="underline" />
    </a>
  );
}

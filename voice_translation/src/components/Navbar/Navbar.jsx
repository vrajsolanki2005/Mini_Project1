import React, { useState, useEffect } from "react";
import { Bot, Menu, LogOut } from "lucide-react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  
    if (authStatus) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
        setUserName(userInfo.name || userInfo.email?.split("@")[0] || "User");
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/sign-in");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="navbar"
      >
        <a href="/" className="brand">
          <Bot className="icon purple" />
          <span className="brand-name">TranslateAI</span>
        </a>

        <div className="nav-links desktop">
          <NavLink href="/features">Features</NavLink>
          <NavLink href="/languages">Languages</NavLink>
          <NavLink href="/voice">Voice Tools</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
        </div>

        <div className="auth-controls desktop">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="user-name">Hi, {userName}</span>
              <Button color="inherit" onClick={handleSignOut} startIcon={<LogOut size={16} />}>
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <a href="/sign-in">
                <Button color="inherit">Sign In</Button>
              </a>
              <a href="/get-started">
                <Button variant="contained" color="secondary">
                  Get Started
                </Button>
              </a>
            </>
          )}
        </div>

        <Button className="menu-toggle" onClick={toggleMobileMenu}>
  <Menu />
</Button>

      </motion.nav>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <a href="/features">Features</a>
          <a href="/languages">Languages</a>
          <a href="/voice">Voice Tools</a>
          <a href="/pricing">Pricing</a>

          <div className="mobile-auth">
            {isAuthenticated ? (
              <>
                <div className="user-name">Hi, {userName}</div>
                <Button color="inherit" onClick={handleSignOut} startIcon={<LogOut size={16} />} fullWidth>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <a href="/sign-in">
                  <Button variant="outlined" fullWidth>
                    Sign In
                  </Button>
                </a>
                <a href="/get-started">
                  <Button variant="contained" color="secondary" fullWidth>
                    Get Started
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </>
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

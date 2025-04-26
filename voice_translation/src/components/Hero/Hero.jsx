import React from "react";
import { motion } from "framer-motion";
import { Languages, Mic, Headphones } from "lucide-react";
import "./Hero.css";

export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="hero-title">
              Real-Time
              <span className="gradient-text"> Voice <br/>Translation</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-subtext"
          >
            Break language barriers with our AI-powered translation platform.
            Speak in your language and get instant voice translations in over 5 languages.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hero-buttons"
          >
            <button className="btn primary">
              <Mic className="icon" />
              Start Translating
            </button>
            <button className="btn outline">
              <Languages className="icon" />
              Supported Languages
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="features"
          >
            <FeatureCard
              icon={<Languages className="feature-icon" />}
              title="50+ Languages"
              description="Support for major world languages with high accuracy translations"
            />
            <FeatureCard
              icon={<Mic className="feature-icon" />}
              title="Voice Recognition"
              description="Advanced AI speech recognition with dialect support"
            />
            <FeatureCard
              icon={<Headphones className="feature-icon" />}
              title="Natural Speech"
              description="Human-like voice output in the target language"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="icon-wrapper">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

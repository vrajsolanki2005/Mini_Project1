import React from "react";
import Hero from "../../components/Hero/Hero";
import Navbar from "../../components/Navbar/Navbar";
import { SparklesCore } from "../../components/Sparkles/SparklesCore";
import "./HomePage.css"; 

function HomePage() {
  return (
    // <div>Hello from HomePage</div>
    <main className="home-container">
      {/* Ambient background with moving particles */}
      <div className="sparkles-background">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="sparkles-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="content-wrapper">
        <Navbar />
        <Hero />
      </div>
    </main>
  );
}

export default HomePage;

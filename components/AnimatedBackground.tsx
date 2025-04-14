"use client";

import React from 'react';
import CursorParticles from './CursorParticles';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden">
      {/* Circuit pattern in the background */}
      <div 
        className="absolute inset-0 opacity-10 bg-circuit-pattern bg-repeat animate-subtle-pan"
        style={{ backgroundSize: '400px' }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary to-primary"></div>
      
      {/* Dark vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient"></div>
      
      {/* Interactive particles */}
      <CursorParticles />
    </div>
  );
};

export default AnimatedBackground;

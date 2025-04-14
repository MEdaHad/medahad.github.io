"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  const scanRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Animate the scanning effect
    if (!scanRef.current) return;
    
    const scanAnimation = () => {
      if (!scanRef.current) return;
      scanRef.current.style.top = '-100%';
      scanRef.current.style.opacity = '0.7';
      
      setTimeout(() => {
        if (!scanRef.current) return;
        scanRef.current.style.transition = 'top 1.5s ease-in-out, opacity 0.2s ease-in-out';
        scanRef.current.style.top = '100%';
        scanRef.current.style.opacity = '0';
      }, 100);
      
      setTimeout(() => {
        if (!scanRef.current) return;
        scanRef.current.style.transition = 'none';
        scanRef.current.style.top = '-100%';
      }, 1700);
    };
    
    // Initial scan
    setTimeout(scanAnimation, 1000);
    
    // Set interval for repeated scanning effect
    const interval = setInterval(scanAnimation, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center">
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Text content */}
          <div className="max-w-2xl order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-white">Medhane </span>
                <span className="text-accent-cyan">Hadush</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl md:text-2xl mb-6 text-text-medium"
            >
              <TypeAnimation
                sequence={[
                  'Threat Detection',
                  2000,
                  'Incident Response',
                  2000,
                  'Web Development',
                  2000,
                  'Security Engineering',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-text-light mb-8"
            >
              A Cybersecurity Analyst and Web Developer with over 5 years of expertise
              in threat detection, incident response, and web development. Experienced in
              JavaScript, React, Django, Java, Python, and AWS.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#projects" className="btn-primary flex items-center gap-2">
                View Projects
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://medahad.github.io/MedaHad_CV.pdf" target="_blank" rel="noopener noreferrer" className="bg-transparent text-text-light hover:text-accent-cyan border border-secondary px-6 py-2.5 rounded-md transition-all duration-300">
                Download Resume
              </a>
            </motion.div>
          </div>
          
          {/* Profile Image */}
          <motion.div 
            className="order-1 md:order-2 flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            <div className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px] group">
              {/* Circle Frame with Cyber Effect */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-accent-cyan 
                  before:absolute before:inset-0 before:rounded-full 
                  before:border-2 before:border-accent-cyan/40 before:scale-110 before:animate-pulse" 
              />
              
              {/* Binary code orbital ring (decorative element) */}
              <div className="absolute inset-0 rounded-full border border-accent-cyan/20 
                animate-[spin_20s_linear_infinite] flex items-center justify-center overflow-hidden">
                <div className="absolute w-full h-full rounded-full text-[8px] text-accent-cyan/30 
                  overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 rotate-[120deg]">
                    01001100 01101111 01110010 01100101 01101101 00100000 01001001 01110000 01110011 01110101 01101101
                  </div>
                </div>
              </div>
              
              {/* Image Container */}
              <div className="absolute inset-[10px] rounded-full overflow-hidden bg-secondary/60 backdrop-blur-sm 
                shadow-lg group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {/* Using standard img tag with direct path */}
                  <img 
                    src="/images/profile.jpg" 
                    alt="Medhane Hadush" 
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                  
                  {/* Fallback if image errors */}
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-cyan-900 to-blue-900">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-32 h-32 text-accent-cyan" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="text-accent-cyan text-xl font-semibold mt-2">MH</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Scanning Effect Overlay */}
                  <div 
                    ref={scanRef}
                    className="absolute left-0 w-full h-[40%] bg-gradient-to-b from-accent-cyan/0 via-accent-cyan/40 to-accent-cyan/0
                      pointer-events-none opacity-0"
                    style={{ top: '-100%' }}
                  />
                  
                  {/* Digital Noise Overlay - using a CSS pattern instead of image */}
                  <div className="absolute inset-0 mix-blend-screen opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" 
                      style={{ 
                        backgroundImage: `radial-gradient(circle at center, rgba(0,229,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '4px 4px'
                      }} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 
                transition-opacity duration-500 bg-accent-cyan blur-xl" />
                
              {/* Cyber scan line that moves on hover */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute w-full h-[2px] bg-accent-cyan/70 top-1/2 
                  group-hover:animate-[scanLine_1.5s_ease-in-out_infinite] blur-[1px]" />
              </div>
              
              {/* Matrix-like dots around the circle */}
              <div className="absolute -inset-4 z-[-1]">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-[5px] h-[5px] rounded-full bg-accent-cyan/80"
                    style={{
                      top: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
                      left: `${50 + 45 * Math.cos(i * Math.PI / 4)}%`,
                      animation: `pulse 3s infinite ${i * 0.3}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 
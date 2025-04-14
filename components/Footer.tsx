"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { SiTryhackme } from 'react-icons/si';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(2023); // Default value for SSR
  
  useEffect(() => {
    // Update the year on the client side
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary-50 text-text-light py-8 border-t border-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-4 md:mb-0">
            <FaShieldAlt className="text-accent-cyan text-xl" />
            <span className="font-bold text-lg text-white">Medhane <span className="text-accent-cyan">Hadush</span></span>
          </Link>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://linkedin.com/in/medhane-hadush" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-medium hover:text-accent-cyan transition-colors"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedinIn className="text-lg" />
            </a>
            <a 
              href="https://github.com/medahad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-medium hover:text-accent-cyan transition-colors"
              aria-label="GitHub Profile"
            >
              <FaGithub className="text-lg" />
            </a>
            <a 
              href="https://tryhackme.com/p/shifta" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-medium hover:text-accent-cyan transition-colors"
              aria-label="TryHackMe Profile"
            >
              <SiTryhackme className="text-lg" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-text-medium">
            © {currentYear} Medhane Hadush
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

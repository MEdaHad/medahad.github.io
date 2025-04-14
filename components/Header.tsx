"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Projects', path: '#projects' },
    { label: 'Skills', path: '#skills' },
    { label: 'Experience', path: '#experience' },
    { label: 'Contact', path: '#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-secondary/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FaShieldAlt className="text-accent-cyan text-2xl" />
            <span className="font-bold text-xl text-white">Medhane <span className="text-accent-cyan">Hadush</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="text-text-light hover:text-accent-cyan transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://medahad.github.io/MedaHad_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <FaUserCircle className="mr-2" />
              Resume
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-light text-2xl focus:outline-none"
            onClick={handleMobileMenuToggle}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-secondary/95 backdrop-blur-lg shadow-lg transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          } overflow-hidden`}
        >
          <nav className="flex flex-col items-center py-4 space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="text-text-light hover:text-accent-cyan transition-colors"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://medahad.github.io/MedaHad_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={closeMobileMenu}
            >
              <FaUserCircle className="mr-2" />
              Resume
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

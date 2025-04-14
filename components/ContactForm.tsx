"use client";

import React from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { SiTryhackme } from 'react-icons/si';
import { motion } from 'framer-motion';

const ContactLinks: React.FC = () => {
  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-secondary/40 backdrop-blur-sm p-8 rounded-xl border border-accent-cyan/20 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-accent-cyan mb-8 text-center">Connect With Me</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* GitHub */}
            <a 
              href="https://github.com/medahad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-primary/50 rounded-lg hover:bg-primary transition-all group"
            >
              <FaGithub className="text-4xl text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-text-light font-medium">GitHub</span>
              <span className="text-text-medium text-sm">@medahad</span>
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/medhane-hadush" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-primary/50 rounded-lg hover:bg-primary transition-all group"
            >
              <FaLinkedinIn className="text-4xl text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-text-light font-medium">LinkedIn</span>
              <span className="text-text-medium text-sm">Medhane Hadush</span>
            </a>
            
            {/* TryHackMe */}
            <a 
              href="https://tryhackme.com/p/shifta" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-primary/50 rounded-lg hover:bg-primary transition-all group"
            >
              <SiTryhackme className="text-4xl text-accent-cyan mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-text-light font-medium">TryHackMe</span>
              <span className="text-text-medium text-sm">@shifta</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactLinks; 
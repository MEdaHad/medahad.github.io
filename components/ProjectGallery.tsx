"use client";

import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaCode, FaServer, FaNetworkWired, FaBug, FaLock, FaRobot, FaUsers, FaGamepad, FaMicrophone, FaRss } from 'react-icons/fa';

// Static project data
const projects = [
  {
    title: "SmartRSSFeed",
    description: "AI-Powered Next.js app for intelligent feed management. Built with Next.js 14, TypeScript, Tailwind CSS, and integrates AI services like OpenAI, Anthropic, Replicate, and Deepgram.",
    icon: <FaRss className="text-accent-cyan text-2xl" />,
    tags: ["Next.js", "TypeScript", "AI", "Tailwind CSS"],
    url: "https://github.com/MEdaHad/SmartRSSFeed"
  },
  {
    title: "WhisperKey",
    description: "Next-Gen Voice-to-Text Conversion application built with Next.js. Features real-time transcription, custom language models, and seamless integration options for developers.",
    icon: <FaMicrophone className="text-accent-cyan text-2xl" />,
    tags: ["Next.js", "Web Development", "AI", "Voice Recognition"],
    url: "https://whisperkey.netlify.app/"
  },
  {
    title: "GTA6Hub",
    description: "The ultimate destination for everything GTA VI. A community-driven platform featuring the latest news, guides, and mods for the GTA 6 gaming community.",
    icon: <FaGamepad className="text-accent-cyan text-2xl" />,
    tags: ["Next.js", "Web Development", "Gaming"],
    url: "https://www.gta6hub.info/"
  },
  {
    title: "CRM with Django",
    description: "A customer relationship management (CRM) system built using Django. It allows you to manage leads and clients, convert leads to clients, and process payments using Stripe.",
    icon: <FaUsers className="text-accent-cyan text-2xl" />,
    tags: ["Django", "Python", "Web Development"]
  },
  {
    title: "InstaBOT",
    description: "An automated Instagram management tool built with Python that helps manage posting schedules, engagement activities, and analytics tracking.",
    icon: <FaRobot className="text-accent-cyan text-2xl" />,
    tags: ["Python", "Automation", "Social Media"]
  },
  {
    title: "Threat Detection System",
    description: "Enhanced SIEM detection capabilities by tuning use cases and implementing the MITRE ATT&CK framework for improved incident response.",
    icon: <FaShieldAlt className="text-accent-cyan text-2xl" />,
    tags: ["SIEM", "MITRE ATT&CK", "Incident Response"]
  },
  {
    title: "Cybersecurity Training Platform",
    description: "Designed and implemented a secure Flask-based web platform for training purposes, integrating AWS S3 for data storage and protection.",
    icon: <FaCode className="text-accent-cyan text-2xl" />,
    tags: ["Flask", "AWS S3", "Web Development"]
  },
  {
    title: "Host Intrusion Prevention System",
    description: "Enhanced HIPS methodology for a financial institution, improving rule accuracy and defense against potential intrusions.",
    icon: <FaServer className="text-accent-cyan text-2xl" />,
    tags: ["Endpoint Security", "Rule-based Detection", "Financial Security"]
  },
  {
    title: "Automated Cryptanalysis Tool",
    description: "Utilized TensorFlow for automating cryptanalysis, enhancing the organization's capability to detect and mitigate threats through data-driven insights.",
    icon: <FaNetworkWired className="text-accent-cyan text-2xl" />,
    tags: ["TensorFlow", "Python", "Data Analysis"]
  },
  {
    title: "Fraud Detection System",
    description: "Developed a system for managing customer-related fraud incidents in banking, minimizing financial risks and improving response efficiency.",
    icon: <FaBug className="text-accent-cyan text-2xl" />,
    tags: ["Financial Security", "Incident Response", "Risk Management"]
  },
  {
    title: "RIO Incident Response Methodology",
    description: "Developed and implemented a streamlined incident handling and prevention process for efficient security operations.",
    icon: <FaLock className="text-accent-cyan text-2xl" />,
    tags: ["Incident Response", "Methodology", "Process Improvement"]
  }
];

const ProjectGallery = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Get all unique tags - only calculated client-side
  const allTags = isMounted 
    ? Array.from(new Set(projects.flatMap(project => project.tags)))
    : [];
  
  // Filter projects based on active tag - only done client-side
  const projectsToDisplay = isMounted && activeTag 
    ? projects.filter(project => project.tags.includes(activeTag))
    : projects;

  // Using a minimal display structure for server-side
  return (
    <section id="projects" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading">Featured Projects</h2>
          {isMounted && (
            <p className="text-text-medium max-w-2xl mx-auto">
              Selected work from my experience in cybersecurity and web development
            </p>
          )}
        </div>

        {isMounted && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button 
              onClick={() => setActiveTag(null)}
              className="px-4 py-1.5 rounded-full text-sm transition-all"
              style={{ 
                backgroundColor: activeTag === null ? 'rgba(0, 229, 255, 0.2)' : 'rgba(26, 34, 51, 0.5)',
                color: activeTag === null ? 'var(--accent-cyan)' : 'var(--text-medium)',
                borderWidth: '1px',
                borderColor: activeTag === null ? 'rgba(0, 229, 255, 0.5)' : 'var(--secondary)'
              }}
            >
              All
            </button>
            
            {allTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => setActiveTag(tag)}
                className="px-4 py-1.5 rounded-full text-sm transition-all"
                style={{ 
                  backgroundColor: activeTag === tag ? 'rgba(0, 229, 255, 0.2)' : 'rgba(26, 34, 51, 0.5)',
                  color: activeTag === tag ? 'var(--accent-cyan)' : 'var(--text-medium)',
                  borderWidth: '1px',
                  borderColor: activeTag === tag ? 'rgba(0, 229, 255, 0.5)' : 'var(--secondary)'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsToDisplay.slice(0, isMounted ? undefined : 3).map((project, index) => (
            <div
              key={index}
              className="card card-hover group"
            >
              <div className="flex items-center mb-4">
                <div className="bg-secondary p-3 rounded-lg mr-4" style={{ backgroundColor: 'rgba(26, 34, 51, 0.8)' }}>
                  {project.icon}
                </div>
                <h3 className="text-xl font-medium text-accent-cyan">{project.title}</h3>
              </div>
              
              <p className="text-text-medium mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="text-xs bg-secondary text-text-light px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(26, 34, 51, 0.8)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {project.url && (
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-cyan text-sm flex items-center hover:underline"
                >
                  <span>Visit Project</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery; 
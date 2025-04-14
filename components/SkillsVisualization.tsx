"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaCode, FaShieldAlt, FaTools, FaDatabase, FaDesktop } from 'react-icons/fa';

// Define skill categories with their respective skills
const skillCategories = [
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: <FaShieldAlt className="text-2xl" />,
    skills: [
      { name: 'Network Security' },
      { name: 'Vulnerability Assessment' },
      { name: 'Penetration Testing' },
      { name: 'Security Auditing' },
      { name: 'SIEM Implementation' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: <FaDesktop className="text-2xl" />,
    skills: [
      { name: 'React & Next.js' },
      { name: 'TypeScript' },
      { name: 'Tailwind CSS' },
      { name: 'HTML5/CSS3/JavaScript' },
      { name: 'Responsive Design' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: <FaServer className="text-2xl" />,
    skills: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'Python Django' },
      { name: 'RESTful APIs' },
      { name: 'GraphQL' },
    ],
  },
  {
    id: 'programming',
    title: 'Programming Languages',
    icon: <FaCode className="text-2xl" />,
    skills: [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'Python' },
      { name: 'Bash Scripting' },
      { name: 'C/C++' },
    ],
  },
  {
    id: 'database',
    title: 'Database Technologies',
    icon: <FaDatabase className="text-2xl" />,
    skills: [
      { name: 'MongoDB' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'SQLite' },
      { name: 'Redis' },
    ],
  },
  {
    id: 'tools',
    title: 'DevOps & Tools',
    icon: <FaTools className="text-2xl" />,
    skills: [
      { name: 'Docker' },
      { name: 'Git & GitHub' },
      { name: 'CI/CD Pipelines' },
      { name: 'AWS' },
      { name: 'Linux System Administration' },
    ],
  },
];

const SkillsVisualization = () => {
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].id);
  const [isVisible, setIsVisible] = useState(false);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Get the active category
  const getActiveCategory = () => {
    return skillCategories.find(category => category.id === activeCategory);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('skills');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section id="skills" className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My <span className="text-accent-cyan">Skills</span>
          </h2>
          <p className="text-text-light max-w-2xl mx-auto">
            I specialize in a diverse range of technologies with a focus on security and modern web development.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {skillCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-accent-cyan text-primary font-bold'
                  : 'bg-secondary text-text-light hover:bg-accent-cyan/20'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.title}
            </button>
          ))}
        </div>

        {/* Skills Visualization */}
        <div className="bg-secondary p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            {getActiveCategory()?.icon}
            <span className="ml-2">{getActiveCategory()?.title}</span>
          </h3>
          
          <div className="space-y-6">
            {getActiveCategory()?.skills.map((skill, index) => (
              <div key={index} className="bg-primary/30 p-3 rounded-md">
                <div className="flex items-center">
                  <span className="font-medium text-text-light">{skill.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10">
            <h4 className="text-xl font-bold mb-4">My Approach</h4>
            <p className="text-text-light">
              I believe in continuous learning and staying updated with the latest advancements in technology. 
              My cybersecurity background gives me a unique perspective on developing secure, robust applications 
              while my full-stack development skills allow me to create seamless, user-focused experiences.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsVisualization; 
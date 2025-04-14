"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const experiences = [
  {
    title: "Technical Security Coordinator",
    company: "Banque Cantonale Vaudoise (BCV)",
    location: "Lausanne",
    period: "August 2024 — December 2024",
    type: "Contract",
    description: [
      "Enhanced the bank's Host Intrusion Prevention System (HIPS) methodology, improving rule accuracy and defense against potential intrusions.",
      "Managing customer-related fraud incidents, minimizing financial risks and improving response efficiency.",
      "Developing and implementing the RIO incident response methodology, streamlining incident handling and prevention processes.",
      "Secured employee devices targeted by brute force attacks, reducing vulnerabilities and enhancing endpoint security."
    ]
  },
  {
    title: "Cybersecurity Engineer",
    company: "Banque Cantonale Vaudoise (BCV)",
    location: "Lausanne",
    period: "August 2023 — July 2024",
    type: "Intern",
    description: [
      "Enhanced threat detection capabilities by tuning SIEM detection use cases.",
      "Proposed and implemented an improved Incident Response Methodology.",
      "Integrated MITRE ATT&CK framework techniques into Cybersecurity preparedness, detection, incident response, and attack mitigation strategies.",
      "Actively managed fraudulent activities related to the bank's customers."
    ]
  },
  {
    title: "Cybersecurity Analyst",
    company: "Information Network Security Agency (INSA)",
    location: "Addis Ababa",
    period: "January 2018 — September 2020",
    type: "Full-time",
    description: [
      "Developed engaging Cybersecurity training modules, simplifying complex concepts for better comprehension and retention.",
      "Designed and implemented a secure Flask-based web platform for training purposes, incorporating AWS S3 for robust data storage and protection.",
      "Utilized TensorFlow for automating cryptanalysis, enhancing the organization's capability to detect and mitigate Cybersecurity threats through data-driven insights."
    ]
  }
];

const education = [
  {
    degree: "BSc in Software Engineering",
    institution: "MicroLink IT College",
    location: "Mekele",
    period: "September 2013 — August 2017"
  },
  {
    degree: "Cyber Security Certification",
    institution: "Ariel University",
    location: "Ariel",
    period: "April 2018 — October 2018"
  },
  {
    degree: "Powercoders Bootcamp",
    institution: "Powercoders",
    location: "Bern",
    period: "2023"
  }
];

const ExperienceTimeline = () => {
  return (
    <section id="experience" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">Experience</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Experience */}
          <div>
            <div className="flex items-center mb-6">
              <FaBriefcase className="text-accent-cyan text-xl mr-3" />
              <h3 className="text-2xl font-semibold text-text-light">Work History</h3>
            </div>
            
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card relative"
                >
                  <div className="mb-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-medium text-accent-cyan">{exp.title}</h4>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">{exp.type}</span>
                    </div>
                    <div className="text-text-medium">
                      {exp.company}, {exp.location}
                    </div>
                    <div className="text-sm text-text-medium mb-4">{exp.period}</div>
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    {exp.description.map((item, i) => (
                      <li key={i} className="pl-4 relative">
                        <span className="absolute left-0 top-2 w-2 h-2 bg-accent-cyan rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Education */}
          <div>
            <div className="flex items-center mb-6">
              <FaGraduationCap className="text-accent-cyan text-xl mr-3" />
              <h3 className="text-2xl font-semibold text-text-light">Education</h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card"
                >
                  <h4 className="text-lg font-medium text-accent-cyan">{edu.degree}</h4>
                  <div className="text-text-medium">{edu.institution}, {edu.location}</div>
                  <div className="text-sm text-text-medium mt-2">{edu.period}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <a 
                href="https://medahad.github.io/MedaHad_CV.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary w-full flex justify-center items-center"
              >
                Download Full Resume
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline; 
import React from 'react';
import HeroSection from '@/components/HeroSection';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import SkillsVisualization from '@/components/SkillsVisualization';
import ProjectGallery from '@/components/ProjectGallery';
import ContactLinks from '@/components/ContactForm';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SkillsVisualization />
      <ProjectGallery />
      <ExperienceTimeline />
      <ContactLinks />
    </main>
  );
} 
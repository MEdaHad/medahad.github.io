"use client";

import React, { useEffect, useState } from 'react';

const CursorParticles: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Load the tsParticles library dynamically
    const loadParticles = async () => {
      try {
        // Create a script element to load tsparticles
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.min.js';
        script.async = true;
        
        script.onload = () => {
          // Once the script is loaded, initialize particles
          if (typeof window !== 'undefined' && window.tsParticles) {
            window.tsParticles.load('tsparticles', {
              fpsLimit: 60,
              particles: {
                color: {
                  value: "#00e5ff"
                },
                links: {
                  color: "#00e5ff",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1
                },
                move: {
                  enable: true,
                  random: true,
                  speed: 0.8,
                  outMode: "bounce"
                },
                number: {
                  density: {
                    enable: true,
                    value_area: 800
                  },
                  value: 40
                },
                opacity: {
                  value: 0.3
                },
                shape: {
                  type: "circle"
                },
                size: {
                  value: 3,
                  random: true
                }
              },
              detectRetina: true
            });
          }
        };
        
        // Append the script to the document
        document.body.appendChild(script);
        
        // Clean up
        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
          // Destroy particles on unmount
          if (typeof window !== 'undefined' && window.tsParticles) {
            window.tsParticles.destroy();
          }
        };
      } catch (error) {
        console.error("Failed to load particles:", error);
      }
    };
    
    if (typeof window !== 'undefined') {
      loadParticles();
    }
  }, []);

  // Only render the container div on the client
  if (!isClient) {
    return null;
  }

  return (
    <div 
      id="tsparticles" 
      className="fixed inset-0 z-[-1] opacity-30 pointer-events-none"
    ></div>
  );
};

// Add TypeScript interface for the window object
declare global {
  interface Window {
    tsParticles: any;
  }
}

export default CursorParticles;

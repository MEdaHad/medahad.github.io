"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillCategories, SkillCategory, Skill } from "@/lib/skillsData"; // Adjust path if needed

// Floating Code Snippet Component
const FloatingSnippet: React.FC<{ snippet: string; categoryId: string; index: number }> = ({ snippet, categoryId, index }) => {
    // Use useMemo to generate random values only once
    const randomValues = useMemo(() => {
        return {
            x: (index % 3 * 20) - 30, // Deterministic pattern based on index
            y: (Math.floor(index / 3) * 20) - 30,
            delay: (index * 0.5) % 2,
            duration: 4 + (index % 3),
        };
    }, [index]);

    return (
        <motion.pre
            key={`${snippet}-${categoryId}-${index}`}
            initial={{ opacity: 0, x: `${randomValues.x}%`, y: `${randomValues.y}%`, scale: 0.8 }}
            animate={{ opacity: [0, 0.6, 0.6, 0], scale: [0.8, 1, 0.8] }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: randomValues.duration, delay: randomValues.delay, ease: "easeInOut" }}
            className="absolute font-mono text-xs text-accent-blue/70 p-1 bg-primary/30 rounded pointer-events-none select-none z-0"
            style={{
                 // Prevent snippets overlapping category hex too much
                 top: `${50 + randomValues.y}%`,
                 left: `${50 + randomValues.x}%`,
                 transform: 'translate(-50%, -50%)', // Center the origin
            }}
        >
            {snippet}
        </motion.pre>
    );
};


// Skill Item with Progress Bar
const SkillItem: React.FC<{ skill: Skill }> = ({ skill }) => {
    const SkillIcon = skill.icon;
    const proficiency = skill.level; // Assuming level is 0-100

    return (
        <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {SkillIcon && <SkillIcon className="w-4 h-4 text-accent-cyan flex-shrink-0" />}
            <span className="text-sm text-text-light flex-grow min-w-[100px]">{skill.name}</span>
            {/* Progress Bar */}
            <div className="w-full max-w-[150px] bg-secondary rounded-full h-2.5 overflow-hidden flex-shrink-0">
                <motion.div
                    className="bg-gradient-to-r from-accent-blue to-accent-cyan h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${proficiency}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
            </div>
            <span className="text-xs text-accent-blue font-mono w-8 text-right">{proficiency}%</span>
        </motion.div>
    );
};


// Main Visualization Component
const SkillsVisualization: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);
    // Use state to track whether we're on the client or not
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCategoryClick = (category: SkillCategory) => {
        setActiveCategory((prev: SkillCategory | null) => (prev?.id === category.id ? null : category)); // Toggle active category
    };

    const getCategorySnippets = (category: SkillCategory | null): string[] => {
        if (!category) return [];
        return category.skills.map((s: Skill) => s.codeSnippet).filter((s): s is string => !!s);
    }

    // Skip rendering on the server to avoid hydration issues
    if (!isMounted) {
        return null;
    }

    return (
        <div className="relative w-full flex flex-col items-center space-y-10 py-10">

            {/* Category Hexagons */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
                {skillCategories.map((category: SkillCategory) => {
                    const CategoryIcon = category.icon;
                    const isActive = activeCategory?.id === category.id;
                    return (
                        <motion.div
                            key={category.id}
                            className="relative group flex flex-col items-center cursor-pointer"
                            onClick={() => handleCategoryClick(category)}
                            whileHover={{ scale: 1.05 }}
                            animate={{ scale: isActive ? 1.1 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            {/* Hexagon Shape */}
                            <div
                                className={`w-32 h-[147px] md:w-36 md:h-[166px] lg:w-40 lg:h-[184px] transition-all duration-300 ease-out ${
                                    isActive ? 'bg-accent-cyan/10 border-accent-cyan' : 'bg-primary/60 border-secondary hover:border-accent-blue'
                                } border-2 flex items-center justify-center`}
                                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                            >
                                {/* Icon inside hexagon */}
                                <CategoryIcon
                                    className={`w-10 h-10 md:w-12 md:h-12 transition-colors duration-300 ${
                                        isActive ? 'text-accent-cyan drop-shadow-glow-cyan-xs' : 'text-text-medium group-hover:text-accent-blue'
                                    }`}
                                />
                            </div>
                            {/* Category Name */}
                            <span className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
                                isActive ? 'text-accent-cyan' : 'text-text-medium group-hover:text-accent-blue'
                            }`}>
                                {category.name}
                            </span>

                             {/* Floating Snippets Container - Absolutely positioned relative to this category div */}
                             {isActive && (['languages', 'frameworks'].includes(category.id)) && (
                                <div className="absolute inset-0 w-full h-full z-0 overflow-visible">
                                    <AnimatePresence>
                                        {getCategorySnippets(activeCategory).slice(0, 5).map((snippet, i) => ( // Limit snippets
                                            <FloatingSnippet 
                                                key={`${category.id}-${i}`} 
                                                snippet={snippet} 
                                                categoryId={category.id}
                                                index={i} 
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Expanded Skills Area */}
            <AnimatePresence mode="wait">
                {activeCategory && (
                    <motion.div
                        key={activeCategory.id} // Ensures component remounts on category change
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto', transition: { duration: 0.4, ease: "easeInOut" } }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
                        className="w-full max-w-xl mt-8 p-6 bg-secondary/50 border border-accent-cyan/30 rounded-lg shadow-lg backdrop-blur-sm overflow-hidden"
                    >
                        <h4 className="text-xl font-semibold text-accent-cyan mb-5 text-center">{activeCategory.name} Skills</h4>
                        <div className="space-y-4">
                            {activeCategory.skills.map((skill: Skill) => (
                                <SkillItem key={skill.name} skill={skill} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SkillsVisualization;

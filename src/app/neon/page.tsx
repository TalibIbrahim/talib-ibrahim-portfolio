'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useMode } from '@/context/ModeContext';
import { useIntensity } from '@/hooks/useIntensity';
import { useThemeSystem } from '@/hooks/useThemeSystem';
import { portfolioData } from '@/data/portfolio';
import Hero from '@/components/Hero';
import SignatureChamber from '@/components/SignatureChamber';
import BentoShowcase from '@/components/BentoShowcase';
import SkillsMatrix from '@/components/SkillsMatrix';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Contact from '@/components/Contact';
import FooterCTA from '@/components/FooterCTA';
import BoringView from '@/components/BoringView';
import BluntView from '@/components/BluntView';
import PragmaticView from '@/components/PragmaticView';
import HyperBackgroundEffects from '@/components/HyperBackgroundEffects';
import Preloader from '@/components/Preloader';
import SmoothScroll from '@/components/SmoothScroll';
import ClickSpark from '@/components/react-bits/ClickSpark';
import GravitationalCursor from '@/components/GravitationalCursor';

const boringStageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * /neon Route: Full Cyberpunk Fluid Glow Redesign
 * Features WebGL liquid ambient shaders, parallax hero with dynamic spotlight mask,
 * interactive handwritten Signature Chamber, Bento Showcase, and Recruiter Intensity Slider.
 */
export default function NeonRoute() {
  const { mode } = useMode();
  const { stage } = useIntensity();
  const { setTheme } = useThemeSystem();

  useEffect(() => {
    setTheme('neon');
    document.documentElement.setAttribute('data-theme', 'neon');
  }, [setTheme]);

  return (
    <>
      <GravitationalCursor />
      <HyperBackgroundEffects />
      <Preloader />
      <SmoothScroll>
        <ClickSpark sparkColor="var(--accent, #ccff00)" sparkCount={10} sparkSize={12} sparkRadius={30}>
          {mode === 'boring' ? (
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.div
                  key="boring-stage-1"
                  variants={boringStageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <BluntView />
                </motion.div>
              )}

              {stage === 2 && (
                <motion.div
                  key="boring-stage-2"
                  variants={boringStageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <PragmaticView />
                </motion.div>
              )}

              {(stage === 3 || stage === 4) && (
                <motion.div
                  key="boring-stage-3"
                  variants={boringStageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <BoringView />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <main>
              <Hero data={portfolioData.hero} />
              <SignatureChamber />
              <BentoShowcase projects={portfolioData.projects} />
              <SkillsMatrix competencies={portfolioData.competencies} />
              <ExperienceTimeline experiences={portfolioData.experience} />
              <Contact />
              <FooterCTA socials={portfolioData.socials} />
            </main>
          )}
        </ClickSpark>
      </SmoothScroll>
    </>
  );
}

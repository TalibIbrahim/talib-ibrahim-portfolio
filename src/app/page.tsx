import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Showreel } from '@/components/sections/Showreel';
import { Split } from '@/components/sections/Split';
import { Stack } from '@/components/sections/Stack';
import { Timeline } from '@/components/sections/Timeline';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
import { departure, fraunces } from './fonts';

export default function Home() {
  return (
    <>
      {/* Departure Mono (hero rows) and Fraunces (headline accents) are home-page faces only. */}
      <div data-fun-root data-stage className={`${departure.variable} ${fraunces.variable}`}>
        <Hero />
        <About />
        <Showreel />
        <Split />
        <Stack />
        <Timeline />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

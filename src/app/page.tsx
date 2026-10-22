import { Hero } from '@/components/sections/Hero';
import { Signature } from '@/components/sections/Signature';
import { About } from '@/components/sections/About';
import { Showreel } from '@/components/sections/Showreel';
import { Stack } from '@/components/sections/Stack';
import { Timeline } from '@/components/sections/Timeline';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <div data-fun-root data-stage>
        <Hero />
        <Signature />
        <About />
        <Showreel />
        <Stack />
        <Timeline />
        <Contact />
      </div>
    </>
  );
}

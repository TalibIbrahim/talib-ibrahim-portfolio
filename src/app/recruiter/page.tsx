import type { Metadata } from 'next';
import { RecruiterHome } from '@/components/recruiter/RecruiterHome';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Recruiter mode',
  description: `${site.name}: projects, experience, education and stack on one page, with a slider from hard sell to a one-paragraph pitch.`,
  alternates: { canonical: '/recruiter' },
};

export default function RecruiterPage() {
  return <RecruiterHome />;
}

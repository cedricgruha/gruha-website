import dynamic from 'next/dynamic';
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { SpecialistsSection } from "@/components/sections/SpecialistsSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";

const HomeSearchJournalSection = dynamic(() => import("@/components/sections/HomeSearchJournalSection").then(mod => mod.HomeSearchJournalSection));
const CohortSection = dynamic(() => import("@/components/sections/CohortSection").then(mod => mod.CohortSection));
const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection").then(mod => mod.ProjectsSection));
const WaitlistSection = dynamic(() => import("@/components/sections/WaitlistSection").then(mod => mod.WaitlistSection));
const SectionThree = dynamic(() => import("@/components/sections/SectionThree").then(mod => mod.SectionThree));
const CtaSection = dynamic(() => import("@/components/sections/CtaSection").then(mod => mod.CtaSection));
const SectionFour = dynamic(() => import("@/components/sections/SectionFour").then(mod => mod.SectionFour));
const TrustCtaSection = dynamic(() => import("@/components/sections/TrustCtaSection").then(mod => mod.TrustCtaSection));
const SectionFive = dynamic(() => import("@/components/sections/SectionFive").then(mod => mod.SectionFive));
const FinalCtaSection = dynamic(() => import("@/components/sections/FinalCtaSection").then(mod => mod.FinalCtaSection));
const SectionSix = dynamic(() => import("@/components/sections/SectionSix").then(mod => mod.SectionSix));
const LastStepCta = dynamic(() => import("@/components/sections/LastStepCta").then(mod => mod.LastStepCta));
const FooterVariant = dynamic(() => import("@/components/layout/FooterVariant").then(mod => mod.FooterVariant));

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">
        <HeroSection />
        <FeatureSection />
        <SpecialistsSection />
        <HowItWorksSection/>
        {/* Step-1 */}
        <HomeSearchJournalSection />
        <CohortSection />
        {/* Step-2 */}
        <ProjectsSection />
        <WaitlistSection />
        {/* step-3 */}
        <SectionThree />
        <CtaSection />
        {/* step-4 */}
        <SectionFour />
        <TrustCtaSection />
        {/* step-5 */}
        <SectionFive />
        <FinalCtaSection />
        {/* step-6 */}
        <SectionSix />
        <LastStepCta />
      </main>
      <FooterVariant />
      {/* <Footer /> */}
    </>
  );
}

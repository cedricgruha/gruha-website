import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { SpecialistsSection } from "@/components/sections/SpecialistsSection";
import { HomeSearchJournalSection } from "@/components/sections/HomeSearchJournalSection";
import { CohortSection } from "@/components/sections/CohortSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { WaitlistSection } from "@/components/sections/WaitlistSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { TrustCtaSection } from "@/components/sections/TrustCtaSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { SectionThree } from "@/components/sections/SectionThree";
import { SectionFour } from "@/components/sections/SectionFour";
import { SectionFive } from "@/components/sections/SectionFive";
import { SectionSix } from "@/components/sections/SectionSix";
import { LastStepCta } from "@/components/sections/LastStepCta";
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
      <Footer />
    </>
  );
}

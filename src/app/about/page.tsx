import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";
import { FooterVariant } from "@/components/layout/FooterVariant";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the mission and the founders behind Gruha.ai, an AI-native platform revolutionizing home ownership in Bengaluru.",
};

export default function AboutPage() {
  return (
    <>
      <Header forceSolid />
      <main className="min-h-screen bg-[#FDFAF7] pt-32 pb-24">
        <article className="container mx-auto px-6 max-w-3xl">
          {/* Press Release Header Meta */}
          <div className="mb-12 border-b border-[#E8DDD0] pb-8">
            <span className="font-inter text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#FE6235]">
              Our Mission
            </span>
            <h1 className="font-fraunces text-4xl md:text-5xl lg:text-6xl text-black mt-4 mb-6 leading-tight">
              A Letter from the <span className="italic underline decoration-[#FE6235]/30">Founders</span>
            </h1>
            <div className="flex items-center gap-4 text-[#6B6B6B] font-inter text-sm">
              <span>Bengaluru, India</span>
              <span className="w-1 h-1 bg-[#E8DDD0] rounded-full"></span>
              <span>2026</span>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="space-y-8 font-inter text-lg md:text-xl text-[#1C1C1E] leading-relaxed tracking-tight">
            <p>
              We are three founders who have spent our careers building at the frontier of artificial intelligence — designing large-scale platforms and shipping AI products used by millions. We came together around a shared conviction: some of the biggest decisions people make in their lives are still being made with tools that feel decades behind. None more so than buying a home.
            </p>

            <p>
              This company was born from frustration as much as ambition. Each of us has lived through the home buying journey ourselves — the stale listings, the spreadsheets that never capture what matters, the gut-feel calls on neighborhoods, the opaque pricing, the seven-figure decisions made on information that is always one step out of date. We have felt, personally, how one of life’s most exciting moments quietly becomes one of its most exhausting. The technology to fix this exists; it just has not been pointed at the problem.
            </p>

            <p className="font-medium text-black">
              So we are pointing it there.
            </p>

            <p>
              We are building an AI-native experience for property search and home ownership — one that understands what you actually want, surfaces the trade-offs you would otherwise discover only weeks in, and stays with you from first search through closing and beyond. 
            </p>

            <p>
              Our goal is simple: take the tools we have spent our careers building for the world’s hardest technical problems, and put them in the hands of everyone looking for a place to call home.
            </p>
          </div>

          {/* Founders Signature Area */}
          <div className="mt-20 pt-12 border-t border-[#E8DDD0]">
            <div className="flex flex-col gap-2">
              <p className="font-fraunces text-2xl italic text-black">
                The Founders
              </p>
              <p className="font-inter text-[#6B6B6B] text-sm uppercase tracking-widest font-semibold">
                Gruha.ai Team
              </p>
            </div>
          </div>
        </article>

        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#FE6235]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      </main>
     <FooterVariant />
    </>
  );
}

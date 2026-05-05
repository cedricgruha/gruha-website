
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import Image from "next/image";
import { Metadata } from "next";
import { FooterVariant } from "@/components/layout/FooterVariant";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Gruha.ai for early access and inquiries about AI-powered property search and evaluation in Bengaluru.",
};

export default function ContactPage() {
  return (
    <>
      <Header forceSolid />
      <main className="flex flex-col min-h-screen bg-[#FDFAF7] pt-24 pb-12">
        {/* Header Content */}
        <div className="container mx-auto px-6 text-center mb-12 md:mb-16">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <span className="inline-block font-inter text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#FE6235] mb-4">
              Contact Us
            </span>
            <h1 className="font-fraunces text-4xl md:text-5xl lg:text-6xl text-black mb-6 leading-tight">
              Let&apos;s start your <br />
              <span className="italic">home journey</span>.
            </h1>
            <p className="font-inter text-gray-600 text-base md:text-lg leading-relaxed">
              Have questions about our platform or want to learn how Kabir can help you find your dream home in Bengaluru? Send us a message and we&apos;ll be in touch.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <section className="flex-grow flex items-center justify-center py-4 md:py-8">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              
              {/* Left Column: Image */}
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <div className="relative aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden rounded-2xl">
                  <Image 
                    src="/68f3cbbafd79e9a1361946759b46617bfbfe0043.png"
                    alt="Contact Illustration"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <div className="w-full mx-auto">
                  <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
                    <WaitlistForm 
                      title="Send a Message"
                      subtitle="We'll respond as soon as we can."
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Subtle decorative elements */}
        <div className="fixed top-1/4 -left-20 w-64 h-64 bg-[#FE6235]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      </main>
       <FooterVariant />
    </>
  );
}

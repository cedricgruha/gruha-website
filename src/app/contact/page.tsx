
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WaitlistForm } from "@/components/ui/WaitlistForm";
import Image from "next/image";

export default function ContactPage() {
  return (
    <>
      <Header forceSolid />
      <main className="flex flex-col min-h-screen bg-[#FDFAF7] container">
        <div>
          <span className="inline-block font-inter text-[0.7rem] font-bold tracking-[0.2em] uppercase text-[#FE6235] mb-4">
                    Contact Us
                  </span>
                  <h1 className="font-fraunces text-4xl md:text-5xl text-black mb-6 leading-tight">
                    Let&apos;s start your <br />
                    <span className="italic">home journey</span>.
                  </h1>
                  <p className="font-inter text-gray-600 mb-10 leading-relaxed">
                    Have questions about our platform or want to learn how Kabir can help you find your dream home in Bengaluru? Send us a message and we&apos;ll be in touch.
                  </p>
        </div>
        {/* Contact Section */}
        <section className="flex-grow flex items-center justify-center py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* Left Column: Image */}
              <div className="w-full lg:w-5/12 order-2 lg:order-1">
                <div className="relative aspect-[4/5] w-full mx-auto overflow-hidden">
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
              <div className="w-full lg:w-7/12 order-1 lg:order-2">
                <div className="w-full mx-auto lg:mx-0">
                  

                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
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
      <Footer />
    </>
  );
}

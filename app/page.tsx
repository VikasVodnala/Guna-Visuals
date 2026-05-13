import AnimatedBackground from "@/components/AnimatedBackground";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import WorkSamples from "@/components/WorkSamples";
import MediaPlayerMock from "@/components/MediaPlayerMock";
import AboutUs from "@/components/AboutUs";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <main className="min-h-[300vh] bg-[#050505] relative flex flex-col selection:bg-neon-orange selection:text-white">
      <AnimatedBackground />
      
      <div className="flex-1 flex flex-col z-10 w-full relative">
        <HeroSection />
        
        {/* Divider Glow */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <ServicesGrid />
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <WorkSamples />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <MediaPlayerMock />
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <AboutUs />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <CallToAction />
      </div>
    </main>
  );
}

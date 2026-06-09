"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Video, 
  PenTool, 
  Camera, 
  Layout, 
  Film, 
  Cpu, 
  ArrowLeft, 
  Upload, 
  X, 
  Play, 
  Maximize2, 
  FileText, 
  Calendar,
  User
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

const iconMap: Record<string, any> = {
  Video,
  PenTool,
  Camera,
  Layout,
  Film,
  Cpu
};

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string;
  textContent: string;
  clientName: string;
  createdAt: string;
}

interface ServiceData {
  id: string;
  title: string;
  iconName: string;
  desc: string;
  details: string;
  color: string;
  glow: string;
  delay: number;
  items: ServiceItem[];
}

export default function ServiceShowcasePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.serviceId;

  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMedia, setActiveMedia] = useState<ServiceItem | null>(null);

  useEffect(() => {
    async function fetchServiceData() {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services data");
        const data = await res.json();
        const found = data.services.find((s: ServiceData) => s.id === serviceId);
        if (!found) {
          setError("Service not found");
        } else {
          setService(found);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchServiceData();
  }, [serviceId]);

  // Handle body scroll locking
  useEffect(() => {
    if (activeMedia) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeMedia]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-neon-orange animate-spin mb-4"></div>
          <span className="text-gray-400 font-mono tracking-widest text-xs uppercase animate-pulse">Loading Showcase...</span>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || "Service Not Found"}</h1>
        <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full flex items-center gap-2 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const ServiceIcon = iconMap[service.iconName] || Video;
  const accentColorClass = service.color; // e.g. border-neon-orange
  const glowShadow = service.glow; // rgba(...)

  return (
    <main className="min-h-screen bg-[#050505] relative text-white pb-32 overflow-hidden selection:bg-neon-orange">
      <AnimatedBackground />

      {/* Decorative Glow */}
      <div 
        className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none z-0"
        style={{ background: `radial-gradient(circle, ${glowShadow}, transparent)` }}
      />

      {/* Navbar Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 py-8 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
        <Link href="/admin" className="px-4 py-2 text-xs font-semibold rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 flex items-center gap-2 transition-all">
          <Upload className="w-3.5 h-3.5" />
          <span>Admin Portal</span>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`w-20 h-20 rounded-full bg-black border ${accentColorClass} mx-auto flex items-center justify-center mb-8 shadow-2xl`}
          style={{ boxShadow: `0 0 30px ${glowShadow}` }}
        >
          <ServiceIcon className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
        >
          {service.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-8"
        >
          {service.details}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-24 h-1 bg-white/10 mx-auto rounded-full overflow-hidden"
        >
          <div className={`w-1/2 h-full ${service.id.includes("orange") || service.iconName === "Video" || service.iconName === "Camera" || service.iconName === "Film" ? "bg-neon-orange" : "bg-neon-blue"} rounded-full animate-[pulse_2s_infinite]`} />
        </motion.div>
      </section>

      {/* Media Grid Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Portfolio Samples</h2>
          <span className="text-xs font-mono text-gray-500 uppercase">{service.items.length} items</span>
        </div>

        {service.items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-24 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col items-center justify-center text-center p-8 border-dashed"
          >
            <div className="p-4 rounded-full bg-white/5 mb-4 text-gray-500">
              <ServiceIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Content Uploaded Yet</h3>
            <p className="text-gray-400 font-light max-w-md mb-6">
              This section is ready for uploads. You and your client can upload related showcase items through the admin portal.
            </p>
            <Link href="/admin" className={`px-6 py-2 rounded-full border ${accentColorClass} bg-white/5 hover:bg-white/10 text-sm font-semibold transition-all`} style={{ boxShadow: `0 0 10px ${glowShadow.replace("0.5", "0.15")}` }}>
              Upload Portfolio Item
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl"
              >
                {/* Media Thumbnail / Preview */}
                <div 
                  onClick={() => setActiveMedia(item)}
                  className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden cursor-pointer group-hover:after:opacity-100 after:content-[''] after:absolute after:inset-0 after:bg-black/40 after:opacity-0 after:transition-opacity after:duration-300"
                >
                  {item.mediaType === "video" && (
                    <>
                      <video className="w-full h-full object-cover opacity-80" muted playsInline loop autoPlay>
                        <source src={item.mediaUrl} type="video/mp4" />
                      </video>
                      <div className="absolute z-10 p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                    </>
                  )}

                  {item.mediaType === "image" && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute z-10 p-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </>
                  )}

                  {item.mediaType === "text" && (
                    <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-white/[0.05] to-transparent">
                      <FileText className="w-10 h-10 text-gray-500" />
                      <p className="text-xs text-gray-400 line-clamp-3 italic">
                        &ldquo;{item.textContent}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 font-light leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 font-mono">
                    {item.clientName && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span>{item.clientName}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox / Immersive Media Modals */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMedia(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12"
          >
            <button 
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors z-50"
              onClick={() => setActiveMedia(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#0b0b0b]/90 border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Media Pane */}
              <div className="flex-[3] bg-black flex items-center justify-center relative min-h-[300px] md:min-h-0">
                {activeMedia.mediaType === "video" && (
                  <video className="w-full h-full max-h-[85vh] object-contain" controls autoPlay>
                    <source src={activeMedia.mediaUrl} type="video/mp4" />
                  </video>
                )}

                {activeMedia.mediaType === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeMedia.mediaUrl} alt={activeMedia.title} className="w-full h-full object-contain" />
                )}

                {activeMedia.mediaType === "text" && (
                  <div className="w-full h-full p-8 overflow-y-auto max-h-[40vh] md:max-h-[85vh] flex flex-col justify-center">
                    <div className="max-w-xl mx-auto font-serif text-lg leading-relaxed text-gray-300 select-text whitespace-pre-wrap pl-6 border-l-2 border-neon-blue">
                      &ldquo;{activeMedia.textContent}&rdquo;
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info Pane */}
              <div className="flex-[1.2] p-8 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between overflow-y-auto bg-black/20">
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neon-orange px-2 py-0.5 rounded border border-neon-orange/20 bg-neon-orange/5">
                      {activeMedia.mediaType}
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-white mt-3">{activeMedia.title}</h2>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1.5">Project Story</h4>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">{activeMedia.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-3 font-mono text-xs text-gray-500">
                  {activeMedia.clientName && (
                    <div className="flex justify-between">
                      <span>CLIENT:</span>
                      <span className="text-white">{activeMedia.clientName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>DATE UPLOADED:</span>
                    <span className="text-white">
                      {new Date(activeMedia.createdAt).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

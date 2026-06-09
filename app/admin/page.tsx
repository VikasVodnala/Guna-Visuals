"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Lock, 
  Trash2, 
  Plus, 
  Upload, 
  LogOut, 
  ArrowLeft, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  FolderOpen
} from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

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
  glow: string;
  items: ServiceItem[];
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  // Form states
  const [services, setServices] = useState<ServiceData[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState("image"); // "image" | "video" | "text"
  const [textContent, setTextContent] = useState("");
  const [clientName, setClientName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // Load passcode from local storage on mount
  useEffect(() => {
    const savedPasscode = localStorage.getItem("guna_admin_passcode");
    if (savedPasscode) {
      verifyPasscode(savedPasscode);
    } else {
      setCheckingAuth(false);
    }
    fetchServicesData();
  }, []);

  async function fetchServicesData() {
    try {
      const res = await fetch("/api/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services);
        if (data.services.length > 0) {
          setSelectedService(data.services[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load services database:", e);
    }
  }

  async function verifyPasscode(codeToVerify: string) {
    try {
      setCheckingAuth(true);
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: codeToVerify })
      });
      if (res.ok) {
        setPasscode(codeToVerify);
        localStorage.setItem("guna_admin_passcode", codeToVerify);
        setIsAuthorized(true);
        setAuthError("");
      } else {
        localStorage.removeItem("guna_admin_passcode");
        setAuthError("Invalid admin passcode");
      }
    } catch (err) {
      setAuthError("Failed to authenticate with server");
    } finally {
      setCheckingAuth(false);
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setAuthError("Please enter passcode");
      return;
    }
    verifyPasscode(passcode);
  };

  const handleLogout = () => {
    localStorage.removeItem("guna_admin_passcode");
    setPasscode("");
    setIsAuthorized(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !title) {
      setStatusMsg({ type: "error", text: "Please enter a title and select a service." });
      return;
    }

    if (mediaType !== "text" && !file) {
      setStatusMsg({ type: "error", text: `Please upload an ${mediaType} file.` });
      return;
    }

    if (mediaType === "text" && !textContent) {
      setStatusMsg({ type: "error", text: "Please enter some text content." });
      return;
    }

    try {
      setSubmitting(true);
      setStatusMsg({ type: "", text: "" });

      const formData = new FormData();
      formData.append("serviceId", selectedService);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("mediaType", mediaType);
      formData.append("clientName", clientName);
      formData.append("passcode", passcode);

      if (mediaType === "text") {
        formData.append("textContent", textContent);
      } else if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/services/upload", {
        method: "POST",
        body: formData
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Upload failed");
      }

      setStatusMsg({ type: "success", text: "Portfolio item uploaded successfully!" });
      
      // Reset form
      setTitle("");
      setDescription("");
      setTextContent("");
      setClientName("");
      setFile(null);
      // Reset input element
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh services listing
      await fetchServicesData();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to upload item" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (serviceId: string, itemId: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${itemTitle}"?`)) return;

    try {
      const res = await fetch("/api/services/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, itemId, passcode })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deletion failed");

      setStatusMsg({ type: "success", text: `Deleted item "${itemTitle}" successfully.` });
      await fetchServicesData();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message || "Failed to delete item" });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="w-10 h-10 rounded-full border-t-2 border-neon-blue animate-spin mb-4"></div>
          <span className="text-gray-400 font-mono tracking-widest text-xs uppercase animate-pulse">Authenticating Dashboard...</span>
        </div>
      </div>
    );
  }

  // PASSCODE PROTECTION SCREEN
  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#050505] relative text-white flex items-center justify-center p-4">
        <AnimatedBackground />

        {/* Diagonal Light Leak */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 text-neon-blue">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Guna Visuals Admin</h1>
            <p className="text-sm text-gray-400 font-light">
              Enter passcode to unlock content manager dashboard.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Admin Passcode</label>
              <input 
                type="password" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 outline-none transition-all font-mono text-center"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-mono bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3 bg-neon-blue hover:bg-neon-blue/90 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Dashboard</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // MAIN ADMIN DASHBOARD INTERFACE
  return (
    <main className="min-h-screen bg-[#050505] relative text-white pb-32 selection:bg-neon-blue selection:text-black">
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 py-8 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Site</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Auth Active</span>
          </span>
          <button 
            onClick={handleLogout} 
            className="p-2 rounded-full border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Form */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Add Portfolio Item</h2>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Service Dropdown */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Service Section</label>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl outline-none focus:border-neon-blue/30 text-sm transition-all"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#0b0b0b] text-white">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Item Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Brand Cinematic Ad 2026"
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl outline-none focus:border-neon-blue/30 text-sm transition-all"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Item Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the project or tell a brief story..."
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl outline-none focus:border-neon-blue/30 text-sm transition-all min-h-[80px]"
                />
              </div>

              {/* Media Type Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Content Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "image", label: "Image", icon: ImageIcon },
                    { id: "video", label: "Video", icon: Video },
                    { id: "text", label: "Writing", icon: FileText }
                  ].map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setMediaType(t.id);
                          setFile(null);
                        }}
                        className={`py-2 px-3 border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${mediaType === t.id ? "border-neon-blue bg-neon-blue/5 text-neon-blue" : "border-white/10 hover:border-white/20 text-gray-400 hover:text-white"}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-mono">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Inputs depending on Media Type */}
              {mediaType !== "text" ? (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                    Upload File ({mediaType === "video" ? "MP4 video" : "PNG/JPG/WEBP"})
                  </label>
                  <div className="relative border border-dashed border-white/10 hover:border-neon-blue/20 bg-black/40 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                    <input 
                      type="file" 
                      id="file-upload"
                      accept={mediaType === "video" ? "video/mp4" : "image/*"}
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-300 font-mono select-none">
                      {file ? file.name : "Select or drag file here"}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 select-none">
                      Max suggested size: {mediaType === "video" ? "50MB" : "5MB"}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Written Script / Copy Content</label>
                  <textarea 
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your scripts, marketing copies, or stories here..."
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl outline-none focus:border-neon-blue/30 text-sm transition-all min-h-[140px] font-serif"
                  />
                </div>
              )}

              {/* Client Name Input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">Client Brand (Optional)</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Nike, Apex Corp, Self"
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl outline-none focus:border-neon-blue/30 text-sm transition-all"
                />
              </div>

              {/* Feedback alert messages */}
              {statusMsg.text && (
                <div className={`flex items-start gap-2 text-xs font-mono p-3 rounded-lg border ${statusMsg.type === "success" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"}`}>
                  {statusMsg.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 bg-neon-blue hover:bg-neon-blue/90 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Upload to Service</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Manage / List Items */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-lg bg-neon-orange/10 border border-neon-orange/20 text-neon-orange">
                <FolderOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Active Portfolio Contents</h2>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12 text-gray-500 font-mono text-sm">
                No active services loaded from database.
              </div>
            ) : (
              <div className="space-y-8">
                {services.map(s => (
                  <div key={s.id} className="border-b border-white/5 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-wide text-white">{s.title}</span>
                        <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-gray-400 border border-white/10">
                          {s.items.length} items
                        </span>
                      </div>
                      <Link href={`/services/${s.id}`} className="text-xs text-neon-blue hover:underline">
                        View Page
                      </Link>
                    </div>

                    {s.items.length === 0 ? (
                      <div className="text-xs text-gray-500 italic py-2 pl-4 border-l border-white/5">
                        No portfolio items in this section.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {s.items.map(item => (
                          <div key={item.id} className="flex gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 items-center justify-between hover:bg-white/[0.04] transition-colors">
                            <div className="flex gap-3 items-center min-w-0">
                              {/* Thumbnail preview */}
                              <div className="w-12 h-12 bg-black rounded-lg border border-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {item.mediaType === "video" && <Video className="w-5 h-5 text-gray-400" />}
                                {item.mediaType === "image" && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
                                )}
                                {item.mediaType === "text" && <FileText className="w-5 h-5 text-gray-400" />}
                              </div>

                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-gray-200 truncate">{item.title}</h4>
                                <p className="text-[10px] font-mono text-gray-500 mt-0.5 truncate uppercase">
                                  {item.mediaType} {item.clientName ? `• ${item.clientName}` : ""}
                                </p>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleDeleteItem(s.id, item.id, item.title)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all flex-shrink-0 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}

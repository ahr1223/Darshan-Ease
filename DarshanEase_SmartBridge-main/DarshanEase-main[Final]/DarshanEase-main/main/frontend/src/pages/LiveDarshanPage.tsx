import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader2, MapPin, X } from "lucide-react";
import { PageWrapper } from "@/components/animations";
import { getTemples } from "@/services/templeService";

const LiveDarshanPage = () => {
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStream, setActiveStream] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await getTemples();
        // Filter temples to only show those with a valid liveStreamUrl
        const liveTemples = res.data.filter((t: any) => t.liveStreamUrl && t.liveStreamUrl.trim() !== "");
        setTemples(liveTemples);
      } catch (err) {
        setError("Failed to load live darshan streams.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  // Helper to extract YouTube video ID from various URL formats
  const getOutputEmbedUrl = (url: string) => {
    try {
      if (!url) return "";
      
      // Clean the URL
      const cleanUrl = url.trim();

      if (cleanUrl.includes("youtube.com/embed/")) {
        return cleanUrl;
      }

      // Improved Regex for YouTube: handles watch?v=, youtu.be/, shorts/, live/, and more
      const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|live\/)([^#\&\?]*).*/;
      const match = cleanUrl.match(regExp);

      if (match && match[1] && match[1].length === 11) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      }
      
      // Fallback: If it's a 11-char string directly, assume it's an ID
      if (cleanUrl.length === 11 && !cleanUrl.includes("/")) {
        return `https://www.youtube.com/embed/${cleanUrl}?autoplay=1`;
      }
    } catch (e) {
      console.error("Invalid URL format", e);
    }
    return url;
  };

  return (
    <PageWrapper>
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-150 text-red-600 mb-4 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> LIVE NOW
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Live <span className="text-gradient-saffron">Darshan</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the divine presence from anywhere in the world. Watch live aarti and darshan streams directly from the temples.
            </p>
          </motion.div>

          {/* Error and Loading States */}
          {error && <div className="bg-red-100 text-red-600 rounded-lg px-4 py-3 mb-6 text-center max-w-md mx-auto text-sm">{error}</div>}
          
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : temples.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl shadow-card max-w-2xl mx-auto">
              <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">No Live Streams Available Currently</p>
              <p className="text-sm text-muted-foreground mt-2">Check back later or visit our temples to book an in-person darshan.</p>
              <Link to="/temples" className="inline-block mt-6 px-6 py-2 gradient-saffron text-primary-foreground font-semibold rounded-lg shadow-saffron">
                Browse Temples
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {temples.map((temple, i) => (
                <motion.div
                  key={temple._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl shadow-card overflow-hidden group"
                >
                  <div className="relative h-48 cursor-pointer overflow-hidden" onClick={() => setActiveStream(getOutputEmbedUrl(temple.liveStreamUrl))}>
                    <img 
                      src={temple.image || "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"} 
                      alt={temple.templeName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-saffron/90 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-6 h-6 ml-1 fill-current" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-xs text-white uppercase tracking-wider font-semibold border border-white/20">
                      Live
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-lg mb-2">{temple.templeName}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {temple.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeStream && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActiveStream(null)}
          >
            <div className="w-full max-w-5xl relative" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setActiveStream(null)} 
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                <iframe
                  src={activeStream}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default LiveDarshanPage;

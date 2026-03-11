import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import heroImage from "@/assets/temple-hero.jpg";
import TempleCard from "@/components/TempleCard";
import { PageWrapper } from "@/components/animations";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getTemples } from "@/services/templeService";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "ADMIN") {
        navigate("/admin");
      } else if (user?.role === "ORGANIZER") {
        navigate("/organizer");
      }
    }
  }, [isAuthenticated, user, navigate]);
  const { toast } = useToast();
  const [temples, setTemples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const res = await getTemples();
        setTemples(res.data.slice(0, 6)); // Show max 6 on homepage
      } catch {
        // silently fail — homepage still works without temples
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const handleBookDarshanClick = () => {
    if (isAuthenticated) {
      navigate('/temples');
    } else {
      navigate('/login');
      toast({
        title: "Please login first",
        description: "You need to be logged in to book a Darshan.",
      });
    }
  };

  // Map API data to TempleCard shape
  const templeCards = temples.map((t) => ({
    id: t._id,
    name: t.templeName,
    location: t.location,
    description: t.description,
    image: t.image,
    rating: 4.8,
    timings: `${t.openTime || "6:00 AM"} - ${t.closeTime || "9:00 PM"}`,
    darshans: [],
  }));

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Temple" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero" />
        </div>

        {/* Floating temple icons */}
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-32 left-[10%] text-4xl opacity-30">🕉️</motion.div>
        <motion.div animate={{ y: [10, -15, 10] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute top-48 right-[15%] text-3xl opacity-20">🛕</motion.div>
        <motion.div animate={{ y: [-8, 12, -8] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-40 left-[20%] text-4xl opacity-25">🪷</motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 leading-tight">
              Book Your Temple{" "}
              <span className="text-saffron">Darshan</span>{" "}
              Online
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Skip long queues and experience divine darshan with ease. Secure your spot at India's most sacred temples.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/temples">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 gradient-saffron text-primary-foreground rounded-lg text-lg font-bold shadow-saffron flex items-center gap-2">
                Explore Temples <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button onClick={handleBookDarshanClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 glass-dark text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary-foreground/10 transition-colors">
              Book Darshan
            </motion.button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Temples Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured <span className="text-gradient-saffron">Temples</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Discover and book darshan at India's most revered temples
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : templeCards.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No temples added yet.</p>
              <p className="text-sm text-muted-foreground">Organizers can add temples from <Link to="/organizer" className="text-primary underline">the organizer panel</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templeCards.map((temple, i) => (
                <TempleCard key={temple.id} temple={temple} index={i} />
              ))}
            </div>
          )}

          {templeCards.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
              <Link to="/temples">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                  View All Temples
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default HomePage;

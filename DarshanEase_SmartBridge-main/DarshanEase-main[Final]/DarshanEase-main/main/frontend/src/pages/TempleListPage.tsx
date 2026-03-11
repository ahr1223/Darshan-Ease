import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Loader2 } from "lucide-react";
import TempleCard from "@/components/TempleCard";
import { PageWrapper } from "@/components/animations";
import { getTemples } from "@/services/templeService";

const locations = ["All", "Andhra Pradesh", "Gujarat", "Maharashtra", "Tamil Nadu", "Uttar Pradesh"];

interface Temple {
  _id: string;
  templeName: string;
  location: string;
  description: string;
  image: string;
  openTime: string;
  closeTime: string;
}

const TempleListPage = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        console.log("🔄 Starting to fetch temples...");
        setLoading(true);
        const res = await getTemples();
        console.log("✅ API Response:", res);
        console.log("📊 Temple Data:", res.data);
        setTemples(res.data || []);
        setError("");
        console.log("✅ Temples loaded successfully");
      } catch (err) {
        console.error("❌ API Error Details:", err);
        console.error("❌ Error Response:", err.response);
        console.error("❌ Error Message:", err.message);
        setError(`Database connection failed: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, []);

  const filtered = temples.filter((t) => {
    const matchesSearch = t.templeName.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter === "All" || t.location.includes(locationFilter);
    return matchesSearch && matchesLocation;
  });

  // Map API data to TempleCard expected shape
  const templeCards = filtered.map((t) => ({
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
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Explore <span className="text-gradient-saffron">Temples</span>
            </h1>
            <p className="text-muted-foreground">Find and book darshan at sacred temples across India</p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search temples..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-20">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templeCards.map((temple, i) => (
                  <TempleCard key={temple.id} temple={temple} index={i} />
                ))}
              </div>
              {templeCards.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-20 text-lg"
                >
                  No temples found. Try adding some temples from the Admin panel.
                </motion.p>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default TempleListPage;

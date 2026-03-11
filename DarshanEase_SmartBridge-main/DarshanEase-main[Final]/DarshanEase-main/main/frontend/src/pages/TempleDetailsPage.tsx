import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ArrowLeft, Loader2, Users, Heart, X } from "lucide-react";
import { PageWrapper } from "@/components/animations";
import { getTempleById } from "@/services/templeService";
import { getDarshansByTemple } from "@/services/darshanService";
import { createDonation } from "@/services/donationService";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Darshan {
  _id: string;
  darshanName: string;
  openTime: string;
  closeTime: string;
  normalPrice: number;
  vipPrice: number;
  capacity: number;
  availableSeats: number;
  description: string;
}

interface Temple {
  _id: string;
  templeName: string;
  location: string;
  description: string;
  image: string;
  openTime: string;
  closeTime: string;
}

const TempleDetailsPage = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [darshans, setDarshans] = useState<Darshan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>("501");
  const [donationMessage, setDonationMessage] = useState("");
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const loadTemple = async () => {
      try {
        const [templeRes, darshanRes] = await Promise.all([
          getTempleById(id!),
          getDarshansByTemple(id!),
        ]);
        setTemple(templeRes.data);
        setDarshans(darshanRes.data);
      } catch (err) {
        setError("Failed to load temple details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) loadTemple();
  }, [id]);

  const handleBookNow = (darshanId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user?.role === "ADMIN") {
      toast({
        title: "Access Restricted",
        description: "Administrators cannot book darshans. Please use a regular user account.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/booking/${id}/${darshanId}`);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    
    setDonating(true);
    try {
      await createDonation({
        templeId: id!,
        amount: Number(donationAmount),
        message: donationMessage,
      });
      setShowDonateModal(false);
      setDonationAmount("501");
      setDonationMessage("");
      toast({
        title: "Donation Successful 🙏",
        description: "Thank you for your generous contribution.",
      });
    } catch {
      toast({
        title: "Donation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="pt-24 text-center">
        <p className="text-muted-foreground text-lg">{error || "Temple not found."}</p>
        <Link to="/temples" className="text-primary underline mt-4 inline-block">Back to Temples</Link>
      </div>
    );
  }

  const getFallback = (id: string) => {
    // Use picsum with seed for high resolution hero fallback
    return `https://picsum.photos/seed/${id}/1920/1080`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const id = (temple as any).id || (temple as any)._id;
    e.currentTarget.src = getFallback(id || "");
    e.currentTarget.onerror = null;
  };

  const imageUrl = temple.image || getFallback(id || "");

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <div className="relative h-[25vh] md:h-[40vh] overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={temple.templeName} 
          onError={handleImageError}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 bg-black/20" /> {/* Slight overlay for text readability */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Link to="/temples">
                <motion.span whileHover={{ x: -4 }} className="inline-flex items-center gap-1 text-primary-foreground/70 text-sm mb-4">
                  <ArrowLeft className="w-4 h-4" /> Back to Temples
                </motion.span>
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-primary-foreground mb-2"
              >
                {temple.templeName}
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {temple.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {temple.openTime} - {temple.closeTime}</span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!isAuthenticated) navigate("/login");
                else setShowDonateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-saffron font-bold rounded-lg shadow-xl hover:bg-gray-50 transition-colors shrink-0"
            >
              <Heart className="w-5 h-5 fill-current" /> Donate Now
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-lg p-6 shadow-card mb-8"
        >
          <h2 className="text-xl font-bold mb-3">About Temple</h2>
          <p className="text-muted-foreground leading-relaxed">{temple.description}</p>
        </motion.div>

        {/* Darshan Types */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-6">Darshan Slots</h2>
          {darshans.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">No darshan slots available yet.</p>
          ) : (() => {
            // Group darshans by name
            const groupedDarshans = darshans.reduce((acc, darshan) => {
              if (!acc[darshan.darshanName]) {
                acc[darshan.darshanName] = [];
              }
              acc[darshan.darshanName].push(darshan);
              return acc;
            }, {} as Record<string, Darshan[]>);

            const DarshanGroup = ({ name, slots }: { name: string, slots: Darshan[] }) => {
               const [selectedSlotId, setSelectedSlotId] = useState(slots[0]._id);
               const activeSlot = slots.find(s => s._id === selectedSlotId) || slots[0];

               return (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">{name}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                        <Users className="w-3 h-3" /> Available
                      </span>
                    </div>

                    <div className="mb-4">
                       <label className="block text-xs font-medium text-muted-foreground mb-1">Select Time Slot</label>
                       <select 
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={selectedSlotId}
                          onChange={(e) => setSelectedSlotId(e.target.value)}
                       >
                          {slots.map(s => (
                             <option key={s._id} value={s._id}>
                                {s.openTime} - {s.closeTime} ({s.availableSeats} seats left)
                             </option>
                          ))}
                       </select>
                    </div>
                    
                    {activeSlot.description && (
                      <p className="text-xs text-muted-foreground flex-grow mb-4">{activeSlot.description}</p>
                    )}
                    
                    <div className="mt-auto">
                       <p className="text-xs text-muted-foreground mb-4 font-medium bg-secondary/20 inline-block px-2 py-0.5 rounded text-secondary-foreground">
                         {activeSlot.availableSeats} / {activeSlot.capacity} Seats Available
                       </p>
                       <div className="flex items-center justify-between mb-5">
                         <div>
                           <p className="text-xs text-muted-foreground">Normal</p>
                           <p className="text-lg font-bold text-foreground">₹{activeSlot.normalPrice || "Free"}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-xs text-muted-foreground">VIP</p>
                           <p className="text-lg font-bold text-primary">₹{activeSlot.vipPrice}</p>
                         </div>
                       </div>
                       <motion.button
                         whileHover={{ scale: (activeSlot.availableSeats > 0 && useAuth().user?.role !== 'ADMIN') ? 1.03 : 1 }}
                         whileTap={{ scale: (activeSlot.availableSeats > 0 && useAuth().user?.role !== 'ADMIN') ? 0.97 : 1 }}
                         onClick={() => activeSlot.availableSeats > 0 && handleBookNow(activeSlot._id)}
                         disabled={activeSlot.availableSeats === 0 || useAuth().user?.role === 'ADMIN'}
                         className={`w-full py-2.5 rounded-md text-sm font-semibold shadow-saffron ${
                           activeSlot.availableSeats > 0 && useAuth().user?.role !== 'ADMIN'
                             ? "gradient-saffron text-primary-foreground" 
                             : "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                         }`}
                       >
                         {useAuth().user?.role === 'ADMIN' ? "Admin Access Only" : activeSlot.availableSeats > 0 ? "Book Darshan" : "Sold Out"}
                       </motion.button>
                     </div>
                  </motion.div>
               );
            };

            return (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Object.entries(groupedDarshans).map(([name, slots]) => (
                    <DarshanGroup key={name} name={name} slots={slots} />
                 ))}
               </div>
            );
          })()}
        </motion.div>
      </div>

      {/* Donation Modal */}
      <AnimatePresence>
        {showDonateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <button onClick={() => setShowDonateModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-saffron fill-saffron" />
                </div>
                <h3 className="text-xl font-bold mb-1">Make a Donation</h3>
                <p className="text-sm text-muted-foreground mb-6">Your contribution goes to {temple.templeName} trust fund.</p>

                <form onSubmit={handleDonate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {["101", "501", "1100"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonationAmount(amt)}
                          className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                            donationAmount === amt ? "border-saffron bg-saffron/10 text-saffron" : "border-border text-muted-foreground hover:border-saffron/50"
                          }`}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      required
                      min="1"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Custom amount"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                    <textarea
                      value={donationMessage}
                      onChange={(e) => setDonationMessage(e.target.value)}
                      placeholder="Write a prayer or message..."
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={donating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 gradient-saffron text-primary-foreground rounded-lg font-bold shadow-saffron disabled:opacity-60 mt-4"
                  >
                    {donating ? "Processing..." : `Donate ₹${donationAmount}`}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default TempleDetailsPage;

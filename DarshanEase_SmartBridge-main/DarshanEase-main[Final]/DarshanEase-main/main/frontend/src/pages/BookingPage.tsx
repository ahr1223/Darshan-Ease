import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Minus, Plus, Loader2 } from "lucide-react";
import { PageWrapper } from "@/components/animations";
import { getDarshansByTemple } from "@/services/darshanService";
import { getTempleById } from "@/services/templeService";
import { createBooking } from "@/services/bookingService";
import { useAuth } from "@/context/AuthContext";

const steps = ["Select Darshan", "Enter Tickets", "Confirm Booking"];

const BookingPage = () => {
  const { templeId, darshanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [temple, setTemple] = useState<any>(null);
  const [darshan, setDarshan] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [tickets, setTickets] = useState(1);
  const [ticketType, setTicketType] = useState<"NORMAL" | "VIP">("NORMAL");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      navigate("/admin");
    }
  }, [user, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, dRes] = await Promise.all([
          getTempleById(templeId!),
          getDarshansByTemple(templeId!),
        ]);
        setTemple(tRes.data);
        const found = dRes.data.find((d: any) => d._id === darshanId);
        setDarshan(found || dRes.data[0]);
      } catch {
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [templeId, darshanId]);

  const price = darshan ? (ticketType === "VIP" ? darshan.vipPrice : darshan.normalPrice) : 0;
  const total = price * tickets;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await createBooking({
        templeId: templeId!,
        darshanId: darshan._id,
        bookingDate,
        darshanTime: `${darshan.openTime} - ${darshan.closeTime}`,
        tickets,
        ticketType,
      });
      navigate("/success", { state: res.data });
    } catch (err: any) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!temple || !darshan) return <div className="pt-24 text-center text-muted-foreground">{error || "Booking not found."}</div>;

  return (
    <PageWrapper>
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-3xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold text-center mb-10">
            Book Your <span className="text-gradient-saffron">Darshan</span>
          </motion.h1>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center">
                <motion.div
                  animate={{ scale: activeStep >= i ? 1.1 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    activeStep > i ? "gradient-saffron text-primary-foreground" : activeStep === i ? "border-2 border-primary text-primary" : "border-2 border-border text-muted-foreground"
                  }`}
                >
                  {activeStep > i ? <Check className="w-5 h-5" /> : i + 1}
                </motion.div>
                <span className={`hidden sm:block ml-2 text-sm font-medium ${activeStep >= i ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
                {i < steps.length - 1 && <ChevronRight className="w-5 h-5 text-muted-foreground mx-3" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-lg p-6 md:p-8 shadow-card"
            >
              {/* Step 1 - Select Darshan */}
              {activeStep === 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">{temple.templeName}</h2>
                  <div className="bg-muted rounded-lg p-4 mb-4">
                    <h3 className="font-semibold">{darshan.darshanName}</h3>
                    <p className="text-sm text-muted-foreground">{darshan.openTime} - {darshan.closeTime}</p>
                    <p className="text-xs text-muted-foreground mt-1">{darshan.description}</p>
                    <p className="text-xs font-semibold text-primary mt-2">{darshan.availableSeats} Seats Available</p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Booking Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex gap-4 mb-6">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTicketType("NORMAL")}
                      className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${ticketType === "NORMAL" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                      Normal — ₹{darshan.normalPrice || "Free"}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTicketType("VIP")}
                      className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${ticketType === "VIP" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                      VIP — ₹{darshan.vipPrice}
                    </motion.button>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveStep(1)}
                    className="w-full py-3 gradient-saffron text-primary-foreground rounded-lg font-semibold shadow-saffron">
                    Continue
                  </motion.button>
                </div>
              )}

              {/* Step 2 - Tickets */}
              {activeStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Number of Tickets</h2>
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setTickets(Math.max(1, tickets - 1))}
                      className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50">
                      <Minus className="w-5 h-5" />
                    </motion.button>
                    <motion.span key={tickets} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="text-4xl font-bold text-primary w-16 text-center">
                      {tickets}
                    </motion.span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setTickets(Math.min(darshan.availableSeats, Math.min(10, tickets + 1)))}
                      disabled={tickets >= darshan.availableSeats || tickets >= 10}
                      className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50">
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="bg-muted rounded-lg p-4 mb-6 text-center">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">₹{total}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveStep(0)} className="flex-1 py-3 border-2 border-border rounded-lg font-semibold text-muted-foreground hover:border-primary transition-colors">Back</button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveStep(2)}
                      className="flex-1 py-3 gradient-saffron text-primary-foreground rounded-lg font-semibold shadow-saffron">Continue</motion.button>
                  </div>
                </div>
              )}

              {/* Step 3 - Confirm */}
              {activeStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Booking Summary</h2>
                  <div className="space-y-3 mb-8">
                    {[
                      ["Temple", temple.templeName],
                      ["Darshan", darshan.darshanName],
                      ["Date", bookingDate],
                      ["Type", ticketType],
                      ["Tickets", tickets],
                      ["Price per ticket", `₹${price}`],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-3">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold text-primary">₹{total}</span>
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <div className="flex gap-4">
                    <button onClick={() => setActiveStep(1)} className="flex-1 py-3 border-2 border-border rounded-lg font-semibold text-muted-foreground hover:border-primary transition-colors">Back</button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleConfirm} disabled={submitting}
                      className="flex-1 py-3 gradient-saffron text-primary-foreground rounded-lg font-semibold shadow-saffron disabled:opacity-60">
                      {submitting ? "Booking..." : "Confirm & Pay"}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BookingPage;

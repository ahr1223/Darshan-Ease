import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Eye, Loader2, X, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import { PageWrapper } from "@/components/animations";
import { getUserBookings } from "@/services/bookingService";
import { useAuth } from "@/context/AuthContext";

const UserDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qrModal, setQrModal] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getUserBookings();
        console.log("FETCHED BOOKINGS:", res.data);
        setBookings(res.data);
      } catch (err) {
        console.error("Booking error:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <PageWrapper>
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="container mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold mb-2">
            My <span className="text-gradient-saffron">Dashboard</span>
          </motion.h1>
          {user && <p className="text-muted-foreground mb-8">Welcome back, <strong>{user.name}</strong> 🙏</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <StatCard icon={<Ticket className="w-6 h-6" />} label="Total Bookings" value={bookings.length} color="saffron" index={0} />
            <StatCard icon={<Calendar className="w-6 h-6" />} label="Confirmed Darshans" value={confirmed} color="teal" index={1} />
            <StatCard icon={<MapPin className="w-6 h-6" />} label="Temples Visited" value={new Set(bookings.map((b) => b.templeId?._id)).size} color="gold" index={2} />
          </div>

          {/* Bookings Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-lg shadow-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-bold">My Bookings</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : error ? (
              <p className="text-center text-red-500 py-10">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">No bookings yet. <a href="/temples" className="text-primary underline">Book your first darshan!</a></p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      {["Temple", "Darshan", "Date", "Tickets", "Amount", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, i) => (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{booking.templeId?.templeName || "—"}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {booking.darshanId?.darshanName || "—"}
                          {booking.darshanId?.openTime && booking.darshanId?.closeTime && (
                           <div className="text-xs mt-0.5"><Clock className="inline w-3 h-3 mr-1"/>{booking.darshanId?.openTime} - {booking.darshanId?.closeTime}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{booking.bookingDate}</td>
                        <td className="px-6 py-4 text-center">{booking.tickets}</td>
                        <td className="px-6 py-4 font-semibold text-primary">₹{booking.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {booking.qrCode && booking.status !== "CANCELLED" && (
                              <button onClick={() => setQrModal(booking.qrCode)} className="text-primary hover:text-saffron transition-colors" title="View QR">
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== "CANCELLED" && (
                              <button
                                onClick={async () => {
                                  if (confirm("Are you sure you want to cancel this booking?")) {
                                    try {
                                      await import("@/services/bookingService").then(m => m.cancelBooking(booking._id));
                                      const res = await getUserBookings();
                                      setBookings(res.data);
                                    } catch (err) {
                                      alert("Failed to cancel booking.");
                                    }
                                  }
                                }}
                                className="text-xs font-semibold text-red-500 hover:text-red-700 underline"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* QR Modal */}
      {qrModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setQrModal(null)}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-card rounded-xl p-6 max-w-sm w-full text-center relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setQrModal(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold mb-4">Your QR Ticket</h3>
            <img src={qrModal} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
            <p className="text-xs text-muted-foreground mt-4">Show this QR at the temple entrance</p>
          </motion.div>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default UserDashboard;

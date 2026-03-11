import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Ticket, Users, UserCheck, Loader2, TrendingUp, Clock } from "lucide-react";
import { PageWrapper } from "@/components/animations";
import { getAllUsers, getAllBookings, getAllOrganizers } from "@/services/adminService";
import { getTemples } from "@/services/templeService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ temples: 0, bookings: 0, users: 0, organizers: 0, revenue: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [templesRes, bookingsRes, usersRes, organizersRes] = await Promise.all([
          getTemples(),
          getAllBookings(),
          getAllUsers(),
          getAllOrganizers(),
        ]);
        const bookings = bookingsRes.data;
        const revenue = bookings.reduce((sum: number, b: any) => sum + (b.price || 0), 0);
        setStats({
          temples: templesRes.data.length,
          bookings: bookings.length,
          users: usersRes.data.length,
          organizers: organizersRes.data.length,
          revenue,
        });
        setRecentBookings(bookings.slice(0, 10));
      } catch {
        setError("Unable to load stats. Make sure you're logged in as ADMIN.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Temples", value: stats.temples, icon: Building2, color: "text-orange-500", bg: "bg-orange-100" },
    { label: "Total Bookings", value: stats.bookings, icon: Ticket, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Users", value: stats.users, icon: Users, color: "text-green-600", bg: "bg-green-100" },
    { label: "Organizers", value: stats.organizers, icon: UserCheck, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <PageWrapper>
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="container mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl font-bold mb-2">
            Admin <span className="text-gradient-saffron">Dashboard</span>
          </motion.h1>
          <p className="text-muted-foreground mb-8">Platform overview & analytics</p>

          {error && <div className="bg-red-100 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                {statCards.map((card, i) => (
                  <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                    className="bg-card rounded-xl shadow-card p-5 flex flex-col gap-2">
                    <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <p className="text-2xl font-extrabold">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Bookings */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-card rounded-xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-bold">Recent Bookings</h2>
                </div>
                {recentBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">No bookings yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          {["User", "Temple", "Darshan", "Date", "Tickets", "Amount", "Status"].map((h) => (
                            <th key={h} className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((b, i) => (
                          <motion.tr key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                            className="border-b border-border hover:bg-muted/40 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium">{b.userId?.name || "—"}</td>
                            <td className="px-5 py-4 text-sm text-muted-foreground">{b.templeId?.templeName || "—"}</td>
                            <td className="px-5 py-4 text-sm text-muted-foreground">
                              {b.darshanId?.darshanName || "—"}
                              {b.darshanId?.openTime && b.darshanId?.closeTime && (
                                <div className="text-xs mt-0.5"><Clock className="inline w-3 h-3 mr-1"/>{b.darshanId.openTime} - {b.darshanId.closeTime}</div>
                              )}
                            </td>
                            <td className="px-5 py-4 text-sm text-muted-foreground">{b.bookingDate}</td>
                            <td className="px-5 py-4 text-sm text-center">{b.tickets}</td>
                            <td className="px-5 py-4 text-sm font-semibold text-primary">₹{b.price}</td>
                            <td className="px-5 py-4">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{b.status}</span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;

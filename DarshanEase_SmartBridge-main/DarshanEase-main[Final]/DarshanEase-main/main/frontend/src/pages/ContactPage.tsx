import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { PageWrapper } from "@/components/animations";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PageWrapper>
      <div className="pt-24 pb-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Contact <span className="text-gradient-saffron">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg">Have a question or want to list your temple? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="text-xl font-bold mb-6">Get In Touch</h2>
                {[
                  { icon: Phone, label: "Phone", val: "+91 9149180253" },
                  { icon: Mail, label: "Email", val: "harsh.2428cseai2360@kiet.edu" },
                  { icon: MapPin, label: "Address", val: "Ghaziabad, Uttar Pradesh, India" },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-start gap-4 mb-5 last:mb-0">
                    <div className="w-10 h-10 rounded-full gradient-saffron flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="font-medium">{val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-bold mb-2">Want to list your temple?</h3>
                <p className="text-sm text-muted-foreground">Register as an Organizer and start managing your temple bookings digitally.</p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-8 shadow-card">
              {sent ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                  <div className="text-5xl mb-4">🙏</div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-primary underline text-sm">Send another message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Send a Message</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="harsh"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 gradient-saffron text-primary-foreground rounded-lg font-semibold shadow-saffron flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactPage;

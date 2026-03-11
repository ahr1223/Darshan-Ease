import { motion } from "framer-motion";
import { PageWrapper } from "@/components/animations";
import { Sun, Users, Building2, Star } from "lucide-react";

const team = [
  { name: "Harsh Vishwakarma", role: "Core Developer", initial: "H" },
];

const AboutPage = () => (
  <PageWrapper>
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Sun className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            About <span className="text-gradient-saffron">TempleDarshan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We bridge the gap between devotees and divine darshan — making sacred temple visits accessible to everyone, everywhere.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-card rounded-xl p-8 shadow-card mb-10">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            TempleDarshan was built with a simple mission: let every devotee book darshan at India's most sacred temples
            without standing in long queues. Our platform connects temples, organizers, and devotees — creating a seamless
            spiritual booking experience.
          </p>
        </motion.div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl p-6 shadow-card text-center">
                <div className="w-16 h-16 rounded-full gradient-saffron flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </PageWrapper>
);

export default AboutPage;

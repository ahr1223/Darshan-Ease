import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: "saffron" | "teal" | "red" | "gold";
  index?: number;
}

const colorClasses = {
  saffron: "gradient-saffron",
  teal: "gradient-teal",
  red: "bg-secondary",
  gold: "bg-gold",
};

const StatCard = ({ icon, label, value, color = "saffron", index = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-primary-foreground ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;

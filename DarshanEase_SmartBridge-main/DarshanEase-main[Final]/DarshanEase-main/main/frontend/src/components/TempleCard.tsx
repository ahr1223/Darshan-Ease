import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Temple } from "@/data/temples";

interface TempleCardProps {
  temple: Temple;
  index: number;
}

const TempleCard = ({ temple, index }: TempleCardProps) => {
  const getFallback = (id: string) => {
    // Use picsum with seed for variety and reliability
    return `https://picsum.photos/seed/${id}/800/600`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getFallback(temple.id || (temple as any)._id || "");
    e.currentTarget.onerror = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={temple.image || getFallback(temple.id || (temple as any)._id || "")}
          alt={temple.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 glass px-2 py-1 rounded-full text-xs font-semibold">
          <Star className="w-3 h-3 text-primary fill-primary" />
          {temple.rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{temple.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          {temple.location}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{temple.description}</p>
        <Link to={`/temple/${temple.id}`}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 gradient-saffron text-primary-foreground rounded-md text-sm font-semibold shadow-saffron"
          >
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default TempleCard;

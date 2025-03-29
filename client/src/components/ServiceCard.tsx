import { motion } from "framer-motion";
import { Link } from "wouter";

interface ServiceProps {
  service: {
    id: number;
    title: string;
    description: string;
    image: string;
    link?: string;
  };
}

export default function ServiceCard({ service }: ServiceProps) {
  return (
    <motion.div 
      className="group relative rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <img 
        src={service.image} 
        alt={`${service.title} Service`} 
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-plum)] to-transparent opacity-70 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
        <p className="text-sm opacity-90 mb-3">{service.description}</p>
        <Link 
          href={service.link || `/services/${service.id}`}
          className="inline-block text-[var(--color-amber)] font-medium hover:underline"
        >
          Learn More →
        </Link>
      </div>
    </motion.div>
  );
}

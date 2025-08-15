import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-[var(--color-plum)]">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/assets/uploads/hairstyle.jpg" 
            alt="Beauty salon professional at work" 
            className="w-full h-full object-cover" 
          />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.7)] to-[rgba(26,26,26,0.4)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1 
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Beauty Woven in <span className="text-[var(--color-amber)]">Every Detail</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Nairobi's premier beauty destination offering luxury hair braiding, makeup, nail art, and henna services
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/contact">
            <motion.div 
              className="inline-block bg-[var(--color-amber)] text-white text-lg px-8 py-3 rounded shadow-lg hover:bg-opacity-90 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Today
            </motion.div>
          </Link>
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a href="#services" className="text-white animate-bounce">
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </section>
  );
}

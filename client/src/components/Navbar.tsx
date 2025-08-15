import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  // Handle scroll for changing navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/#services" },
    { name: "About", path: "/about" },
    { name: "Testimonials", path: "/#testimonials" },
  ];
  
  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-primary shadow-md" : "bg-transparent"
    }`}>
      <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl text-white">
          Beautify <span className="text-white/90">by Angel</span>
        </Link>
        
        <div className="hidden md:flex space-x-8 text-white">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`hover:text-white/80 transition ${
                location === link.path ? "text-white/90 font-medium" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Contact
            </Button>
          </Link>
          
          <a href="tel:+254123456789" className="text-white hover:text-white/80 transition">
            <Button className="bg-white text-primary hover:bg-white/90 px-6 py-2 rounded shadow-md">
              Call: +254 123 456 789
            </Button>
          </a>
        </div>
        
        <button 
          className="md:hidden text-white" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="bg-white shadow-lg absolute w-full p-4 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`text-primary hover:text-primary/80 transition ${
                    location === link.path ? "text-primary/90 font-medium" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/contact"
                className="border border-primary text-primary px-4 py-2 rounded text-center hover:bg-primary/10 transition"
              >
                Contact
              </Link>
              <a 
                href="tel:+254123456789"
                className="bg-primary text-white px-6 py-2 rounded text-center hover:bg-primary/90 transition shadow-md mt-2"
              >
                Call: +254 123 456 789
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

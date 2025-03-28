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
    { name: "Contact", path: "/contact" },
  ];
  
  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-[var(--color-plum)] shadow-md" : "bg-transparent"
    }`}>
      <nav className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <a className="font-bold text-2xl text-white">
            Beautify <span className="text-[var(--color-amber)]">by Angel</span>
          </a>
        </Link>
        
        <div className="hidden md:flex space-x-8 text-white">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a className={`hover:text-[var(--color-amber)] transition ${
                location === link.path ? "text-[var(--color-amber)]" : ""
              }`}>
                {link.name}
              </a>
            </Link>
          ))}
        </div>
        
        <Link href="/booking">
          <Button className="bg-[var(--color-amber)] hover:bg-[var(--color-amber)]/90 text-white px-6 py-2 rounded shadow-md">
            Book Now
          </Button>
        </Link>
        
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
                <Link key={link.path} href={link.path}>
                  <a className={`text-[var(--color-plum)] hover:text-[var(--color-amber)] transition ${
                    location === link.path ? "text-[var(--color-amber)]" : ""
                  }`}>
                    {link.name}
                  </a>
                </Link>
              ))}
              <Link href="/booking">
                <a className="bg-[var(--color-amber)] text-white px-6 py-2 rounded text-center hover:bg-opacity-90 transition shadow-md">
                  Book Now
                </a>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

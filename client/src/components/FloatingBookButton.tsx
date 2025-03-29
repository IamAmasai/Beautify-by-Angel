import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface FloatingBookButtonProps {
  price: number;
  onClick: () => void;
}

export default function FloatingBookButton({ price, onClick }: FloatingBookButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down past a certain point (e.g., 300px)
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-background p-2 rounded-lg shadow-md mb-2">
            <span className="text-sm mr-2">Total:</span>
            <span className="font-bold">KSh {price.toLocaleString()}</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={onClick}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Book Now
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
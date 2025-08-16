import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/lib/constants";

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  // Touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left
      handleNext();
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swiped right
      handlePrev();
    }
  };
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-[400px] md:h-[300px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full px-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="w-full md:col-start-2">
                  <div className="bg-[var(--color-ivory)] rounded-lg p-6 shadow-md h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[var(--color-blush)] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonials[currentIndex].name.split(' ').map(s=>s[0]).slice(0,2).join('')}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                        <div className="flex text-[var(--color-amber)]">
                          {Array(5).fill(0).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 flex-grow italic">"{testimonials[currentIndex].text}"</p>
                    <p className="text-sm text-gray-500 mt-4">{testimonials[currentIndex].service}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <button 
        onClick={handlePrev} 
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none hover:bg-[var(--color-ivory)]"
      >
        <ChevronLeft className="h-6 w-6 text-[var(--color-plum)]" />
      </button>
      
      <button 
        onClick={handleNext} 
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 focus:outline-none hover:bg-[var(--color-ivory)]"
      >
        <ChevronRight className="h-6 w-6 text-[var(--color-plum)]" />
      </button>
      
      <div className="flex justify-center mt-8">
        <div className="inline-flex gap-2">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full bg-[var(--color-plum)] ${
                index === currentIndex ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => handleDotClick(index)}
              data-index={index}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

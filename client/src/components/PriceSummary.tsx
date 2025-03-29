import { useEffect, useState } from "react";
import { PriceBreakdown } from "@/lib/priceCalculator";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface PriceSummaryProps {
  priceBreakdown: PriceBreakdown;
  className?: string;
}

export default function PriceSummary({ priceBreakdown, className = "" }: PriceSummaryProps) {
  const [prevTotal, setPrevTotal] = useState(priceBreakdown.totalPrice);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  // Effect to handle price change animations
  useEffect(() => {
    // Determine if price is increasing or decreasing
    setIsIncreasing(priceBreakdown.totalPrice > prevTotal);
    
    // Set highlight state for animation
    if (priceBreakdown.totalPrice !== prevTotal) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 1000);
      return () => clearTimeout(timer);
    }
    
    // Update previous total
    setPrevTotal(priceBreakdown.totalPrice);
  }, [priceBreakdown.totalPrice, prevTotal]);

  return (
    <Card className={`${className} shadow-lg w-full max-w-md`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-center">Price Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {priceBreakdown.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm">{item.name}</span>
            <span className="font-medium">KSh {item.price.toLocaleString()}</span>
          </div>
        ))}
        <Separator />
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <AnimatePresence>
            <motion.span
              key={priceBreakdown.totalPrice}
              className={`text-xl font-bold ${
                isHighlighted ? (isIncreasing ? "text-green-600" : "text-pink-600") : ""
              }`}
              initial={{ opacity: 0.7, y: isIncreasing ? 10 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              KSh {priceBreakdown.totalPrice.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>
      </CardFooter>
    </Card>
  );
}
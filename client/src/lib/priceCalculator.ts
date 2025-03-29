/**
 * Price Calculator Engine
 * Handles all pricing calculations for the booking system
 */

export interface PricingOptions {
  serviceId: number;
  basePrice: number;
  isHomeService: boolean;
  useOwnMaterials: boolean;
  materialQuantity: number;
  selectedPackage?: string;
  packagePrice?: number;
  extraLength?: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  homeServiceFee: number;
  materialsCost: number;
  lengthSurcharge: number;
  totalPrice: number;
  items: {
    name: string;
    price: number;
  }[];
}

// Constants
const HOME_SERVICE_FEE = 200;
const MATERIAL_COST_PER_UNIT = 70;
const EXTRA_LENGTH_FEE = 100;

/**
 * Calculate the total price based on selected options
 */
export function calculatePrice(options: PricingOptions): PriceBreakdown {
  const {
    basePrice,
    isHomeService,
    useOwnMaterials,
    materialQuantity,
    packagePrice,
    extraLength
  } = options;

  // Start with either base price or package price
  const baseAmount = packagePrice !== undefined ? packagePrice : basePrice;
  
  // Calculate home service fee
  const homeServiceFee = isHomeService ? HOME_SERVICE_FEE : 0;
  
  // Calculate materials cost (only if using salon's materials)
  const materialsCost = !useOwnMaterials ? materialQuantity * MATERIAL_COST_PER_UNIT : 0;
  
  // Calculate length surcharge
  const lengthSurcharge = extraLength ? EXTRA_LENGTH_FEE : 0;
  
  // Calculate total
  const totalPrice = baseAmount + homeServiceFee + materialsCost + lengthSurcharge;
  
  // Create itemized breakdown
  const items = [
    { name: "Base Price", price: baseAmount },
  ];
  
  if (homeServiceFee > 0) {
    items.push({ name: "Home Service Fee", price: homeServiceFee });
  }
  
  if (materialsCost > 0) {
    items.push({ name: `Salon Materials (${materialQuantity} units)`, price: materialsCost });
  }
  
  if (lengthSurcharge > 0) {
    items.push({ name: "Extra Length Fee", price: lengthSurcharge });
  }
  
  return {
    basePrice: baseAmount,
    homeServiceFee,
    materialsCost,
    lengthSurcharge,
    totalPrice,
    items
  };
}

/**
 * Format price in KSh currency format
 */
export function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString()}`;
}
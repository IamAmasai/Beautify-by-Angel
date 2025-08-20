import { ENV } from '../env.js';

export function effectivePrice(basePrice: number): number {
  return Math.round(basePrice * ENV.PRICE_MULTIPLIER);
}

export function depositAmount(total: number): number {
  return Math.round(total * ENV.DEPOSIT_PERCENT);
}
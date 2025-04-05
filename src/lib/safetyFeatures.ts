'use client';

import { useState, useEffect } from 'react';
import { getPriceForPair } from '@/lib/jupiter';

// Safety thresholds for trading
const SAFETY_THRESHOLDS = {
  MAX_PRICE_CHANGE_PERCENT: 5, // Maximum allowed price change in percentage
  MAX_SLIPPAGE_PERCENT: 1.5,   // Maximum allowed slippage in percentage
  MIN_LIQUIDITY: 10000,        // Minimum liquidity required for trading
  MAX_TRADE_SIZE_SOL: 10,      // Maximum trade size in SOL
  CIRCUIT_BREAKER_TIMEOUT: 15 * 60 * 1000, // 15 minutes timeout for circuit breaker
};

// Market condition types
export type MarketCondition = 'normal' | 'volatile' | 'extreme' | 'halted';

// Safety feature hook
export function useSafetyFeatures(pair: string) {
  const [marketCondition, setMarketCondition] = useState<MarketCondition>('normal');
  const [isCircuitBreakerTriggered, setIsCircuitBreakerTriggered] = useState(false);
  const [lastPriceCheck, setLastPriceCheck] = useState<{
    price: number;
    timestamp: number;
  } | null>(null);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [safetyWarnings, setSafetyWarnings] = useState<string[]>([]);

  // Check if trade size is within safe limits
  const isTradeSizeSafe = (amount: number): boolean => {
    return amount <= SAFETY_THRESHOLDS.MAX_TRADE_SIZE_SOL;
  };

  // Check if slippage is within safe limits
  const isSlippageSafe = (expectedPrice: number, executionPrice: number): boolean => {
    const slippagePercent = Math.abs((executionPrice - expectedPrice) / expectedPrice * 100);
    return slippagePercent <= SAFETY_THRESHOLDS.MAX_SLIPPAGE_PERCENT;
  };

  // Reset circuit breaker after timeout
  const resetCircuitBreaker = () => {
    setTimeout(() => {
      setIsCircuitBreakerTriggered(false);
      setSafetyWarnings(prev => [...prev, 'Circuit breaker reset, trading resumed']);
    }, SAFETY_THRESHOLDS.CIRCUIT_BREAKER_TIMEOUT);
  };

  // Trigger circuit breaker
  const triggerCircuitBreaker = (reason: string) => {
    setIsCircuitBreakerTriggered(true);
    setSafetyWarnings(prev => [...prev, `Circuit breaker triggered: ${reason}`]);
    resetCircuitBreaker();
  };

  // Check market conditions
  const checkMarketConditions = async () => {
    try {
      // Get current price
      const [inputToken, outputToken] = pair.split('/');
      const currentPrice = await getPriceForPair(inputToken, outputToken);
      
      const now = Date.now();
      
      // Calculate price change if we have a previous price check
      if (lastPriceCheck) {
        const timeDiff = now - lastPriceCheck.timestamp;
        const priceChange = Math.abs((currentPrice - lastPriceCheck.price) / lastPriceCheck.price * 100);
        setPriceChangePercent(priceChange);
        
        // Determine market condition based on price change
        if (priceChange > SAFETY_THRESHOLDS.MAX_PRICE_CHANGE_PERCENT * 2) {
          setMarketCondition('extreme');
          triggerCircuitBreaker('Extreme price volatility detected');
        } else if (priceChange > SAFETY_THRESHOLDS.MAX_PRICE_CHANGE_PERCENT) {
          setMarketCondition('volatile');
          setSafetyWarnings(prev => [...prev, 'Market volatility detected, proceeding with caution']);
        } else {
          setMarketCondition('normal');
        }
      }
      
      // Update last price check
      setLastPriceCheck({
        price: currentPrice,
        timestamp: now
      });
      
    } catch (error) {
      console.error('Error checking market conditions:', error);
      setMarketCondition('halted');
      triggerCircuitBreaker('Unable to fetch market data');
    }
  };

  // Check market conditions periodically
  useEffect(() => {
    // Initial check
    checkMarketConditions();
    
    // Set up interval for regular checks
    const interval = setInterval(checkMarketConditions, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [pair]);

  return {
    marketCondition,
    isCircuitBreakerTriggered,
    priceChangePercent,
    safetyWarnings,
    isTradeSizeSafe,
    isSlippageSafe,
    triggerCircuitBreaker
  };
}

// Mock function for simulating market conditions
export const simulateMarketCondition = (condition: MarketCondition): void => {
  console.log(`Simulating ${condition} market condition`);
};

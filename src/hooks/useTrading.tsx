'use client';

import { useState, useEffect } from 'react';
import { getPriceForPair, getQuote } from '@/lib/jupiter';

// Define types for trading strategies
export type StrategyType = 'Mean Reversion' | 'Breakout Momentum' | 'Range Scalping' | 'Multi-indicator';
export type IndicatorType = 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'Bollinger Bands';

export interface StrategyParams {
  type: StrategyType;
  indicators: {
    type: IndicatorType;
    parameters: Record<string, number>;
  }[];
  amount: number;
  pair: string;
  action: 'buy' | 'sell';
}

export default function useTrading(strategyParams: StrategyParams) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastSignal, setLastSignal] = useState<{
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    reason: string;
  } | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [pnl, setPnl] = useState<number>(0);
  const [trades, setTrades] = useState<any[]>([]);

  // Fetch current price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const [inputToken, outputToken] = strategyParams.pair.split('/');
        const price = await getPriceForPair(inputToken, outputToken);
        setCurrentPrice(price);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [strategyParams.pair]);

  // Execute trade based on strategy
  const executeTrade = async (action: 'buy' | 'sell', amount: number) => {
    setIsExecuting(true);
    
    try {
      // Simulate trade execution
      const [inputToken, outputToken] = strategyParams.pair.split('/');
      
      // Get quote from Jupiter
      const quote = await getQuote(
        action === 'buy' ? outputToken : inputToken,
        action === 'buy' ? inputToken : outputToken,
        amount
      );
      
      // Simulate successful trade
      const newTrade = {
        id: Date.now(),
        pair: strategyParams.pair,
        side: action,
        amount,
        price: currentPrice,
        timestamp: new Date().toISOString(),
        status: 'completed',
        pnl: action === 'buy' ? 0 : amount * 0.02 // Simulate small profit for sell
      };
      
      setTrades(prev => [newTrade, ...prev]);
      
      // Update PnL
      if (action === 'sell') {
        setPnl(prev => prev + (amount * 0.02));
      }
      
      // Set signal
      setLastSignal({
        action,
        confidence: 75,
        reason: `${action === 'buy' ? 'Buy' : 'Sell'} signal generated based on ${strategyParams.type} strategy`
      });
      
      return true;
    } catch (error) {
      console.error('Error executing trade:', error);
      return false;
    } finally {
      setIsExecuting(false);
    }
  };

  // Generate trading signals based on strategy
  const generateSignal = () => {
    // Simulate signal generation based on strategy type
    const signals = {
      'Mean Reversion': {
        action: Math.random() > 0.5 ? 'buy' : 'sell',
        confidence: Math.floor(Math.random() * 30) + 60,
        reason: 'Price deviation from moving average'
      },
      'Breakout Momentum': {
        action: Math.random() > 0.7 ? 'buy' : 'sell',
        confidence: Math.floor(Math.random() * 20) + 70,
        reason: 'Price breakout detected with volume confirmation'
      },
      'Range Scalping': {
        action: Math.random() > 0.4 ? 'buy' : 'sell',
        confidence: Math.floor(Math.random() * 25) + 65,
        reason: 'Price at support/resistance level'
      },
      'Multi-indicator': {
        action: Math.random() > 0.6 ? 'buy' : 'sell',
        confidence: Math.floor(Math.random() * 15) + 75,
        reason: 'Multiple indicators confirm trend direction'
      }
    };
    
    return signals[strategyParams.type];
  };

  return {
    isExecuting,
    lastSignal,
    currentPrice,
    pnl,
    trades,
    executeTrade,
    generateSignal
  };
}

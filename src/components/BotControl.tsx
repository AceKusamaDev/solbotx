'use client';

import { useState } from 'react';

type StrategyType = 'Mean Reversion' | 'Breakout Momentum' | 'Range Scalping' | 'Multi-indicator';
type IndicatorType = 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'Bollinger Bands';

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

interface BotControlProps {
  strategyParams: StrategyParams;
}

export default function BotControl({ strategyParams }: BotControlProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Bot not ready');
  const [lastSignal, setLastSignal] = useState<{
    action: 'buy' | 'sell' | 'hold';
    confidence: number;
    reason: string;
  } | null>(null);

  // Start the bot with the provided strategy parameters
  const handleStartBot = async () => {
    setIsLoading(true);
    setStatusMessage('Starting bot...');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsRunning(true);
      setStatusMessage('Bot running');
      
      // Simulate a trading signal after a short delay
      setTimeout(() => {
        setLastSignal({
          action: 'buy',
          confidence: 75,
          reason: 'Price crossed below SMA(14) indicating potential reversal'
        });
      }, 2000);
    }, 2000);
  };

  // Stop the bot
  const handleStopBot = () => {
    setIsRunning(false);
    setLastSignal(null);
    setStatusMessage('Bot stopped');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isRunning ? 'bg-green-500' : 
            isLoading ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-gray-300">{statusMessage}</span>
        </div>
      </div>

      {lastSignal && (
        <div className="mb-4 p-4 bg-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-white mb-2">Latest Signal</h3>
          <div className="flex items-center mb-2">
            <span className="text-gray-400 mr-2">Action:</span>
            <span className={`font-medium ${
              lastSignal.action === 'buy' ? 'text-green-500' : 
              lastSignal.action === 'sell' ? 'text-red-500' : 'text-yellow-500'
            }`}>
              {lastSignal.action.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center mb-2">
            <span className="text-gray-400 mr-2">Confidence:</span>
            <span className="font-medium text-white">{lastSignal.confidence}%</span>
          </div>
          <div>
            <span className="text-gray-400 mr-2">Reason:</span>
            <span className="text-white">{lastSignal.reason}</span>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleStartBot}
          disabled={isLoading || isRunning}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            isLoading || isRunning
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isLoading ? 'Starting...' : 'Start Bot'}
        </button>
        
        <button
          onClick={handleStopBot}
          disabled={!isRunning || isLoading}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
            !isRunning || isLoading
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Stop Bot
        </button>
      </div>
    </div>
  );
}

// Mock Jupiter API for static deployment
// This file replaces the actual Jupiter API integration for the demo version

export interface QuoteResponse {
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: string;
  routePlan: any[];
  contextSlot: number;
}

export interface SwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

export const getQuote = async (
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<QuoteResponse> => {
  // Mock response
  return {
    inAmount: (amount * 1000000000).toString(), // Convert to lamports
    outAmount: ((amount * 153.42) * 1000000).toString(), // Mock conversion rate
    otherAmountThreshold: "0",
    swapMode: "ExactIn",
    slippageBps: slippageBps,
    platformFee: {
      amount: "0",
      feeBps: 0
    },
    priceImpactPct: "0.1",
    routePlan: [],
    contextSlot: 12345678
  };
};

export const getSwapTransaction = async (
  quoteResponse: QuoteResponse,
  userPublicKey: string
): Promise<SwapResponse> => {
  // Mock response
  return {
    swapTransaction: "mock_transaction_data",
    lastValidBlockHeight: 12345678,
    prioritizationFeeLamports: 5000
  };
};

export const getPriceForPair = async (
  inputMint: string,
  outputMint: string
): Promise<number> => {
  // Mock price data
  const prices: Record<string, number> = {
    "SOL/USDC": 153.42,
    "SOL/USDT": 153.38,
    "SOL/BTC": 0.00245
  };
  
  const key = `${inputMint.split('/')[0]}/${outputMint.split('/')[0]}`;
  return prices[key] || 150.00; // Default fallback price
};

export const getTokenList = async (): Promise<string[]> => {
  // Mock token list
  return ["SOL", "USDC", "USDT", "BTC", "ETH", "BONK"];
};

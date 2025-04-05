'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = () => {
    // Simulate wallet connection for static deployment
    setConnected(true);
    setWalletAddress('8xDc...3Fgh');
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress('');
  };

  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-white">
            SolBotX
          </Link>
          <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-0.5 rounded">
            Demo
          </span>
        </div>
        
        <div>
          {connected ? (
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">
                {walletAddress}
              </span>
              <button
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import TokenDashboard from './Dashboard';
import WalletConnect from './Wallet';

const App = () => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const checkConnection = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
  };

  console.log({ account, isConnected, checkConnection, connectWallet, disconnectWallet, });

  return <>
    <TokenDashboard {...{ account, isConnected, connectWallet }} />
    <WalletConnect {...{ account, isConnected, checkConnection, connectWallet, disconnectWallet, }} />
  </>;
};

export default App;
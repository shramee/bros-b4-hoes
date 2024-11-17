import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data generator for price history
const generatePriceHistory = (basePrice: number, volatility: number) => {
	const points = 20;
	const data = [];
	let currentPrice = basePrice;

	for (let i = 0; i < points; i++) {
		currentPrice = currentPrice * (1 + (Math.random() - 0.5) * volatility);
		data.push({
			time: `${i}h`,
			price: currentPrice
		});
	}
	return data;
};

// Token pair data
const tokenPairs = [
	{
		pair: "AAVE/USD",
		basePrice: 95,
		prediction: 98.5,
		confidence: 85,
		volatility: 0.05
	},
	{
		pair: "ARB/USD",
		basePrice: 1.75,
		prediction: 1.65,
		confidence: 75,
		volatility: 0.08
	},
	{
		pair: "BNB/USD",
		basePrice: 575,
		prediction: 595,
		confidence: 82,
		volatility: 0.04
	},
	{
		pair: "BTC/USD",
		basePrice: 67000,
		prediction: 69500,
		confidence: 88,
		volatility: 0.03
	},
	{
		pair: "DAI/USD",
		basePrice: 1,
		prediction: 1,
		confidence: 99,
		volatility: 0.001
	},
	{
		pair: "ETH/BTC",
		basePrice: 0.053,
		prediction: 0.055,
		confidence: 78,
		volatility: 0.06
	},
	{
		pair: "ETH/USD",
		basePrice: 3500,
		prediction: 3650,
		confidence: 86,
		volatility: 0.045
	}
].map(token => ({
	...token,
	priceHistory: generatePriceHistory(token.basePrice, token.volatility)
}));

const TokenCard = ({ isConnected, clickedBuy, pair, priceHistory, prediction, confidence }) => {
	const currentPrice = priceHistory[priceHistory.length - 1].price;
	const isPriceIncreasing = prediction > currentPrice;
	const formatPrice = (price) => price.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 4
	});

	return (
		<Card className="w-full max-w-sm">
			<CardContent className="p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">{pair}</h2>
					{isPriceIncreasing ? (
						<TrendingUp className="text-green-500" />
					) : (
						<TrendingDown className="text-red-500" />
					)}
				</div>

				<div className="h-32 mb-4">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={priceHistory}>
							<Line
								type="monotone"
								dataKey="price"
								stroke={isPriceIncreasing ? "#22c55e" : "#ef4444"}
								dot={false}
							/>
							<XAxis dataKey="time" hide />
							<YAxis hide domain={['auto', 'auto']} />
							<Tooltip
								formatter={(value) => formatPrice(value)}
								labelFormatter={(label) => `Time: ${label}`}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="space-y-2 mb-4">
					<div className="flex justify-between">
						<span className="text-gray-500">Current Price</span>
						<span className="font-medium">${formatPrice(currentPrice)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-500">Predicted Price</span>
						<span className="font-medium">${formatPrice(prediction)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-500">Prediction Confidence</span>
						<span className="font-medium">{confidence}%</span>
					</div>
				</div>

				<Button
					className={`w-full ${isPriceIncreasing ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
					onClick={() => clickedBuy(pair)}
				>
					{isConnected ? "Buy" : "Connect Wallet"}
				</Button>
			</CardContent>
		</Card>
	);
};

const TokenDashboard = ({ account, isConnected, connectWallet }) => {

	const clickedBuy = async (pair) => {
		if (!window.ethereum) {
			alert('Please install MetaMask!');
			return;
		}

		if (!isConnected) {
			connectWallet();
		}

		try {

		} catch (error) {
			console.error('Error connecting wallet:', error);
		}
	};

	const checkConnection = async () => {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const accounts = await provider.listAccounts();
			if (accounts.length > 0) {
				setIsConnected(true);
			}
		} catch (error) {
			console.error('Error checking connection:', error);
		}
	};

	return <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

		{tokenPairs.map((token) => (
			<TokenCard key={token.pair} {...{ ...token, clickedBuy, isConnected }} />
		))}
	</div>

};

export default TokenDashboard;
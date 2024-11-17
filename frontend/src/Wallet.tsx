import { useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Wallet } from 'lucide-react';

const WalletConnect = ({ account, isConnected, checkConnection, connectWallet, disconnectWallet, }) => {
	useEffect(() => {
		checkConnection();
	}, []);

	const formatAddress = (address) => {
		return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
	};

	return (
		<div className="fixed top-4 right-4">
			{!isConnected ? (
				<Button
					onClick={connectWallet}
					className="flex items-center gap-2"
				>
					<Wallet size={20} />
					Connect Wallet
				</Button>
			) : (
				<Button
					variant="outline"
					onClick={disconnectWallet}
					className="flex items-center gap-2"
				>
					<Wallet size={20} />
					{formatAddress(account)}
				</Button>
			)}
		</div>
	);
};

export default WalletConnect;
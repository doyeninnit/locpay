

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ethers } from 'ethers';
declare global {
    interface Window {
        ethereum: any;
    }
}
const Spinner = () => (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-50">
        <div className="border-t-4 border-blue-500 border-solid rounded-full w-10 h-10 animate-spin"></div>
    </div>
);

const ConfirmModal = ({ businessName, onConfirm }: { businessName: string; onConfirm: () => void }) => (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-black z-50">
        <div className="bg-white p-6 rounded">
            <p className="mb-4">Confirm payment to: {businessName}</p>
            <button onClick={onConfirm} className="bg-green-500 p-2 rounded text-white">Confirm Payment</button>
        </div>
    </div>
);


const TransactionSuccessModal = () => (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-black text-2xl font-bold">Transaction Successful!</p>
        </div>
    </div>
);



const PayMerchants = () => {
    const [tillNumber, setTillNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [merchantWalletAddress, setMerchantWalletAddress] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactionSuccess, setTransactionSuccess] = useState(false);
    const { user } = useAuth(); // Assuming useAuth is correctly implemented

 // Initiate payment to get business name
 const handlePaymentInitiation = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // if (!user) {
    //     console.error("User is not authenticated.");
    //     return;
    // }

    setLoading(true);
    try {
        const response = await fetch('https://locpay.vercel.app/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify({
                tillNumber: tillNumber,
                confirm: false
            }),
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            setBusinessName(data.businessName);
            setIsConfirming(true);
        } else {
            console.error("Error initiating payment:", data.message);
        }
    } catch (error) {
        setLoading(false);
        console.error("Error:", error);
    }
};

// Confirm payment to get merchant wallet address
const handlePaymentConfirmation = async () => {
    setLoading(true);
    try {
        const response = await fetch('https://locpay.vercel.app/pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('userToken')}`
            },
            body: JSON.stringify({
                tillNumber: tillNumber,
                confirm: true
            }),
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            setMerchantWalletAddress(data.walletAddress);
            initiateMetaMaskTransaction(data.walletAddress);
        } else {
            console.error("Error confirming payment:", data.message);
        }
    } catch (error) {
        setLoading(false);
        console.error("Error:", error);
    }
};

// const initiateMetaMaskTransaction = async (merchantWalletAddress: any) => {
//     if (window.ethereum && window.ethereum.isMiniPay) {
//         try {
//             // await window.ethereum.request({ method: 'eth_requestAccounts' });
//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();
//             const transaction = {
//                 to: merchantWalletAddress,
//                 // Convert the amount to Wei. The 'amount' state variable should be in Ether.
//                 // value: ethers.utils.parseEther(amount)
//                 value: ethers.utils.parseUnits(amount, 18) // Assuming cUSD has 18 decimals

//             };

//             const tx = await signer.sendTransaction(transaction);
//             console.log('Transaction successful:', tx);
//             setTransactionSuccess(true);
//             setTimeout(() => setTransactionSuccess(false), 3000);
//         } catch (error) {
//             console.error('Error with MetaMask transaction:', error);
//         }
//     } else {
//         console.error('MetaMask not installed');
//     }
// };

const cUSDContractABI = [
    // transfer
    "function transfer(address recipient, uint256 amount) returns (bool)"
];
const cUSDContractAddress = "0x765DE816845861e75A25fCA122bb6898B8B1282a"

const initiateMetaMaskTransaction = async (merchantWalletAddress: any) => {
    if (window.ethereum && window.ethereum.isMiniPay) {
    try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const cUSDContract = new ethers.Contract(cUSDContractAddress, cUSDContractABI, signer);

            // Convert the amount to the smallest unit of cUSD. 
            // This depends on the decimals used in the cUSD contract, typically 18.
            const amountInSmallestUnit = ethers.utils.parseUnits(amount, 18);

            const tx = await cUSDContract.transfer(merchantWalletAddress, amountInSmallestUnit);
            console.log('cUSD Transaction successful:', tx);
            setTransactionSuccess(true);
            setTimeout(() => setTransactionSuccess(false), 3000);
        } catch (error) {
            console.error('Error with cUSD transaction:', error);
        }
    } else {
        console.error('MetaMask not installed');
    }
};
    return (
        <div className="min-h-screen bg-gradient-to-r from-black to-purple-900 p-4">
            {/* {loading && <Spinner />} */}
            {/* {isConfirming && <ConfirmModal businessName={businessName} onConfirm={handlePaymentConfirmation} />} */}
            {/* {transactionSuccess && <TransactionSuccessModal />} */}

            {loading && <Spinner />}
            {/* {isConfirming && <ConfirmModal businessName={businessName} onConfirm={handlePaymentConfirmation} />} */}
            {transactionSuccess && <TransactionSuccessModal />}
            {/* ...rest of the component... */}

            <div className="container mx-auto text-white">
                <h1 className="text-2xl font-bold mb-4">Pay Merchants</h1>
                <form onSubmit={handlePaymentInitiation}>
                    <div className="mb-4">
                        <label htmlFor="tillNumber" className="block mb-2">Till Number:</label>
                        <input
                            type="number"
                            id="tillNumber"
                            name="tillNumber"
                            className="p-2 rounded bg-gray-800 w-full"
                            value={tillNumber}
                            onChange={e => setTillNumber(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="amount" className="block mb-2">Amount to Pay:</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="p-2 rounded bg-gray-800 w-full"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>

                    {!isConfirming ? (
                        <button type="submit" className="bg-blue-600 p-2 rounded text-white">Proceed</button>
                    ) : (
                        <div>
                            <p className="mb-4">Confirm payment to: {businessName}</p>
                            <button type="button" onClick={handlePaymentConfirmation} className="bg-green-500 p-2 rounded text-white">Confirm Payment</button>
                        </div>
                    )}
                    {/* <button type="submit" className="bg-blue-600 p-2 rounded text-white">Proceed</button> */}

                </form>
            </div>
        </div>
    );
}

export default PayMerchants;

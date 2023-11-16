// import React, { useState } from 'react';

// const Messaging: React.FC = () => {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [newMessage, setNewMessage] = useState<string>('');

//   const userAddress = '0xe1F4615Afec6801493FB889eDe3A70812c842d05'; // Replace with a real address for testing

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       setMessages(prevMessages => [...prevMessages, newMessage]);
//       setNewMessage('');
//     }
//   };

//   return (
//     <div className="h-screen bg-gray-100 flex flex-col">
//       <div className="bg-blue-600 text-white text-center py-4 shadow-md">
//         Wallet-to-Wallet Messaging
//       </div>
//       <div className="flex-grow p-4 overflow-y-auto">
//         {messages.map((message, idx) => (
//           <div key={idx} className="mb-4 p-3 bg-white rounded shadow-md">
//             {message}
//           </div>
//         ))}
//       </div>

//       <div className="border-t p-4 bg-white shadow-inner flex items-center">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-grow p-3 rounded border border-gray-300 outline-none"
//         />
//         <button onClick={handleSendMessage} className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Messaging;


// // Import restapi for function calls  
// // Import socket for listening for real time messages
// import { PushAPI } from '@pushprotocol/restapi';
// import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

// // Ethers v5 or Viem, both are supported
// import { ethers } from 'ethers';

// // Creating a random signer from a wallet, ideally this is the wallet you will connect
// const signer = ethers.Wallet.createRandom();

// // Initialize wallet user, pass 'prod' instead of 'staging' for mainnet apps
// const userAlice = await PushAPI.initialize(signer, { env: 'staging' });

//   // This will be the wallet address of the recipient 
//   const toWalletAddress = ethers.Wallet.createRandom().address;

//   // Send a message to Bob
//   const aliceMessagesBob = await userAlice.chat.send(toWalletAddress, {
//     content: 'Hello Bob!',
//     type: 'Text',
//   });

//   // Create Socket Connection
// const pushSDKSocket = createSocketConnection({
//   user: signer.wallet,
//   socketType: 'chat',
//   socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
//   env: 'staging',
// });

// // To listen to real time message
// pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
//   console.log(message);
// });


// import React, { useEffect, useState } from 'react';
// import { ethers } from 'ethers';
// import { PushAPI } from '@pushprotocol/restapi';
// import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

// const PushProtocolChat: React.FC = () => {
//     const [messages, setMessages] = useState<string[]>([]);
//     const [recipientAddress, setRecipientAddress] = useState<string>('');

//     useEffect(() => {
//         const initializeChat = async () => {
//             // Create a random signer
//             // const signer = ethers.Wallet.createRandom();
//             const signer = new ethers.Wallet("7bc659633cd63c6155a7db700ac16caf9c42c469837b3d35505d369a4b76e24c");

//             // Initialize PushAPI
//             const userAlice = await PushAPI.initialize(signer, { env: 'staging' as any });

//             // Generate a random recipient address
//             const toWalletAddress = new ethers.Wallet("4631b73bedaad273f06dba53872ab67cc2bfcd639fccc21508b589c74706eee4").address;
//             setRecipientAddress(toWalletAddress);

//             // Send a message
//             await userAlice.chat.send(toWalletAddress, {
//                 content: 'Hello Bob!',
//                 type: 'Text',
//             });

//             // Create Socket Connection
//             const pushSDKSocket = createSocketConnection({
//                 user: signer.address,
//                 socketType: 'chat',
//                 socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
//                 env: 'staging' as any, // or the correct value according to the type definition
//             });

//             // Check if pushSDKSocket is not null
//             if (pushSDKSocket) {
//                 // Listen to real-time messages
//                 pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
//                     setMessages((prevMessages) => [...prevMessages, message]);
//                     console.log(messages)
//                 });
//             } else {
//                 // Handle the case where pushSDKSocket is null
//                 console.error('Failed to create socket connection');
//             }
//         };

//         initializeChat();
//     }, []);

//     return (
//         <div>
//             <h1>Push Protocol Chat</h1>
//             <p>Messages with {recipientAddress}</p>
//             <div>
//                 {messages.map((message, index) => (
//                     <p key={index}>{message}</p>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default PushProtocolChat;


import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { PushAPI } from '@pushprotocol/restapi';
import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

const PushProtocolChat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [recipientAddress, setRecipientAddress] = useState<string>('');

    useEffect(() => {
        const initializeChat = async () => {
            try {
                // Replace with your own private keys
                const signerPrivateKey = "7bc659633cd63c6155a7db700ac16caf9c42c469837b3d35505d369a4b76e24c";
                const recipientPrivateKey = "4631b73bedaad273f06dba53872ab67cc2bfcd639fccc21508b589c74706eee4";

                const signer = new ethers.Wallet(signerPrivateKey);
                const toWalletAddress = new ethers.Wallet(recipientPrivateKey).address;
                setRecipientAddress(toWalletAddress);

                const userAlice = await PushAPI.initialize(signer, { env: 'staging' as any });
                
                console.log(userAlice)
                // Send a message
                const sentMessage = await userAlice.chat.send(toWalletAddress, {
                    content: 'Hello Bob!',
                    type: 'Text',
                });
                console.log('Message sent:', sentMessage);

                // Create Socket Connection
                const pushSDKSocket = createSocketConnection({
                    user: signer.address,
                    socketType: 'chat',
                    socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
                    env: 'staging' as any,
                });

                // Listen to real-time messages
                if (pushSDKSocket) {
                  // userAlice.chat.list(type, {options?})
               const aliceChats = await userAlice.chat.list("CHATS");
               console.log(`CHATS: ${aliceChats}`)
                    pushSDKSocket.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => {
                        console.log('Received message:', message);
                        setMessages((prevMessages) => [...prevMessages, message]);
                    });
                } else {
                    console.error('Failed to create socket connection');
                }
            } catch (error) {
                console.error('Error in initializeChat:', error);
            }
        };

        initializeChat();
    }, []);

    return (
        <div>
            <h1>Push Protocol Chat</h1>
            <p>Messages with {recipientAddress}</p>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>{JSON.stringify(message)}</p>

                ))}
            </div>
        </div>
    );
};

export default PushProtocolChat;

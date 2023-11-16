

// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md'; // Import the icons you want to use
// import { useAuth } from '../contexts/AuthContext';

// const Header = () => {
//     const { user } = useAuth();

//     return (
//         <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//             <div className="container mx-auto">
//                 <div className="flex justify-between items-center">
//                     <div className="text-white font-bold">
//                         Welcome, Anon
//                     </div>

//                     {user ? (
//                         <div className="text-white flex items-center space-x-4">
//                             <MdNotifications size={24} /> {/* Notification Icon */}
//                             <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
//                             {/* You can wrap the above icons in buttons or links if needed */}
//                         </div>
//                     ) : null}
//                 </div>
//             </div>
//         </header>
//     );
// }

// export default Header;


// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md'; 
// import { useAuth } from '../contexts/AuthContext';
// // import QRScanner from './QRScanner'; // Make sure to import the scanner component
// import { useState } from 'react';
// import ScanPage from './scan'
// const Header = () => {
//   const { user } = useAuth();
//   const [showScanner, setShowScanner] = useState(false);

//   return (
//     <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center">
//           <div className="text-white font-bold">
//             Welcome, Anon
//           </div>

//           {/* {user ? ( */}
//             <div className="text-white flex items-center space-x-4">
//               <MdNotifications size={24} /> {/* Notification Icon */}
//               <button onClick={() => setShowScanner(!showScanner)}>
//                 <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
//               </button>
//               {showScanner && <ScanPage />}
//             </div>
//           {/* ) : null} */}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;


// import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md';
// import { useAuth } from '../contexts/AuthContext';
// import { useState } from 'react';
// import ScanPage from './scan';

// const Header = () => {
//   const { user } = useAuth();
//   const [showScanner, setShowScanner] = useState(false);

//   return (
//     <header className="bg-gradient-to-r from-black to-purple-900 p-4">
//       <div className="container mx-auto">
//         <div className="flex justify-between items-center">
//           <div className="text-white font-bold">
//             Welcome, Anon
//           </div>

//           {/* {user ? ( */}
//             <div className="text-white flex items-center space-x-4">
//               <MdNotifications size={24} /> {/* Notification Icon */}
//               <button onClick={() => setShowScanner(!showScanner)}>
//                 <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
//               </button>
//               {showScanner && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
//                   <ScanPage />
//                   <button 
//                     className="absolute top-4 right-4 text-white text-2xl" 
//                     onClick={() => setShowScanner(false)}
//                   >
//                     &#x2715; {/* Close button (X symbol) */}
//                   </button>
//                 </div>
//               )}
//             </div>
//           {/* ) : null} */}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import { MdNotifications, MdCenterFocusStrong } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import ScanPage from './scan';

const Header = () => {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);

  const closeScanner = () => setShowScanner(false);

  return (
    <>
      <header className="bg-gradient-to-r from-black to-purple-900 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold">
              Welcome, Anon
            </div>

            <div className="text-white flex items-center space-x-4">
              <MdNotifications size={24} /> {/* Notification Icon */}
              <button onClick={() => setShowScanner(true)}>
                <MdCenterFocusStrong size={24} /> {/* Scan Icon */}
              </button>
            </div>
          </div>
        </div>
      </header>

      {showScanner && (
        <div className="fixed inset-0 bg-black z-50">
          <ScanPage />
          <button 
            className="absolute top-0 right-0 m-4 text-white text-2xl" 
            onClick={closeScanner}
          >
            &#x2715; {/* Close button (X symbol) */}
          </button>
        </div>
      )}
    </>
  );
}

export default Header;

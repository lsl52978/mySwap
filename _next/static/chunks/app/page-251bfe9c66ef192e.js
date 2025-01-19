(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{5907:(e,t,l)=>{Promise.resolve().then(l.bind(l,9809))},9809:(e,t,l)=>{"use strict";l.r(t),l.d(t,{default:()=>r});var n=l(5155),s=l(2115),a=l(9092),c=l(6911);let r=()=>{let{walletConnected:e,walletAddress:t,mockERC20Balance:l,mockUSDCBalance:r,mockSwapBalance:o,connectWallet:i,disconnectWallet:d}=(0,a.v)();return(0,s.useEffect)(()=>{console.log("env var check ","https://your-api-url.com","0x46caFcED9C1E16F05b474774144f325A16d9B26E","0x5BAAA2054Bba4A1FEAf52aFb8502B14c61A8Bed9")},[]),(0,n.jsx)("div",{className:"min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4",children:(0,n.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-6 w-full max-w-lg",children:[(0,n.jsx)("h1",{className:"text-2xl font-bold text-gray-800 text-center mb-6",children:"Wallet Information"}),e?(0,n.jsxs)("div",{className:"space-y-6",children:[(0,n.jsxs)("div",{className:"text-center",children:[(0,n.jsx)("h2",{className:"text-lg font-semibold text-gray-600",children:"Connected Wallet Address:"}),(0,n.jsx)("p",{className:"mt-2 text-purple-700 font-mono break-all",children:t})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)("h3",{className:"text-lg font-semibold text-gray-600",children:"Token Balances:"}),(0,n.jsxs)("div",{className:"flex justify-between items-center mt-4",children:[(0,n.jsx)("span",{className:"text-gray-700",children:"MockERC20:"}),(0,n.jsx)("span",{className:"text-purple-700 font-semibold",children:l})]}),(0,n.jsxs)("div",{className:"flex justify-between items-center mt-4",children:[(0,n.jsx)("span",{className:"text-gray-700",children:"MOCK_USDC:"}),(0,n.jsx)("span",{className:"text-purple-700 font-semibold",children:r})]}),(0,n.jsxs)("div",{className:"flex justify-between items-center mt-4",children:[(0,n.jsx)("span",{className:"text-gray-700",children:"MOCK_LTP_TOKEN:"}),(0,n.jsx)("span",{className:"text-purple-700 font-semibold",children:o})]})]}),(0,n.jsx)("div",{className:"flex justify-center mt-6",children:(0,n.jsx)(c.A,{onClick:d,className:"bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg",children:"Disconnect Wallet"})})]}):(0,n.jsxs)("div",{className:"text-center",children:[(0,n.jsx)("p",{className:"text-gray-600 mb-6",children:"No wallet connected. Please connect your wallet to view balances."}),(0,n.jsx)(c.A,{onClick:i,className:"bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg",children:"Connect Wallet"})]})]})})}},6911:(e,t,l)=>{"use strict";l.d(t,{A:()=>s});var n=l(5155);l(2115);let s=e=>{let{onClick:t,className:l,disabled:s,children:a,type:c="button"}=e;return(0,n.jsx)("button",{onClick:t,disabled:s,type:c,className:"py-2 px-4 rounded-lg font-medium transition ".concat(s?"bg-gray-300 text-gray-500 cursor-not-allowed":"bg-blue-500 hover:bg-blue-600 text-white"," ").concat(l),children:a})}},9092:(e,t,l)=>{"use strict";l.d(t,{WalletProvider:()=>d,v:()=>u});var n=l(5155),s=l(2115),a=l(8808),c=l(5631),r=l(2316),o=l(3201);let i=(0,s.createContext)(void 0),d=e=>{let{children:t}=e,[l,d]=(0,s.useState)(!1),[u,h]=(0,s.useState)(null),[w,m]=(0,s.useState)("0.00"),[x,f]=(0,s.useState)("0.00"),[g,b]=(0,s.useState)("0.00"),v=async()=>{if(!window.ethereum){alert("MetaMask is not installed");return}try{let e=window.ethereum,t=new a.k(e),l=await t.send("eth_accounts",[]);if(l.length>0){console.log("Already connected:",l[0]),d(!0),h(l[0]),(0,o.P)("walletConnected",!0),(0,o.P)("walletAddress",l[0]),await p(t,l[0]);return}let n=await e.request({method:"eth_requestAccounts"});if(0===n.length){alert("No accounts found. Please connect your wallet.");return}let s=n[0];console.log("Connected account:",s),d(!0),h(s),(0,o.P)("walletConnected",!0),(0,o.P)("walletAddress",s),await p(t,s),console.log("Wallet connected successfully.")}catch(e){4001===e.code?alert("User rejected the connection request."):(console.error("Error connecting wallet:",e),alert("Failed to connect wallet. Please try again."))}},p=async(e,t)=>{try{let l=new c.NZ("0x46caFcED9C1E16F05b474774144f325A16d9B26E",["function balanceOf(address) view returns (uint256)"],e),n=new c.NZ("0x5BAAA2054Bba4A1FEAf52aFb8502B14c61A8Bed9",["function balanceOf(address) view returns (uint256)"],e),s=new c.NZ("0xE314913f34Ddb810142Acca1Acd3C96603e42468",["function balanceOf(address) view returns (uint256)"],e),[a,o,i]=await Promise.all([l.balanceOf(t),n.balanceOf(t),s.balanceOf(t)]);m(r.Js(a,18)),f(r.Js(o,6)),b(r.Js(i,18))}catch(e){console.error("Error fetching balances:",e)}},y=async e=>{if(0===e.length)console.log("Wallet disconnected"),d(!1),h(null),m("0.00"),f("0.00"),b("0.00"),(0,o.P)("walletConnected",!1),(0,o.P)("walletAddress",null);else{let t=window.ethereum,l=new a.k(t);h(e[0]),(0,o.P)("walletAddress",e[0]),await p(l,e[0])}},N=e=>{console.log("Chain changed to: ".concat(parseInt(e,16))),0xaa36a7!==parseInt(e,16)?alert("Please switch to Sepolia network."):v()},j=async()=>{if(void 0===window.ethereum){console.log("MetaMask is not installed");return}try{let e=window.ethereum.isMetaMask,t=window.ethereum;e?(await t.request({method:"wallet_revokePermissions",params:[{eth_accounts:{}}]}),console.log("Disconnected via wallet_revokePermissions.")):(await t.request({method:"eth_requestAccounts",params:[{eth_accounts:{}}]}),console.log("Disconnected via eth_requestAccounts substitute method.")),d(!1),h(null),m("0.00"),f("0.00"),b("0.00"),(0,o.P)("walletConnected",!1),(0,o.P)("walletAddress",null),alert("Wallet disconnected successfully.")}catch(e){console.error("Error disconnecting wallet:",e),alert("Failed to disconnect wallet. Please try again.")}};return(0,s.useEffect)(()=>{let e=async()=>{let e=window.ethereum,t=new a.k(e),l=(0,o.J)("walletConnected"),n=(0,o.J)("walletAddress");l&&n&&(console.log("Reconnecting wallet:",n),d(!0),h(n),await p(t,n))};if(window.ethereum){let t=window.ethereum;return t.on("accountsChanged",y),t.on("chainChanged",N),"11155111"!==t.networkVersion&&alert("Please switch to Sepolia network."),e(),()=>{t.removeListener&&(t.removeListener("accountsChanged",y),t.removeListener("chainChanged",N))}}},[]),(0,n.jsx)(i.Provider,{value:{walletConnected:l,walletAddress:u,mockERC20Balance:w,mockUSDCBalance:x,mockSwapBalance:g,connectWallet:v,disconnectWallet:j},children:t})},u=()=>{let e=(0,s.useContext)(i);if(!e)throw Error("useWallet must be used within a WalletProvider");return e}},3201:(e,t,l)=>{"use strict";function n(e,t){localStorage.setItem(e,JSON.stringify(t))}function s(e){try{return JSON.parse(localStorage.getItem(e))}catch(e){return null}}l.d(t,{J:()=>s,P:()=>n})}},e=>{var t=t=>e(e.s=t);e.O(0,[733,441,517,358],()=>t(5907)),_N_E=e.O()}]);
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[552],{4175:(e,a,t)=>{Promise.resolve().then(t.bind(t,771))},771:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>h});var s=t(5155),l=t(2115),n=t(9092),r=t(6911),c=t(3201),i=t(5631),d=t(8808),o=t(6141),u=t(2316),m=t(2276),x=t(4570),w=t(9659);let h=()=>{let{walletConnected:e,walletAddress:a,connectWallet:t}=(0,n.v)(),[h,g]=(0,l.useState)(!1),[f,p]=(0,l.useState)("MockERC20"),[b,N]=(0,l.useState)("MOCK_USDC"),[j,v]=(0,l.useState)(""),[k,y]=(0,l.useState)(""),S="0xE314913f34Ddb810142Acca1Acd3C96603e42468",C="0x5BAAA2054Bba4A1FEAf52aFb8502B14c61A8Bed9",E="0x46caFcED9C1E16F05b474774144f325A16d9B26E",A=(e,a)=>{if(e===C)return{contract:new i.NZ(e,w.HV,a),decimals:6};if(e===E)return{contract:new i.NZ(e,x.HV,a),decimals:18};throw Error("Invalid token address.")},F=async e=>{if(!e||0>=parseFloat(e))return"0.00";try{let a=window.ethereum,t=new d.k(a),s=await t.getSigner(),l=new o.KA(m.HV),n=new i.NZ(S,l,s),r="MockERC20"===f?E:C,c="MockERC20"===b?E:C,{decimals:x}=A(r,s),w=u.XS(e,x),h=await n.getAmountsOut(w,r,c);console.log("Amount out: ",h);let{decimals:g}=A(c,s);return u.Js(h,g)}catch(e){return console.error("Error fetching swap preview:",e),"0.00"}},O=async(e,t)=>{let s=window.ethereum,l=new d.k(s),{contract:n,decimals:r}=A(e,await l.getSigner()),c=await n.balanceOf(a),i=u.XS(t,r);return console.log("Balance for ".concat(e,": ").concat(u.Js(c,r),", Required: ").concat(t)),c>=i},_=async e=>{v(e),g(!0);let a=await F(e);console.log("Swap preview result:",a),y(a),g(!1)},B=async()=>{if(!(!j||0>=parseFloat(j)))try{g(!0);let e=window.ethereum,t=new d.k(e),s=await t.getSigner(),l=new o.KA(m.HV),n=new i.NZ(S,l,s),r="MockERC20"===f?E:C,x="MockERC20"===b?E:C;if(!await O(r,j)){alert("Insufficient token balance. Please check your wallet."),g(!1);return}let{decimals:w}=A(r,s),{decimals:h}=A(x,s),p=u.XS(j,w),N=u.XS(k,h),F=await n.swapExactTokensForTokens(p,N,r,x,a);await F.wait(),alert("Swap successful!"),g(!1),v(""),y("");let _={walletAddress:a,fromToken:f,toToken:b,fromAmount:j,toAmount:k,timestamp:new Date().toISOString()},B=(0,c.J)("transactions")||[];(0,c.P)("transactions",[...B,_])}catch(e){console.error("Error during swap:",e),g(!1),alert("Swap failed. Please try again.")}};return(0,s.jsx)("div",{className:"min-h-screen bg-blue-50 flex items-center justify-center",children:(0,s.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-6 w-full max-w-md",children:[(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-gray-600 text-sm font-medium",children:"From"}),(0,s.jsxs)("div",{className:"flex items-center bg-purple-100 rounded-lg p-3 mt-2",children:[(0,s.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,s.jsx)("div",{className:"w-6 h-6 bg-indigo-500 rounded-full"}),(0,s.jsx)("span",{className:"text-gray-800 font-medium",children:f})]}),(0,s.jsx)("input",{type:"number",className:"ml-auto bg-transparent focus:outline-none text-right text-gray-800 w-20",placeholder:"0.00",value:j,onChange:e=>_(e.target.value),disabled:!e})]})]}),(0,s.jsx)("div",{className:"flex justify-center",children:(0,s.jsx)(r.A,{onClick:()=>{p(b),N(f),v(""),y("")},className:"w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center",children:"↕️"})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("label",{className:"block text-gray-600 text-sm font-medium",children:"To (estimated)"}),(0,s.jsxs)("div",{className:"flex items-center bg-purple-100 rounded-lg p-3 mt-2",children:[(0,s.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,s.jsx)("div",{className:"w-6 h-6 bg-orange-500 rounded-full"}),(0,s.jsx)("span",{className:"text-gray-800 font-medium",children:b})]}),(0,s.jsx)("input",{type:"text",className:"ml-auto bg-transparent focus:outline-none text-right text-gray-800 w-20",placeholder:"0.00",value:k,readOnly:!0})]})]})]}),(0,s.jsx)("div",{className:"mt-6",children:e?(0,s.jsx)(r.A,{onClick:B,className:"w-full",disabled:h,children:h?"Loading...":"Swap"}):(0,s.jsx)(r.A,{onClick:t,className:"w-full",children:"Connect Wallet"})}),e&&(0,s.jsxs)("div",{className:"mt-4 text-sm text-gray-600",children:["Connected Wallet:"," ",(0,s.jsx)("span",{className:"font-medium",children:a})]})]})})}}},e=>{var a=a=>e(e.s=a);e.O(0,[733,824,441,517,358],()=>a(4175)),_N_E=e.O()}]);
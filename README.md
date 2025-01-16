# MySwap - Uniswap Clone

This project is a decentralized exchange (DEX) UI that mimics the functionalities of Uniswap, built using [Next.js](https://nextjs.org) and deployed using GitHub Pages. The app allows users to add and remove liquidity from the exchange, simulating a basic token swap interface.

## Getting Started

Follow these steps to get the project running on your local machine:

### 1. Clone the repository:

```bash
git clone https://github.com/lsl52978/mySwap.git
cd mySwap
```

````

### 2. Install dependencies:

Ensure you are using **Node.js version 18.18 or higher**. You can check your Node.js version with the following command:

```bash
node -v
```

If you need to update Node.js, visit [Node.js download](https://nodejs.org/) to install the required version.

After verifying the Node.js version, install the dependencies using one of the following package managers:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables:

This project uses environment variables that are required for it to work correctly. You need to manually create a `.env` file in the root directory of the project with the following content:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_MOCK_ERC20_ADDRESS=0x46caFcED9C1E16F05b474774144f325A16d9B26E
NEXT_PUBLIC_MOCK_USDC_ADDRESS=0x5BAAA2054Bba4A1FEAf52aFb8502B14c61A8Bed9
NEXT_PUBLIC_MOCK_SWAP_ADDRESS=0xE314913f34Ddb810142Acca1Acd3C96603e42468
```

These environment variables are used for interacting with the mock Uniswap smart contracts and API. Replace the `NEXT_PUBLIC_API_URL` with your actual API URL if needed.

> **Note:** The `.env` file is ignored by Git, so it won't be pushed to GitHub for security reasons.

### 4. Run the development server:

Once the dependencies are installed and the environment variables are set up, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This will start the app at [http://localhost:3000](http://localhost:3000) on your browser. The page will auto-update as you modify the code.

### 5. Start editing the app:

To start editing the main page, modify the `app/page.tsx` file. Any changes you make will be reflected in real-time.

## Environment Requirements

- **Node.js**: v18.18 or higher
- **npm**: v8 or higher (bundled with Node.js)

Make sure your development environment is set up accordingly.

## GitHub Pages

You can view the deployed version of the app on GitHub Pages:

[MySwap - GitHub Pages](https://lsl52978.github.io/mySwap/)

## Features

- **Add Liquidity**: Add liquidity to a Uniswap-like decentralized exchange.
- **Remove Liquidity**: Remove liquidity from the exchange.
- **Token Balance Check**: View the balances of the tokens you're interacting with.
- **Transaction History**: View transaction details and statuses.

## Learn More

If you'd like to learn more about Next.js or how this app works, check out these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and APIs.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial for beginners.
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Contribute and explore the official Next.js repository.

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is through [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). It is the platform made by the creators of Next.js, and it provides seamless deployment with automatic optimizations.

For more information on deploying Next.js projects, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Deploy on GitHub Pages

If you're using GitHub Pages to deploy, make sure to configure `basePath` in the `next.config.js` file if you're hosting the project under a sub-path (e.g., `https://username.github.io/repository-name`).

```js
module.exports = {
  basePath: "/mySwap",
};
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

````

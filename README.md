# Crypto-Devs

#### This is a decentralized application (Dapp) that allows users to whitelist and verify their addresses. It is built using Solidity, JavaScript, Hardhat, NEXT.js, and Tailwind CSS. The Dapp is deployed on Vercel.

## Getting Started
#### To use the Dapp, you need to have the Metamask browser extension installed on your browser. You also need to have an Ethereum wallet with some Goerli Ether.

## To run the Dapp locally, follow these steps:

- Clone the repository to your local machine.

- Install the dependencies on each folder by running the following command:
```
npm install
```
- compile the contract
```
npx hardhat compile
```
Deploy the contract to the local network by running the following command:
```
npx hardhat run scripts/deploy.js --network goerli
```
bash
Copy code
npx hardhat run scripts/deploy.js --network localhost

- run local development server
```
npm run dev
```

- Open your browser and navigate to http://localhost:3000.

## Deployment
- The Dapp is deployed on Vercel. 
## License
- This project is licensed under the Apache License - see the LICENSE file for details.

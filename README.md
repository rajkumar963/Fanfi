# Fanfi

> Hackathon project — Fanfi: a fan-engagement and NFT-based tipping platform (frontend in React). Smart contracts assumed to be written in **Move** and deployed to **Aptos** (replacing Solidity/Ethereum).
---
 ![FanFi Banner](https://res.cloudinary.com/dsdcta1sr/image/upload/v1757237283/Screenshot_2025-09-07_145647_btbjjl.png) 
## 🧭 Project Overview

**Fanfi** is a hackathon-ready prototype that connects creators and fans by letting fans tip, stake, and mint limited edition collectibles. This repository contains the frontend (React) and project scaffolding. For this hackathon we use **Move** smart contracts on the **Aptos** blockchain rather than Solidity/Ethereum.

Key ideas:

* Fans can tip creators and receive collectible NFTs in return.
* Creator profiles and feed built in the React frontend.
* Move contracts on Aptos manage minting, balances, and access-control.

## 🎯 Features

* User onboarding (connect wallet — Aptos-compatible wallets like Petra / Martian)
* Browse creators and their collectible drops
* Tip creators using Aptos coins (or testnet tokens)
* Mint limited edition NFTs via Move contracts
* Admin/creator panel to create drops and set supply
* Responsive UI (Create React App-based)

## 🧰 Tech Stack

* Frontend: React (Create React App)
* Styling: CSS (files in `src/`)
* Smart Contracts: **Move** (Aptos) — replace any Solidity references with Move
* Blockchain: **Aptos** (testnet & devnet for hackathon)
* Wallets: Petra / Martian / Aptos Wallet (browser extensions)
* Tooling: `npm` / `yarn`

## 📁 Recommended File Structure

(This repo currently contains a standard CRA frontend. Add the Move contracts and deployment scripts as shown below.)

```
Fanfi/
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ README.md          <- this file
├─ public/
│  ├─ index.html
│  ├─ favicon.ico
│  └─ screenshot.png  <- add screenshot(s) here for README
├─ src/
│  ├─ index.js
│  ├─ App.js
│  ├─ components/
│  │  ├─ Navbar.js
│  │  ├─ CreatorCard.js
│  │  └─ MintModal.js
│  ├─ pages/
│  │  ├─ Home.js
│  │  └─ Creator.js
│  ├─ styles/
│  │  └─ main.css
│  └─ utils/
│     └─ aptos.js      <- helper to interact with Aptos wallet & node
├─ contracts/
│  ├─ Move/            <- place Move modules here (recommended)
│  │  ├─ Fanfi.move
│  │  └─ Fanfi_nft.move
│  └─ scripts/
│     ├─ deploy.sh     <- sample deployment script for aptos CLI
│     └─ mint.js       <- script to mint using Aptos SDK
└─ docs/
   └─ architecture.md
```

> If your repo currently lacks a `contracts/` folder, add it and place Move modules there. The frontend should call a deployment/minting script or a backend API that interacts with Aptos.

## ⚙️ Local Setup (Frontend)

1. Clone the repo

```bash
git clone https://github.com/rajkumar963/Fanfi.git
cd Fanfi
```

2. Install dependencies

```bash
npm install
# or
# yarn install
```

3. Start the dev server

```bash
npm start
# open http://localhost:3000
```

## 🔗 Integrating with Aptos (high-level)

> This section assumes you will write Move modules and deploy on Aptos testnet/devnet. Replace any existing Solidity/Ethereum-specific code with Move and Aptos SDK equivalents.

1. Install Aptos CLI and the Aptos SDK (see Aptos docs for the latest instructions).
2. Create or use an Aptos account (testnet) and fund it with test tokens.
3. Compile and publish Move modules:

```bash
# Example (pseudocode) - adapt to your toolchain
aptos move compile --package-dir contracts/Move
aptos move publish --package-dir contracts/Move --profile testnet
```

4. From frontend, use Aptos wallet adapters or the Aptos JavaScript SDK to sign transactions and call published Move modules (mint, tip, transfer).

## 📸 Screenshots / Demo

Include screenshots or a short GIF in `public/`. Add them to this README like:


![Fanfi Home]([https://res.cloudinary.com/dsdcta1sr/image/upload/v1757237283/Screenshot_2025-09-07_145647_btbjjl.png])

**Tip:** For hackathon judging, include a short video/GIF (e.g. `public/demo.gif`) showing: connect wallet -> tip -> mint -> view NFT.

## 🧩 How to replace Solidity/Ethereum references with Move/Aptos

* Any `contracts/` directory that contains `.sol` files should be converted into `contracts/Move/` with `.move` files.
* Replace web3/ethers calls with Aptos SDK calls. For example:

  * `ethers.js` wallet connection -> use `Aptos` wallet adapters (Petra/Martian/Aptos Wallet)
  * `contract.methods.myMethod()` -> construct Aptos transaction payloads calling the published Move module
* Update README, environment variables, and CI scripts mentioning Ethereum to refer to Aptos.

## ✅ Example: Frontend -> Aptos mint flow (conceptual)

1. User clicks "Mint" in the UI.
2. Frontend prepares the transaction payload (module name, function, arguments, gas).
3. User confirms the transaction in their Aptos wallet extension.
4. Transaction gets submitted to Aptos node; on success, frontend shows minted NFT metadata.

## 🧪 Testnet / Demo Tips for Hackathon

* Use Aptos testnet for demo to avoid mainnet costs.
* Provide pre-funded test accounts and seed phrase in a `docs/demo_accounts.md` (ONLY for hackathon demo, **do not** commit real private keys).
* Add a script `contracts/scripts/fund_demo_accounts.sh` to automate funding from a faucet.

## 🛠️ Recommended Scripts (examples)

* `contracts/scripts/compile_move.sh` — compile Move modules
* `contracts/scripts/publish_move.sh` — publish to Aptos testnet
* `contracts/scripts/mint_demo.sh` — mint demo NFTs (used by frontend or CLI)

## 🤝 Contribution

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-change`
3. Commit & push
4. Open a PR describing your change

## 📜 License

Add a license file (`LICENSE`) to declare how others can use your code. MIT is common for hackathon projects.

## 📬 Contact

Project owner: `rajkumar963` (GitHub profile)

---

*This README was generated/templated for a hackathon. Replace placeholders (scripts, Move modules, screenshots) with real files before final submission.*

<!-- Repository reference: GitHub repo -->

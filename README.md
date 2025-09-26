# Meteora Merkle Distributor SDK

A Typescript SDK for interacting with the Merkle Distributor Program on Meteora.

## Overview

This SDK provides a set of tools and methods to interact with the Meteora Merkle Distributor Program. It enables developers to distribute tokens to their users.

## Installation

```bash
npm install @meteora-ag/merkle-distributor-sdk
# or
pnpm install @meteora-ag/merkle-distributor-sdk
# or
yarn add @meteora-ag/merkle-distributor-sdk
```

## Initialization

```typescript
import { Connection } from "@solana/web3.js";
import { MerkleDistributorClient } from "@meteora-ag/merkle-distributor-sdk";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const tokenMint = new PublicKey("YOUR_TOKEN_MINT");
const claimProofEndpoint = "YOUR_CLAIM_PROOF_ENDPOINT";
const client = new MerkleDistributorClient(
  tokenMint,
  claimProofEndpoint,
  connection,
  "confirmed"
);
```

## Usage

Refer to the [docs](./docs.md) for how to use the functions.

## Test

```bash
pnpm install
pnpm test
```

## Program Address

- Mainnet-beta: `DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j`
- Devnet: `DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j`

# Merkle Distributor SDK: Function Documentation

## Table of Contents

- [Main Functions](#main-functions)

  - [claimToken](#claimToken)

- [State Functions](#state-functions)

  - [getDistributor](#getDistributor)
  - [getClaimStatus](#getClaimStatus)
  - [getUser](#getUser)

---

## Main Functions

### claimToken

Claim tokens from the merkle tree

**Function**

```typescript
async claimToken(params: ClaimTokenParam): Promise<Transaction>;
```

**Parameters**

```typescript
interface ClaimTokenParam {
  claimant: PublicKey; // The claimant's public key
  distributorAccountData?: Distributor; // The distributor account data
}
```

**Returns**

- A transaction that can be signed and sent to the network with the claimant to sign the transaction.

**Example**

```typescript
const transaction = await client.claimToken({
  claimant: new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz"),
});

const { newClaimTx } = transaction;

const signature = await sendAndConfirmTransaction(connection, newClaimTx, [
  claimant,
]);
```

**Notes**

- When signing the transaction, the claimant must sign the transaction.
- The `distributorAccountData` is optional and will be fetched within the `claimToken` function if not provided.

---

## State Functions

### getDistributor

Get the distributor from the merkle tree

**Function**

```typescript
async getDistributor(merkleTree: PublicKey): Promise<Distributor>
```

**Parameters**

```typescript
{
  merkleTree: PublicKey; // The merkle tree's public key
}
```

**Returns**

- The distributor from the merkle tree

**Example**

```typescript
const user = await client.getUser(userAddress);
if (!user) {
  throw new Error("User not found");
}

const distributor = await client.getDistributor(
  new PublicKey(user.merkle_tree)
);
```

---

### getClaimStatus

Get the claim status from the claim proof endpoint

**Function**

```typescript
async getClaimStatus(claimant: PublicKey): Promise<ClaimStatus>
```

**Parameters**

```typescript
{
  claimant: PublicKey; // The claimant's public key
}
```

**Returns**

- The claim status from the claim proof endpoint

**Example**

```typescript
const claimStatus = await client.getClaimStatus(
  new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz")
);
```

---

### getUser

Get the user's information from the claim proof endpoint

**Function**

```typescript
async getUser(claimant: PublicKey): Promise<UserResponse>
```

**Returns**

- The user's information from the claim proof endpoint

**Example**

```typescript
const user = await client.getUser(
  new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz")
);
```

---

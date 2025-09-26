import { IdlTypes, Program } from "@coral-xyz/anchor";
import { MerkleDistributor } from "./idl/idl";
import { PublicKey } from "@solana/web3.js";

export type MerkleDistributorProgram = Program<MerkleDistributor>;

export type Distributor = IdlTypes<MerkleDistributor>["merkleDistributor"];

export interface UserResponse {
  merkle_tree: string;
  amount: number;
  proof: number[][];
}

export type ClaimTokenParam = {
  claimant: PublicKey;
  distributorAccountData?: Distributor;
};

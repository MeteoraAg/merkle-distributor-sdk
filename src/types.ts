import { IdlTypes, Program } from "@coral-xyz/anchor";
import { MerkleDistributor } from "./idl/idl";

export type MerkleDistributorProgram = Program<MerkleDistributor>;

export type Distributor = IdlTypes<MerkleDistributor>["merkleDistributor"];

export interface UserResponse {
  merkle_tree: string;
  amount: number;
  proof: number[][];
}

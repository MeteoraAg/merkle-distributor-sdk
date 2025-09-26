import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";

import { MerkleDistributor } from "../idl/idl";
import MerkleDistributorIDL from "../idl/idl.json";
import { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { MerkleDistributorProgram } from "../types";

export function createMerkleDistributorProgram(
  connection: Connection,
  commitment: Commitment = "confirmed"
): MerkleDistributorProgram {
  const provider = new AnchorProvider(connection, null as unknown as Wallet, {
    commitment,
  });
  const program = new Program<MerkleDistributor>(
    MerkleDistributorIDL,
    provider
  );

  return program;
}

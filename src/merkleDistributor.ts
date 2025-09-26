import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Commitment,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";

import {
  ClaimTokenParam,
  Distributor,
  MerkleDistributorProgram,
  UserResponse,
} from "./types";
import {
  createMerkleDistributorProgram,
  deriveClaimStatusAddress,
  getOrCreateATAInstruction,
} from "./helpers";

export class MerkleDistributorClient {
  program: MerkleDistributorProgram;
  private mint: PublicKey;
  private claimProofEndpoint: string;
  private connection: Connection;
  private commitment: Commitment;

  constructor(
    mint: PublicKey,
    claimProofEndpoint: string,
    connection: Connection,
    commitment: Commitment
  ) {
    this.program = createMerkleDistributorProgram(connection, commitment);
    this.mint = mint;
    this.claimProofEndpoint = claimProofEndpoint;
    this.connection = connection;
    this.commitment = commitment;
  }

  /**
   * Get the user
   * @param claimant The claimant's public key
   * @returns The user
   */
  async getUser(claimant: PublicKey): Promise<UserResponse | null> {
    try {
      const res = await fetch(
        `${
          this.claimProofEndpoint
        }/${this.mint.toBase58()}/${claimant.toBase58()}`
      );

      if (!res.ok) {
        return null;
      }
      const user = await res.json();
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get the claim status
   * @param claimant The claimant's public key
   * @returns The claim status
   */
  async getClaimStatus(
    claimant: PublicKey
  ): Promise<{ amount: BN; isClaimed: boolean } | null> {
    if (!claimant) {
      return null;
    }

    const user = await this.getUser(claimant);

    if (!user || !user.merkle_tree) {
      return null;
    }

    const claimStatusAddress = deriveClaimStatusAddress(
      claimant,
      new PublicKey(user.merkle_tree)
    );

    const status = await this.program.account.claimStatus.fetchNullable(
      claimStatusAddress
    );

    return {
      amount: new BN(user.amount),
      isClaimed: Boolean(status),
    };
  }

  /**
   * Get the distributor account data
   * @param merkleTree The merkle tree public key
   * @returns The distributor account data
   */
  async getDistributor(merkleTree: PublicKey): Promise<Distributor | null> {
    const distributor =
      await this.program.account.merkleDistributor.fetchNullable(merkleTree);

    return distributor;
  }

  /**
   * Claim tokens
   * @param claimant The claimant's public key
   * @returns The transaction
   */
  async claimToken(params: ClaimTokenParam): Promise<Transaction> {
    const { claimant } = params;
    if (!claimant) {
      throw new Error("Claimant is required");
    }

    const user = await this.getUser(claimant);
    if (!user) {
      throw new Error("User not found");
    }

    const { proof, merkle_tree } = user;

    const distributorAddress = new PublicKey(merkle_tree);
    let distributorAccountData =
      params.distributorAccountData ??
      (await this.getDistributor(distributorAddress));
    if (!distributorAccountData) {
      throw new Error("Distributor not found");
    }

    const mint = new PublicKey(distributorAccountData.mint);

    const claimStatusAddress = deriveClaimStatusAddress(
      claimant,
      distributorAddress
    );

    const tokenProgram = TOKEN_PROGRAM_ID;

    const preInstructions: TransactionInstruction[] = [];

    const { ataPubkey: toATA, ix: toATAIx } = await getOrCreateATAInstruction(
      this.connection,
      mint,
      claimant,
      claimant,
      true,
      tokenProgram
    );
    toATAIx && preInstructions.push(toATAIx);

    const { ataPubkey: mdATA, ix: mdATAIx } = await getOrCreateATAInstruction(
      this.connection,
      mint,
      distributorAddress,
      claimant,
      true,
      tokenProgram
    );
    mdATAIx && preInstructions.push(mdATAIx);

    return await this.program.methods
      .newClaim(new BN(user.amount), new BN(0), proof)
      .accountsPartial({
        claimant,
        claimStatus: claimStatusAddress,
        distributor: distributorAddress,
        from: mdATA,
        to: toATA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .preInstructions(preInstructions)
      .transaction();
  }
}

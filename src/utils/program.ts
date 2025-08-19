import * as anchor from '@coral-xyz/anchor';
import { Program, web3 } from '@coral-xyz/anchor';

import { IDL as MerkleDistributorIDL, MerkleDistributor } from '../types/merkle_distributor';

export function createMerkleDistributorProgram(provider: anchor.Provider, programId: web3.PublicKey) {
  const program = new Program<MerkleDistributor>(MerkleDistributorIDL, programId, provider);

  return program;
}

export const MERKLE_DISTRIBUTOR_PROGRAM_ID = new web3.PublicKey('DiSLRwcSFvtwvMWSs7ubBMvYRaYNYupa76ZSuYLe6D7j');

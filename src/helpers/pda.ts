import { PublicKey } from '@solana/web3.js';
import { MERKLE_DISTRIBUTOR_PROGRAM_ID } from './program';

export function deriveClaimStatusAddress(claimant: PublicKey, merkleTree: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('ClaimStatus'), claimant.toBuffer(), merkleTree.toBuffer()],
    MERKLE_DISTRIBUTOR_PROGRAM_ID,
  )[0];
}

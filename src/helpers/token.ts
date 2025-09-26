import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
} from '@solana/spl-token';

export const getOrCreateATAInstruction = async (
  connection: Connection,
  tokenMint: PublicKey,
  owner: PublicKey,
  payer: PublicKey,
  allowOwnerOffCurve = true,
  tokenProgram: PublicKey,
): Promise<{ ataPubkey: PublicKey; ix?: TransactionInstruction }> => {
  const toAccount = getAssociatedTokenAddressSync(tokenMint, owner, allowOwnerOffCurve, tokenProgram);

  try {
    await getAccount(connection, toAccount);
    return { ataPubkey: toAccount, ix: undefined };
  } catch (e) {
    if (e instanceof TokenAccountNotFoundError || e instanceof TokenInvalidAccountOwnerError) {
      const ix = createAssociatedTokenAccountIdempotentInstruction(payer, toAccount, owner, tokenMint, tokenProgram);

      return { ataPubkey: toAccount, ix };
    } else {
      /* handle error */
      console.error('Error::getOrCreateATAInstruction', e);
      throw e;
    }
  }
};

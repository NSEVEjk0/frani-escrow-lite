// Frani Invoice — configuration.
// Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2 only.

import process from 'node:process';

export const NETWORK = process.env.ESCROW_NETWORK || 'testnet2';

export const config = {
  network: NETWORK,
  dataDir: process.env.ESCROW_DATA_DIR || './wallet-data',
  walletApiBaseUrl:
    process.env.ESCROW_WALLET_API || 'https://wallet-api.unicity.network',
  // Public testnet2 oracle key — not a secret.
  oracleApiKey:
    process.env.ESCROW_ORACLE_KEY || 'sk_ddc3cfcc001e4a28ac3fad7407f99590',
  deviceId: process.env.ESCROW_DEVICE_ID || 'frani-escrow-lite-1',
  nametag: process.env.ESCROW_NAMETAG || '',
  // Where invoices are stored as JSON.
  dataDir: process.env.ESCROW_DIR || './escrows',
  // UCT uses 18 decimals on Unicity testnet2.
  decimals: Number(process.env.ESCROW_DECIMALS || '18'),
};

export function assertTestnet2() {
  if (config.network !== 'testnet2' && !process.env.ESCROW_ALLOW_NONTESTNET2) {
    throw new Error(
      `Frani Invoice is testnet2-only. Refusing to start on '${config.network}'. ` +
        `Set ESCROW_ALLOW_NONTESTNET2=1 only if you truly mean it.`,
    );
  }
}

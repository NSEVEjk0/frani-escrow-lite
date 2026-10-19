#!/usr/bin/env node
// Frani Escrow Lite — CLI + daemon entrypoint.
// Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2 only.

import process from 'node:process';
import { config } from '../src/config.js';
import { Store } from '../src/store.js';
import { createEscrow, ship, confirm, refund, renderEscrow } from '../src/escrow.js';

export const HELP = `Frani Escrow Lite — two-party goods escrow on Unicity testnet2

Usage:
  frani-escrow-lite new --buyer <address> --seller <address> --amount <UCT> [--token UCT]
  frani-escrow-lite ship <escrowId> --by <seller>
  frani-escrow-lite confirm <escrowId> --by <buyer>
  frani-escrow-lite refund <escrowId> --by <buyer|seller>
  frani-escrow-lite status <escrowId>
  frani-escrow-lite list
  frani-escrow-lite about
  frani-escrow-lite help
`;

export const aboutText = `Frani Escrow Lite — deposit, ship, confirm, release — with a refund path.
Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2.
`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) out[a.slice(2, eq)] = a.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[a.slice(2)] = argv[++i];
      else out[a.slice(2)] = true;
    } else out._.push(a);
  }
  return out;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const store = new Store(config.dataDir);

  switch (cmd) {
    case 'new': {
      const escrow = createEscrow({
        buyer: args.buyer,
        seller: args.seller,
        amount: args.amount,
        token: args.token || 'UCT',
      });
      await store.save(escrow);
      console.log(`Created ${renderEscrow(escrow)}`);
      console.log(`Escrow id: ${escrow.id}`);
      break;
    }
    case 'ship': {
      const escrow = await store.get(rest[0]);
      ship(escrow, args.by);
      await store.save(escrow);
      console.log(`Shipped — ${renderEscrow(escrow)}`);
      break;
    }
    case 'confirm': {
      const escrow = await store.get(rest[0]);
      confirm(escrow, args.by);
      await store.save(escrow);
      console.log(`Released — ${renderEscrow(escrow)}`);
      break;
    }
    case 'refund': {
      const escrow = await store.get(rest[0]);
      refund(escrow, args.by);
      await store.save(escrow);
      console.log(`Refunded — ${renderEscrow(escrow)}`);
      break;
    }
    case 'status': {
      const escrow = await store.get(rest[0]);
      console.log(renderEscrow(escrow));
      break;
    }
    case 'list': {
      const escrows = await store.list();
      if (escrows.length === 0) console.log('No escrows yet.');
      for (const e of escrows) console.log(renderEscrow(e));
      break;
    }
    case 'about':
      console.log(aboutText);
      break;
    case 'help':
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

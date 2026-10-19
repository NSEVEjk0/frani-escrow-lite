# Frani Escrow Lite

Two-party goods escrow on Unicity testnet2. Buyer deposits, seller ships,
buyer confirms, funds release. A refund path exists before release. No
custodial pool — the escrow is a state machine over signed actions.

Made by **CRYPTFRANI**. Owner / creator: **Itachi**.

---

## Track

Payments and markets.

## Is it Agentic?

No. Frani Escrow Lite advances a fixed state machine. No autonomous behaviour,
no model in the loop.

## Runs on AstridOS?

No.

## Live on-network

- Network: **testnet2**
- Each deployment holds its own wallet and prints its address at startup.

## SDK features used

| Feature | Where |
|---|---|
| Wallet identity | `src/wallet.js` (Sphere SDK) |
| Payment requests (concept) | deposit/release map to invoice flows |

## Commands

```bash
npm run new -- --buyer 0x… --seller 0x… --amount 50
npm run ship -- <escrowId> --by 0xSeller
npm run confirm -- <escrowId> --by 0xBuyer
npm run refund -- <escrowId> --by 0xBuyer
```

// Frani Escrow Lite — two-party goods escrow domain logic.
// States: deposited → shipped → released (buyer confirms) or refunded.
// Only the right party can advance each state; release is final.

export function newId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export const STATES = ['deposited', 'shipped', 'released', 'refunded'];

export function createEscrow({ buyer, seller, amount, token = 'UCT' }) {
  if (!buyer) throw new Error('an escrow needs a buyer');
  if (!seller) throw new Error('an escrow needs a seller');
  const base = Number(amount);
  if (!Number.isFinite(base) || base <= 0) throw new Error('amount must be positive');
  return {
    id: newId('esc'),
    buyer,
    seller,
    amount: String(base),
    token,
    state: 'deposited',
    createdAt: new Date().toISOString(),
  };
}

export function ship(escrow, by) {
  if (!escrow) throw new Error('escrow not found');
  if (escrow.state !== 'deposited') throw new Error(`cannot ship from state ${escrow.state}`);
  if (by !== escrow.seller) throw new Error('only the seller can ship');
  escrow.state = 'shipped';
  escrow.shippedAt = new Date().toISOString();
  return escrow;
}

export function confirm(escrow, by) {
  if (!escrow) throw new Error('escrow not found');
  if (escrow.state !== 'shipped') throw new Error(`cannot confirm from state ${escrow.state}`);
  if (by !== escrow.buyer) throw new Error('only the buyer can confirm');
  escrow.state = 'released';
  escrow.releasedAt = new Date().toISOString();
  return escrow;
}

export function refund(escrow, by) {
  if (!escrow) throw new Error('escrow not found');
  if (escrow.state === 'released') throw new Error('cannot refund a released escrow');
  if (by !== escrow.buyer && by !== escrow.seller) throw new Error('only buyer or seller can refund');
  escrow.state = 'refunded';
  escrow.refundedAt = new Date().toISOString();
  return escrow;
}

export function renderEscrow(escrow) {
  return `${escrow.id} · ${escrow.buyer} ⇄ ${escrow.seller} · ${escrow.amount} ${escrow.token} · ${escrow.state}`;
}

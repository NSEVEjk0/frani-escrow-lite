// Frani Escrow Lite — unit tests (plain node).
import assert from 'node:assert/strict';
import { createEscrow, ship, confirm, refund } from '../src/escrow.js';

const BUYER = '0xBuyer';
const SELLER = '0xSeller';
const OTHER = '0xOther';

const escrow = createEscrow({ buyer: BUYER, seller: SELLER, amount: '50' });

assert.equal(escrow.state, 'deposited');

// only seller can ship
assert.throws(() => ship(escrow, BUYER), /only the seller/);
ship(escrow, SELLER);
assert.equal(escrow.state, 'shipped');

// only buyer can confirm
assert.throws(() => confirm(escrow, SELLER), /only the buyer/);
confirm(escrow, BUYER);
assert.equal(escrow.state, 'released');

// released is final
assert.throws(() => refund(escrow, BUYER), /cannot refund a released/);

// refund path works from deposited
const esc2 = createEscrow({ buyer: BUYER, seller: SELLER, amount: '10' });
refund(esc2, BUYER);
assert.equal(esc2.state, 'refunded');

// refund allowed from shipped by either party
const esc3 = createEscrow({ buyer: BUYER, seller: SELLER, amount: '10' });
ship(esc3, SELLER);
refund(esc3, SELLER);
assert.equal(esc3.state, 'refunded');

console.log('escrow.test.js — all passed');

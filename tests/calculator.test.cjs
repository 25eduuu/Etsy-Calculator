const test = require('node:test');
const assert = require('node:assert/strict');
const calculateOrder = require('../calculator.js');

const base = {
  price:32, shipping:4.9, gift:0, discount:0, cogs:8, postage:5.2, other:1,
  listing:0.18, transaction:6.5, processing:4, fixed:0.3, regulatory:0.8,
  feeVat:22, offsite:0, vatOnFees:true
};

test('base scenario includes fee VAT and yields expected contribution', () => {
  const r = calculateOrder(base);
  assert.equal(r.gross, 36.9);
  assert.ok(Math.abs(r.net - 17.027366) < 1e-9);
  assert.ok(Math.abs(r.margin - 46.1446233062) < 1e-8);
});

test('break-even price covers variable fees and fixed costs', () => {
  const r = calculateOrder(base);
  const atBreakEven = calculateOrder({...base, price:r.breakEven});
  assert.ok(Math.abs(atBreakEven.net) < 1e-9);
});

test('discount and offsite attribution both reduce contribution', () => {
  const normal = calculateOrder(base);
  const reduced = calculateOrder({...base,discount:20,offsite:15});
  assert.ok(reduced.net < normal.net);
  assert.ok(reduced.breakEven > normal.breakEven);
  assert.ok(Math.abs(calculateOrder({...base,price:reduced.breakEven,discount:20,offsite:15}).net) < 1e-9);
});

test('empty order has finite results', () => {
  const r = calculateOrder({...base,price:0,shipping:0,gift:0,cogs:0,postage:0,other:0,listing:0,fixed:0});
  assert.equal(r.net,0);
  assert.equal(r.margin,0);
  assert.equal(r.breakEven,0);
});

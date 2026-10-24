import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateRange, estimate, validate, type BookingInput } from '../../src/lib/booking.ts';

const today = new Date(2026, 9, 24);
const ok: BookingInput = { service: 'gel', extras: [], date: '2026-10-25', slot: 'day', name: 'Катя', phone: '8 912 345 67 89', consent: true };

test('a complete booking has no errors', () => {
  assert.deepEqual(validate(ok, today), {});
});

test('every required field reports its own error', () => {
  const e = validate({ service: '', extras: [], date: '', slot: '', name: ' ', phone: '', consent: false }, today);
  assert.deepEqual(Object.keys(e).sort(), ['consent', 'date', 'name', 'phone', 'service', 'slot']);
});

test('dates outside today … +60 days are rejected', () => {
  assert.equal(dateRange(today).min, '2026-10-24');
  assert.equal(dateRange(today).max, '2026-12-23');
  assert.ok(validate({ ...ok, date: '2026-10-23' }, today).date);
  assert.ok(validate({ ...ok, date: '2026-12-24' }, today).date);
  assert.equal(validate({ ...ok, date: '2026-10-24' }, today).date, undefined);
});

test('phone must be a Russian number', () => {
  assert.ok(validate({ ...ok, phone: '12345' }, today).phone);
  assert.equal(validate({ ...ok, phone: '+7 (912) 345-67-89' }, today).phone, undefined);
});

test('estimate adds extras, and «not sure» has no price', () => {
  assert.deepEqual(estimate('gel', ['design', 'foreign']), { price: 2900 + 500 + 300, minutes: 105 + 20 + 15 });
  assert.deepEqual(estimate('unsure', ['design']), { price: null, minutes: null });
});

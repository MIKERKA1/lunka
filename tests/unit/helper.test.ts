import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recommend } from '../../src/data/helper.ts';
import { minutes, rub } from '../../src/data/services.ts';

test('waits until the needed questions are answered', () => {
  assert.equal(recommend(null, null, null), null);
  assert.equal(recommend('color', null, null), null);
  assert.equal(recommend('feet', 'healthy', null), null);
});

test('plain colour on healthy nails is the gel manicure, nothing added', () => {
  const r = recommend('color', 'healthy', null)!;
  assert.equal(r.service.id, 'gel');
  assert.deepEqual(r.addons, []);
  assert.equal(r.total, r.service.price);
});

test('weak nails get strengthening instead of plain gel', () => {
  assert.equal(recommend('color', 'weak', null)!.service.id, 'strength');
  const clean = recommend('clean', 'weak', null)!;
  assert.equal(clean.service.id, 'manicure');
  assert.equal(clean.total, clean.service.price + 500);
});

test('another salon’s coating adds removal price and time', () => {
  const r = recommend('art', 'covered', null)!;
  assert.equal(r.service.id, 'gel');
  assert.equal(r.total, r.service.price + 500 + 300);
  assert.equal(r.duration, r.service.duration + 20 + 15);
});

test('feet ignore the nails answer', () => {
  assert.equal(recommend('feet', 'covered', 'color')!.service.id, 'pedicure-gel');
  assert.equal(recommend('feet', null, 'none')!.service.id, 'pedicure');
});

test('formats money and time with non-breaking spaces', () => {
  assert.equal(rub(2900), '2 900 ₽');
  assert.equal(minutes(105), '1 ч 45 мин');
  assert.equal(minutes(50), '50 мин');
  assert.equal(minutes(120), '2 ч');
});

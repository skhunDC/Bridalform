const test = require('node:test');
const assert = require('node:assert/strict');
const { findBestDesignerMatch, normalizePayload, FIELD_MAP } = require('./utils');

test('designer alias map resolves canonical name', () => {
  const m = findBestDesignerMatch('justin alexandar');
  assert.equal(m.canonical, 'Justin Alexander');
  assert.equal(m.score, 1);
});

test('unknown designer falls back to typed input when low confidence', () => {
  const m = findBestDesignerMatch('Completely Unknown Label');
  assert.equal(m.canonical, 'Completely Unknown Label');
});

test('normalize payload keeps required structures', () => {
  const p = normalizePayload({ customerName: '  Ana ', serviceRequested: [' Clean Only '], consentAccepted: 1, designerInput: 'pronovia' });
  assert.equal(p.customerName, 'Ana');
  assert.deepEqual(p.serviceRequested, ['Clean Only']);
  assert.equal(p.consentAccepted, true);
  assert.equal(p.designerCanonical, 'Pronovias');
});

test('field map preserves one-to-one schema uniqueness', () => {
  assert.equal(FIELD_MAP.length, 40);
  assert.equal(new Set(FIELD_MAP).size, FIELD_MAP.length);
});

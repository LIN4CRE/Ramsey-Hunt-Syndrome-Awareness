import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateVerificationHash,
  simulateIncomingPayPalDonation,
  performAutomatedAudit,
} from './automation';
import { INITIAL_CAMPAIGNS, INITIAL_EXPENSES } from './transparency';

test('generates consistent deterministic audit verification hashes', () => {
  const hash1 = generateVerificationHash('test-data-123');
  const hash2 = generateVerificationHash('test-data-123');
  assert.equal(hash1, hash2);
  assert.ok(hash1.startsWith('AUDIT-'));
});

test('simulates incoming PayPal donation with valid properties', () => {
  const donation = simulateIncomingPayPalDonation(INITIAL_CAMPAIGNS, 50);
  assert.equal(donation.amountGBP, 50);
  assert.ok(donation.paypalTransactionId?.startsWith('PP-'));
  assert.ok(donation.id.startsWith('don-auto-'));
  assert.equal(donation.verified, true);
  assert.ok(donation.donorName.length > 0);
});

test('performs automated audit and scores 100 on reconciled expenses', () => {
  const audit = performAutomatedAudit(INITIAL_EXPENSES, 2000, 930);
  assert.equal(audit.overallScore, 100);
  assert.equal(audit.status, 'EXCELLENT');
  assert.equal(audit.charityCommissionReady, true);
  assert.equal(audit.checks.length, 4);
  assert.ok(audit.auditHash.startsWith('AUDIT-'));
});

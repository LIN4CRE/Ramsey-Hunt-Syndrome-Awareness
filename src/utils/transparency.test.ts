import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotalInflows,
  calculateTotalOutflows,
  calculateReserveBalance,
  calculateReconciliationRate,
  computeTransparencySummary,
  generateLedgerCSV,
  formatGBP,
  computeCampaignProgress,
  computeDonorStats,
  INITIAL_DONATIONS,
  INITIAL_EXPENSES,
  INITIAL_CAMPAIGNS,
  INITIAL_RECURRING_DONATIONS,
} from './transparency';
import { DonationRecord, ExpenseRecord } from '../types';

test('calculates total inflows accurately from donations', () => {
  const donations: DonationRecord[] = [
    { id: '1', donorName: 'Alice', isAnonymous: false, amountGBP: 100, date: '2026-10-01', verified: true },
    { id: '2', donorName: 'Bob', isAnonymous: false, amountGBP: 50.5, date: '2026-10-02', verified: true },
  ];
  assert.equal(calculateTotalInflows(donations), 150.5);
});

test('calculates total outflows accurately from expenses', () => {
  const expenses: ExpenseRecord[] = [
    {
      id: 'e1',
      title: 'Leaflets',
      description: 'Print run',
      category: 'awareness_leaflets',
      amountGBP: 200,
      date: '2026-10-01',
      vendor: 'Print Co',
      receiptNumber: 'REC-1',
      receiptItems: [{ item: 'Paper', costGBP: 200 }],
      status: 'disbursed',
      approvedBy: 'Trustee',
    },
    {
      id: 'e2',
      title: 'Hosting',
      description: 'Web hosting',
      category: 'digital_infrastructure',
      amountGBP: 75.25,
      date: '2026-10-02',
      vendor: 'Host Co',
      receiptNumber: 'REC-2',
      receiptItems: [{ item: 'Cloud', costGBP: 75.25 }],
      status: 'disbursed',
      approvedBy: 'Trustee',
    },
  ];
  assert.equal(calculateTotalOutflows(expenses), 275.25);
});

test('calculates reserve balance and prevents negative balances', () => {
  assert.equal(calculateReserveBalance(1000, 400), 600);
  assert.equal(calculateReserveBalance(300, 500), 0); // No negative reserves
});

test('calculates 100% receipt reconciliation rate when all expenses have receipt numbers', () => {
  const rate = calculateReconciliationRate(INITIAL_EXPENSES);
  assert.equal(rate, 100);
});

test('computes full transparency summary with Charity Commission threshold', () => {
  const summary = computeTransparencySummary(INITIAL_DONATIONS, INITIAL_EXPENSES, 2000, 5000);
  assert.ok(summary.totalInflowsGBP > 0);
  assert.ok(summary.totalOutflowsGBP > 0);
  assert.equal(summary.reserveBalanceGBP, summary.totalInflowsGBP - summary.totalOutflowsGBP);
  assert.equal(summary.charityCommissionThresholdGBP, 5000);
  assert.equal(summary.distanceToRegistrationThresholdGBP, 5000 - summary.totalInflowsGBP);
  assert.equal(summary.adminWastePercentage, 0);
});

test('computes campaign progress dynamically against goal target', () => {
  const campaign = INITIAL_CAMPAIGNS[0]; // Clinic & GP Awareness Leaflets (£600 target)
  const progress = computeCampaignProgress(campaign, INITIAL_DONATIONS);
  assert.ok(progress.raisedGBP > 0);
  assert.ok(progress.percent >= 0 && progress.percent <= 100);
  assert.equal(progress.remainingGBP, Math.max(0, campaign.targetGBP - progress.raisedGBP));
  assert.ok(progress.donorCount > 0);
});

test('computes donor statistics and recurring donation aggregation', () => {
  const stats = computeDonorStats('katherine.bell@nhs.net', INITIAL_DONATIONS, INITIAL_RECURRING_DONATIONS);
  assert.equal(stats.donationCount, 1);
  assert.equal(stats.totalDonatedGBP, 150);
  assert.equal(stats.activeRecurring.length, 1);
  assert.equal(stats.monthlyRecurringGBP, 15);
});

test('generates compliant CSV ledger containing both inflows and outflows', () => {
  const csv = generateLedgerCSV(INITIAL_DONATIONS, INITIAL_EXPENSES);
  assert.ok(csv.startsWith('Type,ID,Date,Party/Vendor'));
  assert.ok(csv.includes('Inflow'));
  assert.ok(csv.includes('Outflow'));
});

test('formats GBP currency with pound symbol and proper separators', () => {
  const formatted = formatGBP(1250);
  assert.ok(formatted.includes('1,250') || formatted.includes('1250'));
  assert.ok(formatted.includes('£'));
});

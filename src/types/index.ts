export type TransactionType = 'inflow' | 'outflow';

export type ExpenseCategory =
  | 'patient_guides'
  | 'audiology_signposts'
  | 'awareness_leaflets'
  | 'digital_infrastructure'
  | 'volunteer_coordination'
  | 'governance_contingency';

export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail?: string;
  isAnonymous: boolean;
  amountGBP: number;
  date: string;
  paypalTransactionId?: string;
  donorMessage?: string;
  allocatedCategory?: ExpenseCategory;
  campaignId?: string;
  verified: boolean;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  description: string;
  category: ExpenseCategory;
  amountGBP: number;
  date: string;
  vendor: string;
  receiptNumber: string;
  receiptUrl?: string;
  receiptItems: Array<{ item: string; costGBP: number }>;
  status: 'approved' | 'disbursed' | 'planned';
  approvedBy: string;
  notes?: string;
  campaignId?: string;
}

export interface MilestoneItem {
  id: string;
  name: string;
  category: ExpenseCategory;
  budgetGBP: number;
  spentGBP: number;
  description: string;
  impactMetric: string;
  status: 'active' | 'completed' | 'queued';
  colorHex: string;
}

export interface CampaignGoal {
  id: string;
  title: string;
  slug: string;
  targetGBP: number;
  currentGBP: number;
  category: ExpenseCategory;
  deadline: string;
  description: string;
  status: 'active' | 'funded' | 'upcoming';
  linkedMilestoneId?: string;
  colorHex: string;
  donorCount: number;
  beneficiaryGroup: string;
}

export interface ImpactReport {
  id: string;
  title: string;
  date: string;
  author: string;
  campaignId: string;
  campaignTitle: string;
  story: string;
  photos: Array<{ url: string; caption: string }>;
  metricsAchieved: Array<{ label: string; value: string }>;
  fundsSpentGBP: number;
  linkedReceipts: string[];
  verified: boolean;
}

export interface RecurringDonation {
  id: string;
  donorEmail: string;
  donorName: string;
  amountGBP: number;
  frequency: 'monthly' | 'quarterly' | 'annual';
  startDate: string;
  nextBillingDate: string;
  status: 'active' | 'paused' | 'cancelled';
  campaignId: string;
  campaignTitle: string;
  paypalSubscriptionId: string;
}

export interface DonorProfile {
  id: string;
  email: string;
  name: string;
  isAnonymous: boolean;
  joinedDate: string;
  badge: string;
  bio?: string;
}

export interface TransparencySummary {
  totalInflowsGBP: number;
  totalOutflowsGBP: number;
  reserveBalanceGBP: number;
  fundraisingGoalGBP: number;
  percentGoalReached: number;
  donorCount: number;
  receiptReconciliationRate: number; // e.g. 100%
  adminWastePercentage: number; // 0%
  charityCommissionThresholdGBP: number; // 5000
  distanceToRegistrationThresholdGBP: number;
}

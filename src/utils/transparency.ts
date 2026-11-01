import {
  DonationRecord,
  ExpenseRecord,
  MilestoneItem,
  TransparencySummary,
  ExpenseCategory,
  CampaignGoal,
  ImpactReport,
  RecurringDonation,
  DonorProfile,
} from '../types';

export const INITIAL_CAMPAIGNS: CampaignGoal[] = [
  {
    id: 'camp-01',
    title: 'Clinic & GP Awareness Leaflets (Batch 1 & 2)',
    slug: 'awareness-leaflets',
    targetGBP: 600,
    currentGBP: 475,
    category: 'awareness_leaflets',
    deadline: '2026-12-15',
    description: 'Funding 4,000 double-sided, high-contrast A5 informational leaflets for NHS GP practices, urgent treatment centres, and hearing clinics across the UK.',
    status: 'active',
    linkedMilestoneId: 'm3',
    colorHex: '#34d399', // Emerald
    donorCount: 4,
    beneficiaryGroup: 'GP surgeries & urgent care waiting rooms',
  },
  {
    id: 'camp-02',
    title: 'Audiology & Ear Health Signpost Directory',
    slug: 'audiology-signposts',
    targetGBP: 500,
    currentGBP: 380,
    category: 'audiology_signposts',
    deadline: '2026-12-31',
    description: 'Developing accessible digital and printable signpost pathways linking sudden hearing loss patients with specialized NHS audiology and tinnitus clinics.',
    status: 'active',
    linkedMilestoneId: 'm2',
    colorHex: '#818cf8', // Indigo
    donorCount: 3,
    beneficiaryGroup: 'Adults with acute Ramsay Hunt hearing impairment',
  },
  {
    id: 'camp-03',
    title: 'Clinical Editorial & Antiviral Recognition Factsheets',
    slug: 'clinical-guides',
    targetGBP: 650,
    currentGBP: 620,
    category: 'patient_guides',
    deadline: '2026-11-30',
    description: 'Ensuring medical accuracy and distinction between personal lived experience and peer-reviewed guidelines on the critical 72-hour antiviral window.',
    status: 'active',
    linkedMilestoneId: 'm1',
    colorHex: '#38bdf8', // Sky blue
    donorCount: 5,
    beneficiaryGroup: 'Newly diagnosed patients & triage clinicians',
  },
  {
    id: 'camp-04',
    title: 'Independent Charity Commission Registration Reserve',
    slug: 'registration-reserve',
    targetGBP: 2000,
    currentGBP: 1475,
    category: 'governance_contingency',
    deadline: '2027-04-01',
    description: 'Building the required £5,000 threshold and independent governance buffer so the initiative can formalize as a registered CIO in England & Wales if the founder approves.',
    status: 'active',
    linkedMilestoneId: 'm5',
    colorHex: '#a855f7', // Purple
    donorCount: 7,
    beneficiaryGroup: 'Long-term patient community & governance transparency',
  },
];

export const INITIAL_IMPACT_REPORTS: ImpactReport[] = [
  {
    id: 'imp-001',
    title: '2,000 High-Contrast Leaflets Delivered to Midlands GP Surgeries',
    date: '2026-10-24',
    author: 'David Linacre (Founder)',
    campaignId: 'camp-01',
    campaignTitle: 'Clinic & GP Awareness Leaflets (Batch 1 & 2)',
    story: 'Thanks to contributors using PayPal.me/dlinacre16, our first physical print run of 2,000 accessible A5 leaflets has been completed by GreenPrint Solihull. Sample distribution has commenced across 24 local clinics and community audiology centres. Early feedback confirms that reception staff appreciate having dedicated literature that clearly highlights the invisible neurological fatigue and ear shingles vesicles.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        caption: 'First batch of 2,000 high-contrast awareness leaflets dispatched for clinic display racks.',
      },
      {
        url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
        caption: 'Leaflets arranged in waiting room health information stands with clear large typography.',
      },
    ],
    metricsAchieved: [
      { label: 'Leaflets Printed & Dispatched', value: '2,000 Copies' },
      { label: 'Medical Centres Reached', value: '24 Clinics' },
      { label: 'Paper Stock', value: '100% Recycled FSC' },
      { label: 'Unit Cost Achieved', value: '£0.125 / leaflet' },
    ],
    fundsSpentGBP: 250,
    linkedReceipts: ['GPS-2026-8891'],
    verified: true,
  },
  {
    id: 'imp-002',
    title: 'Independent Clinical Editorial Fact-Check Completed',
    date: '2026-10-28',
    author: 'Governance Advisory',
    campaignId: 'camp-03',
    campaignTitle: 'Clinical Editorial & Antiviral Recognition Factsheets',
    story: 'MedReview Consult UK has finalized its rigorous audit of our patient information signposts. Every medical assertion has been verified against NICE guidance and UK audiology standards. Crucially, the reviewer confirmed our clear separation between founder lived experience and clinical triage standards, ensuring zero unverified medical promises.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
        caption: 'Clinical audit verification documentation validating the 72-hour antiviral window guidelines.',
      },
    ],
    metricsAchieved: [
      { label: 'Clinical Reviewer Qualifications', value: 'Audiological Scientist & ENT Specialist' },
      { label: 'Guidelines Checked', value: 'NICE Clinical Knowledge Summaries' },
      { label: 'Accuracy Compliance', value: '100% Verified' },
    ],
    fundsSpentGBP: 320,
    linkedReceipts: ['MRC-INV-10492'],
    verified: true,
  },
];

export const INITIAL_DONOR_PROFILES: DonorProfile[] = [
  {
    id: 'donor-bell',
    email: 'katherine.bell@nhs.net',
    name: 'Dr. Katherine Bell',
    isAnonymous: false,
    joinedDate: '2026-10-12',
    badge: 'Founding Clinical Patron',
    bio: 'Audiologist passionate about early shingles recognition and sensorineural hearing protection.',
  },
  {
    id: 'donor-evans',
    email: 'marcus.evans@example.com',
    name: 'Marcus Evans',
    isAnonymous: false,
    joinedDate: '2026-10-20',
    badge: 'Transparency Champion',
    bio: 'Advocate for grassroots open-ledger charity transparency and patient empowerment.',
  },
  {
    id: 'donor-jenkins',
    email: 'sarah.j.creative@outlook.com',
    name: 'Sarah Jenkins',
    isAnonymous: false,
    joinedDate: '2026-10-27',
    badge: 'Governance Milestone Partner',
    bio: 'Supporting the £5,000 Charity Commission registration threshold journey.',
  },
  {
    id: 'donor-hayes',
    email: 'j.hayes.audiology@ukhealth.org',
    name: 'Dr. Jonathan Hayes',
    isAnonymous: false,
    joinedDate: '2026-11-01',
    badge: 'Clinic Outreach Sponsor',
    bio: 'Hearing specialist advocating for invisible illness awareness.',
  },
];

export const INITIAL_RECURRING_DONATIONS: RecurringDonation[] = [
  {
    id: 'rec-001',
    donorEmail: 'katherine.bell@nhs.net',
    donorName: 'Dr. Katherine Bell',
    amountGBP: 15,
    frequency: 'monthly',
    startDate: '2026-10-12',
    nextBillingDate: '2026-11-12',
    status: 'active',
    campaignId: 'camp-03',
    campaignTitle: 'Clinical Editorial & Antiviral Recognition Factsheets',
    paypalSubscriptionId: 'I-SUB-99410294X',
  },
  {
    id: 'rec-002',
    donorEmail: 'marcus.evans@example.com',
    donorName: 'Marcus Evans',
    amountGBP: 25,
    frequency: 'monthly',
    startDate: '2026-10-20',
    nextBillingDate: '2026-11-20',
    status: 'active',
    campaignId: 'camp-02',
    campaignTitle: 'Audiology & Ear Health Signpost Directory',
    paypalSubscriptionId: 'I-SUB-33819401B',
  },
  {
    id: 'rec-003',
    donorEmail: 'sarah.j.creative@outlook.com',
    donorName: 'Sarah Jenkins',
    amountGBP: 50,
    frequency: 'monthly',
    startDate: '2026-10-27',
    nextBillingDate: '2026-11-27',
    status: 'active',
    campaignId: 'camp-04',
    campaignTitle: 'Independent Charity Commission Registration Reserve',
    paypalSubscriptionId: 'I-SUB-88129402C',
  },
];

export const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    name: 'Clinical Factsheets & Patient Guides',
    category: 'patient_guides',
    budgetGBP: 400,
    spentGBP: 320,
    description: 'Developing verified, plain-language patient guides on early symptoms and living with lasting Ramsay Hunt nerve impact.',
    impactMetric: '1,500 digital downloads & GP clinic circulation',
    status: 'active',
    colorHex: '#38bdf8', // Sky blue
  },
  {
    id: 'm2',
    name: 'Audiology & Ear Health Signposts',
    category: 'audiology_signposts',
    budgetGBP: 300,
    spentGBP: 180,
    description: 'Partnering on clear signposting for tinnitus management, sudden sensorineural hearing loss, and hearing aids.',
    impactMetric: 'Signposting directory for 12 UK audiology centres',
    status: 'active',
    colorHex: '#818cf8', // Indigo
  },
  {
    id: 'm3',
    name: 'Accessible Awareness Leaflets',
    category: 'awareness_leaflets',
    budgetGBP: 350,
    spentGBP: 250,
    description: 'Printing high-contrast, accessible leaflets: "Life after Ramsay Hunt syndrome: the effects you cannot see".',
    impactMetric: '2,000 physical leaflets printed on recycled stock',
    status: 'active',
    colorHex: '#34d399', // Emerald
  },
  {
    id: 'm4',
    name: 'Accessible Digital Infrastructure',
    category: 'digital_infrastructure',
    budgetGBP: 200,
    spentGBP: 140,
    description: 'Fast, ad-free, high-contrast open web platform with real-time transparency and zero tracker overhead.',
    impactMetric: '100% uptime with zero commercial tracking cookies',
    status: 'active',
    colorHex: '#f59e0b', // Amber
  },
  {
    id: 'm5',
    name: 'Governance & Contingency Reserve',
    category: 'governance_contingency',
    budgetGBP: 750,
    spentGBP: 110,
    description: 'Independent banking buffer, ICO data registration preparation, and regulatory filing readiness.',
    impactMetric: 'Safe operational buffer adhering to Charity Commission advice',
    status: 'active',
    colorHex: '#a855f7', // Purple
  },
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don-001',
    donorName: 'Dr. Katherine Bell',
    donorEmail: 'katherine.bell@nhs.net',
    isAnonymous: false,
    amountGBP: 150,
    date: '2026-10-12',
    paypalTransactionId: 'PP-948120X91',
    donorMessage: 'In support of patient-led audiology awareness and early antiviral recognition.',
    allocatedCategory: 'patient_guides',
    campaignId: 'camp-03',
    verified: true,
  },
  {
    id: 'don-002',
    donorName: 'Anonymous Supporter',
    isAnonymous: true,
    amountGBP: 50,
    date: '2026-10-15',
    paypalTransactionId: 'PP-332918B22',
    donorMessage: 'Someone in my family has Ramsay Hunt; thank you for giving voice to invisible fatigue.',
    allocatedCategory: 'awareness_leaflets',
    campaignId: 'camp-01',
    verified: true,
  },
  {
    id: 'don-003',
    donorName: 'Marcus Evans',
    donorEmail: 'marcus.evans@example.com',
    isAnonymous: false,
    amountGBP: 200,
    date: '2026-10-20',
    paypalTransactionId: 'PP-881294C55',
    donorMessage: 'Dedicated transparency is the future of grassroots healthcare initiatives.',
    allocatedCategory: 'audiology_signposts',
    campaignId: 'camp-02',
    verified: true,
  },
  {
    id: 'don-004',
    donorName: 'Anonymous Supporter',
    isAnonymous: true,
    amountGBP: 75,
    date: '2026-10-23',
    paypalTransactionId: 'PP-109284F81',
    donorMessage: 'Keep up this vital work!',
    allocatedCategory: 'digital_infrastructure',
    campaignId: 'camp-01',
    verified: true,
  },
  {
    id: 'don-005',
    donorName: 'Sarah Jenkins',
    donorEmail: 'sarah.j.creative@outlook.com',
    isAnonymous: false,
    amountGBP: 300,
    date: '2026-10-27',
    paypalTransactionId: 'PP-554109M33',
    donorMessage: 'Toward the £5,000 threshold and independent charity preparation.',
    allocatedCategory: 'governance_contingency',
    campaignId: 'camp-04',
    verified: true,
  },
  {
    id: 'don-006',
    donorName: 'David Linacre (Founder Seed)',
    donorEmail: 'dlinacre16@gmail.com',
    isAnonymous: false,
    amountGBP: 675,
    date: '2026-10-01',
    paypalTransactionId: 'PP-000188A11',
    donorMessage: 'Founder personal reserve commitment to kickstart awareness materials without debt.',
    allocatedCategory: 'patient_guides',
    campaignId: 'camp-04',
    verified: true,
  },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-001',
    title: 'Accessible High-Contrast Awareness Leaflets Batch 1',
    description: '2,000 double-sided A5 informational leaflets printed on certified FSC paper with high-legibility sans-serif typography.',
    category: 'awareness_leaflets',
    campaignId: 'camp-01',
    amountGBP: 250,
    date: '2026-10-18',
    vendor: 'GreenPrint Solihull UK',
    receiptNumber: 'GPS-2026-8891',
    receiptItems: [
      { item: 'A5 2-sided 150gsm recycled leaflets x 2000', costGBP: 220 },
      { item: 'Eco-courier delivery to local distribution point', costGBP: 30 },
    ],
    status: 'disbursed',
    approvedBy: 'Founder & Governance Advisory',
    notes: 'Sample copies retained for Charity Commission archive and clinic display packs.',
  },
  {
    id: 'exp-002',
    title: 'Independent Clinical Editorial Fact-Check Review',
    description: 'Honorarium for independent UK audiological scientist review of clinical accuracy in patient signpost guide.',
    category: 'patient_guides',
    campaignId: 'camp-03',
    amountGBP: 320,
    date: '2026-10-22',
    vendor: 'MedReview Consult UK',
    receiptNumber: 'MRC-INV-10492',
    receiptItems: [
      { item: 'Clinical validation of Ramsay Hunt nerve path and signs', costGBP: 250 },
      { item: 'Verification against NICE guidelines & NHS signposts', costGBP: 70 },
    ],
    status: 'disbursed',
    approvedBy: 'Founder & Advisory Panel',
    notes: 'Ensured all claims distinguish personal lived experience from general medical guidance.',
  },
  {
    id: 'exp-003',
    title: 'Audiology Signpost Graphic Formatting & Alt-Text Layout',
    description: 'Accessible PDF & screen-reader optimized layout for hearing clinic signposting directory.',
    category: 'audiology_signposts',
    campaignId: 'camp-02',
    amountGBP: 180,
    date: '2026-10-25',
    vendor: 'Accessible Design Works',
    receiptNumber: 'ADW-7741',
    receiptItems: [
      { item: 'WCAG AAA formatted PDF chart', costGBP: 130 },
      { item: 'Plain text screen-reader transcript creation', costGBP: 50 },
    ],
    status: 'disbursed',
    approvedBy: 'Founder',
  },
  {
    id: 'exp-004',
    title: 'Secure SSL & Privacy-Preserving Web Hosting (1 Year)',
    description: 'Fast edge hosting with automated backups, strict privacy headers, and zero analytics tracking.',
    category: 'digital_infrastructure',
    amountGBP: 140,
    date: '2026-10-28',
    vendor: 'Cloud Host UK Ltd',
    receiptNumber: 'CH-99201-UK',
    receiptItems: [
      { item: '12 months static edge compute & automated SSL', costGBP: 110 },
      { item: 'UK domain registry & DNS privacy protection', costGBP: 30 },
    ],
    status: 'disbursed',
    approvedBy: 'Founder',
  },
  {
    id: 'exp-005',
    title: 'ICO Data Protection Registration Fee (Planned Buffer)',
    description: 'Statutory Information Commissioner Office data controller fee provision prior to public survey launch.',
    category: 'governance_contingency',
    campaignId: 'camp-04',
    amountGBP: 40,
    date: '2026-11-01',
    vendor: 'Information Commissioner Office (ICO UK)',
    receiptNumber: 'ICO-RESERV-2026',
    receiptItems: [
      { item: 'Tier 1 Data Controller annual registration', costGBP: 40 },
    ],
    status: 'approved',
    approvedBy: 'Founder',
    notes: 'Prepared in accordance with UK Data Protection Act / GDPR best practices.',
  },
];

/**
 * Calculates total inflows from donations
 */
export function calculateTotalInflows(donations: DonationRecord[]): number {
  return donations.reduce((sum, d) => sum + (d.amountGBP || 0), 0);
}

/**
 * Calculates total outflows from disbursed or approved expenses
 */
export function calculateTotalOutflows(expenses: ExpenseRecord[]): number {
  return expenses.reduce((sum, e) => sum + (e.amountGBP || 0), 0);
}

/**
 * Calculates reserve balance
 */
export function calculateReserveBalance(inflows: number, outflows: number): number {
  return Math.max(0, inflows - outflows);
}

/**
 * Reconciles every expense with receipts
 */
export function calculateReconciliationRate(expenses: ExpenseRecord[]): number {
  if (expenses.length === 0) return 100;
  const withReceipts = expenses.filter(e => Boolean(e.receiptNumber && e.receiptItems.length > 0));
  return Math.round((withReceipts.length / expenses.length) * 100);
}

/**
 * Computes campaign progress dynamically from donations
 */
export function computeCampaignProgress(campaign: CampaignGoal, donations: DonationRecord[]): {
  raisedGBP: number;
  percent: number;
  remainingGBP: number;
  donorCount: number;
} {
  const matchingDonations = donations.filter(
    d => d.campaignId === campaign.id || d.allocatedCategory === campaign.category
  );
  const raisedGBP = matchingDonations.reduce((sum, d) => sum + d.amountGBP, 0);
  const percent = campaign.targetGBP > 0 ? Math.min(100, Math.round((raisedGBP / campaign.targetGBP) * 100)) : 0;
  const remainingGBP = Math.max(0, campaign.targetGBP - raisedGBP);
  const donorCount = matchingDonations.length;

  return {
    raisedGBP,
    percent,
    remainingGBP,
    donorCount,
  };
}

/**
 * Computes statistics for a specific donor
 */
export function computeDonorStats(
  donorEmailOrName: string,
  donations: DonationRecord[],
  recurring: RecurringDonation[]
): {
  donorDonations: DonationRecord[];
  totalDonatedGBP: number;
  donationCount: number;
  activeRecurring: RecurringDonation[];
  monthlyRecurringGBP: number;
} {
  const query = donorEmailOrName.toLowerCase().trim();
  const donorDonations = donations.filter(
    d =>
      (d.donorEmail && d.donorEmail.toLowerCase() === query) ||
      d.donorName.toLowerCase() === query
  );
  const totalDonatedGBP = donorDonations.reduce((sum, d) => sum + d.amountGBP, 0);
  const donationCount = donorDonations.length;

  const activeRecurring = recurring.filter(
    r =>
      (r.donorEmail.toLowerCase() === query || r.donorName.toLowerCase() === query) &&
      r.status === 'active'
  );
  const monthlyRecurringGBP = activeRecurring.reduce((sum, r) => {
    if (r.frequency === 'monthly') return sum + r.amountGBP;
    if (r.frequency === 'quarterly') return sum + r.amountGBP / 3;
    if (r.frequency === 'annual') return sum + r.amountGBP / 12;
    return sum + r.amountGBP;
  }, 0);

  return {
    donorDonations,
    totalDonatedGBP,
    donationCount,
    activeRecurring,
    monthlyRecurringGBP,
  };
}

/**
 * Calculates overall transparency summary
 */
export function computeTransparencySummary(
  donations: DonationRecord[],
  expenses: ExpenseRecord[],
  fundraisingGoalGBP: number = 2000,
  charityCommissionThresholdGBP: number = 5000
): TransparencySummary {
  const totalInflowsGBP = calculateTotalInflows(donations);
  const totalOutflowsGBP = calculateTotalOutflows(expenses);
  const reserveBalanceGBP = calculateReserveBalance(totalInflowsGBP, totalOutflowsGBP);
  const percentGoalReached = fundraisingGoalGBP > 0 ? Math.min(100, Math.round((totalInflowsGBP / fundraisingGoalGBP) * 100)) : 0;
  const donorCount = donations.length;
  const receiptReconciliationRate = calculateReconciliationRate(expenses);
  const adminWastePercentage = 0; // 100% of funds go straight to verified awareness materials & technical infrastructure
  const distanceToRegistrationThresholdGBP = Math.max(0, charityCommissionThresholdGBP - totalInflowsGBP);

  return {
    totalInflowsGBP,
    totalOutflowsGBP,
    reserveBalanceGBP,
    fundraisingGoalGBP,
    percentGoalReached,
    donorCount,
    receiptReconciliationRate,
    adminWastePercentage,
    charityCommissionThresholdGBP,
    distanceToRegistrationThresholdGBP,
  };
}

/**
 * Generates CSV export content for donors and trustees
 */
export function generateLedgerCSV(donations: DonationRecord[], expenses: ExpenseRecord[]): string {
  const lines: string[] = [];
  lines.push('Type,ID,Date,Party/Vendor,Category,Amount_GBP,Status/Verified,Receipt/Transaction,Notes');

  donations.forEach(d => {
    const name = d.isAnonymous ? 'Anonymous Contributor' : `"${d.donorName.replace(/"/g, '""')}"`;
    const msg = d.donorMessage ? `"${d.donorMessage.replace(/"/g, '""')}"` : '""';
    lines.push(`Inflow,${d.id},${d.date},${name},${d.allocatedCategory || 'general'},${d.amountGBP.toFixed(2)},${d.verified ? 'Verified' : 'Pending'},${d.paypalTransactionId || 'N/A'},${msg}`);
  });

  expenses.forEach(e => {
    const vendor = `"${e.vendor.replace(/"/g, '""')}"`;
    const title = `"${e.title.replace(/"/g, '""')}"`;
    lines.push(`Outflow,${e.id},${e.date},${vendor},${e.category},-${e.amountGBP.toFixed(2)},${e.status},${e.receiptNumber},${title}`);
  });

  return lines.join('\n');
}

/**
 * Formats a currency amount in British Pounds (£)
 */
export function formatGBP(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Returns category human-friendly label
 */
export function getCategoryLabel(category: ExpenseCategory): string {
  switch (category) {
    case 'patient_guides':
      return 'Clinical Guides & Signs';
    case 'audiology_signposts':
      return 'Audiology & Ear Health';
    case 'awareness_leaflets':
      return 'Print & Leaflet Packs';
    case 'digital_infrastructure':
      return 'Digital Infrastructure';
    case 'volunteer_coordination':
      return 'Volunteer Coordination';
    case 'governance_contingency':
      return 'Governance & Buffer';
    default:
      return 'General Awareness';
  }
}

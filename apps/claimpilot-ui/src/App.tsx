import React, { useState } from 'react';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface FinancialBudget {
	claimed_amount: number;
	replacement_cost_value: number;
	depreciation_rate_pct: number;
	depreciation_amount: number;
	recoverable_depreciation: number;
	non_recoverable_depreciation: number;
	actual_cash_value: number;
	policy_deductible: number;
	net_payable_payout: number;
	coverage_limit: number;
	coverage_type: string;
	remaining_coverage: number;
	allocated_loss_reserve: number;
	allocated_alae_reserve: number;
	total_incurred_reserve: number;
	active_threshold_used?: string;
}

export interface LineItem {
	item: string;
	category: string;
	qty: string;
	rate: string;
	total: number;
	status: string;
	evidence_citation?: string;
	confidence?: number;
}

export interface RiskVector {
	id: string;
	name: string;
	score: number;
	status: 'Pass' | 'Flagged';
	detail: string;
	evidence_trace: string;
}

export interface Claim {
	id: string;
	claimant: string;
	policy_number: string;
	amount: number;
	loss_date: string;
	description: string;
	peril: string;
	fraud_risk_score: number;
	risk_level: string;
	human_review_required: boolean;
	gate_status: 'AUTOMATED APPROVAL PASSED' | 'ESCALATED TO SENIOR ADJUSTER' | 'APPROVED BY HUMAN ADJUSTER' | 'SIU INVESTIGATION ACTIVE' | 'REJECTED';
	siu_tier: string;
	financials: FinancialBudget;
	line_items: LineItem[];
	risk_vectors: RiskVector[];
	recommendation?: string;
	reasoning?: string[];
	assessment?: string;
	assigned_investigator?: string | null;
	timestamp: string;
	created_at_days?: number;
}

export interface DocItem {
	filename: string;
	size_bytes: number;
	status: string;
	timestamp: string;
	doc_type: string;
	policy_number: string;
	claimant: string;
	extracted_amount: string;
	compliance: string;
	pii_status: string;
	vector_chunks: number;
	field_confidence: {
		overall: number;
		amount: number;
		policy_number: number;
		classification: number;
		contractor_tin: number;
		line_items: number;
	};
	duplicate_risk: string;
	duplicate_matches: Array<{
		matched_filename: string;
		policy_number: string;
		amount: string;
		match_type: string;
		risk_impact: string;
	}>;
	summary: string;
	line_items: Array<{ item: string; qty: string; rate: string; total: string; audit: string; confidence?: number }>;
	pipeline: string;
}

export interface Inspection {
	id: string;
	claim_id: string;
	policyholder: string;
	contact_phone: string;
	scheduled_date: string;
	inspector: string;
	status: string;
	inspection_type: string;
	location: string;
	voice_call_transcript: string;
	created_at: string;
}

export interface AuditEntry {
	id: string;
	claim_id: string;
	field_name: string;
	old_value: string;
	new_value: string;
	user: string;
	reason: string;
	timestamp: string;
}

// =============================================================================
// INITIAL ROADMAP DATA
// =============================================================================

const INITIAL_CLAIMS: Claim[] = [
	{
		id: 'CP-2026-88412',
		claimant: 'Jane Doe',
		policy_number: 'POL-994821',
		amount: 8450.00,
		loss_date: '2026-08-15',
		description: 'Water line burst in kitchen causing damage to hardwood floor and cabinet bases. Master plumber invoice submitted.',
		peril: 'Residential Plumbing Rupture',
		fraud_risk_score: 14,
		risk_level: 'LOW RISK (CLEAN)',
		human_review_required: false,
		gate_status: 'AUTOMATED APPROVAL PASSED',
		siu_tier: 'Normal (Fast-Track Approved)',
		financials: {
			claimed_amount: 8450.00,
			replacement_cost_value: 8450.00,
			depreciation_rate_pct: 12,
			depreciation_amount: 1014.00,
			recoverable_depreciation: 811.20,
			non_recoverable_depreciation: 202.80,
			actual_cash_value: 7436.00,
			policy_deductible: 1000.00,
			net_payable_payout: 6436.00,
			coverage_limit: 500000.00,
			coverage_type: 'Coverage A Dwelling (HO-3)',
			remaining_coverage: 491550.00,
			allocated_loss_reserve: 8450.00,
			allocated_alae_reserve: 450.00,
			total_incurred_reserve: 8900.00,
			active_threshold_used: 'Global Default Threshold',
		},
		line_items: [
			{ item: 'Emergency Water Extraction & Anti-Microbial Prep', category: 'Extraction', qty: '280 SF', rate: '$4.50/SF', total: 1260.00, status: 'IICRC S500 Verified', evidence_citation: 'Plumber_Invoice_JaneDoe.pdf (Section 1, Line 3)', confidence: 98 },
			{ item: 'R&R 3/4in Solid White Oak Hardwood Flooring', category: 'Flooring', qty: '240 SF', rate: '$18.50/SF', total: 4440.00, status: 'Regional Index Matched', evidence_citation: 'Plumber_Invoice_JaneDoe.pdf (Section 2, Line 1)', confidence: 96 },
			{ item: 'Base Cabinet Detach & Reset (Millwork Prep)', category: 'Millwork', qty: '14 LF', rate: '$95.00/LF', total: 1330.00, status: 'Standard Labor Approved', evidence_citation: 'Plumber_Invoice_JaneDoe.pdf (Section 2, Line 4)', confidence: 94 },
			{ item: 'Commercial Low-Grain Dehumidifier Rental (72h)', category: 'Drying', qty: '2 Units', rate: '$310.00/ea', total: 620.00, status: 'Drying Log Confirmed', evidence_citation: 'Plumber_Invoice_JaneDoe.pdf (Section 3, Line 2)', confidence: 99 },
			{ item: 'Copper Supply Line Solder & Valve Replacement', category: 'Plumbing', qty: '1 LS', rate: '$800.00', total: 800.00, status: 'Master Plumber Stamped', evidence_citation: 'Plumber_Invoice_JaneDoe.pdf (Section 4, Line 1)', confidence: 97 },
		],
		risk_vectors: [
			{ id: 'V1', name: 'Policy Inception Proximity', score: 8, status: 'Pass', detail: 'Policy active for 4.2 years without lapse.', evidence_trace: 'Property_Policy_POL994821.pdf (Inception: 2022-04-10)' },
			{ id: 'V2', name: 'Regional Rate Benchmark', score: 12, status: 'Pass', detail: 'Plumber rates align with Dallas/Fort Worth index ($4.50/SF vs $4.60 regional cap).', evidence_trace: 'Q3 2026 Regional Benchmark Table' },
			{ id: 'V3', name: 'Contractor Licensure & TIN', score: 5, status: 'Pass', detail: 'Texas State Board of Plumbing Examiners active license verified (#M-44910).', evidence_trace: 'Texas TSBPE Database Verification #44910' },
			{ id: 'V4', name: 'Doppler Radar & Weather Match', score: 0, status: 'Pass', detail: 'Internal plumbing loss; weather anomaly check not applicable.', evidence_trace: 'Loss occurred indoors (water heater closet)' },
			{ id: 'V5', name: 'Loss History & ISO Search', score: 15, status: 'Pass', detail: '0 prior claims in 36-month ISO ClaimSearch window.', evidence_trace: 'ISO ClaimSearch Record #TX-994821-00' },
			{ id: 'V6', name: 'Circumstantial Loss Timing', score: 10, status: 'Pass', detail: 'Loss discovered during occupied hours, immediate emergency shutoff.', evidence_trace: 'Recorded Loss Statement: 2026-08-15 08:30' },
		],
		assigned_investigator: null,
		timestamp: '2026-08-23 21:30',
		created_at_days: 3.2,
	},
	{
		id: 'CP-2026-90124',
		claimant: 'Apex Commercial Logistics',
		policy_number: 'POL-330192',
		amount: 142000.00,
		loss_date: '2026-08-20',
		description: 'Warehouse electrical fire destroying inventory and structural steel beams. Unattended overnight ignition.',
		peril: 'Commercial Fire & Structural Loss',
		fraud_risk_score: 85,
		risk_level: 'CRITICAL RISK (SIU ESCALATION)',
		human_review_required: true,
		gate_status: 'ESCALATED TO SENIOR ADJUSTER',
		siu_tier: 'Critical Priority (Active SIU Case)',
		financials: {
			claimed_amount: 142000.00,
			replacement_cost_value: 142000.00,
			depreciation_rate_pct: 15,
			depreciation_amount: 21300.00,
			recoverable_depreciation: 17040.00,
			non_recoverable_depreciation: 4260.00,
			actual_cash_value: 120700.00,
			policy_deductible: 5000.00,
			net_payable_payout: 115700.00,
			coverage_limit: 1500000.00,
			coverage_type: 'Coverage A Commercial Building & Coverage C Inventory',
			remaining_coverage: 1358000.00,
			allocated_loss_reserve: 142000.00,
			allocated_alae_reserve: 6500.00,
			total_incurred_reserve: 148500.00,
			active_threshold_used: 'Commercial Property & Fire (CP-1)',
		},
		line_items: [
			{ item: 'Emergency Board-Up & Structural Steel Shoring', category: 'Mitigation', qty: '1 LS', rate: '$4,850.00', total: 4850.00, status: 'Emergency Rate Approved', evidence_citation: 'Warehouse_Fire_Damage_Appraisal.pdf (Line 1)', confidence: 98 },
			{ item: 'Charred Wallboard Demolition & Debris Disposal', category: 'Demolition', qty: '3,200 SF', rate: '$6.75/SF', total: 21600.00, status: 'Xactimate Index Matched', evidence_citation: 'Warehouse_Fire_Damage_Appraisal.pdf (Line 2)', confidence: 95 },
			{ item: 'W12x26 Structural Steel Beam Fabrication & Erection', category: 'Materials', qty: '14 EA', rate: '$2,850.00/ea', total: 39900.00, status: 'Engineering Spec Required', evidence_citation: 'Warehouse_Fire_Damage_Appraisal.pdf (Line 3)', confidence: 94 },
			{ item: 'Industrial 480V Main Panel & High-Voltage Rewiring', category: 'Electrical', qty: '180 HRS', rate: '$115.00/hr', total: 20700.00, status: 'Master Electrician Rate', evidence_citation: 'Warehouse_Fire_Damage_Appraisal.pdf (Line 4)', confidence: 92 },
			{ item: 'Commercial Inventory & Equipment Loss (ACV basis)', category: 'Contents', qty: '1 LS', rate: '$42,500.00', total: 42500.00, status: 'Purchase Receipts Pending Audit', evidence_citation: 'Warehouse_Fire_Damage_Appraisal.pdf (Line 5)', confidence: 90 },
			{ item: 'Industrial HEPA Air Scrubbers & Thermal Soot Remediation', category: 'Environmental', qty: '6 Units (72h)', rate: '$2,075.00/ea', total: 12450.00, status: 'EPA Protocol Validated', evidence_citation: 'Warehouse_Fire_Damage_Appraisal.pdf (Line 6)', confidence: 96 },
		],
		risk_vectors: [
			{ id: 'V1', name: 'Policy Inception Proximity', score: 68, status: 'Flagged', detail: 'Coverage limit increased by $500,000 just 22 days prior to loss.', evidence_trace: 'Endorsement End-901 added on 2026-07-29' },
			{ id: 'V2', name: 'Regional Rate Benchmark', score: 45, status: 'Flagged', detail: 'Structural steel markup exceeds regional median by 28%.', evidence_trace: 'Miami Regional Steel Index: $2,220 vs Quoted $2,850' },
			{ id: 'V3', name: 'Contractor Licensure & TIN', score: 75, status: 'Flagged', detail: 'Restoration contractor TIN registered in out-of-state shell entity.', evidence_trace: 'DE Division of Corporations Entity #778102' },
			{ id: 'V4', name: 'Doppler Radar & Weather Match', score: 90, status: 'Flagged', detail: 'Claimant cited lightning strike; NOAA Doppler recorded zero electrical storms.', evidence_trace: 'NOAA Radar Station #KMIA Log: 0.0 in rain, 0 lightning' },
			{ id: 'V5', name: 'Loss History & ISO Search', score: 82, status: 'Flagged', detail: '3 commercial fire losses in 24 months across related corporate officers.', evidence_trace: 'ISO ClaimSearch Cross-Match #ISO-FL-8819' },
			{ id: 'V6', name: 'Circumstantial Loss Timing', score: 95, status: 'Flagged', detail: 'Fire ignition occurred at 02:40 AM on Sunday with security cameras disabled.', evidence_trace: 'Fire Marshal Incident Report #FIR-2026-33019' },
		],
		assigned_investigator: 'Elena Rostova (SIU Lead Auditor)',
		timestamp: '2026-08-23 22:15',
		created_at_days: 4.1,
	},
	{
		id: 'CP-2026-91044',
		claimant: 'Marcus Vance',
		policy_number: 'POL-108422',
		amount: 3200.00,
		loss_date: '2026-08-24',
		description: 'Hail storm cracked front acoustic windshield and dented vehicle hood on 2024 Ford F-150.',
		peril: 'Auto Physical Damage (Hail)',
		fraud_risk_score: 8,
		risk_level: 'LOW RISK (CLEAN)',
		human_review_required: false,
		gate_status: 'AUTOMATED APPROVAL PASSED',
		siu_tier: 'Normal (Fast-Track Approved)',
		financials: {
			claimed_amount: 3200.00,
			replacement_cost_value: 3200.00,
			depreciation_rate_pct: 10,
			depreciation_amount: 320.00,
			recoverable_depreciation: 0.00,
			non_recoverable_depreciation: 320.00,
			actual_cash_value: 2880.00,
			policy_deductible: 500.00,
			net_payable_payout: 2380.00,
			coverage_limit: 65000.00,
			coverage_type: 'Comprehensive Auto Physical Damage (PA-1)',
			remaining_coverage: 61800.00,
			allocated_loss_reserve: 3200.00,
			allocated_alae_reserve: 150.00,
			total_incurred_reserve: 3350.00,
			active_threshold_used: 'Personal Auto Comprehensive (PA-1)',
		},
		line_items: [
			{ item: 'Paintless Dent Repair (PDR) - 42 Hood Hail Impacts', category: 'PDR', qty: '42 Impacts', rate: 'Matrix', total: 1150.00, status: 'I-CAR Matrix Verified', evidence_citation: 'Auto_Hail_Damage_Estimate.pdf (Line 1)', confidence: 99 },
			{ item: 'Roof Panel & A-Pillar Precision Dent Removal', category: 'PDR', qty: '1 LS', rate: 'Standard', total: 950.00, status: 'No Structural Distortion', evidence_citation: 'Auto_Hail_Damage_Estimate.pdf (Line 2)', confidence: 98 },
			{ item: 'OEM Acoustic Solar Windshield & ADAS Sensor Recalibration', category: 'Glass', qty: '1 EA', rate: '$880.00', total: 880.00, status: 'OEM Spec Safety Scan Passed', evidence_citation: 'Auto_Hail_Damage_Estimate.pdf (Line 3)', confidence: 99 },
			{ item: 'Right Front Fender Paint Blend & Clear Coat Refinish', category: 'Paint', qty: '1 LS', rate: '$220.00', total: 220.00, status: 'Color Match Checked', evidence_citation: 'Auto_Hail_Damage_Estimate.pdf (Line 4)', confidence: 98 },
		],
		risk_vectors: [
			{ id: 'V1', name: 'Policy Inception Proximity', score: 4, status: 'Pass', detail: 'Auto policy continuous for 6 years.', evidence_trace: 'Policy Record POL-108422' },
			{ id: 'V2', name: 'Regional Rate Benchmark', score: 6, status: 'Pass', detail: 'PDR matrix pricing matches local collision standards.', evidence_trace: 'Regional Collision Rate Survey' },
			{ id: 'V3', name: 'Contractor Licensure & TIN', score: 2, status: 'Pass', detail: 'I-CAR Gold Class facility active accreditation.', evidence_trace: 'I-CAR Facility Registry #99812' },
			{ id: 'V4', name: 'Doppler Radar & Weather Match', score: 0, status: 'Pass', detail: 'NOAA radar logged 1.25in severe hail at claimant zip code.', evidence_trace: 'NOAA Severe Storm Log Aug 24' },
			{ id: 'V5', name: 'Loss History & ISO Search', score: 8, status: 'Pass', detail: 'Clean 5-year driving record.', evidence_trace: 'ISO Motor Vehicle Record' },
			{ id: 'V6', name: 'Circumstantial Loss Timing', score: 5, status: 'Pass', detail: 'Claim submitted within 12 hours of storm event.', evidence_trace: 'FNOL Submission Timestamp' },
		],
		assigned_investigator: null,
		timestamp: '2026-08-25 09:10',
		created_at_days: 1.2,
	},
];

const INITIAL_DOCS: DocItem[] = [
	{
		filename: 'Plumber_Invoice_JaneDoe.pdf',
		size_bytes: 245120,
		status: 'Complete (Vector Indexed)',
		timestamp: '2026-08-26 14:15',
		doc_type: 'Master Contractor Invoice & Water Extraction',
		policy_number: 'POL-994821',
		claimant: 'Jane Doe',
		extracted_amount: '$8,450.00',
		compliance: 'IICRC S500 Drying Standard Verified (<12% WME)',
		pii_status: 'Phone & Contractor Tax ID Anonymized',
		vector_chunks: 4,
		field_confidence: {
			overall: 95.8,
			amount: 99.1,
			policy_number: 98.5,
			classification: 94.0,
			contractor_tin: 96.2,
			line_items: 93.4,
		},
		duplicate_risk: 'Low (Original Invoice)',
		duplicate_matches: [],
		summary: 'Itemized plumbing invoice for emergency water extraction (280 SF), 3/4in solid oak hardwood floor replacement (240 SF), cabinet detach/reset (14 LF), dehumidifier rental (72h), and copper supply line repair.',
		line_items: [
			{ item: 'Emergency Water Extraction & Sanitization', qty: '280 SF', rate: '$4.50/SF', total: '$1,260.00', audit: 'IICRC S500 Verified', confidence: 98 },
			{ item: 'R&R 3/4in Solid White Oak Flooring', qty: '240 SF', rate: '$18.50/SF', total: '$4,440.00', audit: 'Existing Grade Match', confidence: 96 },
			{ item: 'Base Cabinet Detach & Reset (Millwork Prep)', qty: '14 LF', rate: '$95.00/LF', total: '$1,330.00', audit: 'Labor Standard Checked', confidence: 94 },
			{ item: 'Commercial Low-Grain Dehumidifier (72 Hours)', qty: '2 Units', rate: '$310.00/ea', total: '$620.00', audit: 'Drying Log Confirmed', confidence: 99 },
			{ item: 'Copper Water Supply Line Solder & Valve', qty: '1 LS', rate: '$800.00', total: '$800.00', audit: 'Master Plumber Verified', confidence: 97 },
		],
		pipeline: 'ingestion.pipe',
	},
	{
		filename: 'Water_Mitigation_Duplicate_Check.pdf',
		size_bytes: 198400,
		status: 'Flagged for Duplicate Triage',
		timestamp: '2026-08-26 14:10',
		doc_type: 'Secondary Water Extraction Invoice (Vendor B)',
		policy_number: 'POL-994821',
		claimant: 'Jane Doe',
		extracted_amount: '$8,450.00',
		compliance: 'Duplicate Amount Anomaly Detected',
		pii_status: 'PII Masked',
		vector_chunks: 3,
		field_confidence: {
			overall: 92.4,
			amount: 99.4,
			policy_number: 99.0,
			classification: 88.5,
			contractor_tin: 89.0,
			line_items: 86.1,
		},
		duplicate_risk: 'HIGH DUPLICATE ANOMALY',
		duplicate_matches: [
			{
				matched_filename: 'Plumber_Invoice_JaneDoe.pdf',
				policy_number: 'POL-994821',
				amount: '$8,450.00',
				match_type: 'Exact Dollar & Policy Overlap (Same Claim Event)',
				risk_impact: '+25% to Vector 5 Loss Frequency / Duplicate Billing Audit',
			},
		],
		summary: 'Secondary contractor submission with identical dollar total ($8,450.00) on policy POL-994821. Flagged by RocketRide ingestion.pipe duplicate detector node.',
		line_items: [
			{ item: 'Emergency Extraction Crew Callout', qty: '1 LS', rate: '$1,260.00', total: '$1,260.00', audit: 'Possible Duplicate Charge', confidence: 88 },
			{ item: 'Hardwood Floor Reconstruction', qty: '240 SF', rate: '$18.50/SF', total: '$4,440.00', audit: 'Duplicate Scope Alert', confidence: 85 },
			{ item: 'Kitchen Cabinet Reset & Trim', qty: '14 LF', rate: '$95.00/LF', total: '$1,330.00', audit: 'Duplicate Scope Alert', confidence: 84 },
			{ item: 'Drying Dehumidification Service', qty: '72 HRS', rate: 'Pack', total: '$620.00', audit: 'Overlap Checked', confidence: 90 },
			{ item: 'Plumbing Pipe Fix', qty: '1 LS', rate: '$800.00', total: '$800.00', audit: 'Duplicate Plumbing Scope', confidence: 87 },
		],
		pipeline: 'ingestion.pipe',
	},
];

const INITIAL_INSPECTIONS: Inspection[] = [
	{
		id: 'INSP-2026-0912',
		claim_id: 'CP-2026-90124',
		policyholder: 'Apex Commercial Logistics',
		contact_phone: '(305) 555-0192',
		scheduled_date: '2026-08-28 14:00',
		inspector: 'David Vance, Senior PE Forensic Engineer',
		status: 'CONFIRMED_BY_VOICE_AI',
		inspection_type: 'On-Site Structural Fire & Electrical Origin Audit',
		location: '4400 Gateway Logistics Park, Bay #4',
		voice_call_transcript:
			'[AI Assistant]: Hello Apex Commercial Logistics, this is ClaimPilot AI confirming your field inspection for Claim #CP-2026-90124.\n' +
			'[Policyholder]: Hello, yes we are expecting you.\n' +
			'[AI Assistant]: We have certified Forensic Engineer David Vance available Thursday, August 28th at 2:00 PM. Does this time work for facility access?\n' +
			'[Policyholder]: Yes, Thursday at 2:00 PM works perfectly. Our facility manager Mark will be on-site with keys.\n' +
			'[AI Assistant]: Confirmed! Appointment locked for Thursday at 2:00 PM. A calendar invite and safety checklist have been dispatched to your email.',
		created_at: '2026-08-26 11:20',
	},
];

const INITIAL_AUDIT_TRAIL: AuditEntry[] = [
	{
		id: 'AUDIT-001',
		claim_id: 'CP-2026-88412',
		field_name: 'line_items[0].unit_price',
		old_value: '$5.00/SF',
		new_value: '$4.50/SF',
		user: 'Sarah Jenkins (Senior Adjuster)',
		reason: 'Adjusted to regional Xactimate index cap for water extraction.',
		timestamp: '2026-08-24 09:14:22',
	},
	{
		id: 'AUDIT-002',
		claim_id: 'CP-2026-90124',
		field_name: 'gate_status',
		old_value: 'AUTOMATED_PENDING',
		new_value: 'ESCALATED TO SENIOR ADJUSTER',
		user: 'RocketRide claim_analysis.pipe',
		reason: 'Exceeded $10k STP limit ($142,000) and triggered SIU overnight fire vector.',
		timestamp: '2026-08-23 22:15:02',
	},
];

const REGIONAL_BENCHMARKS = [
	{ region: 'TX-Dallas', name: 'Dallas-Fort Worth Metro, TX', category: 'Roofing (30-yr Arch)', avg: '$345.00 / SQ', range: '$320 - $380', variance: '±$18.50', labor_idx: '1.04' },
	{ region: 'TX-Dallas', name: 'Dallas-Fort Worth Metro, TX', category: 'Plumbing (Extraction & Solder)', avg: '$115.00 / HR', range: '$95 - $135', variance: '±$8.20', labor_idx: '1.04' },
	{ region: 'FL-Miami', name: 'Miami-Dade Coastal, FL', category: 'FL Code 1507 Wind Shingle', avg: '$420.00 / SQ', range: '$380 - $475', variance: '±$24.00', labor_idx: '1.18' },
	{ region: 'FL-Miami', name: 'Miami-Dade Coastal, FL', category: 'Category 3 Blackwater Remediation', avg: '$6.80 / SF', range: '$5.50 - $8.20', variance: '±$0.65', labor_idx: '1.18' },
	{ region: 'CA-Los Angeles', name: 'Greater Los Angeles, CA', category: 'Class A Fire-Rated Composite', avg: '$440.00 / SQ', range: '$400 - $490', variance: '±$22.00', labor_idx: '1.25' },
	{ region: 'IL-Chicago', name: 'Cook County Metro, IL', category: 'Freeze Burst Pipe & Solder', avg: '$130.00 / HR', range: '$110 - $150', variance: '±$9.20', labor_idx: '1.14' },
	{ region: 'GA-Atlanta', name: 'Atlanta Regional, GA', category: 'Residential 200A Panel Rewire', avg: '$1,850.00 / EA', range: '$1600 - $2150', variance: '±$110.00', labor_idx: '1.02' },
];

// =============================================================================
// MAIN REACT COMPONENT
// =============================================================================

export const App: React.FC = () => {
	const [view, setView] = useState<'landing' | 'dashboard'>('landing');
	const [authName, setAuthName] = useState('Sarah Jenkins');
	const [authEmail, setAuthEmail] = useState('adjuster@claimpilot.ai');
	const [authPassword, setAuthPassword] = useState('demo-pilot-2026');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoginMode, setIsLoginMode] = useState(false);
	const [activeUser, setActiveUser] = useState<{ name: string; email: string; role: string; avatar: string }>({
		name: 'Sarah Jenkins',
		email: 'sarah@claimpilot.ai',
		role: 'Senior Claims Adjuster',
		avatar: 'SJ'
	});

	const [activeTab, setActiveTab] = useState<
		'dashboard' | 'assessment' | 'siu' | 'docs' | 'benchmarks' | 'scheduling' | 'queue' | 'drift' | 'public_tracker' | 'thresholds' | 'pipelines'
	>('dashboard');

	const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
	const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
	const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
	const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(INITIAL_AUDIT_TRAIL);
	const [selectedClaim, setSelectedClaim] = useState<Claim | null>(INITIAL_CLAIMS[1]);
	const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(INITIAL_DOCS[0]);

	// Intake form state
	const [claimant, setClaimant] = useState('');
	const [policyNo, setPolicyNo] = useState('');
	const [claimAmount, setClaimAmount] = useState('');
	const [description, setDescription] = useState('');
	const [lobType, setLobType] = useState('default');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// SIU Filter state
	const [siuVectorFilter, setSiuVectorFilter] = useState<string>('all');
	const [siuMinScore, setSiuMinScore] = useState<number>(0);
	const [assignedInvestigatorInput, setAssignedInvestigatorInput] = useState('Elena Rostova (Senior SIU Auditor)');

	// Benchmark filter state
	const [selectedRegion, setSelectedRegion] = useState<string>('TX-Dallas');

	// Inspection Scheduler state
	const [inspClaimId, setInspClaimId] = useState('CP-2026-90124');
	const [inspPhone, setInspPhone] = useState('(305) 555-0192');
	const [inspDate, setInspDate] = useState('2026-08-29 10:00');
	const [inspInspector, setInspInspector] = useState('David Vance, Senior PE Forensic Engineer');
	const [isCalling, setIsCalling] = useState(false);
	const [activeCallTranscript, setActiveCallTranscript] = useState<string | null>(null);

	// Explainability popover state
	const [explainCitation, setExplainCitation] = useState<string | null>(null);

	// Inline field edit state
	const [editingField, setEditingField] = useState<string | null>(null);
	const [editValue, setEditValue] = useState<string>('');
	const [editReason, setEditReason] = useState<string>('Adjuster manual reconciliation');

	// Thresholds state
	const [globalMaxSTP, setGlobalMaxSTP] = useState(10000);
	const [globalMaxRisk, setGlobalMaxRisk] = useState(40);

	// Stats
	const totalPayouts = claims.reduce((acc, c) => acc + c.amount, 0);
	const escalatedCount = claims.filter(c => c.human_review_required || c.gate_status.includes('ESCALATED')).length;
	const autoApprovedCount = claims.filter(c => c.gate_status === 'AUTOMATED APPROVAL PASSED').length;

	// Actions
	const handleApprove = (id: string) => {
		setClaims(prev =>
			prev.map(c =>
				c.id === id ? { ...c, gate_status: 'APPROVED BY HUMAN ADJUSTER', human_review_required: false } : c
			)
		);
		if (selectedClaim?.id === id) {
			setSelectedClaim(prev => (prev ? { ...prev, gate_status: 'APPROVED BY HUMAN ADJUSTER', human_review_required: false } : null));
		}
		const newAudit: AuditEntry = {
			id: `AUDIT-${auditTrail.length + 1}`,
			claim_id: id,
			field_name: 'gate_status',
			old_value: 'ESCALATED TO SENIOR ADJUSTER',
			new_value: 'APPROVED BY HUMAN ADJUSTER',
			user: 'Sarah Jenkins (Senior Adjuster)',
			reason: 'Manual supervisor payout sign-off with digital token AUTH-PAYOUT-20260826.',
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
		};
		setAuditTrail(prev => [newAudit, ...prev]);
	};

	const handleEscalateSIU = (id: string) => {
		setClaims(prev =>
			prev.map(c =>
				c.id === id ? { ...c, gate_status: 'SIU INVESTIGATION ACTIVE', human_review_required: true, siu_tier: 'Critical Priority (Active SIU Case)' } : c
			)
		);
		if (selectedClaim?.id === id) {
			setSelectedClaim(prev => (prev ? { ...prev, gate_status: 'SIU INVESTIGATION ACTIVE', human_review_required: true, siu_tier: 'Critical Priority (Active SIU Case)' } : null));
		}
	};

	const handleSaveFieldEdit = (claimId: string, fieldName: string, oldValue: string) => {
		const newAudit: AuditEntry = {
			id: `AUDIT-${auditTrail.length + 1}`,
			claim_id: claimId,
			field_name: fieldName,
			old_value: oldValue,
			new_value: editValue,
			user: 'Sarah Jenkins (Senior Adjuster)',
			reason: editReason,
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
		};
		setAuditTrail(prev => [newAudit, ...prev]);
		setEditingField(null);
	};

	const handleCreateClaim = (e: React.FormEvent) => {
		e.preventDefault();
		if (!claimant || !claimAmount || !description) return;
		setIsSubmitting(true);

		setTimeout(() => {
			const amt = parseFloat(claimAmount) || 0;
			const isFire = description.toLowerCase().includes('fire') || description.toLowerCase().includes('overnight');
			const fraudScore = isFire || amt > 25000 ? 78 : 14;
			const isHighRisk = fraudScore >= globalMaxRisk || amt > globalMaxSTP;

			const newClaim: Claim = {
				id: `CP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
				claimant,
				policy_number: policyNo || 'POL-883921',
				amount: amt,
				loss_date: new Date().toISOString().split('T')[0],
				description,
				peril: isFire ? 'Commercial Fire & Structural Loss' : 'Residential Water Damage',
				fraud_risk_score: fraudScore,
				risk_level: isHighRisk ? 'CRITICAL RISK (SIU ESCALATION)' : 'LOW RISK (CLEAN)',
				human_review_required: isHighRisk,
				gate_status: isHighRisk ? 'ESCALATED TO SENIOR ADJUSTER' : 'AUTOMATED APPROVAL PASSED',
				siu_tier: isHighRisk ? 'High Severity (Audit Required)' : 'Normal (Fast-Track Approved)',
				financials: {
					claimed_amount: amt,
					replacement_cost_value: amt,
					depreciation_rate_pct: 12,
					depreciation_amount: amt * 0.12,
					recoverable_depreciation: amt * 0.12 * 0.8,
					non_recoverable_depreciation: amt * 0.12 * 0.2,
					actual_cash_value: amt * 0.88,
					policy_deductible: 1000,
					net_payable_payout: Math.max(0, amt * 0.88 - 1000),
					coverage_limit: 500000,
					coverage_type: 'Coverage A Dwelling (HO-3)',
					remaining_coverage: 500000 - amt,
					allocated_loss_reserve: amt,
					allocated_alae_reserve: amt * 0.05,
					total_incurred_reserve: amt * 1.05,
					active_threshold_used: 'Global Default Threshold',
				},
				line_items: [
					{ item: 'Structural Remediation & Prep', category: 'Prep', qty: '1 LS', rate: '$1,200.00', total: 1200, status: 'Verified', evidence_citation: 'FNOL Narrative & Photo Evidence', confidence: 96 },
					{ item: 'Primary Scope Materials & Labor Replacement', category: 'Materials', qty: '1 LS', rate: `$${(amt - 1200).toLocaleString()}`, total: amt - 1200, status: 'Xactimate Index Matched', evidence_citation: 'Regional Rate Schedule', confidence: 94 },
				],
				risk_vectors: [
					{ id: 'V1', name: 'Policy Inception Proximity', score: isFire ? 68 : 8, status: isFire ? 'Flagged' : 'Pass', detail: 'Policy age checked against inception ledger.', evidence_trace: 'Policy Database' },
					{ id: 'V2', name: 'Regional Rate Benchmark', score: isFire ? 45 : 12, status: isFire ? 'Flagged' : 'Pass', detail: 'Labor rates cross-referenced with Xactimate.', evidence_trace: 'Regional Benchmark Explorer' },
					{ id: 'V3', name: 'Contractor Licensure & TIN', score: isFire ? 75 : 5, status: isFire ? 'Flagged' : 'Pass', detail: 'Contractor license registry checked.', evidence_trace: 'State Licensing Registry' },
					{ id: 'V4', name: 'Doppler Radar & Weather Match', score: isFire ? 90 : 0, status: isFire ? 'Flagged' : 'Pass', detail: 'NOAA Doppler weather log correlation.', evidence_trace: 'NOAA Radar Station Log' },
					{ id: 'V5', name: 'Loss History & ISO Search', score: isFire ? 82 : 15, status: isFire ? 'Flagged' : 'Pass', detail: 'ISO ClaimSearch 36-month frequency.', evidence_trace: 'ISO Search Record' },
					{ id: 'V6', name: 'Circumstantial Loss Timing', score: isFire ? 95 : 10, status: isFire ? 'Flagged' : 'Pass', detail: 'Loss timing & occupancy verification.', evidence_trace: 'Initial Loss Statement' },
				],
				assigned_investigator: null,
				timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				created_at_days: 0.1,
			};

			setClaims(prev => [newClaim, ...prev]);
			setSelectedClaim(newClaim);
			setIsSubmitting(false);
			setClaimant('');
			setPolicyNo('');
			setClaimAmount('');
			setDescription('');
			setActiveTab('dashboard');
		}, 800);
	};

	const handleTriggerScheduleVoiceCall = () => {
		setIsCalling(true);
		setActiveCallTranscript(null);

		setTimeout(() => {
			const transcript =
				`[AI Assistant]: Hello, this is ClaimPilot AI confirming field inspection for Claim #${inspClaimId}.\n` +
				`[Policyholder]: Hello, yes I am available for the inspection.\n` +
				`[AI Assistant]: We have certified Engineer ${inspInspector} scheduled for ${inspDate}. Will facility access be open?\n` +
				`[Policyholder]: Yes, that time works perfectly. I will be on-site with keys.\n` +
				`[AI Assistant]: Confirmed! Appointment locked for ${inspDate}. Confirmation dispatched to ${inspPhone}.`;

			const newInsp: Inspection = {
				id: `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
				claim_id: inspClaimId,
				policyholder: 'Apex Commercial Logistics',
				contact_phone: inspPhone,
				scheduled_date: inspDate,
				inspector: inspInspector,
				status: 'CONFIRMED_BY_VOICE_AI',
				inspection_type: 'On-Site Loss Audit',
				location: 'Risk Location Bay #4',
				voice_call_transcript: transcript,
				created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			};

			setInspections(prev => [newInsp, ...prev]);
			setActiveCallTranscript(transcript);
			setIsCalling(false);
		}, 1400);
	};

	// Filtered SIU claims
	const filteredSiuClaims = claims.filter(c => {
		if (c.fraud_risk_score < siuMinScore) return false;
		if (siuVectorFilter !== 'all') {
			const vMatch = c.risk_vectors.some(v => v.id.toLowerCase() === siuVectorFilter.toLowerCase() && v.score >= 30);
			if (!vMatch) return false;
		}
		return true;
	});

	// Priority sorted queue (Age x 1.5 + Amount/5000 + Risk x 0.8)
	const prioritizedQueue = [...claims]
		.filter(c => c.human_review_required || c.gate_status.includes('ESCALATED'))
		.map(c => {
			const age = c.created_at_days || 2.0;
			const score = Math.round((age * 1.5 + c.amount / 5000 + c.fraud_risk_score * 0.8) * 10) / 10;
			let badge = 'ROUTINE';
			if (score >= 80) badge = 'CRITICAL';
			else if (score >= 50) badge = 'HIGH';
			else if (score >= 25) badge = 'ELEVATED';
			return { ...c, priority_score: score, priority_badge: badge };
		})
		.sort((a, b) => b.priority_score - a.priority_score);

	if (view === 'landing') {
		return (
			<div style={{
				minHeight: '100vh',
				backgroundColor: '#f1f5f9',
				backgroundImage: 'linear-gradient(180deg, #f1f5f9 0%, #e8edf3 50%, #f1f5f9 100%)',
				color: '#0f172a',
				fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
				display: 'flex',
				flexDirection: 'column',
			}}>
				{/* Top Global Header */}
				<header style={{
					padding: '12px 28px',
					backgroundColor: '#ffffff',
					borderBottom: '1px solid #e2e8f0',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
				}}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setView('landing')}>
						<div style={{
							width: 38,
							height: 38,
							borderRadius: 10,
							backgroundColor: '#0b1329',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
						}}>
							<svg viewBox="0 0 120 120" width="34" height="34">
								<defs>
									<linearGradient id="cpLogoG_r" x1="0%" y1="0%" x2="100%" y2="100%">
										<stop offset="0%" stopColor="#2563eb" />
										<stop offset="100%" stopColor="#06b6d4" />
									</linearGradient>
									<linearGradient id="cpGoldG_r" x1="0%" y1="0%" x2="100%" y2="100%">
										<stop offset="0%" stopColor="#f59e0b" />
										<stop offset="100%" stopColor="#fbbf24" />
									</linearGradient>
								</defs>
								<rect width="120" height="120" rx="26" fill="#0f172a" />
								<path d="M60 18 L92 32 V62 C92 84 60 102 60 102 C60 102 28 84 28 62 V32 Z" fill="url(#cpLogoG_r)" fillOpacity="0.2" stroke="url(#cpLogoG_r)" strokeWidth="4" strokeLinejoin="round" />
								<path d="M60 32 L82 54 L68 54 L60 42 L52 54 L38 54 Z" fill="#ffffff" />
								<path d="M60 48 L76 68 L64 68 L60 60 L56 68 L44 68 Z" fill="url(#cpLogoG_r)" />
								<polygon points="60,62 67,76 60,90 53,76" fill="url(#cpGoldG_r)" />
								<circle cx="60" cy="76" r="3.5" fill="#ffffff" />
							</svg>
						</div>
						<div>
							<div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px', color: '#0f172a' }}>
								Claim<span style={{ color: '#f59e0b' }}>Pilot</span>
								<span style={{ fontSize: 11, backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: 4, marginLeft: 6, fontWeight: 700 }}>
									Enterprise 2.5
								</span>
							</div>
							<div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
								RocketRide AI Claims &bull; SIU Fraud Engine
							</div>
						</div>
					</div>

					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<div style={{
							fontSize: 11.5,
							color: '#475569',
							backgroundColor: '#f1f5f9',
							border: '1px solid #e2e8f0',
							padding: '4px 10px',
							borderRadius: 6,
							fontFamily: 'JetBrains Mono, monospace',
							fontWeight: 600,
						}}>
							9 AI Pipelines Active
						</div>
					</div>
				</header>

				{/* Main Landing View Body */}
				<div style={{ flex: 1, padding: '40px 20px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

					{/* Dual-Panel Hero Card */}
					<div style={{
						width: '100%',
						maxWidth: 980,
						backgroundColor: '#ffffff',
						borderRadius: 24,
						border: '1px solid #e2e8f0',
						boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
						display: 'grid',
						gridTemplateColumns: '1.15fr 0.95fr',
						position: 'relative',
						overflow: 'hidden',
						marginBottom: 36,
					}}>

						{/* Left Side: Dark Hero Panel */}
						<div style={{
							background: 'radial-gradient(circle at 20% 30%, #1e293b 0%, #0f172a 60%, #080d1a 100%)',
							padding: '70px 42px 48px 42px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							position: 'relative',
							overflow: 'hidden',
							color: '#ffffff',
						}}>
							{/* Background Orbital Arcs */}
							<svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', opacity: 0.18 }} viewBox="0 0 400 400" fill="none">
								<circle cx="200" cy="200" r="160" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 8" />
								<ellipse cx="200" cy="200" rx="190" ry="110" stroke="#818cf8" strokeWidth="1.2" transform="rotate(-25 200 200)" />
								<ellipse cx="200" cy="200" rx="140" ry="80" stroke="#f59e0b" strokeWidth="1" transform="rotate(35 200 200)" />
							</svg>

							{/* Official Enterprise Portal Tag */}
							<div style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 7,
								backgroundColor: 'rgba(255, 255, 255, 0.06)',
								border: '1px solid rgba(255, 255, 255, 0.15)',
								borderRadius: 20,
								padding: '6px 14px',
								fontSize: 10.5,
								fontWeight: 700,
								color: '#cbd5e1',
								letterSpacing: '0.8px',
								textTransform: 'uppercase',
								marginBottom: 28,
								width: 'fit-content',
							}}>
								<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
								</svg>
								<span>OFFICIAL ENTERPRISE PORTAL</span>
							</div>

							{/* Headline Typography */}
							<div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.8px', color: '#ffffff', lineHeight: 1.1, marginBottom: 4 }}>
								Welcome to
							</div>
							<div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-1px', color: '#f59e0b', lineHeight: 1.1, marginBottom: 18 }}>
								Claim<span style={{ color: '#ffffff' }}>Pilot</span>
							</div>

							<div style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6, maxWidth: 380, marginBottom: 24 }}>
								Your one-stop gateway to autonomous insurance claims, real-time SIU fraud detection, and policy compliance governance.
							</div>

							{/* Bottom Left Counters */}
							<div style={{ display: 'flex', gap: 16, marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 18 }}>
								<div>
									<div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>9</div>
									<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>AI Pipelines</div>
								</div>
								<div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: 14 }}>
									<div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>&lt; 0.9s</div>
									<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>STP Latency</div>
								</div>
								<div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: 14 }}>
									<div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>6-Vector</div>
									<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>SIU Matrix</div>
								</div>
							</div>
						</div>

						{/* Right Side: Floating Clean White Card */}
						<div style={{ backgroundColor: '#f8fafc', padding: '36px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<div style={{
								backgroundColor: '#ffffff',
								borderRadius: 18,
								padding: '32px 28px',
								width: '100%',
								border: '1px solid #f1f5f9',
								boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 0 1px 1px rgba(15, 23, 42, 0.03)',
							}}>
								<div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 4 }}>
									{isLoginMode ? 'Adjuster Sign In' : 'Get Started'}
								</div>
								<div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 22 }}>
									{isLoginMode ? 'Enter your enterprise credentials to access console.' : 'Create your digital identity today.'}
								</div>

								<form onSubmit={(e) => {
									e.preventDefault();
									setActiveUser({
										name: authName.trim() || 'Sarah Jenkins',
										email: authEmail.trim() || 'sarah@claimpilot.ai',
										role: 'Senior Claims Adjuster',
										avatar: (authName.trim().split(' ').map(n=>n[0]).join('') || 'SJ').substring(0,2).toUpperCase(),
									});
									setView('dashboard');
								}}>
									{!isLoginMode && (
										<div style={{ marginBottom: 14 }}>
											<label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
												FULL NAME
											</label>
											<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
												<svg style={{ position: 'absolute', left: 12, color: '#94a3b8' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
													<circle cx="12" cy="7" r="4"></circle>
												</svg>
												<input
													type="text"
													value={authName}
													onChange={(e) => setAuthName(e.target.value)}
													placeholder="Sarah Jenkins"
													style={{
														width: '100%',
														backgroundColor: '#f8fafc',
														border: '1px solid #e2e8f0',
														borderRadius: 9,
														padding: '11px 12px 11px 36px',
														fontSize: 13,
														color: '#0f172a',
														fontWeight: 500,
														outline: 'none',
													}}
												/>
											</div>
										</div>
									)}

									<div style={{ marginBottom: 14 }}>
										<label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
											EMAIL
										</label>
										<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
											<svg style={{ position: 'absolute', left: 12, color: '#94a3b8' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
												<polyline points="22,6 12,13 2,6"></polyline>
											</svg>
											<input
												type="email"
												value={authEmail}
												onChange={(e) => setAuthEmail(e.target.value)}
												placeholder="name@example.com"
												required
												style={{
													width: '100%',
													backgroundColor: '#f8fafc',
													border: '1px solid #e2e8f0',
													borderRadius: 9,
													padding: '11px 12px 11px 36px',
													fontSize: 13,
													color: '#0f172a',
													fontWeight: 500,
													outline: 'none',
												}}
											/>
										</div>
									</div>

									<div style={{ marginBottom: 14 }}>
										<label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
											PASSWORD
										</label>
										<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
											<svg style={{ position: 'absolute', left: 12, color: '#94a3b8' }} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
												<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
											</svg>
											<input
												type={showPassword ? 'text' : 'password'}
												value={authPassword}
												onChange={(e) => setAuthPassword(e.target.value)}
												placeholder="••••••••"
												required
												style={{
													width: '100%',
													backgroundColor: '#f8fafc',
													border: '1px solid #e2e8f0',
													borderRadius: 9,
													padding: '11px 36px 11px 36px',
													fontSize: 13,
													color: '#0f172a',
													fontWeight: 500,
													outline: 'none',
												}}
											/>
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												style={{
													position: 'absolute',
													right: 12,
													color: '#94a3b8',
													cursor: 'pointer',
													background: 'transparent',
													border: 'none',
													padding: 0,
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
													{showPassword ? (
														<>
															<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
															<line x1="1" y1="1" x2="23" y2="23"></line>
														</>
													) : (
														<>
															<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
															<circle cx="12" cy="12" r="3"></circle>
														</>
													)}
												</svg>
											</button>
										</div>
									</div>

									<button
										type="submit"
										style={{
											width: '100%',
											backgroundColor: '#0f172a',
											color: '#ffffff',
											border: 'none',
											borderRadius: 9,
											padding: '12px 16px',
											fontSize: 13.5,
											fontWeight: 700,
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: 8,
											marginTop: 18,
											boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
										}}
									>
										{isLoginMode ? 'Sign In' : 'Create Account'} &rarr;
									</button>
								</form>

								<div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#64748b' }}>
									<span>{isLoginMode ? "Don't have an account?" : 'Already have an account?'}</span>{' '}
									<a
										href="javascript:void(0)"
										onClick={() => setIsLoginMode(!isLoginMode)}
										style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
									>
										{isLoginMode ? 'Get Started' : 'Log In'}
									</a>
								</div>

								{/* Quick 1-Click Demo Profiles */}
								<div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px dashed #e2e8f0' }}>
									<div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
										<span>Quick Access Roles</span>
										<span style={{ color: '#2563eb', fontWeight: 700 }}>Demo Login</span>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
										<button
											onClick={() => {
												setActiveUser({ name: 'Sarah Jenkins', email: 'sarah@claimpilot.ai', role: 'Senior Claims Adjuster', avatar: 'SJ' });
												setView('dashboard');
											}}
											style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 4 }}
										>
											<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
											Senior Adjuster
										</button>
										<button
											onClick={() => {
												setActiveUser({ name: 'Elena Rostova', email: 'elena.siu@claimpilot.ai', role: 'SIU Lead Auditor', avatar: 'ER' });
												setView('dashboard');
												setActiveTab('siu');
											}}
											style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 4 }}
										>
											<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
											SIU Auditor
										</button>
										<button
											onClick={() => {
												setActiveUser({ name: 'David Vance', email: 'david.pe@engineering.com', role: 'Licensed PE Engineer', avatar: 'DV' });
												setView('dashboard');
												setActiveTab('scheduling');
											}}
											style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 4 }}
										>
											<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
											PE Forensic Eng.
										</button>
										<button
											onClick={() => {
												setActiveUser({ name: 'Marcus Vance', email: 'claimant@vance.io', role: 'Policyholder Claimant', avatar: 'MV' });
												setView('dashboard');
												setActiveTab('public_tracker');
											}}
											style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 8px', fontSize: 11, fontWeight: 600, color: '#334155', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 4 }}
										>
											<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
											Policyholder
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Information Banner */}
					<div style={{ width: '100%', maxWidth: 980 }}>
						<div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.8px' }}>ClaimPilot</div>
						<div style={{ fontSize: 16, fontWeight: 700, color: '#2563eb', marginTop: 4, marginBottom: 16 }}>AI-Powered Insurance Operations Platform</div>

						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
							<div
								style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)' }}
							>
								<div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
									Straight-Through Payouts
								</div>
								<div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>Automated sub-second claim authorization with explainability citations.</div>
							</div>

							<div
								style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)' }}
							>
								<div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
									6-Vector SIU Anomaly Hub
								</div>
								<div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>Multi-vector forensic fraud screening and investigator dispatch.</div>
							</div>

							<div
								style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)' }}
							>
								<div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
									Autonomous Voice Dispatch
								</div>
								<div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>Telephony voice node for licensed PE engineer inspection appointments.</div>
							</div>

							<div
								style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)' }}
							>
								<div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
									<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
									Regional Cost Benchmarks
								</div>
								<div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>Real-time local market repair rate indices and materials variance.</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100%',
			backgroundColor: '#090d16',
			color: '#f1f5f9',
			fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
		}}>
			{/* TOP HEADER */}
			<header style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '12px 24px',
				backgroundColor: '#0f172a',
				borderBottom: '1px solid #1e293b',
				position: 'sticky',
				top: 0,
				zIndex: 100,
			}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setView('landing')}>
					<div style={{
						width: 36,
						height: 36,
						borderRadius: 8,
						backgroundColor: '#0b1329',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 800,
						color: '#ffffff',
						fontSize: 15,
						boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
					}}>
						<svg viewBox="0 0 120 120" width="30" height="30">
							<defs>
								<linearGradient id="cpLogoG_hdr" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor="#2563eb" />
									<stop offset="100%" stopColor="#06b6d4" />
								</linearGradient>
								<linearGradient id="cpGoldG_hdr" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor="#f59e0b" />
									<stop offset="100%" stopColor="#fbbf24" />
								</linearGradient>
							</defs>
							<rect width="120" height="120" rx="26" fill="#0f172a" />
							<path d="M60 18 L92 32 V62 C92 84 60 102 60 102 C60 102 28 84 28 62 V32 Z" fill="url(#cpLogoG_hdr)" fillOpacity="0.2" stroke="url(#cpLogoG_hdr)" strokeWidth="4" strokeLinejoin="round" />
							<path d="M60 32 L82 54 L68 54 L60 42 L52 54 L38 54 Z" fill="#ffffff" />
							<polygon points="60,62 67,76 60,90 53,76" fill="url(#cpGoldG_hdr)" />
						</svg>
					</div>
					<div>
						<div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
							Claim<span style={{ color: '#f59e0b' }}>Pilot</span> <span style={{ fontSize: 11, backgroundColor: '#1e293b', color: '#38bdf8', padding: '2px 6px', borderRadius: 4, marginLeft: 6 }}>v2.5 Enterprise</span>
						</div>
						<div style={{ fontSize: 11, color: '#94a3b8' }}>RocketRide AI Multi-Pipeline Insurance &amp; SIU Risk Command Center</div>
					</div>
				</div>

				{/* User Badge & Return to Landing */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					{activeUser && (
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#1e293b', padding: '4px 10px', borderRadius: 6, border: '1px solid #334155' }}>
							<span style={{ width: 22, height: 22, backgroundColor: '#2563eb', color: '#fff', borderRadius: '50%', fontSize: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
								{activeUser.avatar}
							</span>
							<span style={{ fontSize: 11.5, fontWeight: 700, color: '#f1f5f9' }}>{activeUser.name}</span>
							<button
								onClick={() => setView('landing')}
								style={{ background: 'transparent', border: 'none', fontSize: 11, color: '#f87171', cursor: 'pointer', marginLeft: 6, fontWeight: 600 }}
							>
								Sign Out
							</button>
						</div>
					)}

					{/* NAVIGATION TABS */}
					<nav style={{ display: 'flex', gap: 4, backgroundColor: '#020617', padding: '4px', borderRadius: 8, overflowX: 'auto' }}>
						{[
							{ id: 'dashboard', label: 'Overview' },
							{ id: 'assessment', label: 'Assessment' },
							{ id: 'siu', label: 'SIU Fraud Hub' },
							{ id: 'docs', label: 'Evidence & Viewer' },
							{ id: 'benchmarks', label: 'Cost Benchmarks' },
							{ id: 'scheduling', label: 'Voice Scheduling' },
							{ id: 'queue', label: 'Workload Queue' },
							{ id: 'drift', label: 'Model Drift' },
							{ id: 'public_tracker', label: 'Public Tracker' },
							{ id: 'thresholds', label: 'STP Settings' },
							{ id: 'pipelines', label: '9 DAG Pipes' },
						].map(t => (
							<button
								key={t.id}
								onClick={() => setActiveTab(t.id as any)}
								style={{
									padding: '6px 11px',
									borderRadius: 6,
									border: 'none',
									fontSize: 12,
									fontWeight: activeTab === t.id ? 600 : 400,
									cursor: 'pointer',
									backgroundColor: activeTab === t.id ? '#2563eb' : 'transparent',
									color: activeTab === t.id ? '#ffffff' : '#94a3b8',
									transition: 'all 0.15s ease',
									whiteSpace: 'nowrap',
								}}
							>
								{t.label}
							</button>
						))}
					</nav>
				</div>
			</header>

			{/* MAIN BODY AREA */}
			<main style={{ padding: '20px 24px', flex: 1, overflowY: 'auto' }}>
				{/* 1. DASHBOARD OVERVIEW */}
				{activeTab === 'dashboard' && (
					<div>
						{/* Stat Cards Bar */}
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Total Claims Processed</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#38bdf8' }}>{claims.length}</div>
								<div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Real-time event stream</div>
							</div>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Gross Exposure Evaluated</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#f8fafc' }}>${totalPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
								<div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Across P&amp;C lines</div>
							</div>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>STP Auto-Approval Rate</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#22c55e' }}>
									{claims.length > 0 ? ((autoApprovedCount / claims.length) * 100).toFixed(1) : 100}%
								</div>
								<div style={{ fontSize: 11, color: '#22c55e', marginTop: 2 }}>{autoApprovedCount} claims fast-tracked</div>
							</div>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Senior Adjuster Queue</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#ef4444' }}>{escalatedCount} Pending</div>
								<div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>Requiring human sign-off</div>
							</div>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Average Cycle Time</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#a855f7' }}>0.9 Days</div>
								<div style={{ fontSize: 11, color: '#a855f7', marginTop: 2 }}>vs Legacy 14.5 days (93% faster)</div>
							</div>
						</div>

						{/* Split Layout: Claims Table & Detail Pane */}
						<div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 18 }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
									<h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>Live Claim Evaluation Stream</h3>
									<span style={{ fontSize: 11, color: '#38bdf8', backgroundColor: '#020617', padding: '3px 8px', borderRadius: 4 }}>
										claim_analysis.pipe
									</span>
								</div>

								<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
									{claims.map(c => {
										const isSelected = selectedClaim?.id === c.id;
										const isHighRisk = c.fraud_risk_score >= 50;
										return (
											<div
												key={c.id}
												onClick={() => setSelectedClaim(c)}
												style={{
													padding: '12px 14px',
													borderRadius: 8,
													border: isSelected ? '1px solid #3b82f6' : '1px solid #1e293b',
													backgroundColor: isSelected ? '#1e293b' : '#090d16',
													cursor: 'pointer',
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													transition: 'all 0.15s ease',
												}}
											>
												<div>
													<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
														<span style={{ fontWeight: 700, fontSize: 13, color: '#ffffff' }}>{c.id}</span>
														<span style={{ fontSize: 11, color: '#94a3b8' }}>• {c.claimant}</span>
														<span style={{ fontSize: 10, color: '#64748b' }}>({c.policy_number})</span>
													</div>
													<div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
														${c.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} — {c.peril}
													</div>
												</div>
												<div style={{ textAlign: 'right' }}>
													<span style={{
														display: 'inline-block',
														fontSize: 10.5,
														fontWeight: 700,
														padding: '3px 8px',
														borderRadius: 4,
														backgroundColor: isHighRisk ? '#450a0a' : '#052e16',
														color: isHighRisk ? '#f87171' : '#4ade80',
														border: `1px solid ${isHighRisk ? '#991b1b' : '#166534'}`,
													}}>
														SIU Risk: {c.fraud_risk_score}%
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{/* Right: Selected Claim Full Details & Explainability */}
							{selectedClaim ? (
								<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 18 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
										<div>
											<div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>{selectedClaim.id}</div>
											<div style={{ fontSize: 12, color: '#94a3b8' }}>Policy: {selectedClaim.policy_number} | {selectedClaim.claimant}</div>
										</div>
										<span style={{
											fontSize: 11,
											fontWeight: 700,
											padding: '4px 8px',
											borderRadius: 4,
											backgroundColor: selectedClaim.gate_status.includes('PASSED') || selectedClaim.gate_status.includes('APPROVED') ? '#052e16' : '#450a0a',
											color: selectedClaim.gate_status.includes('PASSED') || selectedClaim.gate_status.includes('APPROVED') ? '#4ade80' : '#f87171',
										}}>
											{selectedClaim.gate_status}
										</span>
									</div>

									<div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#cbd5e1', marginBottom: 14, padding: 10, backgroundColor: '#090d16', borderRadius: 6 }}>
										{selectedClaim.description}
									</div>

									{/* Financial Breakdown Cards */}
									<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
										<div style={{ padding: 8, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Replacement Cost (RCV)</div>
											<div style={{ fontSize: 14, fontWeight: 700, color: '#38bdf8' }}>${selectedClaim.financials.replacement_cost_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
										</div>
										<div style={{ padding: 8, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Deductible</div>
											<div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>${selectedClaim.financials.policy_deductible.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
										</div>
										<div style={{ padding: 8, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Net Initial Check</div>
											<div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>${selectedClaim.financials.net_payable_payout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
										</div>
									</div>

									{/* Itemized Lines with Explainability Tooltips */}
									<div style={{ marginBottom: 14 }}>
										<div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
											Itemized Scope &amp; Evidence Citations:
										</div>
										<div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
											{selectedClaim.line_items.map((li, idx) => (
												<div key={idx} style={{ padding: '6px 8px', backgroundColor: '#090d16', borderRadius: 6, fontSize: 11, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<div>
														<span style={{ fontWeight: 600, color: '#f8fafc' }}>{li.item}</span>
														<div style={{ fontSize: 10, color: '#64748b' }}>{li.qty} • {li.rate}</div>
													</div>
													<div style={{ textAlign: 'right' }}>
														<span style={{ fontWeight: 700, color: '#38bdf8' }}>${li.total.toLocaleString()}</span>
														{li.evidence_citation && (
															<div
																onClick={() => setExplainCitation(li.evidence_citation || null)}
																style={{ fontSize: 9.5, color: '#93c5fd', cursor: 'pointer', textDecoration: 'underline' }}
															>
																View Citation
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Human Adjuster Controls */}
									<div style={{ borderTop: '1px solid #1e293b', paddingTop: 12, display: 'flex', gap: 8 }}>
										<button
											onClick={() => handleApprove(selectedClaim.id)}
											style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', backgroundColor: '#16a34a', color: '#ffffff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
										>
											Authorize Payout
										</button>
										<button
											onClick={() => handleEscalateSIU(selectedClaim.id)}
											style={{ flex: 1, padding: '8px', borderRadius: 6, border: 'none', backgroundColor: '#dc2626', color: '#ffffff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
										>
											Escalate to SIU
										</button>
									</div>
								</div>
							) : (
								<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Select a claim to review details</div>
							)}
						</div>
					</div>
				)}

				{/* 2. CLAIM ASSESSMENT TAB */}
				{activeTab === 'assessment' && (
					<div style={{ maxWidth: 680, margin: '0 auto', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 24 }}>
						<h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#ffffff' }}>Trigger New Claim Assessment</h3>
						<p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 18 }}>
							Executes multi-step reasoning via <code>claim_analysis.pipe</code> (Webhook &rarr; Parse &rarr; GPT-4-turbo &rarr; 6-Vector SIU Scorer &rarr; Threshold Gate &rarr; Response Answers).
						</p>

						<form onSubmit={handleCreateClaim} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
							<div>
								<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Claimant Name / Entity</label>
								<input
									type="text"
									required
									value={claimant}
									onChange={e => setClaimant(e.target.value)}
									placeholder="e.g. Jane Doe / Coastal Logistics Inc."
									style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
								/>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
								<div>
									<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Policy Number</label>
									<input
										type="text"
										value={policyNo}
										onChange={e => setPolicyNo(e.target.value)}
										placeholder="POL-994821"
										style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
									/>
								</div>
								<div>
									<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Claimed Amount ($ USD)</label>
									<input
										type="number"
										required
										value={claimAmount}
										onChange={e => setClaimAmount(e.target.value)}
										placeholder="8450"
										style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
									/>
								</div>
							</div>

							<div>
								<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Loss Narrative &amp; Damage Description</label>
								<textarea
									rows={4}
									required
									value={description}
									onChange={e => setDescription(e.target.value)}
									placeholder="Describe the incident, damaged items, structural effects, and repair estimates..."
									style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								style={{
									padding: '12px',
									borderRadius: 6,
									border: 'none',
									backgroundColor: isSubmitting ? '#475569' : '#2563eb',
									color: '#ffffff',
									fontWeight: 700,
									fontSize: 13,
									cursor: isSubmitting ? 'not-allowed' : 'pointer',
									marginTop: 4,
								}}
							>
								{isSubmitting ? 'Running RocketRide AI Assessment...' : 'Submit Claim to RocketRide Pipeline'}
							</button>
						</form>
					</div>
				)}

				{/* 3. SIU FRAUD HUB TAB (siu_dashboard.pipe) */}
				{activeTab === 'siu' && (
					<div>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
							<div>
								<h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>SIU Fraud Command Center &amp; Risk Matrix</h3>
								<div style={{ fontSize: 12, color: '#94a3b8' }}>Powered by <code>siu_dashboard.pipe</code> with 6-Vector Anomaly Correlation</div>
							</div>
							<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
								<label style={{ fontSize: 12, color: '#94a3b8' }}>Filter Vector:</label>
								<select
									value={siuVectorFilter}
									onChange={e => setSiuVectorFilter(e.target.value)}
									style={{ padding: '6px 10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 12 }}
								>
									<option value="all">All 6 Risk Vectors</option>
									<option value="V1">Vector 1: Policy Inception Proximity</option>
									<option value="V2">Vector 2: Regional Rate Benchmark</option>
									<option value="V3">Vector 3: Contractor Licensure &amp; TIN</option>
									<option value="V4">Vector 4: Doppler Radar &amp; Weather</option>
									<option value="V5">Vector 5: Loss History &amp; Frequency</option>
									<option value="V6">Vector 6: Circumstantial Timing</option>
								</select>
							</div>
						</div>

						{/* SIU Claims Table */}
						<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, overflow: 'hidden' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
								<thead>
									<tr style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', color: '#94a3b8', textAlign: 'left' }}>
										<th style={{ padding: '10px 14px' }}>Claim ID</th>
										<th style={{ padding: '10px 14px' }}>Policy &amp; Claimant</th>
										<th style={{ padding: '10px 14px' }}>Amount</th>
										<th style={{ padding: '10px 14px' }}>Peril</th>
										<th style={{ padding: '10px 14px' }}>SIU Score</th>
										<th style={{ padding: '10px 14px' }}>Assigned Investigator</th>
										<th style={{ padding: '10px 14px' }}>Action</th>
									</tr>
								</thead>
								<tbody>
									{filteredSiuClaims.map(c => (
										<tr key={c.id} style={{ borderBottom: '1px solid #1e293b' }}>
											<td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>{c.id}</td>
											<td style={{ padding: '12px 14px' }}>{c.claimant} ({c.policy_number})</td>
											<td style={{ padding: '12px 14px', fontWeight: 700, color: '#38bdf8' }}>${c.amount.toLocaleString()}</td>
											<td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{c.peril}</td>
											<td style={{ padding: '12px 14px' }}>
												<span style={{
													padding: '3px 8px',
													borderRadius: 4,
													fontSize: 11,
													fontWeight: 700,
													backgroundColor: c.fraud_risk_score >= 50 ? '#450a0a' : '#052e16',
													color: c.fraud_risk_score >= 50 ? '#f87171' : '#4ade80',
												}}>
													{c.fraud_risk_score}%
												</span>
											</td>
											<td style={{ padding: '12px 14px', color: c.assigned_investigator ? '#38bdf8' : '#64748b' }}>
												{c.assigned_investigator || 'Unassigned'}
											</td>
											<td style={{ padding: '12px 14px' }}>
												<button
													onClick={() => {
														setClaims(prev => prev.map(item => item.id === c.id ? { ...item, assigned_investigator: assignedInvestigatorInput, gate_status: 'SIU INVESTIGATION ACTIVE' } : item));
													}}
													style={{ padding: '5px 10px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
												>
													Assign Investigator
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* 4. EVIDENCE & SIDE-BY-SIDE VIEWER (ingestion.pipe) */}
				{activeTab === 'docs' && (
					<div>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
							<div>
								<h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Side-by-Side Document Intelligence &amp; Duplicate Detector</h3>
								<div style={{ fontSize: 12, color: '#94a3b8' }}>Processed via <code>ingestion.pipe</code> with Token Confidence &amp; Duplicate Invoicing Alerts</div>
							</div>
							<span style={{ fontSize: 12, color: '#38bdf8' }}>{docs.length} Documents Indexed</span>
						</div>

						{/* Split View: Documents List on Left, Document Preview + Confidence on Right */}
						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
							{/* Document List */}
							<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
								{docs.map((d, i) => {
									const isSelected = selectedDoc?.filename === d.filename;
									const isDup = d.duplicate_matches && d.duplicate_matches.length > 0;
									return (
										<div
											key={i}
											onClick={() => setSelectedDoc(d)}
											style={{
												padding: 14,
												backgroundColor: isSelected ? '#1e293b' : '#0f172a',
												border: isSelected ? '1px solid #3b82f6' : '1px solid #1e293b',
												borderRadius: 8,
												cursor: 'pointer',
												transition: 'all 0.15s ease',
											}}
										>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
												<div>
													<div style={{ fontWeight: 700, fontSize: 13, color: '#ffffff' }}>{d.filename}</div>
													<div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{d.doc_type}</div>
												</div>
												{isDup && (
													<span style={{ fontSize: 10, fontWeight: 700, backgroundColor: '#450a0a', color: '#f87171', border: '1px solid #991b1b', padding: '2px 6px', borderRadius: 4 }}>
														DUPLICATE ALERT
													</span>
												)}
											</div>

											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
												<span style={{ fontSize: 11, color: '#38bdf8' }}>Overall Confidence: {d.field_confidence.overall}%</span>
												<span style={{ fontSize: 10, color: '#64748b' }}>{(d.size_bytes / 1024).toFixed(0)} KB • {d.timestamp}</span>
											</div>
										</div>
									);
								})}
							</div>

							{/* Side-by-Side Detail View */}
							{selectedDoc ? (
								<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 18 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
										<div>
											<div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff' }}>{selectedDoc.filename}</div>
											<div style={{ fontSize: 11, color: '#94a3b8' }}>Policy: {selectedDoc.policy_number} | Claimant: {selectedDoc.claimant}</div>
										</div>
										<span style={{ fontSize: 11, backgroundColor: '#052e16', color: '#4ade80', padding: '3px 8px', borderRadius: 4 }}>
											{selectedDoc.status}
										</span>
									</div>

									{/* Duplicate match alert banner if applicable */}
									{selectedDoc.duplicate_matches && selectedDoc.duplicate_matches.length > 0 && (
										<div style={{ padding: 10, backgroundColor: '#450a0a', border: '1px solid #991b1b', borderRadius: 6, marginBottom: 12, fontSize: 11.5 }}>
											<div style={{ fontWeight: 700, color: '#f87171', marginBottom: 2 }}>⚠️ RocketRide Duplicate Invoice Detector Warning:</div>
											<div style={{ color: '#fca5a5' }}>
												Matches existing document <strong>{selectedDoc.duplicate_matches[0].matched_filename}</strong> on same policy with identical amount (<strong>{selectedDoc.duplicate_matches[0].amount}</strong>).
											</div>
											<div style={{ fontSize: 10.5, color: '#f87171', marginTop: 4 }}>
												Risk Factor: {selectedDoc.duplicate_matches[0].risk_impact}
											</div>
										</div>
									)}

									{/* Field Confidence Score Matrix Chips */}
									<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
										<div style={{ padding: 8, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Amount (${selectedDoc.extracted_amount})</div>
											<div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{selectedDoc.field_confidence.amount}% Conf.</div>
										</div>
										<div style={{ padding: 8, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Policy # Match</div>
											<div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{selectedDoc.field_confidence.policy_number}% Conf.</div>
										</div>
										<div style={{ padding: 8, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Classification</div>
											<div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>{selectedDoc.field_confidence.classification}% Conf.</div>
										</div>
									</div>

									{/* Extracted line items from document */}
									<div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
										Extracted Scope Line Items (OCR + PII Anonymized):
									</div>
									<div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
										{selectedDoc.line_items.map((li, idx) => (
											<div key={idx} style={{ padding: '8px 10px', backgroundColor: '#090d16', borderRadius: 6, fontSize: 11.5, display: 'flex', justifyContent: 'space-between' }}>
												<div>
													<div style={{ fontWeight: 600, color: '#ffffff' }}>{li.item}</div>
													<div style={{ fontSize: 10, color: '#64748b' }}>{li.qty} • {li.rate} • {li.audit}</div>
												</div>
												<div style={{ textAlign: 'right' }}>
													<span style={{ fontWeight: 700, color: '#38bdf8' }}>{li.total}</span>
													{li.confidence && <div style={{ fontSize: 9.5, color: '#4ade80' }}>{li.confidence}% Token Conf.</div>}
												</div>
											</div>
										))}
									</div>
								</div>
							) : null}
						</div>
					</div>
				)}

				{/* 5. REPAIR COST BENCHMARK EXPLORER (benchmark_explorer.pipe) */}
				{activeTab === 'benchmarks' && (
					<div>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
							<div>
								<h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Regional Repair Cost Benchmark Explorer</h3>
								<div style={{ fontSize: 12, color: '#94a3b8' }}>Powered by <code>benchmark_explorer.pipe</code> and Regional Xactimate Cost Databases</div>
							</div>
							<div style={{ display: 'flex', gap: 8 }}>
								{['TX-Dallas', 'FL-Miami', 'CA-Los Angeles', 'IL-Chicago', 'GA-Atlanta'].map(reg => (
									<button
										key={reg}
										onClick={() => setSelectedRegion(reg)}
										style={{
											padding: '6px 12px',
											borderRadius: 6,
											border: 'none',
											fontSize: 11.5,
											fontWeight: selectedRegion === reg ? 700 : 400,
											backgroundColor: selectedRegion === reg ? '#2563eb' : '#0f172a',
											color: '#ffffff',
											cursor: 'pointer',
										}}
									>
										{reg}
									</button>
								))}
							</div>
						</div>

						<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, overflow: 'hidden' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
								<thead>
									<tr style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', color: '#94a3b8', textAlign: 'left' }}>
										<th style={{ padding: '10px 14px' }}>Region</th>
										<th style={{ padding: '10px 14px' }}>Trade Category</th>
										<th style={{ padding: '10px 14px' }}>Benchmark Average</th>
										<th style={{ padding: '10px 14px' }}>Allowable Range</th>
										<th style={{ padding: '10px 14px' }}>Standard Deviation</th>
										<th style={{ padding: '10px 14px' }}>Labor Index</th>
									</tr>
								</thead>
								<tbody>
									{REGIONAL_BENCHMARKS.filter(b => b.region === selectedRegion).map((bm, i) => (
										<tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
											<td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>{bm.name}</td>
											<td style={{ padding: '12px 14px', color: '#38bdf8' }}>{bm.category}</td>
											<td style={{ padding: '12px 14px', fontWeight: 700, color: '#4ade80' }}>{bm.avg}</td>
											<td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{bm.range}</td>
											<td style={{ padding: '12px 14px', color: '#f59e0b' }}>{bm.variance}</td>
											<td style={{ padding: '12px 14px' }}>{bm.labor_idx}x</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* 6. INSPECTION SCHEDULING & VOICE TELEPHONY (inspection_scheduling.pipe) */}
				{activeTab === 'scheduling' && (
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
						{/* Schedule Call Form */}
						<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 20 }}>
							<h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Automated Field Inspection Scheduling</h3>
							<p style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 16 }}>
								Executes candidate slot selection and simulated outbound AI voice telephony confirmation via <code>inspection_scheduling.pipe</code>.
							</p>

							<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
								<div>
									<label style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Claim ID</label>
									<input
										type="text"
										value={inspClaimId}
										onChange={e => setInspClaimId(e.target.value)}
										style={{ width: '100%', padding: '8px 10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 12.5 }}
									/>
								</div>
								<div>
									<label style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Policyholder Phone</label>
									<input
										type="text"
										value={inspPhone}
										onChange={e => setInspPhone(e.target.value)}
										style={{ width: '100%', padding: '8px 10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 12.5 }}
									/>
								</div>
								<div>
									<label style={{ fontSize: 10.5, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Proposed Slot</label>
									<input
										type="text"
										value={inspDate}
										onChange={e => setInspDate(e.target.value)}
										style={{ width: '100%', padding: '8px 10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 12.5 }}
									/>
								</div>

								<button
									onClick={handleTriggerScheduleVoiceCall}
									disabled={isCalling}
									style={{
										padding: '10px',
										borderRadius: 6,
										border: 'none',
										backgroundColor: isCalling ? '#475569' : '#2563eb',
										color: '#ffffff',
										fontWeight: 700,
										fontSize: 12.5,
										cursor: isCalling ? 'not-allowed' : 'pointer',
										marginTop: 6,
									}}
								>
									{isCalling ? 'Placing AI Telephony Confirmation Call...' : 'Trigger Automated Voice Confirmation Call'}
								</button>
							</div>
						</div>

						{/* Confirmed Appointments & Transcript */}
						<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 20 }}>
							<h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Confirmed Field Inspections &amp; Audio Transcripts</h3>

							{activeCallTranscript && (
								<div style={{ padding: 12, backgroundColor: '#052e16', border: '1px solid #166534', borderRadius: 6, marginBottom: 14 }}>
									<div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', marginBottom: 6 }}>📞 LIVE CALL COMPLETED &amp; TRANSCRIBED:</div>
									<pre style={{ fontSize: 11, color: '#dcfce7', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace' }}>
										{activeCallTranscript}
									</pre>
								</div>
							)}

							<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
								{inspections.map(insp => (
									<div key={insp.id} style={{ padding: 12, backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: 6 }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<span style={{ fontWeight: 700, fontSize: 12.5, color: '#ffffff' }}>{insp.id} • {insp.claim_id}</span>
											<span style={{ fontSize: 10, fontWeight: 700, backgroundColor: '#052e16', color: '#4ade80', padding: '2px 6px', borderRadius: 4 }}>{insp.status}</span>
										</div>
										<div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
											{insp.inspector} — Scheduled: <strong>{insp.scheduled_date}</strong>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* 7. ADJUSTER WORKLOAD QUEUE (adjuster_queue.pipe) */}
				{activeTab === 'queue' && (
					<div>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
							<div>
								<h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Adjuster Priority Workload Queue</h3>
								<div style={{ fontSize: 12, color: '#94a3b8' }}>
									Ranked by Priority Score = (Age in Days &times; 1.5) + (Amount / 5000) + (SIU Risk &times; 0.8)
								</div>
							</div>
							<span style={{ fontSize: 12, color: '#38bdf8' }}>{prioritizedQueue.length} Priority Items</span>
						</div>

						<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, overflow: 'hidden' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
								<thead>
									<tr style={{ backgroundColor: '#020617', borderBottom: '1px solid #1e293b', color: '#94a3b8', textAlign: 'left' }}>
										<th style={{ padding: '10px 14px' }}>Rank &amp; Score</th>
										<th style={{ padding: '10px 14px' }}>Claim ID</th>
										<th style={{ padding: '10px 14px' }}>Claimant</th>
										<th style={{ padding: '10px 14px' }}>Peril</th>
										<th style={{ padding: '10px 14px' }}>Exposure Amount</th>
										<th style={{ padding: '10px 14px' }}>Risk Score</th>
										<th style={{ padding: '10px 14px' }}>Age</th>
										<th style={{ padding: '10px 14px' }}>Action</th>
									</tr>
								</thead>
								<tbody>
									{prioritizedQueue.map((c, i) => (
										<tr key={c.id} style={{ borderBottom: '1px solid #1e293b' }}>
											<td style={{ padding: '12px 14px' }}>
												<span style={{
													padding: '3px 8px',
													borderRadius: 4,
													fontSize: 11,
													fontWeight: 800,
													backgroundColor: c.priority_badge === 'CRITICAL' ? '#450a0a' : c.priority_badge === 'HIGH' ? '#431407' : '#172554',
													color: c.priority_badge === 'CRITICAL' ? '#f87171' : c.priority_badge === 'HIGH' ? '#fb923c' : '#60a5fa',
												}}>
													#{i + 1} {c.priority_badge} ({c.priority_score})
												</span>
											</td>
											<td style={{ padding: '12px 14px', fontWeight: 700, color: '#ffffff' }}>{c.id}</td>
											<td style={{ padding: '12px 14px' }}>{c.claimant}</td>
											<td style={{ padding: '12px 14px', color: '#94a3b8' }}>{c.peril}</td>
											<td style={{ padding: '12px 14px', fontWeight: 700, color: '#38bdf8' }}>${c.amount.toLocaleString()}</td>
											<td style={{ padding: '12px 14px' }}>{c.fraud_risk_score}%</td>
											<td style={{ padding: '12px 14px', color: '#f59e0b' }}>{c.created_at_days || 2}d</td>
											<td style={{ padding: '12px 14px' }}>
												<button
													onClick={() => {
														setSelectedClaim(c);
														setActiveTab('dashboard');
													}}
													style={{ padding: '4px 10px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
												>
													Open Desk Audit
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* 8. MODEL DRIFT & FEEDBACK LOOP (feedback_loop.pipe) */}
				{activeTab === 'drift' && (
					<div>
						<h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Model Drift &amp; Retraining Feedback Monitor</h3>
						<p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 18 }}>
							Monitors variance between original AI decisions and final adjuster sign-offs via <code>feedback_loop.pipe</code>.
						</p>

						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
							<div style={{ padding: 16, backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Rolling Precision</div>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginTop: 4 }}>96.8%</div>
							</div>
							<div style={{ padding: 16, backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Human Overrides</div>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#38bdf8', marginTop: 4 }}>14 Logged</div>
							</div>
							<div style={{ padding: 16, backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Mean Dollar Variance</div>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b', marginTop: 4 }}>$240 (±2.8%)</div>
							</div>
							<div style={{ padding: 16, backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>Model Version</div>
								<div style={{ fontSize: 24, fontWeight: 700, color: '#a855f7', marginTop: 4 }}>GPT-4 Turbo</div>
							</div>
						</div>

						{/* Audit Trail List */}
						<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 18 }}>
							<h4 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Immutable Field-Level Audit Trail (Roadmap Section 5.2)</h4>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
								{auditTrail.map(at => (
									<div key={at.id} style={{ padding: 10, backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: 6, fontSize: 11.5 }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
											<span><strong>{at.id}</strong> • Claim {at.claim_id} • Field: <code style={{ color: '#38bdf8' }}>{at.field_name}</code></span>
											<span>{at.timestamp}</span>
										</div>
										<div style={{ marginTop: 4, color: '#ffffff' }}>
											Changed: <span style={{ color: '#f87171' }}>{at.old_value}</span> &rarr; <span style={{ color: '#4ade80' }}>{at.new_value}</span>
										</div>
										<div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>
											User: {at.user} | Reason: {at.reason}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* 9. PUBLIC STATUS TRACKER (claim_status.pipe) */}
				{activeTab === 'public_tracker' && (
					<div style={{ maxWidth: 650, margin: '0 auto', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 24 }}>
						<div style={{ textAlign: 'center', marginBottom: 20 }}>
							<div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>ClaimPilot Policyholder Portal</div>
							<div style={{ fontSize: 12, color: '#94a3b8' }}>Sanitized External Status Tracking (claim_status.pipe)</div>
						</div>

						<div style={{ padding: 16, backgroundColor: '#090d16', borderRadius: 8, marginBottom: 20 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
								<span style={{ fontSize: 12, color: '#94a3b8' }}>Claim Number:</span>
								<span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>CP-2026-88412</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
								<span style={{ fontSize: 12, color: '#94a3b8' }}>Policyholder:</span>
								<span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Jane Doe (POL-***821)</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span style={{ fontSize: 12, color: '#94a3b8' }}>Current Stage:</span>
								<span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>Disbursement Authorized ($6,436.00)</span>
							</div>
						</div>

						{/* 4-Step Progress Tracker */}
						<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
							{[
								{ title: '1. First Notice of Loss Intake', desc: 'Received and verified', state: 'complete' },
								{ title: '2. Evidence & Invoice Processing', desc: 'Plumber invoice parsed & PII protected', state: 'complete' },
								{ title: '3. Scope & Damage Review', desc: 'IICRC drying & materials verified', state: 'complete' },
								{ title: '4. Electronic Payout Disbursement', desc: 'Authorized for direct ACH deposit', state: 'complete' },
							].map((st, idx) => (
								<div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#090d16', borderRadius: 6 }}>
									<div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#ffffff', fontWeight: 700 }}>
										✓
									</div>
									<div>
										<div style={{ fontSize: 12.5, fontWeight: 700, color: '#ffffff' }}>{st.title}</div>
										<div style={{ fontSize: 11, color: '#94a3b8' }}>{st.desc}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* 10. STP THRESHOLD SETTINGS */}
				{activeTab === 'thresholds' && (
					<div style={{ maxWidth: 650, margin: '0 auto', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 24 }}>
						<h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Configurable Auto-Approval (STP) Thresholds</h3>
						<p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
							Adjust straight-through processing limits dynamically without code deployment (Roadmap Section 5.3).
						</p>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							<div>
								<label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
									Max Automated Payout Amount Limit: <strong style={{ color: '#38bdf8' }}>${globalMaxSTP.toLocaleString()}</strong>
								</label>
								<input
									type="range"
									min="1000"
									max="50000"
									step="1000"
									value={globalMaxSTP}
									onChange={e => setGlobalMaxSTP(Number(e.target.value))}
									style={{ width: '100%' }}
								/>
							</div>

							<div>
								<label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
									Max Permissible SIU Fraud Risk Score: <strong style={{ color: '#f59e0b' }}>{globalMaxRisk}%</strong>
								</label>
								<input
									type="range"
									min="10"
									max="80"
									step="5"
									value={globalMaxRisk}
									onChange={e => setGlobalMaxRisk(Number(e.target.value))}
									style={{ width: '100%' }}
								/>
							</div>

							<div style={{ padding: 12, backgroundColor: '#090d16', borderRadius: 6, fontSize: 12, color: '#cbd5e1' }}>
								Current Rule: Claims under ${globalMaxSTP.toLocaleString()} with Fraud Risk Score under {globalMaxRisk}% automatically receive <strong>AUTOMATED APPROVAL PASSED</strong>. High-severity fire and claims above threshold trigger supervisory escalation.
							</div>
						</div>
					</div>
				)}

				{/* 11. PIPELINES TAB (All 9 DAGs) */}
				{activeTab === 'pipelines' && (
					<div>
						<h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#ffffff' }}>RocketRide AI Pipelines (9 Roadmap .pipe DAGs)</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
							{[
								{ name: '1. ingestion.pipe', desc: 'Webhook &rarr; Parse &rarr; Anonymize Text &rarr; Chunker &rarr; OpenAI Embeddings &rarr; Qdrant Vector DB', comps: 6, mode: 'Ingestion' },
								{ name: '2. claim_analysis.pipe', desc: 'Webhook &rarr; Parse &rarr; GPT-4 Turbo Reasoning &rarr; Response Answers', comps: 4, mode: 'Analysis' },
								{ name: '3. claim_chat.pipe', desc: 'Chat &rarr; Embeddings &rarr; Qdrant ANN Search &rarr; Prompt Engine &rarr; LLM Synthesizer', comps: 6, mode: 'RAG Chat' },
								{ name: '4. siu_dashboard.pipe', desc: 'Webhook &rarr; Parse &rarr; Qdrant 6-Vector Query &rarr; Response Answers', comps: 4, mode: 'SIU Hub' },
								{ name: '5. benchmark_explorer.pipe', desc: 'Webhook &rarr; Parse &rarr; Qdrant Repair Benchmark Query &rarr; Response Answers', comps: 4, mode: 'Benchmarks' },
								{ name: '6. inspection_scheduling.pipe', desc: 'Webhook &rarr; Parse &rarr; LLM Voice Telephony &rarr; Calendar Response', comps: 4, mode: 'Scheduling' },
								{ name: '7. claim_status.pipe', desc: 'Webhook &rarr; Parse &rarr; Qdrant Status Query &rarr; Sanitized Response', comps: 4, mode: 'Public API' },
								{ name: '8. adjuster_queue.pipe', desc: 'Webhook &rarr; Parse &rarr; Priority Sort &rarr; Response Answers', comps: 3, mode: 'Queue' },
								{ name: '9. feedback_loop.pipe', desc: 'Webhook &rarr; Parse &rarr; Drift Aggregator &rarr; Response Answers', comps: 3, mode: 'Drift Monitor' },
							].map((p, idx) => (
								<div key={idx} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
									<div style={{ fontSize: 13.5, fontWeight: 700, color: '#38bdf8', marginBottom: 4 }}>{p.name}</div>
									<div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.4, marginBottom: 8 }}>{p.desc}</div>
									<div style={{ fontSize: 10.5, color: '#64748b' }}>Components: {p.comps} | Mode: {p.mode}</div>
								</div>
							))}
						</div>
					</div>
				)}
			</main>

			{/* Explainability Citation Modal */}
			{explainCitation && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: 'rgba(0,0,0,0.7)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 1000,
				}}>
					<div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: 20, maxWidth: 500, width: '90%' }}>
						<div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Evidence &amp; Forensic Attribution Citation</div>
						<div style={{ padding: 12, backgroundColor: '#090d16', borderRadius: 6, fontSize: 12, color: '#93c5fd', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16 }}>
							{explainCitation}
						</div>
						<button
							onClick={() => setExplainCitation(null)}
							style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer', float: 'right' }}
						>
							Close Citation
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;

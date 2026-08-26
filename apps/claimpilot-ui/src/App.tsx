import React, { useState } from 'react';
import { LandingPage } from './LandingPage';
import { Logo } from './Logo';
import './index.css';

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
	active_threshold_used: string;
}

export interface RiskVector {
	id: string;
	name: string;
	score: number;
	status: 'Pass' | 'Flagged';
	detail: string;
	evidence_trace?: string;
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
	gate_status: string;
	siu_tier: string;
	financials: FinancialBudget;
	line_items: LineItem[];
	risk_vectors: RiskVector[];
	assigned_investigator?: string | null;
	timestamp: string;
	created_at_days?: number;
	priority_score?: number;
	priority_badge?: string;
}

export interface DocItem {
	filename: string;
	policy_number: string;
	claimant: string;
	doc_type: string;
	extracted_amount: number;
	field_confidence: {
		amount: number;
		policy_number: number;
		claimant: number;
		classification: number;
		overall: number;
	};
	status: string;
	size_bytes: number;
	timestamp: string;
	duplicate_risk?: string;
	duplicate_matches?: Array<{
		matched_filename: string;
		policy_number: string;
		amount: string;
		match_type: string;
		risk_impact: string;
	}>;
	summary: string;
	line_items: Array<{ item: string; qty: string; rate: string; total: string; audit: string; confidence: number }>;
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
// INITIAL REALISTIC DATASET
// =============================================================================

const INITIAL_CLAIMS: Claim[] = [
	{
		id: 'CP-2026-88412',
		claimant: 'Jane Doe',
		policy_number: 'POL-994821',
		amount: 8450.0,
		loss_date: '2026-08-24',
		description: 'Sudden kitchen supply line rupture causing floor buckling, base cabinet swelling, and drywall saturation. IICRC Category 1 water.',
		peril: 'Residential Water Damage',
		fraud_risk_score: 14,
		risk_level: 'LOW RISK (CLEAN)',
		human_review_required: false,
		gate_status: 'AUTOMATED APPROVAL PASSED',
		siu_tier: 'Normal (Fast-Track Approved)',
		financials: {
			claimed_amount: 8450.0,
			replacement_cost_value: 8450.0,
			depreciation_rate_pct: 12,
			depreciation_amount: 1014.0,
			recoverable_depreciation: 811.2,
			non_recoverable_depreciation: 202.8,
			actual_cash_value: 7436.0,
			policy_deductible: 1000.0,
			net_payable_payout: 6436.0,
			coverage_limit: 350000.0,
			coverage_type: 'Coverage A Dwelling (HO-3)',
			remaining_coverage: 341550.0,
			allocated_loss_reserve: 8450.0,
			allocated_alae_reserve: 422.5,
			total_incurred_reserve: 8872.5,
			active_threshold_used: 'Standard P&C Rule ($10,000 max STP / 40% SIU)',
		},
		line_items: [
			{ item: 'Emergency Water Extraction (IICRC Cat 1)', category: 'Extraction', qty: '280 SF', rate: '$4.50/SF', total: 1260.0, status: 'Verified', evidence_citation: 'Invoice Line 1 • Plumber_Invoice_JaneDoe.pdf:p.1', confidence: 98 },
			{ item: 'Hardwood Floor Reconstruction (Oak 3/4")', category: 'Flooring', qty: '240 SF', rate: '$18.50/SF', total: 4440.0, status: 'Xactimate Index Matched', evidence_citation: 'Scope Sheet • Plumber_Invoice_JaneDoe.pdf:p.1', confidence: 95 },
			{ item: 'Kitchen Base Cabinet Reset & Trim', category: 'Cabinetry', qty: '14 LF', rate: '$95.00/LF', total: 1330.0, status: 'Verified', evidence_citation: 'Scope Sheet • Plumber_Invoice_JaneDoe.pdf:p.1', confidence: 92 },
			{ item: 'Industrial Dehumidifier Pack (72 hrs)', category: 'Remediation', qty: '3 Units', rate: '$140.00/ea', total: 420.0, status: 'IICRC S500 Standard', evidence_citation: 'Drying Log • Plumber_Invoice_JaneDoe.pdf:p.2', confidence: 99 },
			{ item: 'Plumbing Supply Line Re-Piping & Solder', category: 'Plumbing', qty: '1 LS', rate: '$1,000.00', total: 1000.0, status: 'Verified', evidence_citation: 'Invoice Line 5 • Plumber_Invoice_JaneDoe.pdf:p.2', confidence: 97 },
		],
		risk_vectors: [
			{ id: 'V1', name: 'Policy Inception Proximity', score: 8, status: 'Pass', detail: 'Policy active 48 months. No recent endorsement drift.', evidence_trace: 'Policy POL-994821 bound 2022-09-15' },
			{ id: 'V2', name: 'Regional Rate Benchmark', score: 12, status: 'Pass', detail: 'Extraction ($4.50/SF) aligns with TX-Dallas median ($4.20 - $4.80/SF).', evidence_trace: 'Benchmark explorer node Qdrant index: TX-Dallas' },
			{ id: 'V3', name: 'Contractor Licensure & TIN', score: 5, status: 'Pass', detail: 'Apex Emergency Restoration LLC verified active master license #TX-PL-884102.', evidence_trace: 'State Licensing Registry API response: Active/Good Standing' },
			{ id: 'V4', name: 'Doppler Radar & Weather Match', score: 0, status: 'Pass', detail: 'Interior plumbing event. Meteorological validation not required.', evidence_trace: 'Peril HO-0422 internal discharge code' },
			{ id: 'V5', name: 'Loss History & ISO Search', score: 15, status: 'Pass', detail: '1 prior claim recorded in 36 months ($1,200 wind minor). Low loss frequency.', evidence_trace: 'ISO ClaimSearch API query: Match POL-994821' },
			{ id: 'V6', name: 'Circumstantial Loss Timing', score: 10, status: 'Pass', detail: 'Reported within 3 hours of initial plumber callout.', evidence_trace: 'First Notice of Loss timestamp vs Invoice timestamp' },
		],
		assigned_investigator: null,
		timestamp: '2026-08-24 14:32',
		created_at_days: 0.2,
	},
	{
		id: 'CP-2026-90124',
		claimant: 'Apex Commercial Logistics',
		policy_number: 'POL-330192',
		amount: 142000.0,
		loss_date: '2026-08-23',
		description: 'Warehouse electrical fire destroying inventory and structural steel beams. Unattended overnight ignition.',
		peril: 'Commercial Fire & Structural Loss',
		fraud_risk_score: 85,
		risk_level: 'CRITICAL RISK (SIU ESCALATION)',
		human_review_required: true,
		gate_status: 'ESCALATED TO SENIOR ADJUSTER',
		siu_tier: 'Critical Priority (Active SIU Case)',
		financials: {
			claimed_amount: 142000.0,
			replacement_cost_value: 142000.0,
			depreciation_rate_pct: 15,
			depreciation_amount: 21300.0,
			recoverable_depreciation: 17040.0,
			non_recoverable_depreciation: 4260.0,
			actual_cash_value: 120700.0,
			policy_deductible: 5000.0,
			net_payable_payout: 115700.0,
			coverage_limit: 2500000.0,
			coverage_type: 'Commercial Property CP-0010',
			remaining_coverage: 2358000.0,
			allocated_loss_reserve: 142000.0,
			allocated_alae_reserve: 7100.0,
			total_incurred_reserve: 149100.0,
			active_threshold_used: 'Standard P&C Rule ($10,000 max STP / 40% SIU)',
		},
		line_items: [
			{ item: 'Emergency Board-Up & Structural Steel Shoring', category: 'Shoring', qty: '1 LS', rate: '$4,850.00', total: 4850.0, status: 'Verified', evidence_citation: 'Invoice #4401 • ApexFire_Invoice.pdf:p.1', confidence: 91 },
			{ item: 'Charred Wallboard Demolition & Debris Disposal', category: 'Demo', qty: '3,200 SF', rate: '$6.75/SF', total: 21600.0, status: 'Regional Cap Flagged', evidence_citation: 'Scope Item 2 • ApexFire_Invoice.pdf:p.1', confidence: 86 },
			{ item: 'W12x26 Structural Steel Beam Fabrication & Erection', category: 'Steel', qty: '14 EA', rate: '$2,850.00/ea', total: 39900.0, status: 'PE Audit Mandated', evidence_citation: 'Engineer Draft • ApexFire_Invoice.pdf:p.2', confidence: 82 },
			{ item: '200A 3-Phase Industrial Switchgear Replacement', category: 'Electrical', qty: '2 Sets', rate: '$18,400.00/ea', total: 36800.0, status: 'Origin Review Flagged', evidence_citation: 'Electrical Quote • ApexFire_Invoice.pdf:p.2', confidence: 84 },
			{ item: 'HVAC Roof Top Unit Smoke Remediation', category: 'Mechanical', qty: '3 Units', rate: '$12,950.00/ea', total: 38850.0, status: 'Verified', evidence_citation: 'Mechanical Line • ApexFire_Invoice.pdf:p.3', confidence: 89 },
		],
		risk_vectors: [
			{ id: 'V1', name: 'Policy Inception Proximity', score: 68, status: 'Flagged', detail: 'Coverage increased from $1M to $2.5M just 19 days prior to loss date.', evidence_trace: 'Policy Endorsement Log #END-2026-0804' },
			{ id: 'V2', name: 'Regional Rate Benchmark', score: 45, status: 'Flagged', detail: 'Demolition unit rate ($6.75/SF) is 38% above Miami-Dade commercial index ($4.90/SF).', evidence_trace: 'Xactimate FL-Miami regional construction index' },
			{ id: 'V3', name: 'Contractor Licensure & TIN', score: 75, status: 'Flagged', detail: 'Submitting contractor registered 4 months ago; no prior commercial loss citations.', evidence_trace: 'Sunbiz FL Corporate Filings entity registration date' },
			{ id: 'V4', name: 'Doppler Radar & Weather Match', score: 90, status: 'Flagged', detail: 'Claimant reported lightning strike. Doppler radar confirms zero lightning within 12 miles.', evidence_trace: 'NOAA Doppler Radar Station KMIA log 2026-08-23 02:00-05:00 UTC' },
			{ id: 'V5', name: 'Loss History & ISO Search', score: 82, status: 'Flagged', detail: 'Entity principal has 2 prior fire loss settlements with other carriers in past 48 months.', evidence_trace: 'ISO ClaimSearch cross-carrier principal TIN query' },
			{ id: 'V6', name: 'Circumstantial Loss Timing', score: 95, status: 'Flagged', detail: 'Loss occurred Sunday at 3:15 AM during lease renewal negotiations.', evidence_trace: 'Alarm Company dispatch log vs Lease document audit' },
		],
		assigned_investigator: 'Elena Rostova, Senior SIU Fraud Specialist',
		timestamp: '2026-08-23 22:15',
		created_at_days: 1.8,
	},
	{
		id: 'CP-2026-91044',
		claimant: 'Marcus Vance',
		policy_number: 'POL-108422',
		amount: 3200.0,
		loss_date: '2026-08-25',
		description: 'Comprehensive auto hail damage to hood, roof, and trunk. PDR paintless dent repair estimate attached.',
		peril: 'Auto Physical Damage (Hail)',
		fraud_risk_score: 8,
		risk_level: 'LOW RISK (CLEAN)',
		human_review_required: false,
		gate_status: 'AUTOMATED APPROVAL PASSED',
		siu_tier: 'Normal (Fast-Track Approved)',
		financials: {
			claimed_amount: 3200.0,
			replacement_cost_value: 3200.0,
			depreciation_rate_pct: 0,
			depreciation_amount: 0,
			recoverable_depreciation: 0,
			non_recoverable_depreciation: 0,
			actual_cash_value: 3200.0,
			policy_deductible: 500.0,
			net_payable_payout: 2700.0,
			coverage_limit: 45000.0,
			coverage_type: 'Comprehensive Auto Coverage',
			remaining_coverage: 41800.0,
			allocated_loss_reserve: 3200.0,
			allocated_alae_reserve: 160.0,
			total_incurred_reserve: 3360.0,
			active_threshold_used: 'Standard P&C Rule ($10,000 max STP / 40% SIU)',
		},
		line_items: [
			{ item: 'PDR Hail Dent Removal (Hood)', category: 'PDR', qty: '42 Dents', rate: '$35.00/ea', total: 1470.0, status: 'Verified', evidence_citation: 'Photo Inspection • Hail_Vance.pdf:p.1', confidence: 99 },
			{ item: 'PDR Hail Dent Removal (Roof Panel)', category: 'PDR', qty: '36 Dents', rate: '$35.00/ea', total: 1260.0, status: 'Verified', evidence_citation: 'Photo Inspection • Hail_Vance.pdf:p.1', confidence: 98 },
			{ item: 'Trunk Lid Clearcoat Polish & Blend', category: 'Paint', qty: '1 Panel', rate: '$470.00', total: 470.0, status: 'Verified', evidence_citation: 'Body Shop Quote • Hail_Vance.pdf:p.2', confidence: 96 },
		],
		risk_vectors: [
			{ id: 'V1', name: 'Policy Inception Proximity', score: 5, status: 'Pass', detail: 'Policy active 32 months.', evidence_trace: 'Auto Policy POL-108422' },
			{ id: 'V2', name: 'Regional Rate Benchmark', score: 8, status: 'Pass', detail: 'PDR rate ($35/dent) matches TX-Dallas PDR matrix.', evidence_trace: 'Dallas PDR Schedule' },
			{ id: 'V3', name: 'Contractor Licensure & TIN', score: 0, status: 'Pass', detail: 'Direct repair network certified facility.', evidence_trace: 'Carrier DRP Network List' },
			{ id: 'V4', name: 'Doppler Radar & Weather Match', score: 0, status: 'Pass', detail: 'Severe hail storm confirmed by NOAA at policy address on 2026-08-25.', evidence_trace: 'NOAA Severe Weather Report #HAIL-TX-0825' },
			{ id: 'V5', name: 'Loss History & ISO Search', score: 12, status: 'Pass', detail: 'Clean loss history across 36 months.', evidence_trace: 'ISO Search Clean' },
			{ id: 'V6', name: 'Circumstantial Loss Timing', score: 5, status: 'Pass', detail: 'Same-day reporting via mobile app.', evidence_trace: 'FNOL Mobile Submission' },
		],
		assigned_investigator: null,
		timestamp: '2026-08-25 18:40',
		created_at_days: 0.1,
	},
];

const INITIAL_DOCS: DocItem[] = [
	{
		filename: 'Plumber_Invoice_JaneDoe.pdf',
		policy_number: 'POL-994821',
		claimant: 'Jane Doe',
		doc_type: 'Invoice & Extraction Scope',
		extracted_amount: 8450.0,
		field_confidence: { amount: 98, policy_number: 99, claimant: 99, classification: 96, overall: 98 },
		status: 'PII Protected & Anonymized',
		size_bytes: 412800,
		timestamp: '2026-08-24 14:30',
		summary: 'Plumbing emergency water extraction invoice with itemized line items. Fully parsed and verified against Xactimate benchmark.',
		line_items: [
			{ item: 'Emergency Extraction Crew Callout', qty: '1 LS', rate: '$1,260.00', total: '$1,260.00', audit: 'Verified', confidence: 98 },
			{ item: 'Hardwood Floor Reconstruction', qty: '240 SF', rate: '$18.50/SF', total: '$4,440.00', audit: 'Verified', confidence: 95 },
			{ item: 'Kitchen Cabinet Reset & Trim', qty: '14 LF', rate: '$95.00/LF', total: '$1,330.00', audit: 'Verified', confidence: 92 },
			{ item: 'Drying Dehumidification Service', qty: '72 HRS', rate: 'Pack', total: '$420.00', audit: 'Verified', confidence: 99 },
			{ item: 'Plumbing Pipe Solder Fix', qty: '1 LS', rate: '$1,000.00', total: '$1,000.00', audit: 'Verified', confidence: 97 },
		],
		pipeline: 'ingestion.pipe',
	},
	{
		filename: 'Duplicate_Contractor_JaneDoe.pdf',
		policy_number: 'POL-994821',
		claimant: 'Jane Doe',
		doc_type: 'Duplicate Contractor Invoicing',
		extracted_amount: 8450.0,
		field_confidence: { amount: 92, policy_number: 95, claimant: 94, classification: 88, overall: 87 },
		status: 'DUPLICATE ANOMALY DETECTED',
		size_bytes: 388100,
		timestamp: '2026-08-24 16:45',
		duplicate_risk: 'HIGH DUPLICATE ANOMALY',
		duplicate_matches: [
			{
				matched_filename: 'Plumber_Invoice_JaneDoe.pdf',
				policy_number: 'POL-994821',
				amount: '$8,450.00',
				match_type: 'Exact Dollar & Policy Overlap (Same Claim Event)',
				risk_impact: 'WARNING: Duplicate Billing Audit Triggered',
			},
		],
		summary: 'Secondary contractor submission with identical dollar total ($8,450.00) on policy POL-994821. Flagged by ClaimVertex duplicate detector node.',
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
			'[AI Assistant]: Hello Apex Commercial Logistics, this is ClaimVertex AI confirming your field inspection for Claim #CP-2026-90124.\n' +
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
		user: 'ClaimVertex claim_analysis.pipe',
		reason: 'Exceeded STP limit ($142,000) and triggered SIU overnight fire vector.',
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
	const [authEmail, setAuthEmail] = useState('adjuster@claimvertex.ai');
	const [authPassword, setAuthPassword] = useState('demo-vertex-2026');
	const [showPassword, setShowPassword] = useState(false);
	const [activeUser, setActiveUser] = useState<{ name: string; email: string; role: string; avatar: string }>({
		name: 'Sarah Jenkins',
		email: 'sarah@claimvertex.ai',
		role: 'Senior Claims Adjuster',
		avatar: 'SJ'
	});

	const [activeTab, setActiveTab] = useState<
		'assessment' | 'siu' | 'docs' | 'benchmarks' | 'scheduling' | 'queue' | 'drift' | 'public_tracker' | 'thresholds' | 'pipelines' | 'history'
	>('assessment');

	const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
	const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
	const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
	const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(INITIAL_AUDIT_TRAIL);
	const [selectedClaim, setSelectedClaim] = useState<Claim | null>(INITIAL_CLAIMS[0]);
	const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(INITIAL_DOCS[0]);

	// Intake form state
	const [claimant, setClaimant] = useState('Jane Doe');
	const [policyNo, setPolicyNo] = useState('POL-994821');
	const [claimAmount, setClaimAmount] = useState('8450.00');
	const [description, setDescription] = useState('Water line burst in kitchen causing damage to hardwood floors, base cabinets, and sub-flooring. Plumber invoice attached.');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasAnalyzed, setHasAnalyzed] = useState(true);

	// SIU Filter state
	const [siuVectorFilter, setSiuVectorFilter] = useState<string>('all');
	const [assignedInvestigatorInput, setAssignedInvestigatorInput] = useState('Elena Rostova, Senior SIU Fraud Specialist');

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

	// Thresholds state
	const [globalMaxSTP, setGlobalMaxSTP] = useState(10000);
	const [globalMaxRisk, setGlobalMaxRisk] = useState(40);

	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	// Stats
	const totalPayouts = claims.reduce((acc, c) => acc + c.amount, 0);
	const escalatedCount = claims.filter(c => c.human_review_required || c.gate_status.includes('ESCALATED')).length;
	const autoApprovedCount = claims.filter(c => c.gate_status === 'AUTOMATED APPROVAL PASSED').length;

	// Preset loader
	const loadPreset = (type: 'water' | 'fire' | 'auto' | 'roof' | 'commercial') => {
		if (type === 'water') {
			setClaimant('Jane Doe');
			setPolicyNo('POL-994821');
			setClaimAmount('8450.00');
			setDescription('Water line burst in kitchen causing damage to hardwood floors, base cabinets, and sub-flooring. Plumber invoice attached.');
		} else if (type === 'fire') {
			setClaimant('Apex Commercial Logistics');
			setPolicyNo('POL-330192');
			setClaimAmount('142000.00');
			setDescription('Warehouse electrical fire destroying inventory and structural steel beams. Unattended overnight ignition.');
		} else if (type === 'auto') {
			setClaimant('Marcus Vance');
			setPolicyNo('POL-108422');
			setClaimAmount('3200.00');
			setDescription('Comprehensive auto hail damage to hood, roof, and trunk. PDR paintless dent repair estimate attached.');
		} else if (type === 'roof') {
			setClaimant('Cynthia Sterling');
			setPolicyNo('POL-449102');
			setClaimAmount('38750.00');
			setDescription('Category 3 Hurricane wind damage to asphalt shingle roof. 32 squares blown off with interior drywall water leaks.');
		} else if (type === 'commercial') {
			setClaimant('Metro Food Distributors');
			setPolicyNo('POL-771829');
			setClaimAmount('24500.00');
			setDescription('Commercial refrigeration power surge failure causing spoiled inventory in Walk-In Cooler #2.');
		}
	};

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

	const handleCreateClaim = (e: React.FormEvent) => {
		e.preventDefault();
		if (!claimant || !claimAmount || !description) return;
		setIsSubmitting(true);

		setTimeout(() => {
			const amt = parseFloat(claimAmount) || 0;
			const isFire = description.toLowerCase().includes('fire') || description.toLowerCase().includes('overnight');
			const isRoof = description.toLowerCase().includes('roof') || description.toLowerCase().includes('hurricane');
			const fraudScore = isFire ? 85 : isRoof ? 34 : amt > 25000 ? 58 : 14;
			const isHighRisk = fraudScore >= globalMaxRisk || amt > globalMaxSTP;

			const newClaim: Claim = {
				id: `CP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
				claimant,
				policy_number: policyNo || 'POL-883921',
				amount: amt,
				loss_date: new Date().toISOString().split('T')[0],
				description,
				peril: isFire ? 'Commercial Fire & Structural Loss' : isRoof ? 'Hurricane Roof Wind Damage' : 'Residential Water Damage',
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
					{ item: 'Emergency Remediation & Site Prep', category: 'Prep', qty: '1 LS', rate: '$1,200.00', total: 1200, status: 'Verified', evidence_citation: 'FNOL Scope Narrative', confidence: 98 },
					{ item: 'Structural Materials & Labor Replacement', category: 'Materials', qty: '1 LS', rate: `$${(amt - 1200).toLocaleString()}`, total: amt - 1200, status: 'Xactimate Index Matched', evidence_citation: 'Regional Rate Schedule', confidence: 95 },
				],
				risk_vectors: [
					{ id: 'V1', name: 'Policy Inception Proximity', score: isFire ? 68 : 8, status: isFire ? 'Flagged' : 'Pass', detail: 'Policy inception ledger verified.', evidence_trace: 'Policy Database' },
					{ id: 'V2', name: 'Regional Rate Benchmark', score: isFire ? 45 : 12, status: isFire ? 'Flagged' : 'Pass', detail: 'Labor rates cross-referenced with Xactimate.', evidence_trace: 'Regional Benchmark Explorer' },
					{ id: 'V3', name: 'Contractor Licensure & TIN', score: isFire ? 75 : 5, status: isFire ? 'Flagged' : 'Pass', detail: 'Contractor license registry checked.', evidence_trace: 'State Licensing Registry' },
					{ id: 'V4', name: 'Doppler Radar & Weather Match', score: isFire ? 90 : 0, status: isFire ? 'Flagged' : 'Pass', detail: 'NOAA Doppler weather log correlation.', evidence_trace: 'NOAA Radar Station Log' },
					{ id: 'V5', name: 'Loss History & ISO Search', score: isFire ? 82 : 15, status: isFire ? 'Flagged' : 'Pass', detail: 'ISO ClaimSearch frequency check.', evidence_trace: 'ISO Search Record' },
					{ id: 'V6', name: 'Circumstantial Loss Timing', score: isFire ? 95 : 10, status: isFire ? 'Flagged' : 'Pass', detail: 'Loss timing & occupancy verification.', evidence_trace: 'Initial Loss Statement' },
				],
				assigned_investigator: isHighRisk ? 'Elena Rostova, Senior SIU Fraud Specialist' : null,
				timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				created_at_days: 0.1,
			};

			setClaims(prev => [newClaim, ...prev]);
			setSelectedClaim(newClaim);
			setHasAnalyzed(true);
			setIsSubmitting(false);
		}, 600);
	};

	const handleTriggerScheduleVoiceCall = () => {
		setIsCalling(true);
		setActiveCallTranscript(null);

		setTimeout(() => {
			const transcript =
				`[AI Assistant]: Hello, this is ClaimVertex AI confirming field inspection for Claim #${inspClaimId}.\n` +
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
		}, 1200);
	};

	// Filtered SIU claims
	const filteredSiuClaims = claims.filter(c => {
		if (siuVectorFilter !== 'all') {
			const vMatch = c.risk_vectors.some(v => v.id.toLowerCase() === siuVectorFilter.toLowerCase() && v.score >= 30);
			if (!vMatch) return false;
		}
		return true;
	});

	// Priority queue
	const prioritizedQueue = [...claims]
		.filter(c => c.human_review_required || c.gate_status.includes('ESCALATED'))
		.map((c, i) => {
			const age = c.created_at_days || 2.0;
			const score = Math.round((age * 1.5 + c.amount / 5000 + c.fraud_risk_score * 0.8) * 10) / 10;
			let badge = 'ROUTINE';
			if (score >= 80) badge = 'CRITICAL';
			else if (score >= 50) badge = 'HIGH';
			else if (score >= 25) badge = 'ELEVATED';
			return { ...c, priority_score: score, priority_badge: badge };
		})
		.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));

	if (view === 'landing') {
		return (
			<>
				<LandingPage onLogin={() => setIsLoginModalOpen(true)} />

				{/* ── OFFICIAL ENTERPRISE LOGIN MODAL ── */}
				{isLoginModalOpen && (
					<div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setIsLoginModalOpen(false)}>
						<div style={{ backgroundColor: '#ffffff', borderRadius: 16, width: '100%', maxWidth: 400, padding: '32px 28px', boxShadow: '0 20px 40px -10px rgba(15,23,42,0.2)', border: '1px solid #e2e8f0', position: 'relative', maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
							
							{/* Close Button */}
							<button onClick={() => setIsLoginModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
							</button>

							{/* Official Header */}
							<div style={{ textAlign: 'center', marginBottom: 22 }}>
								<div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#0f172a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
									<Logo size={24} color="#ffffff" />
								</div>
								<h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>Sign In</h2>
								<p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>ClaimVertex Enterprise Portal</p>
							</div>

							{/* Login Form */}
							<form onSubmit={e => { e.preventDefault(); setActiveUser({ name: authName || 'Sarah Jenkins', email: authEmail, role: 'Senior Claims Adjuster', avatar: 'SJ' }); setView('dashboard'); setIsLoginModalOpen(false); }}>
								
								{/* Email Input */}
								<div style={{ marginBottom: 14 }}>
									<label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>
										Email address
									</label>
									<input
										type="email"
										value={authEmail}
										onChange={e => setAuthEmail(e.target.value)}
										placeholder="adjuster@claimvertex.ai"
										style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 12px', fontFamily: 'inherit', fontSize: 13.5, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
										required
									/>
								</div>

								{/* Password Input */}
								<div style={{ marginBottom: 16 }}>
									<label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>
										Password
									</label>
									<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
										<input
											type={showPassword ? 'text' : 'password'}
											value={authPassword}
											onChange={e => setAuthPassword(e.target.value)}
											placeholder="••••••••••••"
											style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 42px 10px 12px', fontFamily: 'inherit', fontSize: 13.5, color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											style={{ position: 'absolute', right: 12, background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
										>
											{showPassword ? 'Hide' : 'Show'}
										</button>
									</div>
								</div>

								{/* Options Row */}
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, fontSize: 12.5 }}>
									<label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', cursor: 'pointer' }}>
										<input type="checkbox" defaultChecked style={{ accentColor: '#0f172a' }} />
										<span>Remember this device</span>
									</label>
									<span style={{ color: '#0f172a', fontWeight: 600, cursor: 'pointer' }}>
										Forgot password?
									</span>
								</div>

								{/* Primary Submit Button */}
								<button
									type="submit"
									id="modal-submit-btn"
									style={{ width: '100%', backgroundColor: '#0f172a', color: '#ffffff', fontSize: 14, fontWeight: 700, padding: '11px 0', borderRadius: 8, border: 'none', cursor: 'pointer' }}
								>
									Sign In
								</button>

								{/* Divider */}
								<div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', margin: '18px 0 14px', color: '#94a3b8', fontSize: 11, fontWeight: 600 }}>
									<span style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }} />
									<span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>or</span>
									<span style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }} />
								</div>

								{/* Enterprise SSO Button */}
								<button
									type="button"
									onClick={() => { setActiveUser({ name: 'Sarah Jenkins', email: authEmail || 'sarah@claimvertex.ai', role: 'Senior Claims Adjuster', avatar: 'SJ' }); setView('dashboard'); setIsLoginModalOpen(false); }}
									style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', fontSize: 13, fontWeight: 600, padding: '10px 0', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
								>
									<span>Sign In with Enterprise SSO</span>
								</button>
							</form>

							{/* Security Certifications Footer */}
							<div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
								🔒 Enterprise 256-bit encryption · SOC-2 compliant
							</div>

						</div>
					</div>
				)}
			</>
		);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// UNIFIED CORPORATE DASHBOARD (Constant Neutral Palette + Red strictly for Warnings/Security)
	// ─────────────────────────────────────────────────────────────────────────
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
			backgroundColor: '#f8fafc',
			color: '#0f172a',
			fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
		}}>
			{/* ── TOP HEADER ── */}
			<header style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '12px 32px',
				backgroundColor: '#ffffff',
				borderBottom: '1px solid #e2e8f0',
				position: 'sticky',
				top: 0,
				zIndex: 100,
				boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
			}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setView('landing')}>
					<div style={{
						width: 38,
						height: 38,
						borderRadius: 10,
						backgroundColor: '#0f172a',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
						flexShrink: 0,
					}}>
						<Logo size={22} color="#ffffff" />
					</div>
					<div>
						<div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.4px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
							ClaimVertex <span style={{ fontSize: 11, color: '#475569', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>Enterprise 2.5</span>
						</div>
						<div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
							AUTONOMOUS P&amp;C AI CLAIMS • SIU FRAUD ENGINE
						</div>
					</div>
				</div>

				{/* Right: User profile, Pipelines tag, and Status indicator */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
					{activeUser && (
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span style={{ width: 26, height: 26, backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '50%', fontSize: 10.5, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
								{activeUser.avatar}
							</span>
							<span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{activeUser.name}</span>
							<button
								onClick={() => setView('landing')}
								style={{ background: 'transparent', border: 'none', fontSize: 12, color: '#64748b', cursor: 'pointer', marginLeft: 4, fontWeight: 600 }}
							>
								Sign Out
							</button>
						</div>
					)}
					<span style={{ fontSize: 11.5, color: '#475569', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: 6, fontFamily: 'monospace', fontWeight: 600 }}>
						9 AI Pipelines Active
					</span>
					<div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
						<span style={{ width: 6, height: 6, backgroundColor: '#0f172a', borderRadius: '50%' }} />
						Core Server Active
					</div>
				</div>
			</header>

			{/* ── MAIN CONTAINER ── */}
			<div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 28px', width: '100%', display: 'flex', flexDirection: 'column', gap: 20, flex: 1, boxSizing: 'border-box' }}>
				
				{/* 5 KPI METRICS CARDS (Constant Neutral Text + Red strictly for Warning Queue) */}
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Total Claims Tracked</div>
						<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>{claims.length}</div>
						<div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>P&amp;C and Commercial</div>
					</div>
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Gross Exposure</div>
						<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>${totalPayouts.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
						<div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Total reserve volume</div>
					</div>
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>STP Auto-Approval Rate</div>
						<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
							{claims.length > 0 ? ((autoApprovedCount / claims.length) * 100).toFixed(1) : 100}%
						</div>
						<div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>Fast-track payout</div>
					</div>
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Senior Adjuster Queue</div>
						<div style={{ fontSize: 24, fontWeight: 800, color: '#b91c1c', letterSpacing: '-0.5px' }}>{escalatedCount} Case</div>
						<div style={{ fontSize: 11, color: '#b91c1c', fontWeight: 600 }}>⚠️ SIU Warning Active</div>
					</div>
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Avg Settlement Latency</div>
						<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>0.9 Days</div>
						<div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>vs Legacy 14.5 days</div>
					</div>
				</div>

				{/* 11 NAVIGATION TABS */}
				<div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: '4px', borderRadius: 8, border: '1px solid #e2e8f0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
					{[
						{ id: 'assessment', label: 'Claim Assessment' },
						{ id: 'siu', label: 'SIU Fraud Hub' },
						{ id: 'docs', label: 'Document Ingestion & Viewer' },
						{ id: 'benchmarks', label: 'Cost Benchmarks' },
						{ id: 'scheduling', label: 'Voice Scheduling' },
						{ id: 'queue', label: 'Workload Queue' },
						{ id: 'drift', label: 'Model Drift Monitor' },
						{ id: 'public_tracker', label: 'Public Tracker' },
						{ id: 'thresholds', label: 'STP Settings' },
						{ id: 'pipelines', label: '9 AI Pipelines' },
						{ id: 'history', label: 'Audit Trail' },
					].map(t => (
						<button
							key={t.id}
							onClick={() => setActiveTab(t.id as any)}
							style={{
								padding: '8px 14px',
								borderRadius: 6,
								border: 'none',
								fontSize: 12.5,
								fontWeight: 600,
								cursor: 'pointer',
								backgroundColor: activeTab === t.id ? '#0f172a' : 'transparent',
								color: activeTab === t.id ? '#ffffff' : '#475569',
								boxShadow: activeTab === t.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
								transition: 'all 0.15s ease',
							}}
						>
							{t.label}
						</button>
					))}
				</div>

				{/* ── TAB 1: CLAIM ASSESSMENT & EXPLAINABILITY ── */}
				{activeTab === 'assessment' && (
					<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
						
						{/* Left: Input Form & Presets */}
						<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
								<div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>Submit &amp; Evaluate Claim Record</div>
								<span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#475569', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: 4 }}>
									claim_analysis.pipe
								</span>
							</div>

							{/* Presets */}
							<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								<div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Real-World Case Templates:</div>
								<div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
									<button type="button" onClick={() => loadPreset('water')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '6px 11px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Water Burst ($8,450)</button>
									<button type="button" onClick={() => loadPreset('fire')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '6px 11px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Warehouse Fire ($142,000)</button>
									<button type="button" onClick={() => loadPreset('auto')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '6px 11px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Auto Hail ($3,200)</button>
									<button type="button" onClick={() => loadPreset('roof')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '6px 11px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Hurricane Roof ($38,750)</button>
									<button type="button" onClick={() => loadPreset('commercial')} style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '6px 11px', borderRadius: 6, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}>Commercial Spoilage ($24,500)</button>
								</div>
							</div>

							<form onSubmit={handleCreateClaim} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
								<div>
									<label style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Claimant Name / Entity</label>
									<input
										type="text"
										value={claimant}
										onChange={e => setClaimant(e.target.value)}
										style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '9px 12px', color: '#0f172a', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
										required
									/>
								</div>

								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
									<div>
										<label style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Policy Number</label>
										<input
											type="text"
											value={policyNo}
											onChange={e => setPolicyNo(e.target.value)}
											style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '9px 12px', color: '#0f172a', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
											required
										/>
									</div>
									<div>
										<label style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Claimed Amount ($)</label>
										<input
											type="number"
											value={claimAmount}
											onChange={e => setClaimAmount(e.target.value)}
											style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '9px 12px', color: '#0f172a', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
											required
										/>
									</div>
								</div>

								<div>
									<label style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Loss Description &amp; Incident Scope</label>
									<textarea
										rows={3}
										value={description}
										onChange={e => setDescription(e.target.value)}
										style={{ width: '100%', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6, padding: '9px 12px', color: '#0f172a', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
										required
									/>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									style={{
										width: '100%',
										backgroundColor: '#0f172a',
										color: '#ffffff',
										border: 'none',
										borderRadius: 6,
										padding: '12px 16px',
										fontSize: 13.5,
										fontWeight: 700,
										cursor: isSubmitting ? 'not-allowed' : 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 8,
										boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
									}}
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
									<span>{isSubmitting ? 'Evaluating AI Pipelines...' : 'Run Autonomous AI Damage & SIU Assessment'}</span>
								</button>
							</form>
						</div>

						{/* Right: Assessment & Financial Budget Results */}
						<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minHeight: 540 }}>
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
								<div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>Assessment &amp; Financial Budget Results</div>
								{selectedClaim && (
									<span style={{
										fontSize: 11.5,
										fontWeight: 700,
										padding: '4px 10px',
										borderRadius: 20,
										backgroundColor: selectedClaim.gate_status.includes('ESCALATED') || selectedClaim.gate_status.includes('SIU') ? '#fef2f2' : '#f1f5f9',
										color: selectedClaim.gate_status.includes('ESCALATED') || selectedClaim.gate_status.includes('SIU') ? '#b91c1c' : '#334155',
										border: `1px solid ${selectedClaim.gate_status.includes('ESCALATED') || selectedClaim.gate_status.includes('SIU') ? '#fecaca' : '#e2e8f0'}`,
									}}>
										{selectedClaim.gate_status}
									</span>
								)}
							</div>

							{selectedClaim && hasAnalyzed ? (
								<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
									{/* Claim Header Bar */}
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
										<div>
											<div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{selectedClaim.id}</div>
											<div style={{ fontSize: 11.5, color: '#64748b' }}>Policy #{selectedClaim.policy_number} • {selectedClaim.claimant}</div>
										</div>
										<div style={{ textAlign: 'right' }}>
											<div style={{ fontSize: 11, color: '#64748b' }}>SIU Score</div>
											<div style={{ fontSize: 15, fontWeight: 800, color: selectedClaim.fraud_risk_score >= 50 ? '#b91c1c' : '#0f172a' }}>
												{selectedClaim.fraud_risk_score} / 100
											</div>
										</div>
									</div>

									{/* Financial Snapshot (Clean Neutral Values) */}
									<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
										<div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
											<div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Gross RCV</div>
											<div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>${selectedClaim.financials.replacement_cost_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
										</div>
										<div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
											<div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Deductible</div>
											<div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>${selectedClaim.financials.policy_deductible.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
										</div>
										<div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
											<div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Net Authorized</div>
											<div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>${selectedClaim.financials.net_payable_payout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
										</div>
									</div>

									{/* Itemized Line Scope */}
									<div>
										<div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
											Itemized Scope Breakdown (Verified Line Items):
										</div>
										<div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', fontSize: 12 }}>
											{selectedClaim.line_items.map((li, idx) => (
												<div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderBottom: idx < selectedClaim.line_items.length - 1 ? '1px solid #f1f5f9' : 'none', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
													<div>
														<div style={{ fontWeight: 600, color: '#0f172a' }}>{li.item}</div>
														<div style={{ fontSize: 11, color: '#64748b' }}>{li.qty} • {li.rate}</div>
													</div>
													<div style={{ textAlign: 'right' }}>
														<div style={{ fontWeight: 700, color: '#0f172a' }}>${li.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
														{li.evidence_citation && (
															<span
																onClick={() => setExplainCitation(li.evidence_citation || null)}
																style={{ fontSize: 10, color: '#475569', cursor: 'pointer', textDecoration: 'underline' }}
															>
																View Citation
															</span>
														)}
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Action Buttons: Neutral primary for Authorize, Red strictly for Warning Escalate */}
									<div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
										<button
											onClick={() => handleApprove(selectedClaim.id)}
											style={{ flex: 1, backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 6, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
										>
											Authorize Payout
										</button>
										<button
											onClick={() => handleEscalateSIU(selectedClaim.id)}
											style={{ flex: 1, backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: 6, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
										>
											Escalate to SIU (Warning)
										</button>
									</div>
								</div>
							) : (
								<div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
									<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
									<div style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>No Claim Evaluated in Current Session</div>
									<div style={{ fontSize: 12, maxWidth: 360, margin: '0 auto' }}>Click a sample template or enter claim details, then click <strong>Run Autonomous AI Damage &amp; SIU Assessment</strong>.</div>
								</div>
							)}
						</div>

					</div>
				)}

				{/* ── TAB 2: SIU FRAUD HUB ── */}
				{activeTab === 'siu' && (
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
							<div>
								<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>SIU Fraud Command Center &amp; Risk Matrix</div>
								<div style={{ fontSize: 12, color: '#64748b' }}>Powered by <code>siu_dashboard.pipe</code> with 6-Vector Anomaly Correlation</div>
							</div>
							<select
								value={siuVectorFilter}
								onChange={e => setSiuVectorFilter(e.target.value)}
								style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, color: '#0f172a', fontSize: 12, outline: 'none' }}
							>
								<option value="all">Filter: All 6 Vectors</option>
								<option value="V1">Vector 1: Inception Proximity</option>
								<option value="V2">Vector 2: Benchmark Markup</option>
								<option value="V3">Vector 3: Contractor Licensure</option>
								<option value="V4">Vector 4: Doppler Weather</option>
								<option value="V5">Vector 5: Loss History</option>
								<option value="V6">Vector 6: Timing &amp; Origin</option>
							</select>
						</div>

						<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
							<thead>
								<tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
									<th style={{ padding: '10px 14px' }}>Claim ID</th>
									<th style={{ padding: '10px 14px' }}>Policyholder</th>
									<th style={{ padding: '10px 14px' }}>Peril</th>
									<th style={{ padding: '10px 14px' }}>Claim Amount</th>
									<th style={{ padding: '10px 14px' }}>SIU Score</th>
									<th style={{ padding: '10px 14px' }}>Assigned Investigator</th>
									<th style={{ padding: '10px 14px' }}>Action</th>
								</tr>
							</thead>
							<tbody>
								{filteredSiuClaims.map(c => (
									<tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
										<td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{c.id}</td>
										<td style={{ padding: '12px 14px' }}>{c.claimant} ({c.policy_number})</td>
										<td style={{ padding: '12px 14px', color: '#475569' }}>{c.peril}</td>
										<td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>${c.amount.toLocaleString()}</td>
										<td style={{ padding: '12px 14px' }}>
											<span style={{
												padding: '3px 8px',
												borderRadius: 4,
												fontSize: 11,
												fontWeight: 700,
												backgroundColor: c.fraud_risk_score >= 50 ? '#fef2f2' : '#f1f5f9',
												color: c.fraud_risk_score >= 50 ? '#b91c1c' : '#475569',
												border: `1px solid ${c.fraud_risk_score >= 50 ? '#fecaca' : '#e2e8f0'}`,
											}}>
												{c.fraud_risk_score}%
											</span>
										</td>
										<td style={{ padding: '12px 14px', color: '#475569' }}>
											{c.assigned_investigator || 'Unassigned'}
										</td>
										<td style={{ padding: '12px 14px' }}>
											<button
												onClick={() => setClaims(prev => prev.map(item => item.id === c.id ? { ...item, assigned_investigator: assignedInvestigatorInput, gate_status: 'SIU INVESTIGATION ACTIVE' } : item))}
												style={{ padding: '5px 10px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 4, fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
											>
												Assign Investigator
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* ── TAB 3: DOCUMENT INGESTION & VIEWER ── */}
				{activeTab === 'docs' && (
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
						<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
								<div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Document Ingestion &amp; Duplicate Detector</div>
								<span style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: 4 }}>ingestion.pipe</span>
							</div>

							<div style={{ border: '2px dashed #cbd5e1', borderRadius: 8, padding: 24, textAlign: 'center', background: '#f8fafc', cursor: 'pointer', marginBottom: 16 }}>
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 6px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="17" x2="12" y2="15"></line></svg>
								<div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>Upload Invoices, Estimates &amp; Loss Proofs</div>
								<div style={{ fontSize: 11.5, color: '#64748b' }}>Automated PII Strip • Token Confidence • Qdrant Indexing</div>
							</div>

							<div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Indexed Document Repository:</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
								{docs.map((d, i) => (
									<div
										key={i}
										onClick={() => setSelectedDoc(d)}
										style={{
											padding: 12,
											background: selectedDoc?.filename === d.filename ? '#f1f5f9' : '#f8fafc',
											border: selectedDoc?.filename === d.filename ? '1px solid #0f172a' : '1px solid #e2e8f0',
											borderRadius: 8,
											cursor: 'pointer',
										}}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between' }}>
											<div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{d.filename}</div>
											{d.duplicate_matches && <span style={{ fontSize: 10, fontWeight: 700, background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '2px 6px', borderRadius: 4 }}>⚠️ DUPLICATE ALERT</span>}
										</div>
										<div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{d.doc_type} • Confidence: {d.field_confidence.overall}%</div>
									</div>
								))}
							</div>
						</div>

						{/* Detail */}
						{selectedDoc && (
							<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
								<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{selectedDoc.filename}</div>
								<div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 14 }}>Policy #{selectedDoc.policy_number} • {selectedDoc.claimant}</div>

								{selectedDoc.duplicate_matches && (
									<div style={{ padding: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, marginBottom: 14, fontSize: 11.5, color: '#b91c1c' }}>
										<strong>⚠️ Duplicate Invoice Warning:</strong> Matches existing document <strong>{selectedDoc.duplicate_matches[0].matched_filename}</strong> on same policy ({selectedDoc.duplicate_matches[0].amount}).
									</div>
								)}

								<div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>Extracted Line Items (OCR):</div>
								<div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', fontSize: 12 }}>
									{selectedDoc.line_items.map((li, idx) => (
										<div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
											<div>
												<div style={{ fontWeight: 600, color: '#0f172a' }}>{li.item}</div>
												<div style={{ fontSize: 10.5, color: '#64748b' }}>{li.qty} • {li.rate}</div>
											</div>
											<div style={{ fontWeight: 700, color: '#0f172a' }}>{li.total}</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* ── TAB 4: COST BENCHMARKS ── */}
				{activeTab === 'benchmarks' && (
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
							<div>
								<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Regional Repair Cost Benchmark Explorer</div>
								<div style={{ fontSize: 12, color: '#64748b' }}>Powered by <code>benchmark_explorer.pipe</code> and Regional Xactimate Index</div>
							</div>
							<div style={{ display: 'flex', gap: 6 }}>
								{['TX-Dallas', 'FL-Miami', 'CA-Los Angeles', 'IL-Chicago', 'GA-Atlanta'].map(r => (
									<button
										key={r}
										onClick={() => setSelectedRegion(r)}
										style={{
											padding: '6px 12px',
											borderRadius: 6,
											border: 'none',
											fontSize: 12,
											fontWeight: selectedRegion === r ? 700 : 500,
											background: selectedRegion === r ? '#0f172a' : '#f1f5f9',
											color: selectedRegion === r ? '#ffffff' : '#475569',
											cursor: 'pointer',
										}}
									>
										{r}
									</button>
								))}
							</div>
						</div>

						<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
							<thead>
								<tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
									<th style={{ padding: '10px 14px' }}>Region</th>
									<th style={{ padding: '10px 14px' }}>Trade Category</th>
									<th style={{ padding: '10px 14px' }}>Benchmark Average</th>
									<th style={{ padding: '10px 14px' }}>Allowable Range</th>
									<th style={{ padding: '10px 14px' }}>Standard Deviation</th>
									<th style={{ padding: '10px 14px' }}>Labor Index</th>
								</tr>
							</thead>
							<tbody>
								{REGIONAL_BENCHMARKS.filter(b => b.region === selectedRegion).map((bm, idx) => (
									<tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
										<td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{bm.name}</td>
										<td style={{ padding: '12px 14px', color: '#475569' }}>{bm.category}</td>
										<td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{bm.avg}</td>
										<td style={{ padding: '12px 14px', color: '#475569' }}>{bm.range}</td>
										<td style={{ padding: '12px 14px', color: '#64748b' }}>{bm.variance}</td>
										<td style={{ padding: '12px 14px' }}>{bm.labor_idx}x</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* ── TAB 5: VOICE SCHEDULING ── */}
				{activeTab === 'scheduling' && (
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
						<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
							<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Automated Field Inspection Scheduling</div>
							<div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Executes AI voice telephony confirmation via <code>inspection_scheduling.pipe</code>.</div>

							<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
								<div>
									<label style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Claim ID</label>
									<input type="text" value={inspClaimId} onChange={e => setInspClaimId(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
								</div>
								<div>
									<label style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Policyholder Phone</label>
									<input type="text" value={inspPhone} onChange={e => setInspPhone(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
								</div>
								<div>
									<label style={{ display: 'block', fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Proposed Slot</label>
									<input type="text" value={inspDate} onChange={e => setInspDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, boxSizing: 'border-box' }} />
								</div>
								<button
									onClick={handleTriggerScheduleVoiceCall}
									disabled={isCalling}
									style={{ backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 6, padding: '11px', fontSize: 13, fontWeight: 700, cursor: isCalling ? 'not-allowed' : 'pointer' }}
								>
									{isCalling ? 'Placing AI Telephony Confirmation Call...' : 'Trigger Automated Voice Confirmation Call'}
								</button>
							</div>
						</div>

						<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
							<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Confirmed Field Inspections &amp; Transcripts</div>
							{activeCallTranscript && (
								<div style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 14, fontSize: 11.5, color: '#0f172a' }}>
									<strong>📞 LIVE CALL COMPLETED &amp; TRANSCRIBED:</strong>
									<pre style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{activeCallTranscript}</pre>
								</div>
							)}
							<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
								{inspections.map(insp => (
									<div key={insp.id} style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
											<span>{insp.id} • {insp.claim_id}</span>
											<span style={{ fontSize: 10.5, color: '#0f172a', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: 4 }}>{insp.status}</span>
										</div>
										<div style={{ fontSize: 11.5, color: '#64748b', marginTop: 3 }}>{insp.inspector} — Scheduled: <strong>{insp.scheduled_date}</strong></div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{/* ── TAB 6: WORKLOAD QUEUE ── */}
				{activeTab === 'queue' && (
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Adjuster Priority Workload Queue</div>
						<div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Ranked by Priority Score = (Age in Days × 1.5) + (Amount / 5000) + (SIU Risk × 0.8)</div>

						<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
							<thead>
								<tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
									<th style={{ padding: '10px 14px' }}>Rank &amp; Score</th>
									<th style={{ padding: '10px 14px' }}>Claim ID</th>
									<th style={{ padding: '10px 14px' }}>Claimant</th>
									<th style={{ padding: '10px 14px' }}>Peril</th>
									<th style={{ padding: '10px 14px' }}>Exposure</th>
									<th style={{ padding: '10px 14px' }}>Risk Score</th>
									<th style={{ padding: '10px 14px' }}>Action</th>
								</tr>
							</thead>
							<tbody>
								{prioritizedQueue.map((c, i) => (
									<tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
										<td style={{ padding: '12px 14px' }}>
											<span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 800, background: c.priority_badge === 'CRITICAL' || c.priority_badge === 'HIGH' ? '#fef2f2' : '#f1f5f9', color: c.priority_badge === 'CRITICAL' || c.priority_badge === 'HIGH' ? '#b91c1c' : '#475569', border: `1px solid ${c.priority_badge === 'CRITICAL' || c.priority_badge === 'HIGH' ? '#fecaca' : '#e2e8f0'}` }}>
												#{i + 1} {c.priority_badge} ({c.priority_score})
											</span>
										</td>
										<td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{c.id}</td>
										<td style={{ padding: '12px 14px' }}>{c.claimant}</td>
										<td style={{ padding: '12px 14px', color: '#64748b' }}>{c.peril}</td>
										<td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>${c.amount.toLocaleString()}</td>
										<td style={{ padding: '12px 14px' }}>
											<span style={{ color: c.fraud_risk_score >= 50 ? '#b91c1c' : '#0f172a', fontWeight: c.fraud_risk_score >= 50 ? 700 : 500 }}>
												{c.fraud_risk_score}%
											</span>
										</td>
										<td style={{ padding: '12px 14px' }}>
											<button
												onClick={() => { setSelectedClaim(c); setActiveTab('assessment'); }}
												style={{ padding: '4px 10px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 4, fontSize: 11.5, cursor: 'pointer' }}
											>
												Open Audit
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* ── TAB 7: MODEL DRIFT ── */}
				{activeTab === 'drift' && (
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Model Drift &amp; Retraining Feedback Monitor</div>
						<div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Monitors variance between original AI decisions and final adjuster sign-offs via <code>feedback_loop.pipe</code>.</div>

						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
							<div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Rolling Precision</div>
								<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>96.8%</div>
							</div>
							<div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Human Overrides</div>
								<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>14 Logged</div>
							</div>
							<div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Drift Status</div>
								<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>NORMAL</div>
							</div>
							<div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
								<div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Retraining Trigger</div>
								<div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>&gt; 5.0% Var</div>
							</div>
						</div>
					</div>
				)}

				{/* ── TAB 8: PUBLIC STATUS TRACKER ── */}
				{activeTab === 'public_tracker' && (
					<div style={{ maxWidth: 650, margin: '0 auto', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ textAlign: 'center', marginBottom: 20 }}>
							<div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>ClaimVertex Policyholder Portal</div>
							<div style={{ fontSize: 12, color: '#64748b' }}>Sanitized External Status Tracking (claim_status.pipe)</div>
						</div>

						<div style={{ padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 20 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
								<span style={{ color: '#64748b' }}>Claim Number:</span>
								<strong style={{ color: '#0f172a' }}>CP-2026-88412</strong>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
								<span style={{ color: '#64748b' }}>Policyholder:</span>
								<strong style={{ color: '#0f172a' }}>Jane Doe (POL-***821)</strong>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
								<span style={{ color: '#64748b' }}>Current Stage:</span>
								<strong style={{ color: '#0f172a' }}>Disbursement Authorized ($6,436.00)</strong>
							</div>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
							{[
								{ title: '1. First Notice of Loss Intake', desc: 'Received and verified' },
								{ title: '2. Evidence & Invoice Processing', desc: 'Plumber invoice parsed & PII protected' },
								{ title: '3. Scope & Damage Review', desc: 'IICRC drying & materials verified' },
								{ title: '4. Electronic Payout Disbursement', desc: 'Authorized for direct ACH deposit' },
							].map((st, idx) => (
								<div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6 }}>
									<div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#ffffff', fontWeight: 700 }}>
										✓
									</div>
									<div>
										<div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>{st.title}</div>
										<div style={{ fontSize: 11, color: '#64748b' }}>{st.desc}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* ── TAB 9: STP SETTINGS ── */}
				{activeTab === 'thresholds' && (
					<div style={{ maxWidth: 650, margin: '0 auto', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Configurable Auto-Approval (STP) Thresholds</div>
						<div style={{ fontSize: 12, color: '#64748b', marginBottom: 20 }}>Adjust straight-through processing limits dynamically without code deployment.</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							<div>
								<label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6, fontWeight: 600 }}>
									Max Automated Payout Amount Limit: <strong style={{ color: '#0f172a' }}>${globalMaxSTP.toLocaleString()}</strong>
								</label>
								<input type="range" min="1000" max="50000" step="1000" value={globalMaxSTP} onChange={e => setGlobalMaxSTP(Number(e.target.value))} style={{ width: '100%', accentColor: '#0f172a' }} />
							</div>

							<div>
								<label style={{ fontSize: 12, color: '#475569', display: 'block', marginBottom: 6, fontWeight: 600 }}>
									Max Permissible SIU Fraud Risk Score: <strong style={{ color: '#b91c1c' }}>{globalMaxRisk}% (Warning Threshold)</strong>
								</label>
								<input type="range" min="10" max="80" step="5" value={globalMaxRisk} onChange={e => setGlobalMaxRisk(Number(e.target.value))} style={{ width: '100%', accentColor: '#b91c1c' }} />
							</div>

							<div style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, color: '#475569' }}>
								Current Rule: Claims under <strong>${globalMaxSTP.toLocaleString()}</strong> with Fraud Risk Score under <strong>{globalMaxRisk}%</strong> automatically receive <strong>AUTOMATED APPROVAL PASSED</strong>.
							</div>
						</div>
					</div>
				)}

				{/* ── TAB 10: 9 AI PIPELINES ── */}
				{activeTab === 'pipelines' && (
					<div>
						<h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>ClaimVertex AI Pipelines (9 Roadmap .pipe DAGs)</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
							{[
								{ name: '1. ingestion.pipe', desc: 'Webhook → Parse → Anonymize Text → Chunker → Embeddings → Qdrant Vector DB', comps: 6, mode: 'Ingestion' },
								{ name: '2. claim_analysis.pipe', desc: 'Webhook → Parse → Reasoning Engine → Response Answers', comps: 4, mode: 'Analysis' },
								{ name: '3. claim_chat.pipe', desc: 'Chat → Embeddings → Qdrant Search → Prompt Engine → Synthesizer', comps: 6, mode: 'RAG Chat' },
								{ name: '4. siu_dashboard.pipe', desc: 'Webhook → Parse → Qdrant 6-Vector Query → Response Answers', comps: 4, mode: 'SIU Hub' },
								{ name: '5. benchmark_explorer.pipe', desc: 'Webhook → Parse → Qdrant Benchmark Query → Response Answers', comps: 4, mode: 'Benchmarks' },
								{ name: '6. inspection_scheduling.pipe', desc: 'Webhook → Parse → Voice Telephony → Calendar Response', comps: 4, mode: 'Scheduling' },
								{ name: '7. claim_status.pipe', desc: 'Webhook → Parse → Status Query → Sanitized Response', comps: 4, mode: 'Public API' },
								{ name: '8. adjuster_queue.pipe', desc: 'Webhook → Parse → Priority Sort → Response Answers', comps: 3, mode: 'Queue' },
								{ name: '9. feedback_loop.pipe', desc: 'Webhook → Parse → Drift Aggregator → Response Answers', comps: 3, mode: 'Drift Monitor' },
							].map((p, idx) => (
								<div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
									<div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{p.name}</div>
									<div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.4, marginBottom: 8 }}>{p.desc}</div>
									<div style={{ fontSize: 10.5, color: '#94a3b8' }}>Components: {p.comps} | Mode: {p.mode}</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* ── TAB 11: AUDIT TRAIL ── */}
				{activeTab === 'history' && (
					<div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 22, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
						<div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Immutable Audit Trail &amp; Adjuster Sign-Off History</div>
						<div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>All manual line item overrides and supervisor payout approvals are logged with timestamps.</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							{auditTrail.map(at => (
								<div key={at.id} style={{ padding: 12, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
										<span><strong>{at.id}</strong> • Claim {at.claim_id} • Field: <code style={{ color: '#0f172a' }}>{at.field_name}</code></span>
										<span>{at.timestamp}</span>
									</div>
									<div style={{ marginTop: 4, color: '#0f172a', fontWeight: 600 }}>
										Changed: <span style={{ color: '#b91c1c' }}>{at.old_value}</span> → <span style={{ color: '#0f172a' }}>{at.new_value}</span>
									</div>
									<div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
										User: {at.user} | Reason: {at.reason}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

			</div>

			{/* Explainability Citation Modal */}
			{explainCitation && (
				<div style={{
					position: 'fixed',
					inset: 0,
					backgroundColor: 'rgba(15, 23, 42, 0.6)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 1000,
					padding: 20,
				}} onClick={() => setExplainCitation(null)}>
					<div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 10, padding: 24, maxWidth: 500, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
						<div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Evidence &amp; Forensic Attribution Citation</div>
						<div style={{ padding: 12, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12.5, color: '#0f172a', fontFamily: 'monospace', marginBottom: 16 }}>
							{explainCitation}
						</div>
						<button
							onClick={() => setExplainCitation(null)}
							style={{ padding: '8px 18px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 6, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', float: 'right' }}
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

import React, { useState } from 'react';

// =============================================================================
// TYPES & DATA
// =============================================================================

interface Claim {
	id: string;
	claimant: string;
	policy_number: string;
	amount: number;
	loss_date: string;
	description: string;
	fraud_risk_score: number;
	human_review_required: boolean;
	gate_status: 'AUTOMATED APPROVAL PASSED' | 'ESCALATED TO SENIOR ADJUSTER' | 'APPROVED BY HUMAN ADJUSTER' | 'REJECTED';
	timestamp: string;
}

interface DocItem {
	filename: string;
	size_bytes: number;
	status: string;
	timestamp: string;
	summary: string;
}

const INITIAL_CLAIMS: Claim[] = [
	{
		id: 'CP-2026-88412',
		claimant: 'Jane Doe',
		policy_number: 'POL-994821',
		amount: 8450.00,
		loss_date: '2026-08-15',
		description: 'Water line burst in kitchen causing damage to hardwood floor and cabinet bases.',
		fraud_risk_score: 14,
		human_review_required: false,
		gate_status: 'AUTOMATED APPROVAL PASSED',
		timestamp: '2026-08-23 21:30',
	},
	{
		id: 'CP-2026-90124',
		claimant: 'Apex Commercial Logistics',
		policy_number: 'POL-330192',
		amount: 142000.00,
		loss_date: '2026-08-20',
		description: 'Warehouse electrical fire destroying inventory and structural beams. Unattended overnight.',
		fraud_risk_score: 85,
		human_review_required: true,
		gate_status: 'ESCALATED TO SENIOR ADJUSTER',
		timestamp: '2026-08-23 22:15',
	},
	{
		id: 'CP-2026-91044',
		claimant: 'Marcus Vance',
		policy_number: 'POL-108422',
		amount: 3200.00,
		loss_date: '2026-08-24',
		description: 'Hail storm cracked front windshield and dented vehicle hood.',
		fraud_risk_score: 8,
		human_review_required: false,
		gate_status: 'AUTOMATED APPROVAL PASSED',
		timestamp: '2026-08-25 09:10',
	},
];

const INITIAL_DOCS: DocItem[] = [
	{
		filename: 'Plumber_Invoice_88412.pdf',
		size_bytes: 245120,
		status: 'Indexed (PII Redacted)',
		timestamp: '2026-08-23 21:35',
		summary: 'Pipe repair $1,200, Flooring replacement $7,250. PII redacted.',
	},
	{
		filename: 'Property_Policy_POL994821.pdf',
		size_bytes: 1048576,
		status: 'Indexed (Vector DB)',
		timestamp: '2026-08-23 21:00',
		summary: 'Full comprehensive dwelling & liability schedule. Water endorsement active.',
	},
];

// =============================================================================
// COMPONENT
// =============================================================================

export const App: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'dashboard' | 'assessment' | 'chat' | 'docs' | 'pipelines'>('dashboard');
	const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
	const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
	const [selectedClaim, setSelectedClaim] = useState<Claim | null>(INITIAL_CLAIMS[1]);

	// New claim form state
	const [claimant, setClaimant] = useState('');
	const [policyNo, setPolicyNo] = useState('');
	const [claimAmount, setClaimAmount] = useState('');
	const [description, setDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Chat state
	const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; citations?: string }>>([
		{
			sender: 'assistant',
			text: 'Hello Adjuster! I am your RAG-backed Policy & Claims Assistant connected to RocketRide claim_chat.pipe. How can I assist you with coverage, endorsement checks, or claim analysis today?',
		},
	]);
	const [chatInput, setChatInput] = useState('');

	// Stats
	const totalPayouts = claims.reduce((acc, c) => acc + c.amount, 0);
	const escalatedCount = claims.filter(c => c.human_review_required && c.gate_status === 'ESCALATED TO SENIOR ADJUSTER').length;
	const autoApprovedCount = claims.filter(c => c.gate_status === 'AUTOMATED APPROVAL PASSED').length;

	const handleApprove = (id: string) => {
		setClaims(prev => prev.map(c => c.id === id ? { ...c, gate_status: 'APPROVED BY HUMAN ADJUSTER', human_review_required: false } : c));
		if (selectedClaim?.id === id) {
			setSelectedClaim(prev => prev ? { ...prev, gate_status: 'APPROVED BY HUMAN ADJUSTER', human_review_required: false } : null);
		}
	};

	const handleReject = (id: string) => {
		setClaims(prev => prev.map(c => c.id === id ? { ...c, gate_status: 'REJECTED', human_review_required: false } : c));
		if (selectedClaim?.id === id) {
			setSelectedClaim(prev => prev ? { ...prev, gate_status: 'REJECTED', human_review_required: false } : null);
		}
	};

	const handleCreateClaim = (e: React.FormEvent) => {
		e.preventDefault();
		if (!claimant || !claimAmount || !description) return;
		setIsSubmitting(true);

		setTimeout(() => {
			const amt = parseFloat(claimAmount) || 0;
			const fraudScore = amt > 25000 || description.toLowerCase().includes('fire') || description.toLowerCase().includes('overnight') ? 78 : 12;
			const isHighRisk = fraudScore > 50 || amt > 5000;
			const newClaim: Claim = {
				id: `CP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
				claimant,
				policy_number: policyNo || 'POL-GEN772',
				amount: amt,
				loss_date: new Date().toISOString().split('T')[0],
				description,
				fraud_risk_score: fraudScore,
				human_review_required: isHighRisk,
				gate_status: isHighRisk ? 'ESCALATED TO SENIOR ADJUSTER' : 'AUTOMATED APPROVAL PASSED',
				timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!chatInput.trim()) return;
		const query = chatInput.trim();
		setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
		setChatInput('');

		setTimeout(() => {
			let reply = 'Based on policy documentation in Qdrant, water damage caused by sudden and accidental burst pipes is fully covered under Section B (Dwelling Protection), subject to a $500 deductible.';
			let citations = 'Property_Policy_POL994821.pdf (Endorsement #WTR-44, Page 12)';

			if (query.toLowerCase().includes('fraud') || query.toLowerCase().includes('risk')) {
				reply = 'SIU Assessment Alert: Claims involving warehouse fires with unmonitored overnight ignition show a high correlation with synthetic inflation. Senior human adjuster review is strictly required.';
				citations = 'SIU_Risk_Guidelines_2026.pdf (Section 4.1)';
			}

			setChatMessages(prev => [...prev, { sender: 'assistant', text: reply, citations }]);
		}, 600);
	};

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100%',
			backgroundColor: '#090d16',
			color: '#f1f5f9',
			fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
		}}>
			{/* Top Header */}
			<header style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '14px 24px',
				backgroundColor: '#0f172a',
				borderBottom: '1px solid #1e293b',
			}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div style={{
						width: 34,
						height: 34,
						borderRadius: 8,
						backgroundColor: '#2563eb',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontWeight: 800,
						color: '#ffffff',
						fontSize: 14,
					}}>
						CP
					</div>
					<div>
						<div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>ClaimPilot</div>
						<div style={{ fontSize: 11, color: '#94a3b8' }}>RocketRide AI Insurance & SIU Fraud Portal</div>
					</div>
				</div>

				{/* Tab Nav */}
				<nav style={{ display: 'flex', gap: 8, backgroundColor: '#020617', padding: '4px', borderRadius: 8 }}>
					{[
						{ id: 'dashboard', label: 'Dashboard' },
						{ id: 'assessment', label: 'New Assessment' },
						{ id: 'chat', label: 'RAG Assistant' },
						{ id: 'docs', label: 'Evidence Library' },
						{ id: 'pipelines', label: 'RocketRide DAGs' },
					].map(t => (
						<button
							key={t.id}
							onClick={() => setActiveTab(t.id as any)}
							style={{
								padding: '6px 14px',
								borderRadius: 6,
								border: 'none',
								fontSize: 12.5,
								fontWeight: activeTab === t.id ? 600 : 400,
								cursor: 'pointer',
								backgroundColor: activeTab === t.id ? '#2563eb' : 'transparent',
								color: activeTab === t.id ? '#ffffff' : '#94a3b8',
								transition: 'all 0.15s ease',
							}}
						>
							{t.label}
						</button>
					))}
				</nav>
			</header>

			{/* Main Workspace Area */}
			<main style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
				{/* DASHBOARD TAB */}
				{activeTab === 'dashboard' && (
					<div>
						{/* Stat Cards */}
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Total Claims Tracked</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#38bdf8' }}>{claims.length}</div>
							</div>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Total Exposure / Payouts</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#f8fafc' }}>${totalPayouts.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
							</div>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Automated Approvals</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#22c55e' }}>{autoApprovedCount}</div>
							</div>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 16 }}>
								<div style={{ fontSize: 11, textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>Senior Adjuster Queue</div>
								<div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: '#ef4444' }}>{escalatedCount} Pending</div>
							</div>
						</div>

						{/* Split Layout: Claims Table & Detail Pane */}
						<div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
							{/* Claims Table */}
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 20 }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
									<h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Claim Assessment Queue</h3>
									<span style={{ fontSize: 12, color: '#64748b' }}>Connected to claim_analysis.pipe</span>
								</div>

								<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
									{claims.map(c => {
										const isSelected = selectedClaim?.id === c.id;
										const isHighRisk = c.fraud_risk_score > 50;
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
														<span style={{ fontWeight: 600, fontSize: 13, color: '#ffffff' }}>{c.id}</span>
														<span style={{ fontSize: 11, color: '#94a3b8' }}>• {c.claimant}</span>
													</div>
													<div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
														${c.amount.toLocaleString()} — {c.description.slice(0, 48)}...
													</div>
												</div>
												<div style={{ textAlign: 'right' }}>
													<span style={{
														display: 'inline-block',
														fontSize: 11,
														fontWeight: 600,
														padding: '3px 8px',
														borderRadius: 4,
														backgroundColor: isHighRisk ? '#450a0a' : '#052e16',
														color: isHighRisk ? '#f87171' : '#4ade80',
														border: `1px solid ${isHighRisk ? '#991b1b' : '#166534'}`,
													}}>
														Fraud Score: {c.fraud_risk_score}%
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{/* Claim Detail & Human-in-the-Loop Oversight Gate */}
							{selectedClaim ? (
								<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 20 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
										<div>
											<div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{selectedClaim.id}</div>
											<div style={{ fontSize: 12, color: '#94a3b8' }}>Policy: {selectedClaim.policy_number} | {selectedClaim.claimant}</div>
										</div>
										<span style={{
											fontSize: 11,
											fontWeight: 700,
											padding: '4px 8px',
											borderRadius: 4,
											backgroundColor: selectedClaim.gate_status.includes('AUTOMATED') || selectedClaim.gate_status.includes('APPROVED') ? '#052e16' : '#450a0a',
											color: selectedClaim.gate_status.includes('AUTOMATED') || selectedClaim.gate_status.includes('APPROVED') ? '#4ade80' : '#f87171',
										}}>
											{selectedClaim.gate_status}
										</span>
									</div>

									<div style={{ fontSize: 13, lineHeight: 1.5, color: '#cbd5e1', marginBottom: 16, padding: 12, backgroundColor: '#090d16', borderRadius: 8 }}>
										{selectedClaim.description}
									</div>

									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
										<div style={{ padding: 10, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>Claim Amount</div>
											<div style={{ fontSize: 16, fontWeight: 600, color: '#38bdf8' }}>${selectedClaim.amount.toLocaleString()}</div>
										</div>
										<div style={{ padding: 10, backgroundColor: '#090d16', borderRadius: 6 }}>
											<div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>AI Risk Score</div>
											<div style={{ fontSize: 16, fontWeight: 600, color: selectedClaim.fraud_risk_score > 50 ? '#ef4444' : '#22c55e' }}>
												{selectedClaim.fraud_risk_score}%
											</div>
										</div>
									</div>

									{/* Human Adjuster Action Controls */}
									<div style={{ borderTop: '1px solid #1e293b', paddingTop: 16 }}>
										<div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>Human Adjuster Override Gate:</div>
										<div style={{ display: 'flex', gap: 10 }}>
											<button
												onClick={() => handleApprove(selectedClaim.id)}
												style={{
													flex: 1,
													padding: '8px 12px',
													borderRadius: 6,
													border: 'none',
													backgroundColor: '#16a34a',
													color: '#ffffff',
													fontWeight: 600,
													fontSize: 12,
													cursor: 'pointer',
												}}
											>
												Approve Claim
											</button>
											<button
												onClick={() => handleReject(selectedClaim.id)}
												style={{
													flex: 1,
													padding: '8px 12px',
													borderRadius: 6,
													border: 'none',
													backgroundColor: '#dc2626',
													color: '#ffffff',
													fontWeight: 600,
													fontSize: 12,
													cursor: 'pointer',
												}}
											>
												Deny / Escalate SIU
											</button>
										</div>
									</div>
								</div>
							) : (
								<div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Select a claim to review details</div>
							)}
						</div>
					</div>
				)}

				{/* NEW ASSESSMENT TAB */}
				{activeTab === 'assessment' && (
					<div style={{ maxWidth: 650, margin: '0 auto', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 24 }}>
						<h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#ffffff' }}>Trigger New Claim Assessment</h3>
						<p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
							Executes multi-step reasoning via <code>claim_analysis.pipe</code> (Webhook -> Parse -> GPT-4-turbo -> Response Answers).
						</p>

						<form onSubmit={handleCreateClaim} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
							<div>
								<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Claimant Name</label>
								<input
									type="text"
									required
									value={claimant}
									onChange={e => setClaimant(e.target.value)}
									placeholder="e.g. John Doe / Global Hauling Inc."
									style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
								/>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
								<div>
									<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Policy Number</label>
									<input
										type="text"
										value={policyNo}
										onChange={e => setPolicyNo(e.target.value)}
										placeholder="POL-883921"
										style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
									/>
								</div>
								<div>
									<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Claimed Amount ($ USD)</label>
									<input
										type="number"
										required
										value={claimAmount}
										onChange={e => setClaimAmount(e.target.value)}
										placeholder="4500"
										style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
									/>
								</div>
							</div>

							<div>
								<label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Loss Narrative & Damage Description</label>
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
									fontWeight: 600,
									fontSize: 13,
									cursor: isSubmitting ? 'not-allowed' : 'pointer',
									marginTop: 8,
								}}
							>
								{isSubmitting ? 'Running RocketRide Assessment...' : 'Submit Claim to RocketRide Pipeline'}
							</button>
						</form>
					</div>
				)}

				{/* RAG CHAT ASSISTANT TAB */}
				{activeTab === 'chat' && (
					<div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '620px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, overflow: 'hidden' }}>
						<div style={{ padding: '14px 20px', borderBottom: '1px solid #1e293b', backgroundColor: '#090d16', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>RAG Policy & Claims Assistant</div>
								<div style={{ fontSize: 11, color: '#64748b' }}>Connected to claim_chat.pipe + Qdrant Vector DB</div>
							</div>
							<span style={{ fontSize: 11, backgroundColor: '#064e3b', color: '#34d399', padding: '3px 8px', borderRadius: 4 }}>Live RAG</span>
						</div>

						<div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
							{chatMessages.map((msg, i) => (
								<div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
									<div style={{
										padding: '10px 14px',
										borderRadius: 8,
										fontSize: 13,
										lineHeight: 1.45,
										backgroundColor: msg.sender === 'user' ? '#2563eb' : '#1e293b',
										color: '#ffffff',
									}}>
										{msg.text}
										{msg.citations && (
											<div style={{ marginTop: 6, fontSize: 11, color: '#93c5fd', borderTop: '1px solid #334155', paddingTop: 4 }}>
												Citation: {msg.citations}
											</div>
										)}
									</div>
								</div>
							))}
						</div>

						<form onSubmit={handleSendMessage} style={{ display: 'flex', padding: 12, backgroundColor: '#090d16', borderTop: '1px solid #1e293b', gap: 10 }}>
							<input
								type="text"
								value={chatInput}
								onChange={e => setChatInput(e.target.value)}
								placeholder="Ask about endorsements, water exclusions, deductible rules, or SIU flags..."
								style={{ flex: 1, padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#ffffff', fontSize: 13 }}
							/>
							<button
								type="submit"
								style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
							>
								Send
							</button>
						</form>
					</div>
				)}

				{/* EVIDENCE & DOCS TAB */}
				{activeTab === 'docs' && (
					<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 20 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
							<div>
								<h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff' }}>Claim Evidence & Policy Index</h3>
								<div style={{ fontSize: 11, color: '#94a3b8' }}>Ingested via <code>ingestion.pipe</code> with automated PII Redaction & LangChain Chunking</div>
							</div>
							<span style={{ fontSize: 12, color: '#38bdf8' }}>{docs.length} Documents Ingested</span>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							{docs.map((d, i) => (
								<div key={i} style={{ padding: '14px', backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div>
										<div style={{ fontWeight: 600, fontSize: 13, color: '#ffffff' }}>{d.filename}</div>
										<div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{d.summary}</div>
									</div>
									<div style={{ textAlign: 'right' }}>
										<span style={{ fontSize: 11, backgroundColor: '#1e293b', padding: '3px 8px', borderRadius: 4, color: '#38bdf8' }}>{d.status}</span>
										<div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{(d.size_bytes / 1024).toFixed(0)} KB • {d.timestamp}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* PIPELINES TAB */}
				{activeTab === 'pipelines' && (
					<div>
						<h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#ffffff' }}>RocketRide Pipelines (.pipe DAGs)</h3>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 18 }}>
								<div style={{ fontSize: 14, fontWeight: 600, color: '#38bdf8', marginBottom: 6 }}>1. ingestion.pipe</div>
								<div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, marginBottom: 12 }}>
									Intake pipeline: Webhook -> Parse -> Anonymize Text (PII Strip) -> LangChain Chunker -> OpenAI Embeddings -> Qdrant Vector DB.
								</div>
								<div style={{ fontSize: 11, color: '#64748b' }}>Components: 6 | Mode: Ingestion</div>
							</div>

							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 18 }}>
								<div style={{ fontSize: 14, fontWeight: 600, color: '#38bdf8', marginBottom: 6 }}>2. claim_analysis.pipe</div>
								<div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, marginBottom: 12 }}>
									Assessment pipeline: Webhook -> Parse -> LLM OpenAI (GPT-4-turbo) -> Response Answers. Evaluates damages & computes fraud risk.
								</div>
								<div style={{ fontSize: 11, color: '#64748b' }}>Components: 4 | Mode: Analysis</div>
							</div>

							<div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 18 }}>
								<div style={{ fontSize: 14, fontWeight: 600, color: '#38bdf8', marginBottom: 6 }}>3. claim_chat.pipe</div>
								<div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, marginBottom: 12 }}>
									RAG Chat pipeline: Chat -> OpenAI Embeddings -> Qdrant Search -> Prompt Engine -> LLM OpenAI -> Response Answers.
								</div>
								<div style={{ fontSize: 11, color: '#64748b' }}>Components: 6 | Mode: Conversational RAG</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

export default App;

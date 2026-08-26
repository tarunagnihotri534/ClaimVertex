# 🛡️ ClaimVertex — Enterprise AI Insurance Claims & SIU Fraud Engine

ClaimVertex is an enterprise-grade AI insurance platform orchestrating **9 deterministic AI pipelines** for Property & Casualty carriers, forensic structural engineers, and Special Investigation Units (SIU).

## 🚀 Key Platform Features
- **⚡ Straight-Through Processing (STP)**: Sub-second auto-payout authorizations for qualified low-risk claims.
- **🔍 6-Vector Forensic Fraud Matrix**: Real-time EXIF verification, duplicate invoice matching, and syndicate collusion analysis.
- **🎙️ Autonomous PE Engineering Dispatch**: Voice & calendar booking node for licensed structural engineers.
- **💬 Multi-Persona RAG Policy Copilot**: Citation-backed policy Q&A assistant with Qdrant vector retrieval.
- **🚦 Human-in-the-Loop Gate**: High-exposure triage backlog and real-time RLHF calibration loop.
- **🌐 Public Claimant Tracker**: Live 4-stage transparent claim tracking portal.

## 🛠️ Pipelines Included
1. `ingestion.pipe` — Multi-modal parsing, PII redaction & Qdrant vectorization
2. `claim_analysis.pipe` — Policy limits check, damage evaluation & STP scoring
3. `claim_chat.pipe` — RAG Q&A copilot with verified policy citations
4. `siu_dashboard.pipe` — 6-Vector forensic fraud detection matrix
5. `benchmark_explorer.pipe` — Regional labor/material cost indices
6. `inspection_scheduling.pipe` — Licensed PE forensic engineering dispatch
7. `claim_status.pipe` — Public claimant milestone tracking
8. `adjuster_queue.pipe` — High-exposure triage & manual sign-off queue
9. `feedback_loop.pipe` — Adjuster correction & RLHF prompt tuning

## 💻 Development & Integration
Built with **React 18**, **TypeScript**, and **Rsbuild**.


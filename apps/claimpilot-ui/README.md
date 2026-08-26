# ClaimPilot — Enterprise AI Insurance Claims & Fraud Assessment

ClaimPilot is an enterprise-grade AI insurance platform powered by RocketRide.

## Key Capabilities
- **Document Ingestion (`ingestion.pipe`)**: Automated PII redaction and Qdrant vector indexing.
- **Damage & Fraud Assessment (`claim_analysis.pipe`)**: GPT-4-turbo reasoning with risk scoring (0-100%).
- **Policy & Claim Assistant (`claim_chat.pipe`)**: RAG-backed adjuster chat assistant.
- **Human-in-the-Loop Gate**: Escalation workflows for high-value or high-risk claims.

## Development & Usage
Open `claimpilot.rrapp` in VS Code / Cursor to open the RocketRide App Builder.

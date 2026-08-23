# ClaimPilot — AI Insurance Field Claims Copilot (RocketRide)

ClaimPilot is a load-bearing AI application for insurance companies and claim adjusters built on top of **RocketRide**. It processes claim submissions, performs automated fraud screening, indexes evidence into a vector database, and provides a RAG-backed adjuster assistant with human-in-the-loop oversight.

## Quickstart (5 Lines)
```bash
# 1. Activate virtual environment & install requirements
python -m venv .venv && .\.venv\Scripts\activate
pip install -r requirements.txt

# 2. Configure credentials in .env (ROCKETRIDE_URI, ROCKETRIDE_APIKEY, ROCKETRIDE_OPENAI_KEY)

# 3. Launch ClaimPilot Web Dashboard UI
python -m uvicorn app:app --reload
```
Open **http://127.0.0.1:8000** in your web browser.

See [architecture.md](file:///c:/Users/darkt/OneDrive/Documents/Desktop/ClaimPilot/architecture.md) for the complete Mermaid system flowchart.

---

## Load-Bearing Features & Architecture

1. **Multi-Pipeline Architecture (`.pipe`)**:
   - `ingestion.pipe`: Ingests claim forms/invoices via `webhook` → `parse` → `anonymize_text` (PII redaction) → `preprocessor_langchain` → `embedding_openai` → `qdrant`.
   - `claim_analysis.pipe`: Performs direct LLM damage estimation and fraud risk scoring (`webhook` → `parse` → `llm_openai` → `response_answers`).
   - `claim_chat.pipe`: Conversational RAG assistant allowing adjusters to query claim histories with citations (`chat` → `embedding_openai` → `qdrant` → `prompt` → `llm_openai` → `response_answers`).

2. **Human-in-the-Loop Oversight Gate**:
   - High-value claims (>$5,000) or suspicious fraud flags are automatically escalated to licensed human adjusters for final settlement sign-off.

3. **Resource & Lifecycle Management**:
   - Explicit task termination (`client.terminate(token)`) after execution to prevent orphan server processes.
   - Clean environment variable substitution with `ROCKETRIDE_*` prefix and `.env` safety.

---

## Verification & Testing
Run diagnostic checks anytime:
```bash
python check.py
```
